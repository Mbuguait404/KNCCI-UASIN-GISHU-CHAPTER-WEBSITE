import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "254740853372";
const DEFAULT_MESSAGE = "Hello, I'd like to get more information about the Eldoret International Business Summit.";

function whatsAppUrl(message?: string) {
  const text = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${text}` : ""}`;
}

export function WhatsAppFloat() {
  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            size="icon"
            className="h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20BD5A] hover:scale-110 transition-all duration-200"
            aria-label="Chat on WhatsApp"
            data-testid="whatsapp-float"
          >
            <a
              href={whatsAppUrl(DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-7 w-7" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-medium">
          Chat with us on WhatsApp
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
