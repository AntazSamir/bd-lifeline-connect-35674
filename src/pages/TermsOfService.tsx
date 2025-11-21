import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, FileText, AlertCircle } from "lucide-react";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-12 md:py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-2">
                            <Shield className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            BD LifeLine Connect
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Last Updated: November 21, 2024
                        </p>
                    </div>

                    {/* Important Notice */}
                    <Card className="border-primary/50 bg-primary/5">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <div className="space-y-2">
                                    <p className="font-semibold text-foreground">Important Notice</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        By creating an account or using BD LifeLine Connect, you agree to these Terms of Service.
                                        If you do not agree, please do not use the platform.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Terms Content */}
                    <Card>
                        <CardContent className="pt-6">
                            <Accordion type="single" collapsible className="w-full">
                                {/* 1. Introduction */}
                                <AccordionItem value="introduction">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span>1. Introduction & Agreement</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>
                                            Welcome to BD LifeLine Connect ("we", "our", "the Service"). By creating an account or using this platform,
                                            you agree to these Terms of Service. If you do not agree, please do not use the Service.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 2. Purpose of the Platform */}
                                <AccordionItem value="purpose">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        2. Purpose of the Platform
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>BD LifeLine Connect is a community-driven platform designed to:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Connect voluntary blood donors with people in need</li>
                                            <li>Provide search tools to find donors by blood group and location</li>
                                            <li>Allow users to submit emergency blood requests</li>
                                            <li>Help hospitals, patients, and families connect quickly</li>
                                        </ul>
                                        <p className="pt-2">
                                            <strong>Important:</strong> We do not provide medical services or guarantee donor availability.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 3. User Eligibility */}
                                <AccordionItem value="eligibility">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        3. User Eligibility
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>By using this platform, you confirm that:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>You are at least 18 years old</li>
                                            <li>You will provide accurate and truthful information</li>
                                            <li>You understand that blood donation requires meeting medical eligibility standards</li>
                                            <li>You are legally capable of entering into binding agreements</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 4. User Responsibilities */}
                                <AccordionItem value="responsibilities">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        4. User Responsibilities
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>Users agree to:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Provide accurate information in their profile</li>
                                            <li>Keep donor status and availability updated</li>
                                            <li>Use the platform respectfully and responsibly</li>
                                            <li>Not misuse the emergency blood request feature</li>
                                            <li>Not impersonate another person</li>
                                            <li>Not create multiple fake or misleading accounts</li>
                                            <li>Respond promptly to blood donation requests when available</li>
                                            <li>Follow all medical guidelines and safety protocols</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 5. Donor Information & Public Display */}
                                <AccordionItem value="donor-info">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        5. Donor Information & Public Display
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>When creating a donor profile, you agree that the following information may be displayed publicly to help recipients find you:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Your name</li>
                                            <li>Blood group</li>
                                            <li>District / Upazila (location)</li>
                                            <li>Phone number</li>
                                            <li>Last donation date</li>
                                            <li>Availability status</li>
                                        </ul>
                                        <p className="pt-2">
                                            Your information will only be used for blood donation-related purposes and will be handled in accordance with our Privacy Policy.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 6. Emergency Request Usage */}
                                <AccordionItem value="emergency">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        6. Emergency Blood Request Usage Rules
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>Users submitting blood requests must:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Only submit real, urgent, and authentic blood requests</li>
                                            <li>Not spam or misuse the request system</li>
                                            <li>Provide correct hospital and contact details</li>
                                            <li>Update or cancel requests when no longer needed</li>
                                            <li>Provide accurate patient information and requirements</li>
                                        </ul>
                                        <p className="pt-2 font-semibold text-destructive">
                                            Warning: Fake or repeated misuse may result in immediate account suspension or termination.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 7. Account & Profile Management */}
                                <AccordionItem value="account">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        7. Account & Profile Management
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p><strong>Users may:</strong></p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Update their profile information anytime</li>
                                            <li>Change donor availability status</li>
                                            <li>Upload or update profile photo</li>
                                            <li>Manage notification preferences</li>
                                            <li>Delete their account at any time</li>
                                        </ul>
                                        <p className="pt-3"><strong>Platform administrators may:</strong></p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Edit or remove inaccurate or harmful content</li>
                                            <li>Verify user information for authenticity</li>
                                            <li>Suspend accounts that violate these Terms</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 8. Prohibited Activities */}
                                <AccordionItem value="prohibited">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        8. Prohibited Activities
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>You may not:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Harass, threaten, or abuse donors or recipients</li>
                                            <li>Post false or misleading information</li>
                                            <li>Use the platform for illegal activity</li>
                                            <li>Attempt to hack, disrupt, or damage the platform</li>
                                            <li>Upload harmful files or malicious content</li>
                                            <li>Sell or commercialize blood donations</li>
                                            <li>Scrape or harvest user data without authorization</li>
                                            <li>Share your account credentials with others</li>
                                            <li>Create automated bots or scripts to access the platform</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 9. Accuracy of Information */}
                                <AccordionItem value="accuracy">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        9. Accuracy of Information
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>Users are fully responsible for the accuracy of:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Personal information (name, contact details)</li>
                                            <li>Blood group</li>
                                            <li>Contact details (phone number, email)</li>
                                            <li>Last donation date</li>
                                            <li>Location information</li>
                                            <li>Availability status</li>
                                        </ul>
                                        <p className="pt-2 font-semibold">
                                            The platform is not responsible for incorrect information provided by users.
                                            Providing false information may result in account suspension.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 10. Health & Medical Disclaimer */}
                                <AccordionItem value="medical">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        10. Health & Medical Disclaimer
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p><strong>BD LifeLine Connect:</strong></p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Does not verify medical eligibility of donors</li>
                                            <li>Does not provide medical advice, diagnosis, or treatment</li>
                                            <li>Does not guarantee donor response or donation</li>
                                            <li>Does not replace hospitals or certified blood banks</li>
                                            <li>Is not responsible for medical complications arising from blood donation or transfusion</li>
                                        </ul>
                                        <p className="pt-2 font-semibold text-destructive">
                                            Always consult a qualified medical professional for health-related decisions.
                                            All blood donations must be conducted through certified medical facilities.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 11. Limitation of Liability */}
                                <AccordionItem value="liability">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        11. Limitation of Liability
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>To the fullest extent permitted by law, BD LifeLine Connect is not liable for:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Donor availability or response time</li>
                                            <li>Unsuccessful blood requests</li>
                                            <li>Medical complications or outcomes</li>
                                            <li>Any interactions or communication between users</li>
                                            <li>Damages or losses resulting from using our Service</li>
                                            <li>Data loss or service interruptions</li>
                                            <li>Actions or inactions of other users</li>
                                        </ul>
                                        <p className="pt-2 font-semibold">
                                            You use the Service at your own risk. The platform is provided "as is" and "as available"
                                            without warranties of any kind.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 12. Account Suspension & Termination */}
                                <AccordionItem value="termination">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        12. Account Suspension & Termination
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>We may suspend or terminate accounts that:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Provide false or misleading information</li>
                                            <li>Misuse emergency request features</li>
                                            <li>Harass or threaten other users</li>
                                            <li>Violate these Terms of Service</li>
                                            <li>Harm platform integrity or security</li>
                                            <li>Engage in illegal activities</li>
                                        </ul>
                                        <p className="pt-2">
                                            Upon termination, your access to the platform will cease immediately.
                                            Certain data may be retained as required by law or for legitimate business purposes.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 13. Privacy & Data Usage Summary */}
                                <AccordionItem value="privacy">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        13. Privacy & Data Usage Summary
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p><strong>We collect personal data such as:</strong></p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Name, phone number, email</li>
                                            <li>Blood group</li>
                                            <li>Address (District, Upazila)</li>
                                            <li>Profile photo</li>
                                            <li>Last donation date</li>
                                        </ul>
                                        <p className="pt-3"><strong>Data is used to:</strong></p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Help match donors and recipients</li>
                                            <li>Maintain donor listings</li>
                                            <li>Improve platform functionality</li>
                                            <li>Prevent misuse and ensure safety</li>
                                            <li>Send notifications about blood requests</li>
                                        </ul>
                                        <p className="pt-2 font-semibold text-primary">
                                            We never sell user data. For complete details, please review our Privacy Policy.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 14. Changes to the Terms */}
                                <AccordionItem value="changes">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        14. Changes to the Terms
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>
                                            We may update these Terms of Service at any time to reflect changes in our practices,
                                            legal requirements, or platform features.
                                        </p>
                                        <p>
                                            When we make changes, we will update the "Last Updated" date at the top of this page.
                                            Continued use of the platform after changes are posted means you accept the updated Terms.
                                        </p>
                                        <p className="font-semibold">
                                            We encourage you to review these Terms periodically to stay informed about your rights and responsibilities.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 15. Contact Information */}
                                <AccordionItem value="contact">
                                    <AccordionTrigger className="text-left hover:text-primary">
                                        15. Contact Information
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                        <p>If you have questions, concerns, or feedback about these Terms of Service, please contact us:</p>
                                        <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                                            <p><strong>Email:</strong> support@bloodconnect.bd</p>
                                            <p><strong>Phone:</strong> +880 1XXX-XXXXXX</p>
                                            <p><strong>Platform:</strong> BD LifeLine Connect</p>
                                        </div>
                                        <p className="pt-2">
                                            We aim to respond to all inquiries within 48 hours during business days.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    {/* Footer Notice */}
                    <Card className="border-muted">
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground text-center leading-relaxed">
                                By using BD LifeLine Connect, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                                Thank you for being part of our life-saving community.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfService;
