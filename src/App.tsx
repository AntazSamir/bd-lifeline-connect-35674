import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
import CheckEmail from "./pages/CheckEmail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ResetPassword from "./pages/ResetPassword";
import TestRealtime from "./pages/TestRealtime";
import TermsOfService from "./pages/TermsOfService";
import { AuthListener } from "./components/AuthListener";
import ScrollToHashElement from "./components/ScrollToHashElement";
import PageTransition from "./components/PageTransition";
import NavigationProgress from "./components/NavigationProgress";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <NavigationProgress />
              <AuthListener />
              <ScrollToHashElement />
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/request-blood" element={<RequestBlood />} />
                  <Route path="/create-request" element={<CreateRequest />} />
                  <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
                  <Route path="/find-donors" element={<FindDonors />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/complete-profile" element={<CompleteProfile />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/confirm-email" element={<EmailConfirmation />} />
                  <Route path="/check-email" element={<CheckEmail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/test-realtime" element={<TestRealtime />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
