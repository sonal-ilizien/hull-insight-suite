import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Eye, Calendar, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DockyardPlan {
  id: number
  vesselName: string
  command: string
  dockyard: string
  reasonForDocking: string
  plannedDate: string
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected"
  initiator: string
  reviewer?: string
  approver?: string
  createdOn: string
}

const mockPlans: DockyardPlan[] = [
  {
    id: 1,
    vesselName: "INS Vikrant",
    command: "Western Naval Command",
    dockyard: "Cochin Shipyard",
    reasonForDocking: "Routine Maintenance",
    plannedDate: "2024-03-15",
    status: "Under Review",
    initiator: "Lt. Cdr. Sharma",
    reviewer: "Cdr. Patel",
    createdOn: "2024-01-15"
  },
  {
    id: 2,
    vesselName: "INS Kolkata",
    command: "Eastern Naval Command",
    dockyard: "Mazagon Dock",
    reasonForDocking: "Emergency Repair",
    plannedDate: "2024-02-28",
    status: "Approved",
    initiator: "Lt. Kumar",
    reviewer: "Cdr. Singh",
    approver: "Capt. Verma",
    createdOn: "2024-01-10"
  },
  {
    id: 3,
    vesselName: "INS Vikramaditya",
    command: "Western Naval Command", 
    dockyard: "Naval Dockyard Mumbai",
    reasonForDocking: "Annual Overhaul",
    plannedDate: "2024-04-10",
    status: "Draft",
    initiator: "Lt. Cdr. Gupta",
    createdOn: "2024-01-20"
  }
]

const vessels = ["INS Vikrant", "INS Kolkata", "INS Vikramaditya", "INS Chennai", "INS Delhi"]
const commands = ["Western Naval Command", "Eastern Naval Command", "Southern Naval Command"]
const dockyards = ["Cochin Shipyard", "Mazagon Dock", "Naval Dockyard Mumbai", "Goa Shipyard"]

export default function DockyardPlans() {
  const [plans, setPlans] = useState<DockyardPlan[]>(mockPlans)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<DockyardPlan | null>(null)
  const [newPlan, setNewPlan] = useState({
    vesselName: "",
    command: "",
    dockyard: "",
    reasonForDocking: "",
    plannedDate: "",
    description: ""
  })
  const { toast } = useToast()

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.command.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || plan.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreatePlan = () => {
    if (!newPlan.vesselName || !newPlan.command || !newPlan.dockyard || !newPlan.reasonForDocking || !newPlan.plannedDate) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    const plan: DockyardPlan = {
      id: Date.now(),
      vesselName: newPlan.vesselName,
      command: newPlan.command,
      dockyard: newPlan.dockyard,
      reasonForDocking: newPlan.reasonForDocking,
      plannedDate: newPlan.plannedDate,
      status: "Draft",
      initiator: "Current User",
      createdOn: new Date().toISOString().split('T')[0]
    }

    setPlans(prev => [plan, ...prev])
    setNewPlan({ vesselName: "", command: "", dockyard: "", reasonForDocking: "", plannedDate: "", description: "" })
    setIsCreateOpen(false)
    toast({ title: "Success", description: "Dockyard plan created successfully" })
  }

  const handleStatusChange = (planId: number, newStatus: DockyardPlan["status"]) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, status: newStatus } : plan
    ))
    toast({ title: "Success", description: `Plan status updated to ${newStatus}` })
  }

  const handleDeletePlan = (planId: number) => {
    setPlans(prev => prev.filter(plan => plan.id !== planId))
    toast({ title: "Success", description: "Plan deleted successfully" })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft": return <FileText className="h-4 w-4" />
      case "Submitted": return <Clock className="h-4 w-4" />
      case "Under Review": return <Eye className="h-4 w-4" />
      case "Approved": return <CheckCircle className="h-4 w-4" />
      case "Rejected": return <XCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Dockyard Plan Approval</h1>
          <p className="text-muted-foreground mt-2">
            Manage dockyard plans from initiation to approval
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Dockyard Plan</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new dockyard plan
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vessel">Vessel *</Label>
                    <Select value={newPlan.vesselName} onValueChange={(value) => setNewPlan(prev => ({ ...prev, vesselName: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vessel" />
                      </SelectTrigger>
                      <SelectContent>
                        {vessels.map(vessel => (
                          <SelectItem key={vessel} value={vessel}>{vessel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="command">Command *</Label>
                    <Select value={newPlan.command} onValueChange={(value) => setNewPlan(prev => ({ ...prev, command: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select command" />
                      </SelectTrigger>
                      <SelectContent>
                        {commands.map(command => (
                          <SelectItem key={command} value={command}>{command}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dockyard">Dockyard *</Label>
                    <Select value={newPlan.dockyard} onValueChange={(value) => setNewPlan(prev => ({ ...prev, dockyard: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dockyard" />
                      </SelectTrigger>
                      <SelectContent>
                        {dockyards.map(dockyard => (
                          <SelectItem key={dockyard} value={dockyard}>{dockyard}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plannedDate">Planned Date *</Label>
                    <Input 
                      type="date" 
                      value={newPlan.plannedDate}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, plannedDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Docking *</Label>
                  <Input 
                    placeholder="Enter reason for docking"
                    value={newPlan.reasonForDocking}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, reasonForDocking: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    placeholder="Additional details..."
                    value={newPlan.description}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreatePlan}>Create Plan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                <p className="text-2xl font-bold">{plans.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{plans.filter(p => p.status === "Under Review").length}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{plans.filter(p => p.status === "Approved").length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{plans.filter(p => p.status === "Draft").length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dockyard Plans</CardTitle>
              <CardDescription>Manage all dockyard planning requests</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vessel</TableHead>
                <TableHead>Command</TableHead>
                <TableHead>Dockyard</TableHead>
                <TableHead>Planned Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Initiator</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.vesselName}</TableCell>
                  <TableCell>{plan.command}</TableCell>
                  <TableCell>{plan.dockyard}</TableCell>
                  <TableCell>{new Date(plan.plannedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(plan.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(plan.status)}
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{plan.initiator}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedPlan(plan)
                          setIsEditOpen(true)
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      {plan.status === "Under Review" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(plan.id, "Approved")}
                          >
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(plan.id, "Rejected")}
                          >
                            <XCircle className="h-3 w-3 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}