import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ship, FileText, Activity, AlertCircle, TrendingUp, Calendar, Menu } from "lucide-react"

const dashboardStats = [
  {
    title: "Total Vessels",
    value: "127",
    description: "Active in fleet",
    icon: Ship,
    trend: "+2 this month"
  },
  {
    title: "Pending Plans",
    value: "23", 
    description: "Awaiting approval",
    icon: FileText,
    trend: "-5 from last week"
  },
  {
    title: "Active Surveys",
    value: "45",
    description: "In progress", 
    icon: Activity,
    trend: "+12 this quarter"
  },
  {
    title: "Critical Issues",
    value: "8",
    description: "Require attention",
    icon: AlertCircle,
    trend: "Urgent action needed"
  }
]

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Ship className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-bold">Hull Insight</h1>
                <p className="text-xs text-muted-foreground">Naval Management</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Fleet Operations Dashboard
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Hull Insight</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive naval vessel management platform for dockyard planning, hull surveys, and fleet operations
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule View
              </Button>
              <Button>
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-primary" />
                  Global Masters
                </CardTitle>
                <CardDescription>
                  Manage vessels, commands, dockyards, and hull systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Access Module</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Dockyard Plan Approval
                </CardTitle>
                <CardDescription>
                  Create, review, and approve dockyard plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Access Module</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Hull Survey
                </CardTitle>
                <CardDescription>
                  Log quarterly hull surveys and track compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Access Module</Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and immediate actions
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-16 flex-col gap-2" variant="outline">
                <FileText className="h-6 w-6" />
                <span>New Dockyard Plan</span>
              </Button>
              <Button className="h-16 flex-col gap-2" variant="outline">
                <Activity className="h-6 w-6" />
                <span>Log Hull Survey</span>
              </Button>
              <Button className="h-16 flex-col gap-2" variant="outline">
                <Ship className="h-6 w-6" />
                <span>Add Vessel</span>
              </Button>
              <Button className="h-16 flex-col gap-2" variant="outline">
                <AlertCircle className="h-6 w-6" />
                <span>View Alerts</span>
              </Button>
            </CardContent>
          </Card>

          {/* Status Overview */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">INS Vikrant - Dockyard Plan</p>
                    <p className="text-sm text-muted-foreground">Submitted for review</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">INS Kolkata - Hull Survey</p>
                    <p className="text-sm text-muted-foreground">Completed quarterly inspection</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">Approved</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">INS Chennai - Maintenance</p>
                    <p className="text-sm text-muted-foreground">Scheduled for dry dock</p>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Platform health and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database Connection</span>
                  <Badge className="bg-success text-success-foreground">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Users</span>
                  <span className="text-sm font-medium">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">System Load</span>
                  <Badge variant="secondary">Normal</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Backup</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;