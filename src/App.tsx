import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { LanguageProvider } from "./contexts/LanguageContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import QRForm from "./pages/QRForm";
import PublicForm from "./pages/PublicForm";
import Plans from "./pages/Plans";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Campaigns from "./pages/Campaigns";
import Templates from "./pages/Templates";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import PrintQR from "./pages/PrintQR";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Inventory from "./pages/Inventory";
import Onboarding from "./pages/Onboarding";
import POS from "./pages/POS";
import Orders from "./pages/Orders";
import Tables from "./pages/Tables";
import Employees from "./pages/Employees";
import CashFlow from "./pages/CashFlow";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/qr" element={<QRForm />} />
                <Route path="/form/:qrCode" element={<PublicForm />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
                <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
                <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                <Route path="/print/:qrCode" element={<PrintQR />} />
                <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
                <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
                <Route path="/cashflow" element={<ProtectedRoute><CashFlow /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
