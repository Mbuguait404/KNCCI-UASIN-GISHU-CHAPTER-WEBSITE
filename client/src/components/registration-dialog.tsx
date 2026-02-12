import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { TicketSelection } from "@/components/ticket-selection";
import { Event } from "@shared/schema";
import { Calendar, MapPin } from "lucide-react";

interface RegistrationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    event: Event;
}

export function RegistrationDialog({ isOpen, onOpenChange, event }: RegistrationDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden gap-0 border-0 shadow-2xl">
                <div className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground p-6 sm:p-8">
                    <DialogHeader className="space-y-4 text-left">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                            </div>
                            <DialogTitle className="text-3xl sm:text-4xl font-bold leading-tight">
                                Register for {event.name}
                            </DialogTitle>
                            <DialogDescription className="text-primary-foreground/90 text-lg sm:text-xl max-w-2xl">
                                Secure your spot at the premier business summit in the region.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-6 sm:p-8 bg-background max-h-[70vh] overflow-y-auto">
                    <TicketSelection eventId={event.id} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
