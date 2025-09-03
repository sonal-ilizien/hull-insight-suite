import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  FileBarChart, 
  Download, 
  Filter, 
  Calendar,
  Ship,
  FileText,
  Activity,
  Search,
  BarChart3
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReportData {
  id: number
  type: string
  vessel: string
  command: string
  date: string
  status: string
  details: any
}

const reportTypes = [
  { value: "docking-plans", label: "Docking Plan List", icon: Ship },
  { value: "approval-status", label: "Approval Status Report", icon: FileText },
  { value: "survey-summary", label: "Quarterly Survey Summary", icon: Activity },
  { value: "failed-checkpoints", label: "Failed Checkpoints", icon: Activity },
  { value: "action-tracker", label: "Action Tracker", icon: BarChart3 },
  { value: "audit-log", label: "Audit Log Report", icon: FileBarChart }
]

const mockReportData: ReportData[] = [
  {
    id: 1,
    type: "Docking Plan",
    vessel: "INS Vikrant",
    command: "Western Naval Command",
    date: "2024-01-15",
    status: "Under Review",
    details: { initiator: "Lt. Cdr. Sharma", dockyard: "Cochin Shipyard" }
  },
  {
    id: 2,
    type: "Hull Survey",
    vessel: "INS Kolkata",
    command: "Eastern Naval Command", 
    date: "2024-01-10",
    status: "Approved",
    details: { inspector: "Lt. Marine", compartment: "Engine Room" }
  },
  {
    id: 3,
    type: "Docking Plan",
    vessel: "INS Vikramaditya",
    command: "Western Naval Command",
    date: "2024-01-20",
    status: "Draft",
    details: { initiator: "Lt. Cdr. Gupta", dockyard: "Naval Dockyard Mumbai" }
  }
]

const commands = ["All Commands", "Western Naval Command", "Eastern Naval Command", "Southern Naval Command"]
const vessels = ["All Vessels", "INS Vikrant", "INS Kolkata", "INS Vikramaditya", "INS Chennai"]
const statuses = ["All Status", "Draft", "Submitted", "Under Review", "Approved", "Rejected"]

export default function Reports() {
  const [selectedReportType, setSelectedReportType] = useState("")
  const [filters, setFilters] = useState({
    command: "All Commands",
    vessel: "All Vessels", 
    status: "All Status",
    dateFrom: "",
    dateTo: "",
    searchTerm: ""
  })
  const [reportData, setReportData] = useState<ReportData[]>(mockReportData)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const filteredData = reportData.filter(item => {
    const matchesCommand = filters.command === "All Commands" || item.command === filters.command
    const matchesVessel = filters.vessel === "All Vessels" || item.vessel === filters.vessel
    const matchesStatus = filters.status === "All Status" || item.status === filters.status
    const matchesSearch = !filters.searchTerm || 
      item.vessel.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.command.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(filters.searchTerm.toLowerCase())
    
    let matchesDate = true
    if (filters.dateFrom) {
      matchesDate = matchesDate && new Date(item.date) >= new Date(filters.dateFrom)
    }
    if (filters.dateTo) {
      matchesDate = matchesDate && new Date(item.date) <= new Date(filters.dateTo)
    }

    return matchesCommand && matchesVessel && matchesStatus && matchesSearch && matchesDate
  })

  const generateReport = async (format: "pdf" | "xlsx" | "csv") => {
    if (!selectedReportType) {
      toast({ title: "Error", description: "Please select a report type", variant: "destructive" })
      return
    }

    setIsGenerating(true)
    
    // Simulate report generation
    setTimeout(() => {
      toast({ 
        title: "Success", 
        description: `${selectedReportType} report generated successfully in ${format.toUpperCase()} format` 
      })
      setIsGenerating(false)
    }, 2000)
  }

  const exportData = (format: "pdf" | "xlsx" | "csv") => {
    const reportTypeLabel = reportTypes.find(t => t.value === selectedReportType)?.label || "Report"
    const filename = `${reportTypeLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`
    
    if (format === "csv") {
      const headers = ["Type", "Vessel", "Command", "Date", "Status"]
      const csvContent = [
        headers.join(","),
        ...filteredData.map(item => [
          item.type,
          item.vessel,
          item.command,
          item.date,
          item.status
        ].join(","))
      ].join("\n")
      
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${filename}.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
    
    toast({ title: "Success", description: `Report exported as ${format.toUpperCase()}` })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Draft": return "secondary"
      case "Submitted": return "default"
      case "Under Review": return "default"
      case "Approved": return "default"
      case "Rejected": return "destructive"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Generate and export comprehensive reports with advanced filtering
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => generateReport("pdf")}
            disabled={isGenerating || !selectedReportType}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
          <Button 
            variant="outline"
            onClick={() => generateReport("xlsx")}
            disabled={isGenerating || !selectedReportType}
          >
            <Download className="mr-2 h-4 w-4" />
            Generate Excel
          </Button>
        </div>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Report Type</CardTitle>
          <CardDescription>Select the type of report you want to generate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((reportType) => (
              <Card 
                key={reportType.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedReportType === reportType.value ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedReportType(reportType.value)}
              >
                <CardContent className="flex items-center space-x-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <reportType.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{reportType.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Apply filters to customize your report data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Command</Label>
              <Select value={filters.command} onValueChange={(value) => setFilters(prev => ({ ...prev, command: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commands.map(command => (
                    <SelectItem key={command} value={command}>{command}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Vessel</Label>
              <Select value={filters.vessel} onValueChange={(value) => setFilters(prev => ({ ...prev, vessel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vessels.map(vessel => (
                    <SelectItem key={vessel} value={vessel}>{vessel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input 
                type="date" 
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input 
                type="date" 
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setFilters({
                command: "All Commands",
                vessel: "All Vessels",
                status: "All Status", 
                dateFrom: "",
                dateTo: "",
                searchTerm: ""
              })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{filteredData.length}</p>
              </div>
              <FileBarChart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Items</p>
                <p className="text-2xl font-bold">
                  {filteredData.filter(item => item.status === "Under Review" || item.status === "Submitted").length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">
                  {filteredData.filter(item => item.status === "Approved").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vessels Covered</p>
                <p className="text-2xl font-bold">
                  {new Set(filteredData.map(item => item.vessel)).size}
                </p>
              </div>
              <Ship className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report Data Preview</CardTitle>
              <CardDescription>
                Preview of the data that will be included in your report
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportData("csv")}
                disabled={filteredData.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportData("xlsx")}
                disabled={filteredData.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportData("pdf")}
                disabled={filteredData.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Vessel</TableHead>
                  <TableHead>Command</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.type}</TableCell>
                    <TableCell>{item.vessel}</TableCell>
                    <TableCell>{item.command}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {item.details.initiator && `Initiator: ${item.details.initiator}`}
                        {item.details.inspector && `Inspector: ${item.details.inspector}`}
                        {item.details.dockyard && ` • ${item.details.dockyard}`}
                        {item.details.compartment && ` • ${item.details.compartment}`}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileBarChart className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No data matches the current filters</p>
              <p className="text-sm">Try adjusting your filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Standard Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Reports</CardTitle>
          <CardDescription>Quick access to frequently used reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center gap-3">
                <Ship className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Monthly Docking Summary</p>
                  <p className="text-sm text-muted-foreground">All docking plans for the current month</p>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Survey Compliance Report</p>
                  <p className="text-sm text-muted-foreground">Quarterly survey status by vessel</p>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Approval Workflow Report</p>
                  <p className="text-sm text-muted-foreground">Track approval times and bottlenecks</p>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Performance Analytics</p>
                  <p className="text-sm text-muted-foreground">KPIs and trend analysis</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}