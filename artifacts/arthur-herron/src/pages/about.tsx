import { Layout } from "@/components/layout/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import familyPhoto from "@assets/17042ae0-edd9-47c4-b9ad-e0090c74aea8_1783602359278.jpeg";
import foundersPortrait from "@assets/cab111c4-1f8d-4991-9813-b8c3616785f6_1783602359278.jpeg";
import tributePhoto from "@assets/memorial-tribute-cropped.jpg";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-multiply bg-[url('https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              A Family Legacy Since 2004.
            </h1>
            <p className="text-lg lg:text-xl mb-0 text-primary-foreground/90">
              From a single butchery in the heart of Bulawayo, the Williams family has spent two decades bringing Zimbabwe premium quality meat — built on hard work, trust, and the belief that the customer is king.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-6">Our Family Story</h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground">
                <p>
                  In August 2004, our family took over a small butchery on 10th Avenue, Jason Moyo Street, right in the heart of Bulawayo's central business district. What began as a single counter has grown, over 20 years, into a name Zimbabwean families trust.
                </p>
                <p>
                  Through every season — and even the toughest economic times — we've grown from strength to strength by staying close to our customers and never compromising on quality. Alongside our master butchery, we offer freshly made boerewors and sausages, cold meats, groceries, and fresh fruit and vegetables: a true one-stop shopping experience.
                </p>
                <p>
                  As a family-owned business, we treat every customer like part of ours. That's why "the customer is king" isn't just a saying to us — it's the promise that has kept generations coming back.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/shop">
                  <Button size="lg" className="font-bold">Experience the Quality</Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=2070&auto=format&fit=crop" 
                  alt="Premium raw meat" 
                  className="rounded-lg object-cover w-full aspect-[4/5] shadow-md"
                />
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop" 
                  alt="BBQ" 
                  className="rounded-lg object-cover w-full aspect-square shadow-md"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src="https://images.unsplash.com/photo-1602491453631-e2a5fc83a519?q=80&w=1974&auto=format&fit=crop" 
                  alt="Butcher block" 
                  className="rounded-lg object-cover w-full aspect-square shadow-md"
                />
                <img 
                  src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=2070&auto=format&fit=crop" 
                  alt="Cooked steak" 
                  className="rounded-lg object-cover w-full aspect-[4/5] shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Family */}
      <section className="py-20 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4">The Family Behind the Counter</h2>
            <p className="text-muted-foreground">
              Arthur Herron has always been more than a business — it's our family's life's work, passed down and carried forward with the same care we put into every cut.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <figure className="text-center">
              <img
                src={foundersPortrait}
                alt="A cherished portrait of the family's founders"
                className="rounded-lg object-cover w-full aspect-[4/3] shadow-md mb-4"
              />
              <figcaption className="text-sm text-muted-foreground">Where it all began — the generation that laid our foundation.</figcaption>
            </figure>
            <figure className="text-center">
              <img
                src={familyPhoto}
                alt="Members of the Arthur Herron family"
                className="rounded-lg object-cover w-full aspect-[4/3] shadow-md mb-4"
              />
              <figcaption className="text-sm text-muted-foreground">Family at the heart of everything we do, then and now.</figcaption>
            </figure>
          </div>

          {/* In loving memory */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <p className="font-serif text-sm uppercase tracking-widest text-secondary mb-6">In Loving Memory</p>
            <figure>
              <img
                src={tributePhoto}
                alt="A loving tribute to a cherished member of our family"
                className="rounded-lg object-contain w-full max-w-md mx-auto shadow-md mb-5 bg-background"
              />
              <figcaption className="text-muted-foreground italic">
                Forever remembered, forever part of our story. The love, values, and dedication he gave us live on in everything we do.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="font-serif text-3xl font-bold mb-16">The Arthur Herron Standards</h2>
          
          <div className="grid sm:grid-cols-3 gap-12">
            <div>
              <div className="text-secondary font-serif text-5xl font-bold mb-4 opacity-50">01</div>
              <h3 className="font-bold text-xl mb-3">Expertly Sourced</h3>
              <p className="text-muted-foreground text-sm">We build long-term relationships with the best local farmers, selecting only prime livestock for our counters.</p>
            </div>
            <div>
              <div className="text-secondary font-serif text-5xl font-bold mb-4 opacity-50">02</div>
              <h3 className="font-bold text-xl mb-3">Master Butchery</h3>
              <p className="text-muted-foreground text-sm">Our cuts are precise, trimmed to perfection, and customized to your specific cooking needs.</p>
            </div>
            <div>
              <div className="text-secondary font-serif text-5xl font-bold mb-4 opacity-50">03</div>
              <h3 className="font-bold text-xl mb-3">Unbroken Cold-Chain</h3>
              <p className="text-muted-foreground text-sm">From the moment of preparation to arrival at your door, our products are kept at optimal temperatures to preserve freshness.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
