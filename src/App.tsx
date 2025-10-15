import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

import RequestBlood from "./pages/RequestBlood";
import CreateRequest from "./pages/CreateRequest";
import Dashboard from "./pages/Dashboard";
import FindDonors from "./pages/FindDonors";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import TestSupabase from "./pages/TestSupabase";
import TestSupabasePage from "./pages/TestSupabasePage";
import UserProfile from "./pages/UserProfile";
import AdminPanel from "./pages/AdminPanel";
import EmailConfirmation from "./pages/EmailConfirmation";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route path="/request-blood" element={<RequestBlood />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/find-donors" element={<FindDonors />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/test-supabase" element={<TestSupabase />} />
            <Route path="/test-supabase-page" element={<TestSupabasePage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/confirm-email" element={<EmailConfirmation />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;