import { Link } from "wouter";
import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product,
      quantity: 1,
      cutOption: product.cutOptions?.[0] || null,
      note: null,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const isOutOfStock = product.availability !== "in_stock" && product.availability !== "order_ahead";

  return (
    <Link href={`/shop/${product.id}`}>
      <Card className="h-full overflow-hidden group hover:shadow-md transition-shadow hover:border-primary/20 flex flex-col cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.promoTag && (
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary border-none font-bold uppercase tracking-wider text-[10px]">
                {product.promoTag}
              </Badge>
            )}
            {product.availability === "order_ahead" && (
              <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm">
                Order Ahead
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="text-xs text-muted-foreground mb-1">{product.categoryName}</div>
          <h3 className="font-serif font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {product.shortDescription}
          </p>
          
          <div className="mt-auto flex items-end justify-between">
            <div>
              {product.oldPrice && (
                <div className="text-xs text-muted-foreground line-through decoration-destructive/50">
                  ${product.oldPrice.toFixed(2)}
                </div>
              )}
              <div className="font-bold text-lg text-foreground">
                ${product.price.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  / {product.unit}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            variant={isOutOfStock ? "secondary" : "default"}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
