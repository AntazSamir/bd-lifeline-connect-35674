import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, AlertCircle, Clock, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmailConfirmation = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (token_hash && type === "email") {
        try {
          const { error } = await supabase.auth.verifyOtp({
            type: "email",
            token_hash,
          });

          if (error) {
            throw error;
          }

          setStatus("success");
          setMessage(t('emailVerifiedToastDesc'));
          toast({
            title: t('emailVerified'),
            description: t('emailVerifiedToastDesc'),
          });
        } catch (error) {
          console.error("Email confirmation error:", error);
          setStatus("error");
          setMessage(t('failedToVerify'));
          toast({
            title: t('verificationFailed'),
            description: t('verificationFailedToastDesc'),
            variant: "destructive",
          });
        }
      } else {
        setStatus("error");
        setMessage(t('invalidLink'));
      }
    };

    confirmEmail();
  }, [searchParams, toast, t]);

  const handleRedirect = () => {
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              {status === "loading" && <Clock className="h-8 w-8 text-primary animate-spin" />}
              {status === "success" && <CheckCircle className="h-8 w-8 text-success" />}
              {status === "error" && <AlertCircle className="h-8 w-8 text-destructive" />}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === "loading" && t('verifyingEmail')}
              {status === "success" && t('emailVerified')}
              {status === "error" && t('verificationFailed')}
            </CardTitle>
            <CardDescription>
              {status === "loading" && t('waitVerifying')}
              {status === "success" && t('emailVerifiedToastDesc')}
              {status === "error" && t('verificationFailedToastDesc')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-center">
            <p className={status === "error" ? "text-destructive" : ""}>
              {message}
            </p>

            {(status === "success" || status === "error") && (
              <div className="pt-4">
                <Button
                  onClick={handleRedirect}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {t('continueToSignIn')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default EmailConfirmation;