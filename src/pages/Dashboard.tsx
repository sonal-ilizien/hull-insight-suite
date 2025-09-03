import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ship, FileText, Activity, AlertCircle, TrendingUp, Calendar } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"

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

const recentActivities = [
  {
    id: 1,
    type: "Dockyard Plan",
    vessel: "INS Vikrant",
    action: "Submitted for Review",
    user: "Lt. Commander Patel",
    status: "pending",
    time: "2 hours ago"
  },
  {
    id: 2,
    type: "Hull Survey",
    vessel: "INS Vikramaditya", 
    action: "Approved",
    user: "Captain Singh",
    status: "approved",
    time: "5 hours ago"
  },
  {
    id: 3,
    type: "Dockyard Plan",
    vessel: "INS Kolkata",
    action: "Under Review",
    user: "Commander Sharma", 
    status: "underReview",
    time: "1 day ago"
  }
]

export default function Dashboard() {
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
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates from dockyard plans and hull surveys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{activity.type}</Badge>
                        <span className="font-medium">{activity.vessel}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.action} by {activity.user}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge variant={activity.status as any}>
                      {activity.action}
                    </StatusBadge>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="w-full">
                View All Activities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              New Dockyard Plan
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Log Hull Survey
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Ship className="mr-2 h-4 w-4" />
              Add New Vessel
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertCircle className="mr-2 h-4 w-4" />
              View Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}