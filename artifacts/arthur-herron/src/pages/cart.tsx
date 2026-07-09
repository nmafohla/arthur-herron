import { Link } from "wouter";
import { useCart } from "@/lib/cart";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center text-center max-w-md">
          <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-8">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any premium meats to your cart yet. Browse our shop to find the best cuts in Harare.
          </p>
          <Link href="/shop">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 font-bold">
              Start Shopping
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Your Cart</h1>
          <p className="text-primary-foreground/80 mt-2">{totalItems} items</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 space-y-6">
            {items.map((item) => (
              <Card key={`${item.product.id}-${item.cutOption}`} className="overflow-hidden">
                <CardContent className="p-0 sm:p-4">
                  <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-0">
                    {/* Item Image */}
                    <Link href={`/shop/${item.product.id}`} className="shrink-0 block w-full sm:w-32 h-48 sm:h-32 bg-muted rounded-md overflow-hidden">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                      )}
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link href={`/shop/${item.product.id}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                            {item.product.name}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1">
                            ${item.product.price.toFixed(2)} / {item.product.unit}
                          </div>
                          {item.cutOption && (
                            <div className="text-sm bg-muted inline-block px-2 py-1 rounded mt-2">
                              Cut: <span className="font-medium text-foreground">{item.cutOption}</span>
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-lg text-right shrink-0">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-4 sm:mt-0 pt-4 border-t sm:border-t-0 border-border">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.product.id, item.cutOption, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input 
                            value={item.quantity}
                            readOnly
                            className="h-8 w-12 rounded-none border-x-0 text-center text-sm font-medium px-0 focus-visible:ring-0"
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.product.id, item.cutOption, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.product.id, item.cutOption)}
                        >
                          <Trash2 className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  {item.note && (
                    <div className="bg-muted/50 p-3 sm:mx-4 mb-4 mt-0 sm:mt-2 rounded-md text-sm">
                      <span className="font-medium">Note:</span> {item.note}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <Card className="sticky top-24 bg-card border-primary/20 shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-muted-foreground italic">Calculated at checkout</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <Link href="/checkout">
                    <Button size="lg" className="w-full h-14 font-bold text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/shop" className="block text-center text-sm font-medium text-primary hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
