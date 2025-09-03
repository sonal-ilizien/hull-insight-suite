import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Users as UsersIcon, 
  Shield, 
  Settings, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Key
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  unit: string
  command: string
  isActive: boolean
  lastLogin: string
  createdOn: string
}

interface Role {
  id: number
  roleCode: string
  roleName: string
  description: string
  permissions: string[]
}

interface Privilege {
  id: number
  accessName: string
  module: string
  subModule: string
  description: string
}

const mockUsers: User[] = [
  {
    id: 1,
    username: "sharma.naval",
    email: "sharma@naval.gov.in",
    firstName: "Rajesh",
    lastName: "Sharma",
    role: "Initiator",
    unit: "HQ Western Naval Command",
    command: "Western Naval Command",
    isActive: true,
    lastLogin: "2024-01-15",
    createdOn: "2023-06-15"
  },
  {
    id: 2,
    username: "patel.reviewer",
    email: "patel@naval.gov.in", 
    firstName: "Priya",
    lastName: "Patel",
    role: "Reviewer",
    unit: "Naval Dockyard Mumbai",
    command: "Western Naval Command",
    isActive: true,
    lastLogin: "2024-01-14",
    createdOn: "2023-07-20"
  },
  {
    id: 3,
    username: "verma.approver",
    email: "verma@naval.gov.in",
    firstName: "Arun",
    lastName: "Verma",
    role: "Approver",
    unit: "Naval HQ",
    command: "Naval HQ",
    isActive: true,
    lastLogin: "2024-01-13",
    createdOn: "2023-05-10"
  }
]

const mockRoles: Role[] = [
  {
    id: 1,
    roleCode: "INIT",
    roleName: "Initiator",
    description: "Can create and edit plans/surveys until submission",
    permissions: ["create_plan", "edit_plan", "view_own_items"]
  },
  {
    id: 2,
    roleCode: "REV",
    roleName: "Reviewer", 
    description: "Can review submitted items and add comments",
    permissions: ["view_assigned_items", "add_comments", "request_revision", "recommend_approval"]
  },
  {
    id: 3,
    roleCode: "APP",
    roleName: "Approver",
    description: "Can approve or reject items and view audit history",
    permissions: ["final_approve", "reject_items", "view_audit_history"]
  },
  {
    id: 4,
    roleCode: "ADMIN",
    roleName: "Administrator",
    description: "Full system access including user and master data management",
    permissions: ["manage_masters", "manage_users", "manage_roles", "system_config", "override_permissions"]
  }
]

const mockPrivileges: Privilege[] = [
  { id: 1, accessName: "View", module: "Global Masters", subModule: "Vessels", description: "View vessel master data" },
  { id: 2, accessName: "Add", module: "Global Masters", subModule: "Vessels", description: "Add new vessels" },
  { id: 3, accessName: "Edit", module: "Global Masters", subModule: "Vessels", description: "Edit vessel details" },
  { id: 4, accessName: "Delete", module: "Global Masters", subModule: "Vessels", description: "Delete vessels" },
  { id: 5, accessName: "View", module: "Dockyard Plans", subModule: "Plan Creation", description: "View dockyard plans" },
  { id: 6, accessName: "Add", module: "Dockyard Plans", subModule: "Plan Creation", description: "Create new plans" },
  { id: 7, accessName: "Approve", module: "Dockyard Plans", subModule: "Plan Approval", description: "Approve/reject plans" }
]

const commands = ["Naval HQ", "Western Naval Command", "Eastern Naval Command", "Southern Naval Command"]
const units = ["Naval HQ", "HQ Western Naval Command", "Naval Dockyard Mumbai", "Naval Dockyard Visakhapatnam"]
const rolesList = ["Initiator", "Reviewer", "Approver", "Administrator"]

export default function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [privileges, setPrivileges] = useState<Privilege[]>(mockPrivileges)
  const [activeTab, setActiveTab] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "",
    unit: "",
    command: "",
    phone: ""
  })
  const [newRole, setNewRole] = useState({
    roleCode: "",
    roleName: "",
    description: "",
    permissions: [] as string[]
  })
  const { toast } = useToast()

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.email || !newUser.firstName || !newUser.lastName || !newUser.password || !newUser.role) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    const user: User = {
      id: Date.now(),
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      unit: newUser.unit || "Unassigned",
      command: newUser.command || "Unassigned",
      isActive: true,
      lastLogin: "Never",
      createdOn: new Date().toISOString().split('T')[0]
    }

    setUsers(prev => [user, ...prev])
    setNewUser({ username: "", email: "", firstName: "", lastName: "", password: "", role: "", unit: "", command: "", phone: "" })
    setIsCreateUserOpen(false)
    toast({ title: "Success", description: "User created successfully" })
  }

  const handleToggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ))
    toast({ title: "Success", description: "User status updated" })
  }

  const handleCreateRole = () => {
    if (!newRole.roleCode || !newRole.roleName || !newRole.description) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    const role: Role = {
      id: Date.now(),
      roleCode: newRole.roleCode,
      roleName: newRole.roleName,
      description: newRole.description,
      permissions: newRole.permissions
    }

    setRoles(prev => [role, ...prev])
    setNewRole({ roleCode: "", roleName: "", description: "", permissions: [] })
    setIsCreateRoleOpen(false)
    toast({ title: "Success", description: "Role created successfully" })
  }

  const toggleRolePermission = (permission: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
          <p className="text-muted-foreground mt-2">
            Manage system users, roles, and access privileges
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="privileges">Privileges</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {rolesList.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>Add a new user to the system</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Username *</Label>
                      <Input
                        value={newUser.username}
                        onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input
                        value={newUser.firstName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input
                        value={newUser.lastName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Password *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newUser.password}
                          onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Role *</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {rolesList.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Command</Label>
                      <Select value={newUser.command} onValueChange={(value) => setNewUser(prev => ({ ...prev, command: value }))}>
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
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select value={newUser.unit} onValueChange={(value) => setNewUser(prev => ({ ...prev, unit: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map(unit => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newUser.phone}
                      onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateUser}>Create User</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
              <CardDescription>Manage user accounts and access</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Command</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.command}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin === "Never" ? "Never" : new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            {user.isActive ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Key className="h-3 w-3" />
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
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>Define a new role with specific permissions</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Role Code *</Label>
                      <Input
                        value={newRole.roleCode}
                        onChange={(e) => setNewRole(prev => ({ ...prev, roleCode: e.target.value }))}
                        placeholder="e.g., USR"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role Name *</Label>
                      <Input
                        value={newRole.roleName}
                        onChange={(e) => setNewRole(prev => ({ ...prev, roleName: e.target.value }))}
                        placeholder="e.g., User"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Input
                      value={newRole.description}
                      onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the role's purpose and responsibilities"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {["create_plan", "edit_plan", "view_own_items", "view_assigned_items", "add_comments", "request_revision", "recommend_approval", "final_approve", "reject_items", "view_audit_history", "manage_masters", "manage_users"].map(permission => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission}
                            checked={newRole.permissions.includes(permission)}
                            onCheckedChange={() => toggleRolePermission(permission)}
                          />
                          <Label htmlFor={permission} className="text-sm">
                            {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateRole}>Create Role</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>Manage roles and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{role.roleName}</p>
                          <p className="text-sm text-muted-foreground">{role.roleCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map(permission => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {users.filter(u => u.role === role.roleName).length}
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
        </TabsContent>

        {/* Privileges Tab */}
        <TabsContent value="privileges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Privileges</CardTitle>
              <CardDescription>Available access privileges across modules</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Access</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Sub-Module</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assigned Roles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {privileges.map((privilege) => (
                    <TableRow key={privilege.id}>
                      <TableCell>
                        <Badge variant="outline">{privilege.accessName}</Badge>
                      </TableCell>
                      <TableCell>{privilege.module}</TableCell>
                      <TableCell>{privilege.subModule}</TableCell>
                      <TableCell>{privilege.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs">Admin</Badge>
                          <Badge variant="secondary" className="text-xs">Reviewer</Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Global system settings and defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Module Access</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable Dockyard Plans Module</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable Hull Surveys Module</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable Interactive Drawing</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable Reports Module</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">File Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Maximum File Size (MB)</Label>
                      <Input type="number" defaultValue="10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Allowed File Types</Label>
                      <Input defaultValue="pdf,png,jpg,docx,xlsx" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Survey Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Survey Reminder Days</Label>
                      <Input type="number" defaultValue="7" />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Survey Cycle</Label>
                      <Select defaultValue="quarterly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Configuration</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}