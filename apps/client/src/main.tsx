import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Routes, Route, BrowserRouter } from "react-router"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { DirectionProvider } from "./components/ui/direction.tsx"
import { LoginPage } from "./pages/login/login-page.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { AuthProvider } from "./features/auth/auth-provider.tsx"
import { DashboardHomePage } from "./pages/dashboard/dashboard-home-page.tsx"
import { ProtectedRoute } from "./protected-route.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DirectionProvider dir="rtl">
        <QueryClientProvider client={new QueryClient()}>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<DashboardHomePage />} />
                </Route>
              </Routes>
            </BrowserRouter>
            <Toaster richColors />
          </AuthProvider>
        </QueryClientProvider>
      </DirectionProvider>
    </ThemeProvider>
  </StrictMode>
)
