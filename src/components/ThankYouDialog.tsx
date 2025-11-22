import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThankYouDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ThankYouDialog({ open, onOpenChange }: ThankYouDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center justify-center py-8 px-4">
                    {/* Animated Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1
                        }}
                        className="relative mb-6"
                    >
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.3
                                }}
                            >
                                <CheckCircle2 className="w-12 h-12 text-primary" />
                            </motion.div>
                        </div>

                        {/* Floating Hearts */}
                        <motion.div
                            animate={{
                                y: [-10, -20, -10],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -top-2 -right-2"
                        >
                            <Heart className="w-6 h-6 text-primary fill-primary" />
                        </motion.div>
                    </motion.div>

                    {/* Thank You Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-center space-y-3"
                    >
                        <h2 className="text-2xl font-bold text-foreground">
                            Thank You for Being a Hero!
                        </h2>
                        <p className="text-muted-foreground max-w-sm">
                            You're already registered as a blood donor. Your commitment to saving lives is truly appreciated!
                        </p>
                    </motion.div>

                    {/* Close Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8"
                    >
                        <Button
                            onClick={() => onOpenChange(false)}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Close
                        </Button>
                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
