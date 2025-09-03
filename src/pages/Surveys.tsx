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
import { Plus, Search, Edit, Trash2, Activity, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Survey {
  id: number
  vesselName: string
  command: string
  hullCompartment: string
  inspector: string
  inspectionDate: string
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected"
  checkpoints: {
    checkpoint: string
    status: "OK" | "Fail" | "Warning"
    damageType?: string
    severity?: string
    description?: string
  }[]
  correctiveActions: string[]
  createdOn: string
}

const mockSurveys: Survey[] = [
  {
    id: 1,
    vesselName: "INS Vikrant",
    command: "Western Naval Command",
    hullCompartment: "Forward Compartment A",
    inspector: "Lt. Cdr. Naval",
    inspectionDate: "2024-01-15",
    status: "Under Review",
    checkpoints: [
      { checkpoint: "Hull Integrity", status: "OK" },
      { checkpoint: "Watertight Doors", status: "Fail", damageType: "Corrosion", severity: "Medium", description: "Minor rust observed" },
      { checkpoint: "Paint Condition", status: "Warning", damageType: "Wear", severity: "Low", description: "Touch-up required" }
    ],
    correctiveActions: ["Replace corroded fittings", "Apply protective coating"],
    createdOn: "2024-01-15"
  },
  {
    id: 2,
    vesselName: "INS Kolkata",
    command: "Eastern Naval Command",
    hullCompartment: "Engine Room",
    inspector: "Lt. Marine",
    inspectionDate: "2024-01-10",
    status: "Approved",
    checkpoints: [
      { checkpoint: "Hull Integrity", status: "OK" },
      { checkpoint: "Ventilation System", status: "OK" },
      { checkpoint: "Emergency Equipment", status: "OK" }
    ],
    correctiveActions: [],
    createdOn: "2024-01-10"
  }
]

const vessels = ["INS Vikrant", "INS Kolkata", "INS Vikramaditya", "INS Chennai", "INS Delhi"]
const commands = ["Western Naval Command", "Eastern Naval Command", "Southern Naval Command"]
const compartments = ["Forward Compartment A", "Engine Room", "Control Room", "Storage Bay", "Weapon Bay"]
const damageTypes = ["Corrosion", "Crack", "Wear", "Deformation", "Electrical"]
const severities = ["Low", "Medium", "High", "Critical"]

const checkpointsList = [
  "Hull Integrity",
  "Watertight Doors", 
  "Paint Condition",
  "Ventilation System",
  "Emergency Equipment",
  "Fire Safety Equipment",
  "Electrical Systems",
  "Structural Welding"
]

export default function Surveys() {
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newSurvey, setNewSurvey] = useState({
    vesselName: "",
    command: "",
    hullCompartment: "",
    inspector: "",
    inspectionDate: "",
    checkpoints: checkpointsList.map(cp => ({ 
      checkpoint: cp, 
      status: "OK" as const, 
      damageType: "", 
      severity: "", 
      description: "" 
    })),
    correctiveActions: [""]
  })
  const { toast } = useToast()

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.command.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || survey.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateSurvey = () => {
    if (!newSurvey.vesselName || !newSurvey.command || !newSurvey.hullCompartment || !newSurvey.inspector || !newSurvey.inspectionDate) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    const survey: Survey = {
      id: Date.now(),
      vesselName: newSurvey.vesselName,
      command: newSurvey.command,
      hullCompartment: newSurvey.hullCompartment,
      inspector: newSurvey.inspector,
      inspectionDate: newSurvey.inspectionDate,
      status: "Draft",
      checkpoints: newSurvey.checkpoints.filter(cp => cp.status !== "OK" || cp.description),
      correctiveActions: newSurvey.correctiveActions.filter(action => action.trim()),
      createdOn: new Date().toISOString().split('T')[0]
    }

    setSurveys(prev => [survey, ...prev])
    setNewSurvey({
      vesselName: "",
      command: "",
      hullCompartment: "",
      inspector: "",
      inspectionDate: "",
      checkpoints: checkpointsList.map(cp => ({ 
        checkpoint: cp, 
        status: "OK" as const, 
        damageType: "", 
        severity: "", 
        description: "" 
      })),
      correctiveActions: [""]
    })
    setIsCreateOpen(false)
    toast({ title: "Success", description: "Survey created successfully" })
  }

  const handleStatusChange = (surveyId: number, newStatus: Survey["status"]) => {
    setSurveys(prev => prev.map(survey => 
      survey.id === surveyId ? { ...survey, status: newStatus } : survey
    ))
    toast({ title: "Success", description: `Survey status updated to ${newStatus}` })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft": return <Clock className="h-4 w-4" />
      case "Submitted": return <Activity className="h-4 w-4" />
      case "Under Review": return <AlertTriangle className="h-4 w-4" />
      case "Approved": return <CheckCircle className="h-4 w-4" />
      case "Rejected": return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getCheckpointIcon = (status: string) => {
    switch (status) {
      case "OK": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Fail": return <XCircle className="h-4 w-4 text-red-600" />
      default: return <CheckCircle className="h-4 w-4" />
    }
  }

  const updateCheckpoint = (index: number, field: string, value: string) => {
    setNewSurvey(prev => ({
      ...prev,
      checkpoints: prev.checkpoints.map((cp, i) => 
        i === index ? { ...cp, [field]: value } : cp
      )
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quarterly Hull Survey</h1>
          <p className="text-muted-foreground mt-2">
            Manage hull surveys and compliance tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Compliance Dashboard
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Survey
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Hull Survey</DialogTitle>
                <DialogDescription>
                  Fill in the survey details and checkpoints
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vessel *</Label>
                    <Select value={newSurvey.vesselName} onValueChange={(value) => setNewSurvey(prev => ({ ...prev, vesselName: value }))}>
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
                    <Label>Command *</Label>
                    <Select value={newSurvey.command} onValueChange={(value) => setNewSurvey(prev => ({ ...prev, command: value }))}>
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
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Hull Compartment *</Label>
                    <Select value={newSurvey.hullCompartment} onValueChange={(value) => setNewSurvey(prev => ({ ...prev, hullCompartment: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select compartment" />
                      </SelectTrigger>
                      <SelectContent>
                        {compartments.map(compartment => (
                          <SelectItem key={compartment} value={compartment}>{compartment}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Inspector *</Label>
                    <Input 
                      placeholder="Inspector name"
                      value={newSurvey.inspector}
                      onChange={(e) => setNewSurvey(prev => ({ ...prev, inspector: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Inspection Date *</Label>
                    <Input 
                      type="date" 
                      value={newSurvey.inspectionDate}
                      onChange={(e) => setNewSurvey(prev => ({ ...prev, inspectionDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Checkpoints */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Survey Checkpoints</Label>
                  <div className="space-y-3">
                    {newSurvey.checkpoints.map((checkpoint, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">{checkpoint.checkpoint}</Label>
                              <Select 
                                value={checkpoint.status} 
                                onValueChange={(value) => updateCheckpoint(index, 'status', value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OK">OK</SelectItem>
                                  <SelectItem value="Warning">Warning</SelectItem>
                                  <SelectItem value="Fail">Fail</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {checkpoint.status !== "OK" && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Damage Type</Label>
                                  <Select 
                                    value={checkpoint.damageType} 
                                    onValueChange={(value) => updateCheckpoint(index, 'damageType', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select damage type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {damageTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Severity</Label>
                                  <Select 
                                    value={checkpoint.severity} 
                                    onValueChange={(value) => updateCheckpoint(index, 'severity', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {severities.map(severity => (
                                        <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <Label>Description / Notes</Label>
                              <Textarea 
                                placeholder="Additional observations..."
                                value={checkpoint.description}
                                onChange={(e) => updateCheckpoint(index, 'description', e.target.value)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Corrective Actions */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Proposed Corrective Actions</Label>
                  {newSurvey.correctiveActions.map((action, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        placeholder={`Corrective action ${index + 1}`}
                        value={action}
                        onChange={(e) => {
                          const newActions = [...newSurvey.correctiveActions]
                          newActions[index] = e.target.value
                          setNewSurvey(prev => ({ ...prev, correctiveActions: newActions }))
                        }}
                      />
                      {index === newSurvey.correctiveActions.length - 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setNewSurvey(prev => ({ 
                            ...prev, 
                            correctiveActions: [...prev.correctiveActions, ""] 
                          }))}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateSurvey}>Create Survey</Button>
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
                <p className="text-sm font-medium text-muted-foreground">Total Surveys</p>
                <p className="text-2xl font-bold">{surveys.length}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold">{surveys.filter(s => s.status === "Under Review").length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{surveys.filter(s => s.status === "Approved").length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Checkpoints</p>
                <p className="text-2xl font-bold">
                  {surveys.reduce((acc, s) => acc + s.checkpoints.filter(cp => cp.status === "Fail").length, 0)}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hull Surveys</CardTitle>
              <CardDescription>Manage quarterly hull survey inspections</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search surveys..."
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
                <TableHead>Compartment</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Checkpoints</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSurveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell className="font-medium">{survey.vesselName}</TableCell>
                  <TableCell>{survey.hullCompartment}</TableCell>
                  <TableCell>{survey.inspector}</TableCell>
                  <TableCell>{new Date(survey.inspectionDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={survey.status === "Approved" ? "default" : survey.status === "Rejected" ? "destructive" : "secondary"} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(survey.status)}
                      {survey.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {survey.checkpoints.slice(0, 3).map((cp, idx) => (
                        <div key={idx} title={`${cp.checkpoint}: ${cp.status}`}>
                          {getCheckpointIcon(cp.status)}
                        </div>
                      ))}
                      {survey.checkpoints.length > 3 && (
                        <span className="text-sm text-muted-foreground">+{survey.checkpoints.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      {survey.status === "Under Review" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(survey.id, "Approved")}
                          >
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(survey.id, "Rejected")}
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