import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

import RequestBlood from "./pages/RequestBlood";
import CreateRequest from "./pages/CreateRequest";
import Profile from "./pages/Profile";
import FindDonors from "./pages/FindDonors";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CompleteProfile from "./pages/CompleteProfile";
import NotFound from "./pages/NotFound";
import EmailConfirmation from "./pages/EmailConfirmation";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ResetPassword from "./pages/ResetPassword";
import TestRealtime from "./pages/TestRealtime";
import TermsOfService from "./pages/TermsOfService";
import { AuthListener } from "./components/AuthListener";

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
        <AuthListener />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            <Route path="/request-blood" element={<RequestBlood />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/dashboard" element={<Profile />} />
            <Route path="/find-donors" element={<FindDonors />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            {/* Test pages removed from production routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/confirm-email" element={<EmailConfirmation />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/test-realtime" element={<TestRealtime />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
