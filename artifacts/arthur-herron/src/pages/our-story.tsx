import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateWaitlistSignup } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Heart, Users, Sparkles, CheckCircle2 } from "lucide-react";

export default function OurStory() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const waitlist = useCreateWaitlistSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    waitlist.mutate({
      data: {
        fullName,
        email: email || null,
        phone: phone || null,
        interest: "New products (e.g. mabele)",
      },
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-multiply bg-[url('https://images.unsplash.com/photo-1590650046871-92c887180603?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Our Story
            </h1>
            <p className="text-lg lg:text-xl mb-0 text-primary-foreground/90">
              A family business, built one cut at a time, for families like yours.
            </p>
          </div>
        </div>
      </section>

      {/* Family history / journey */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8 justify-center text-center">
            <Users className="h-7 w-7 text-secondary" />
            <h2 className="font-serif text-3xl lg:text-4xl font-bold">A Family Journey</h2>
          </div>
          <div className="prose prose-sm sm:prose-lg dark:prose-invert mx-auto text-muted-foreground text-center">
            <p>
              Arthur Herron began as a small family counter, built on a simple belief: the people who feed your family deserve to know exactly who is feeding them. What started with one butcher's block and a handful of loyal neighbours has grown into a business that Harare families trust for their everyday meals and their biggest celebrations.
            </p>
            <p>
              Every generation of our family has added something to the craft — better relationships with local farmers, sharper butchery skills, and a deeper commitment to the people we serve. We have never stopped being a family business, even as we've grown. That's why we treat every order, big or small, the way we'd want our own family treated.
            </p>
            <p>
              When you buy from us, you're not just getting meat — you're supporting a Zimbabwean family business that has stayed true to its roots.
            </p>
          </div>
          <div className="mt-10 text-center">
            <Link href="/about">
              <Button variant="outline" size="lg" className="font-bold">Read Our Promise</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dedication to service */}
      <section className="py-20 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <Heart className="h-7 w-7 text-secondary" />
            <h2 className="font-serif text-3xl font-bold">Dedicated to Every Family We Serve</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
            Whether you're buying a single braai pack or catering for a family gathering, our team treats your order with the same care and attention.
          </p>

          <div className="grid sm:grid-cols-3 gap-12">
            <div>
              <div className="text-secondary font-serif text-5xl font-bold mb-4 opacity-50">01</div>
              <h3 className="font-bold text-xl mb-3">Personal Attention</h3>
              <p className="text-muted-foreground text-sm">We remember our regulars, their preferred cuts, and what matters to their families.</p>
            </div>
            <div>
              <div className="text-secondary font-serif text-5xl font-bold mb-4 opacity-50">02</div>
              <h3 className="font-bold text-xl mb-3">Community First</h3>
              <p className="text-muted-foreground text-sm">We source locally and reinvest in the community that has supported us for years.</p>
            </div>
            <div>
              <div className="text-secondary font-serif text-5xl font-bold mb-4 opacity-50">03</div>
              <h3 className="font-bold text-xl mb-3">Reliable, Always</h3>
              <p className="text-muted-foreground text-sm">Retail, wholesale, or processing services — we show up with the same quality every time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Room to grow / waitlist */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <Sparkles className="h-7 w-7 text-secondary" />
              <h2 className="font-serif text-3xl font-bold">Growing With You</h2>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We're always looking for ways to serve your family better. Beyond premium meat, we're exploring new staples like mabele and other household favourites. Join our waitlist and be first to know when they arrive.
            </p>
          </div>

          <Card className="border-primary/20 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              {waitlist.isSuccess ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">You're on the list!</h3>
                  <p className="text-muted-foreground text-sm">We'll let you know as soon as new products are available.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="waitlist-name">Full Name *</Label>
                      <Input
                        id="waitlist-name"
                        placeholder="Your name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="waitlist-phone">Phone (Optional)</Label>
                      <Input
                        id="waitlist-phone"
                        placeholder="+263 77 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-email">Email (Optional)</Label>
                    <Input
                      id="waitlist-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full font-bold" disabled={waitlist.isPending}>
                    {waitlist.isPending ? "Joining..." : "Join the Waitlist"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
