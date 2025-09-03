import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Ship, 
  Anchor, 
  MapPin, 
  Settings,
  Upload,
  Download
} from "lucide-react"

const masterCategories = [
  { id: "vessels", name: "Vessels", icon: Ship, count: 127 },
  { id: "commands", name: "Commands", icon: Anchor, count: 24 },
  { id: "dockyards", name: "Dockyards", icon: MapPin, count: 15 },
  { id: "hull-systems", name: "Hull Systems", icon: Settings, count: 89 },
]

const sampleVessels = [
  {
    id: 1,
    name: "INS Vikrant",
    class: "Vikrant Class",
    type: "Aircraft Carrier",
    command: "Western Naval Command",
    dockyard: "Cochin Shipyard",
    yearOfBuild: 2013,
    yearOfDelivery: 2022,
    status: "Active"
  },
  {
    id: 2,
    name: "INS Vikramaditya", 
    class: "Kiev Class",
    type: "Aircraft Carrier",
    command: "Western Naval Command",
    dockyard: "Sevmash Shipyard",
    yearOfBuild: 1987,
    yearOfDelivery: 2013,
    status: "Active"
  },
  {
    id: 3,
    name: "INS Kolkata",
    class: "Kolkata Class",
    type: "Destroyer",
    command: "Eastern Naval Command",
    dockyard: "Mazagon Dock",
    yearOfBuild: 2003,
    yearOfDelivery: 2014,
    status: "Under Maintenance"
  }
]

export default function GlobalMasters() {
  const [selectedCategory, setSelectedCategory] = useState("vessels")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVessel, setSelectedVessel] = useState<any>(null)

  const filteredVessels = sampleVessels.filter(vessel =>
    vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentCategory = masterCategories.find(cat => cat.id === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Masters</h1>
          <p className="text-muted-foreground mt-2">
            Manage master data for vessels, commands, dockyards, and systems
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {masterCategories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCategory === category.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{category.count} entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* List Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentCategory?.icon && <currentCategory.icon className="h-5 w-5" />}
                  {currentCategory?.name}
                </CardTitle>
                <CardDescription>
                  Manage {currentCategory?.name.toLowerCase()} master data
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Command</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVessels.map((vessel) => (
                  <TableRow 
                    key={vessel.id}
                    className={`cursor-pointer hover:bg-muted/50 ${
                      selectedVessel?.id === vessel.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedVessel(vessel)}
                  >
                    <TableCell className="font-medium">{vessel.name}</TableCell>
                    <TableCell>{vessel.class}</TableCell>
                    <TableCell>{vessel.type}</TableCell>
                    <TableCell>{vessel.command}</TableCell>
                    <TableCell>
                      <Badge variant={vessel.status === 'Active' ? 'default' : 'secondary'}>
                        {vessel.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>
              {selectedVessel ? `${selectedVessel.name} Information` : 'Select an item to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedVessel ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vessel Name</label>
                  <p className="text-sm">{selectedVessel.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Class</label>
                  <p className="text-sm">{selectedVessel.class}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="text-sm">{selectedVessel.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Command</label>
                  <p className="text-sm">{selectedVessel.command}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dockyard</label>
                  <p className="text-sm">{selectedVessel.dockyard}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year Built</label>
                    <p className="text-sm">{selectedVessel.yearOfBuild}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year Delivered</label>
                    <p className="text-sm">{selectedVessel.yearOfDelivery}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={selectedVessel.status === 'Active' ? 'default' : 'secondary'}>
                      {selectedVessel.status}
                    </Badge>
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <Button className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </Button>
                  <Button variant="outline" className="w-full">
                    View History
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Ship className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Select an item from the list to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}