import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const CheckEmail = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "your email";

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold mb-2">
                            {t('verifyEmailTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-muted-foreground text-lg">
                            {t('verifyEmailSent', { email: email })}
                        </p>

                        <p className="text-muted-foreground">
                            {t('verifyEmailSpam')}
                        </p>

                        <Button
                            variant="link"
                            className="text-primary font-semibold text-lg"
                            onClick={() => navigate("/sign-in")}
                        >
                            {t('resendEmail')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default CheckEmail;
