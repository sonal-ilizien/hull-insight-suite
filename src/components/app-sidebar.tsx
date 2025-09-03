import { useState } from "react"
import { 
  Users, 
  Shield, 
  FileText, 
  Layers, 
  Calendar, 
  MapPin, 
  Activity, 
  Settings,
  BarChart3,
  FileBarChart,
  PenTool,
  Ship,
  Anchor
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  { 
    title: "Global Masters", 
    url: "/masters", 
    icon: Layers,
    subItems: [
      { title: "Vessels", url: "/masters/vessels", icon: Ship },
      { title: "Commands", url: "/masters/commands", icon: Anchor },
      { title: "Dockyards", url: "/masters/dockyards", icon: MapPin },
      { title: "Hull Systems", url: "/masters/hull-systems", icon: Settings },
    ]
  },
  { 
    title: "Dockyard Plan Approval", 
    url: "/dockyard-plans", 
    icon: FileText,
    subItems: [
      { title: "Plan Creation", url: "/dockyard-plans/create", icon: PenTool },
      { title: "Plan Review", url: "/dockyard-plans/review", icon: FileText },
      { title: "Calendar View", url: "/dockyard-plans/calendar", icon: Calendar },
    ]
  },
  { 
    title: "Quarterly Hull Survey", 
    url: "/surveys", 
    icon: Activity,
    subItems: [
      { title: "Survey Logging", url: "/surveys/create", icon: PenTool },
      { title: "Survey Review", url: "/surveys/review", icon: FileText },
      { title: "Compliance Dashboard", url: "/surveys/compliance", icon: BarChart3 },
    ]
  },
  { 
    title: "Interactive Drawing", 
    url: "/drawing", 
    icon: PenTool 
  },
  { 
    title: "Dashboards", 
    url: "/dashboards", 
    icon: BarChart3 
  },
  { 
    title: "Reports", 
    url: "/reports", 
    icon: FileBarChart 
  },
  { 
    title: "Users & Roles", 
    url: "/users", 
    icon: Users,
    subItems: [
      { title: "Users", url: "/users/list", icon: Users },
      { title: "Roles", url: "/users/roles", icon: Shield },
      { title: "Privileges", url: "/users/privileges", icon: Settings },
    ]
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/")
  const isGroupExpanded = (title: string) => expandedGroups.includes(title)
  
  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const getNavClasses = (isActiveLink: boolean) =>
    isActiveLink 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-72"} border-r border-sidebar-border bg-sidebar`}
      collapsible="icon"
    >
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ship className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Hull Insight</h1>
              <p className="text-sm text-sidebar-foreground/70">Naval Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-3 py-2">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <div>
                      <SidebarMenuButton 
                        onClick={() => toggleGroup(item.title)}
                        className={`w-full justify-between ${getNavClasses(isActive(item.url))}`}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </div>
                        {!collapsed && (
                          <span className={`transform transition-transform ${isGroupExpanded(item.title) ? 'rotate-90' : ''}`}>
                            ›
                          </span>
                        )}
                      </SidebarMenuButton>
                      
                      {!collapsed && isGroupExpanded(item.title) && (
                        <div className="mt-1 ml-6 space-y-1">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuButton key={subItem.title} asChild size="sm">
                              <NavLink 
                                to={subItem.url} 
                                className={({ isActive }) => getNavClasses(isActive)}
                              >
                                <subItem.icon className="mr-3 h-3 w-3" />
                                <span className="text-sm">{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => getNavClasses(isActive)}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}