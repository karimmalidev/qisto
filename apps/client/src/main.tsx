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
import { HomePage } from "./pages/home/home-page.tsx"
import { ProtectedRoute } from "./protected-route.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import { ProtectedLayout } from "./protected-layout.tsx"
import { NotFoundPage } from "./pages/not-found/not-found-page.tsx"
import { ProductsPage } from "./pages/products/products-page.tsx"
import { initDb } from "./db/index.ts"

initDb().then(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider>
        <DirectionProvider dir="rtl">
          <TooltipProvider>
            <QueryClientProvider client={new QueryClient()}>
              <AuthProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route element={<ProtectedLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                      </Route>
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </BrowserRouter>
                <Toaster richColors theme="system" />
              </AuthProvider>
            </QueryClientProvider>
          </TooltipProvider>
        </DirectionProvider>
      </ThemeProvider>
    </StrictMode>
  )
)
