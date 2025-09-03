import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ship, FileText, Activity, AlertCircle, TrendingUp, Calendar } from "lucide-react"

const dashboardStats = [
  { title: "Total Vessels", value: "127", description: "Active in fleet", icon: Ship, trend: "+2 this month" },
  { title: "Pending Plans", value: "23", description: "Awaiting approval", icon: FileText, trend: "-5 from last week" },
  { title: "Active Surveys", value: "45", description: "In progress", icon: Activity, trend: "+12 this quarter" },
  { title: "Critical Issues", value: "8", description: "Require attention", icon: AlertCircle, trend: "Urgent action needed" },
]

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Operations Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor vessel status, dockyard plans, and hull surveys across the fleet
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
                <Badge variant="secondary" className="text-xs">{stat.trend}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-primary" />
              Global Masters
            </CardTitle>
            <CardDescription>Manage vessels, commands, dockyards, and hull systems</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/masters">Access Module</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Dockyard Plan Approval
            </CardTitle>
            <CardDescription>Create, review, and approve dockyard plans</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/dockyard-plans">Access Module</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Hull Survey
            </CardTitle>
            <CardDescription>Log quarterly hull surveys and track compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/surveys">Access Module</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and immediate actions</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button asChild className="h-16 flex-col gap-2" variant="outline">
            <Link to="/dockyard-plans">
              <FileText className="h-6 w-6" />
              <span>New Dockyard Plan</span>
            </Link>
          </Button>
          <Button asChild className="h-16 flex-col gap-2" variant="outline">
            <Link to="/surveys">
              <Activity className="h-6 w-6" />
              <span>Log Hull Survey</span>
            </Link>
          </Button>
          <Button asChild className="h-16 flex-col gap-2" variant="outline">
            <Link to="/masters">
              <Ship className="h-6 w-6" />
              <span>Add Vessel</span>
            </Link>
          </Button>
          <Button asChild className="h-16 flex-col gap-2" variant="outline">
            <Link to="/dashboards">
              <AlertCircle className="h-6 w-6" />
              <span>View Alerts</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
