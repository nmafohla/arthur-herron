import { useRoute } from "wouter";
import { useListProducts, useGetProduct } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingCart, MessageCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/shop/:slugOrId");
  const slugOrId = params?.slugOrId;
  const isNumericId = slugOrId && !isNaN(Number(slugOrId));
  
  // Try getting by ID directly if it's numeric, otherwise fetch all and find by slug
  const { data: productById, isLoading: loadingId } = useGetProduct(Number(slugOrId), {
    query: { enabled: !!isNumericId }
  });
  
  const { data: allProducts, isLoading: loadingAll } = useListProducts(undefined, {
    query: { enabled: !isNumericId }
  });

  const product = isNumericId ? productById : allProducts?.find(p => p.slug === slugOrId || p.id.toString() === slugOrId);
  const isLoading = isNumericId ? loadingId : loadingAll;

  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [cutOption, setCutOption] = useState<string>("");
  const [note, setNote] = useState("");
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
      if (product.cutOptions && product.cutOptions.length > 0) {
        setCutOption(product.cutOptions[0]);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-pulse flex flex-col md:flex-row gap-12 w-full max-w-6xl">
            <div className="w-full md:w-1/2 aspect-square bg-muted rounded-xl"></div>
            <div className="w-full md:w-1/2 space-y-6">
              <div className="h-10 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="h-24 bg-muted rounded w-full"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/shop">
            <Button>Return to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isOutOfStock = product.availability !== "in_stock" && product.availability !== "order_ahead";
  const waMessage = encodeURIComponent(`Hi Arthur Herron! I'm interested in the ${product.name}. Is it available?`);

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      cutOption: cutOption || null,
      note: note || null,
    });
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added.`,
    });
  };

  const allImages = [product.imageUrl, ...(product.galleryUrls || [])].filter(Boolean);

  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/shop" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Images */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden mb-4 border border-border">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <img src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2 flex items-center gap-3">
              <Link href={`/shop?categorySlug=${product.categorySlug}`} className="text-sm font-medium text-primary hover:underline">
                {product.categoryName}
              </Link>
              {product.promoTag && (
                <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary font-bold uppercase tracking-wider text-[10px]">
                  {product.promoTag}
                </Badge>
              )}
            </div>
            
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-foreground">{product.name}</h1>
            
            <div className="mb-6 flex items-end gap-3">
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through decoration-destructive/50">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
              <span className="text-3xl font-bold text-foreground">
                ${product.price.toFixed(2)}
                <span className="text-lg font-normal text-muted-foreground ml-1">/ {product.unit}</span>
              </span>
            </div>
            
            <div className="prose prose-sm sm:prose-base dark:prose-invert mb-8 max-w-none text-muted-foreground">
              {product.description || product.shortDescription}
            </div>

            <div className="space-y-6 mb-8 bg-card border border-border p-6 rounded-xl">
              {/* Options */}
              {product.cutOptions && product.cutOptions.length > 0 && (
                <div className="space-y-3">
                  <Label htmlFor="cut-option" className="text-base">Preparation / Cut Option</Label>
                  <Select value={cutOption} onValueChange={setCutOption}>
                    <SelectTrigger id="cut-option">
                      <SelectValue placeholder="Select a cut option" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.cutOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <Label className="text-base">Quantity</Label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="h-12 w-12 rounded-r-none border-r-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="h-12 w-16 border border-input flex items-center justify-center font-bold text-lg bg-background">
                    {quantity}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="h-12 w-12 rounded-l-none border-l-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Note */}
              <div className="space-y-3">
                <Label htmlFor="note" className="text-base">Special Instructions (Optional)</Label>
                <Textarea 
                  id="note" 
                  placeholder={product.preparationNote || "E.g., Please trim excess fat..."}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="resize-none"
                  rows={2}
                  disabled={isOutOfStock}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-auto">
              <Button 
                size="lg" 
                className="h-14 w-full font-bold text-lg" 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                variant={isOutOfStock ? "secondary" : "default"}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? "Currently Out of Stock" : `Add to Cart — ${(product.price * quantity).toFixed(2)}`}
              </Button>
              
              <a href={`https://wa.me/263771234567?text=${waMessage}`} target="_blank" rel="noreferrer" className="w-full">
                <Button size="lg" variant="outline" className="h-14 w-full font-medium border-primary text-primary hover:bg-primary/5">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Order on WhatsApp instead
                </Button>
              </a>
            </div>
            
            {product.availability === "order_ahead" && (
              <p className="text-sm text-amber-600 dark:text-amber-500 mt-4 flex items-center bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50">
                <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
                This item requires advanced notice. Please allow extra time for preparation.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
