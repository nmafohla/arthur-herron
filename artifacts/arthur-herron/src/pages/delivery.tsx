import { useListDeliveryZones } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Info, CheckCircle2, Globe2, Wallet, Banknote, MessageCircle } from "lucide-react";

export default function Delivery() {
  const { data: zones, isLoading } = useListDeliveryZones();

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-6 text-white">Delivery & Pickup</h1>
          <p className="text-lg lg:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            We use cold-chain vehicles to ensure your premium meats arrive at your door in perfect condition.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Delivery Policy */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold">Same-Day Delivery</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground">
              <p>
                We offer same-day delivery for most areas in Harare when you place your order before <strong>12:00 PM</strong>. Orders placed after the cutoff time will be scheduled for the next business day or your preferred future date.
              </p>
              <ul className="space-y-2 mt-4 list-none pl-0">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Deliveries run Monday to Saturday</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>No deliveries on Sundays or Public Holidays</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Cold-chain guaranteed from our shop to your fridge</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Store Pickup */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold">Free Store Pickup</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground mb-6">
              <p>
                Prefer to collect your order? Select "Store Pickup" at checkout. Your order will be prepared, vacuum-packed, and held in our cold room until you arrive.
              </p>
            </div>
            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-2">Arthur Herron Butchers</h3>
                <p className="text-sm text-muted-foreground mb-4">123 Main Street<br />Harare, Zimbabwe</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mon - Fri</span>
                    <span className="font-medium text-foreground">8:00 AM - 5:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium text-foreground">8:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium text-destructive">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Zones */}
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">Delivery Zones & Fees</h2>
          
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {zones?.map((zone) => (
                <Card key={zone.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg">{zone.name}</h3>
                      <div className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                        ${zone.fee.toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>{zone.etaText}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 shrink-0" />
                        <span>Same day cutoff: {zone.sameDayCutoff}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Diaspora ordering */}
      <div className="bg-muted/50 border-y border-border py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Globe2 className="h-6 w-6" />
                </div>
                <h2 className="font-serif text-2xl font-bold">Ordering From Abroad</h2>
              </div>
              <div className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground">
                <p>
                  Living in the diaspora? You can order online from anywhere in the world and have quality meat delivered straight to your family here in Zimbabwe — no need to send cash and hope it's used well.
                </p>
                <ul className="space-y-2 mt-4 list-none pl-0">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Choose your family's delivery address in Zimbabwe at checkout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Pay securely online from wherever you are</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>We handle the rest — preparation, cold-chain delivery, and confirmation</span>
                  </li>
                </ul>
              </div>
              <a href="https://wa.me/263771234567?text=Hi%20Arthur%20Herron%2C%20I%27m%20in%20the%20diaspora%20and%20would%20like%20to%20order%20for%20my%20family%20in%20Zimbabwe." target="_blank" rel="noreferrer" className="inline-block mt-6">
                <Button variant="outline" className="font-medium border-primary text-primary hover:bg-primary/5">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Ask Us About Diaspora Orders
                </Button>
              </a>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <Wallet className="h-6 w-6" />
                </div>
                <h2 className="font-serif text-2xl font-bold">Payment Methods</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="bg-background">
                  <CardContent className="p-5">
                    <Wallet className="h-5 w-5 text-primary mb-2" />
                    <h4 className="font-bold text-sm mb-1">Online Payment</h4>
                    <p className="text-xs text-muted-foreground">Secure card and mobile money payment via Pesepay at checkout — ideal for local and diaspora orders.</p>
                  </CardContent>
                </Card>
                <Card className="bg-background">
                  <CardContent className="p-5">
                    <Banknote className="h-5 w-5 text-primary mb-2" />
                    <h4 className="font-bold text-sm mb-1">Cash or EcoCash</h4>
                    <p className="text-xs text-muted-foreground">Pay in cash or via EcoCash on delivery, or at our store for pickup orders.</p>
                  </CardContent>
                </Card>
                <Card className="bg-background sm:col-span-2">
                  <CardContent className="p-5">
                    <MessageCircle className="h-5 w-5 text-primary mb-2" />
                    <h4 className="font-bold text-sm mb-1">WhatsApp Orders</h4>
                    <p className="text-xs text-muted-foreground">Prefer to order and arrange payment over WhatsApp? We're happy to help — just message us.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
