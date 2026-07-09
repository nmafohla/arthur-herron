import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export default function Contact() {
  const waMessage = encodeURIComponent("Hi Arthur Herron! I have an inquiry.");

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-6 text-white">Contact Us</h1>
          <p className="text-lg lg:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Need a custom order? Question about delivery? Get in touch with our team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          
          <div>
            <h2 className="font-serif text-3xl font-bold mb-8">Get In Touch</h2>
            <p className="text-muted-foreground mb-10">
              For the fastest response, reach out to us on WhatsApp. Our team is ready to assist you with special requests, bulk orders, or any questions about our products.
            </p>
            
            <a href={`https://wa.me/263771234567?text=${waMessage}`} target="_blank" rel="noreferrer" className="block mb-10">
              <Card className="bg-[#25D366]/10 border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Chat on WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">+263 77 123 4567</p>
                  </div>
                </CardContent>
              </Card>
            </a>

            <div className="space-y-6">
              <div className="flex gap-4">
                <Phone className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold">Call Us</h4>
                  <a href="tel:+263771234567" className="text-muted-foreground hover:text-primary transition-colors">+263 77 123 4567</a>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold">Email Us</h4>
                  <a href="mailto:hello@arthurherron.com" className="text-muted-foreground hover:text-primary transition-colors">hello@arthurherron.com</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-bold mb-8">Visit The Store</h2>
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="aspect-video sm:aspect-[2/1] md:aspect-square lg:aspect-video w-full bg-muted overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1542845634-1188a101b059?q=80&w=2070&auto=format&fit=crop" 
                    alt="Storefront" 
                    className="w-full h-full object-cover grayscale-[20%]"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">Location</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    123 Main Street<br />
                    Harare, Zimbabwe
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">Hours</h4>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li className="flex justify-between gap-4"><span>Mon-Fri</span> <span>8am - 5:30pm</span></li>
                    <li className="flex justify-between gap-4"><span>Sat</span> <span>8am - 1pm</span></li>
                    <li className="flex justify-between gap-4"><span>Sun</span> <span>Closed</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
