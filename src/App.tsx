import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/main-layout";
import Index from "./pages/Index";
import GlobalMasters from "./pages/GlobalMasters";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <MainLayout breadcrumb={["Hull Insight", "Dashboard"]}>
                <Index />
              </MainLayout>
            }
          />

          <Route
            path="/masters"
            element={
              <MainLayout breadcrumb={["Hull Insight", "Global Masters"]}>
                <GlobalMasters />
              </MainLayout>
            }
          />

          <Route
            path="/dockyard-plans"
            element={
              <MainLayout breadcrumb={["Hull Insight", "Dockyard Plans"]}>
                <div className="p-6">Dockyard Plan module coming soon.</div>
              </MainLayout>
            }
          />

          <Route
            path="/surveys"
            element={
              <MainLayout breadcrumb={["Hull Insight", "Hull Surveys"]}>
                <div className="p-6">Hull Surveys module coming soon.</div>
              </MainLayout>
            }
          />

          <Route
            path="/dashboards"
            element={
              <MainLayout breadcrumb={["Hull Insight", "Dashboards"]}>
                <div className="p-6">Dashboards coming soon.</div>
              </MainLayout>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;