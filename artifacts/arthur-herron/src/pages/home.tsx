import { useGetStorefrontSummary } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/layout";
import { ProductCard } from "@/components/shop/product-card";
import { CategoryCard } from "@/components/shop/category-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, Clock, Award } from "lucide-react";

export default function Home() {
  const { data: summary, isLoading } = useGetStorefrontSummary();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-multiply bg-[url('https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white">
              Premium Cuts. <br />
              <span className="text-secondary">Exceptional Quality.</span>
            </h1>
            <p className="text-lg lg:text-xl mb-8 text-primary-foreground/90 max-w-xl">
              Arthur Herron brings the finest fresh meat, curated braai packs, and family boxes direct to your door in Harare. Experience the difference of a true premium butcher.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-lg h-14 px-8">
                  Shop the Selection
                </Button>
              </Link>
              <Link href="/delivery">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-medium text-lg h-14 px-8">
                  View Delivery Zones
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">100% Quality Guarantee</h3>
                <p className="text-xs text-muted-foreground mt-1">Premium grade every time</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Cold-Chain Delivery</h3>
                <p className="text-xs text-muted-foreground mt-1">Fresh to your door</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Same Day Available</h3>
                <p className="text-xs text-muted-foreground mt-1">Order before 12pm</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Expert Butchers</h3>
                <p className="text-xs text-muted-foreground mt-1">Decades of experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Shop by Category</h2>
              <p className="text-muted-foreground">Explore our selection of premium meats.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center text-primary font-medium hover:underline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {summary?.categoryCounts?.slice(0, 4).map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop">
              <Button variant="outline" className="w-full">View All Categories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Customer Favorites</h2>
            <p className="text-muted-foreground">Our most popular cuts, braai packs, and combos.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {summary?.bestSellers?.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16 text-white">How Arthur Herron Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-2xl mb-6 font-serif">1</div>
              <h3 className="font-bold text-xl mb-3 text-white">Order Online</h3>
              <p className="text-primary-foreground/80">Browse our selection of premium meats and place your order securely through our website or via WhatsApp.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-2xl mb-6 font-serif">2</div>
              <h3 className="font-bold text-xl mb-3 text-white">We Prepare</h3>
              <p className="text-primary-foreground/80">Our expert butchers cut, prepare, and pack your order to your exact specifications, ensuring maximum freshness.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-2xl mb-6 font-serif">3</div>
              <h3 className="font-bold text-xl mb-3 text-white">Delivery or Pickup</h3>
              <p className="text-primary-foreground/80">Collect from our store or choose our cold-chain delivery service straight to your door in Harare.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
