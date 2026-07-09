import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsappButton() {
  const message = encodeURIComponent("Hi Arthur Herron! I need some help with an order.");
  
  return (
    <a
      href={`https://wa.me/263771234567?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 md:hidden"
    >
      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-black/20"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    </a>
  );
}
