import { Layout } from "@/components/layout/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-multiply bg-[url('https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              A Legacy of Quality.
            </h1>
            <p className="text-lg lg:text-xl mb-0 text-primary-foreground/90">
              For decades, Arthur Herron has been synonymous with premium quality meat in Zimbabwe. Our commitment to excellence starts at the source and ends on your table.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-6">Our Promise</h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground">
                <p>
                  At Arthur Herron, we don't just sell meat. We provide the centerpiece for your Sunday family lunch, the fuel for your weekend braai, and the reliable quality you need for everyday meals.
                </p>
                <p>
                  We source exclusively from trusted local farmers who meet our strict standards for animal welfare and meat quality. Every cut that leaves our shop has been inspected, expertly prepared, and vacuum-sealed for maximum freshness.
                </p>
                <p>
                  Our master butchers bring decades of experience to the block, ensuring you get exactly what you need, prepared exactly how you like it.
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

      {/* Values */}
      <section className="py-20 bg-muted/50 border-y border-border">
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
