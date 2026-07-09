import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/layout";
import { ProductCard } from "@/components/shop/product-card";
import { CategoryMarquee } from "@/components/shop/category-marquee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategorySlug = searchParams.get("categorySlug") || undefined;
  const initialSearch = searchParams.get("search") || undefined;

  const [search, setSearch] = useState(initialSearch || "");
  const [appliedSearch, setAppliedSearch] = useState(initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategorySlug);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: products, isLoading: loadingProducts } = useListProducts({
    categorySlug: selectedCategory,
    search: appliedSearch || undefined,
  });

  const { data: categories, isLoading: loadingCategories } = useListCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(search);
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (inStockOnly) {
      return products.filter(p => p.availability === "in_stock" || p.availability === "limited");
    }
    return products;
  }, [products, inStockOnly]);

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-lg mb-4">Categories</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cat-all" 
              checked={selectedCategory === undefined} 
              onCheckedChange={() => setSelectedCategory(undefined)}
            />
            <Label htmlFor="cat-all" className="cursor-pointer font-medium">All Products</Label>
          </div>
          {categories?.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${cat.slug}`} 
                checked={selectedCategory === cat.slug} 
                onCheckedChange={() => setSelectedCategory(cat.slug)}
              />
              <Label htmlFor={`cat-${cat.slug}`} className="cursor-pointer">{cat.name} <span className="text-muted-foreground text-xs ml-1">({cat.productCount})</span></Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="in-stock" 
            checked={inStockOnly} 
            onCheckedChange={(checked) => setInStockOnly(!!checked)}
          />
          <Label htmlFor="in-stock" className="cursor-pointer">In Stock Only</Label>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Shop Premium Meats</h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            Browse our full selection of freshly prepared cuts, braai packs, and specialty items.
          </p>
        </div>
      </div>

      {categories && categories.length > 0 && (
        <CategoryMarquee
          categories={categories}
          selectedSlug={selectedCategory}
          onSelect={(slug) =>
            setSelectedCategory((prev) => (prev === slug ? undefined : slug))
          }
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterContent />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..." 
                  className="pl-10 w-full"
                />
                {search && (
                  <button 
                    type="button" 
                    onClick={() => { setSearch(""); setAppliedSearch(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>

              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto lg:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filter Products</SheetTitle>
                  </SheetHeader>
                  <FilterContent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory || appliedSearch || inStockOnly) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {appliedSearch && (
                  <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    "{appliedSearch}"
                    <button onClick={() => { setSearch(""); setAppliedSearch(""); }}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
                {selectedCategory && categories && (
                  <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                    <button onClick={() => setSelectedCategory(undefined)}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
                {inStockOnly && (
                  <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {
                  setSearch(""); setAppliedSearch(""); setSelectedCategory(undefined); setInStockOnly(false);
                }}>
                  Clear All
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-lg border border-border border-dashed">
                <h3 className="font-bold text-xl mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
                <Button onClick={() => {
                  setSearch(""); setAppliedSearch(""); setSelectedCategory(undefined); setInStockOnly(false);
                }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
