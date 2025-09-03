import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../app-sidebar"
import { AppTopbar } from "../app-topbar"

interface MainLayoutProps {
  children: React.ReactNode
  breadcrumb?: string[]
}

export function MainLayout({ children, breadcrumb }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppTopbar breadcrumb={breadcrumb} />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}