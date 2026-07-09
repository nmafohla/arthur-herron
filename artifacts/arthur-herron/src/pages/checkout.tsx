import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/lib/cart";
import { useListDeliveryZones, useCreateOrder } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, MessageCircle, CreditCard } from "lucide-react";
import { Link } from "wouter";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  fulfillmentType: z.enum(["delivery", "pickup"]),
  address: z.string().optional(),
  areaZoneId: z.coerce.number().optional(),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTimeWindow: z.string().min(1, "Preferred time is required"),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.fulfillmentType === "delivery") {
    if (!data.address || data.address.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Delivery address is required",
        path: ["address"],
      });
    }
    if (!data.areaZoneId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Delivery zone is required",
        path: ["areaZoneId"],
      });
    }
  }
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, subtotal, clearCart, totalItems } = useCart();
  const { data: zones, isLoading: loadingZones } = useListDeliveryZones();
  
  const createOrder = useCreateOrder();
  
  const [isWhatsApping, setIsWhatsApping] = useState(false);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fulfillmentType: "delivery",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      preferredTimeWindow: "Morning (9am - 1pm)",
      notes: "",
    },
  });

  const watchFulfillment = form.watch("fulfillmentType");
  const watchZoneId = form.watch("areaZoneId");
  
  const selectedZone = zones?.find(z => z.id === watchZoneId);
  const deliveryFee = watchFulfillment === "delivery" ? (selectedZone?.fee || 0) : 0;
  const orderTotal = subtotal + deliveryFee;

  // Redirect if empty
  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const onSubmit = (data: CheckoutValues) => {
    const orderInput = {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      fulfillmentType: data.fulfillmentType,
      address: data.fulfillmentType === "delivery" ? data.address || null : null,
      areaZoneId: data.fulfillmentType === "delivery" ? data.areaZoneId || null : null,
      preferredDate: data.preferredDate,
      preferredTimeWindow: data.preferredTimeWindow,
      notes: data.notes || null,
      items: items.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.product.price,
        cutOption: i.cutOption,
        note: i.note,
      }))
    };

    createOrder.mutate({ data: orderInput }, {
      onSuccess: (order) => {
        clearCart();
        setLocation(`/order-confirmation/${order.orderNumber}`);
      }
    });
  };

  const handleWhatsAppOrder = () => {
    setIsWhatsApping(true);
    
    // Format cart for WhatsApp
    const cartText = items.map(i => 
      `- ${i.quantity}x ${i.product.name} ${i.cutOption ? `(${i.cutOption})` : ''} @ $${i.product.price.toFixed(2)}`
    ).join('%0A');
    
    const message = `*New Order Request*%0A%0A*Items:*%0A${cartText}%0A%0A*Subtotal:* $${subtotal.toFixed(2)}%0A%0AHi Arthur Herron, I'd like to place this order. Please let me know how to proceed with payment and details.`;
    
    window.open(`https://wa.me/263771234567?text=${message}`, '_blank');
    setIsWhatsApping(false);
  };

  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border py-6">
        <div className="container mx-auto px-4">
          <Link href="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="font-serif text-3xl font-bold mt-4">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-12">
            
            {/* Form Fields */}
            <div className="w-full lg:w-2/3 space-y-8">
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+263 77 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address (Optional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Fulfillment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fulfillmentType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 bg-muted/50 p-4 rounded-lg border border-border cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                              <FormControl>
                                <RadioGroupItem value="delivery" />
                              </FormControl>
                              <div className="flex-1">
                                <FormLabel className="font-bold text-base cursor-pointer">Delivery</FormLabel>
                                <p className="text-sm text-muted-foreground mt-1">We deliver to your door via cold-chain transport.</p>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 bg-muted/50 p-4 rounded-lg border border-border cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                              <FormControl>
                                <RadioGroupItem value="pickup" />
                              </FormControl>
                              <div className="flex-1">
                                <FormLabel className="font-bold text-base cursor-pointer">Store Pickup</FormLabel>
                                <p className="text-sm text-muted-foreground mt-1">Collect your order from our Harare store.</p>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchFulfillment === "delivery" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 pt-4 border-t border-border">
                      <FormField
                        control={form.control}
                        name="areaZoneId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Zone *</FormLabel>
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your area" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {loadingZones ? (
                                  <SelectItem value="loading" disabled>Loading zones...</SelectItem>
                                ) : zones?.map((zone) => (
                                  <SelectItem key={zone.id} value={zone.id.toString()}>
                                    {zone.name} (${zone.fee.toFixed(2)})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {selectedZone && (
                              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {selectedZone.etaText}. Cutoff for same day: {selectedZone.sameDayCutoff}.
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="123 Example Street, Suburb" className="resize-none" rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Date *</FormLabel>
                          <FormControl>
                            <Input type="date" min={new Date().toISOString().split('T')[0]} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredTimeWindow"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time window" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Morning (9am - 1pm)">Morning (9am - 1pm)</SelectItem>
                              <SelectItem value="Afternoon (1pm - 5pm)">Afternoon (1pm - 5pm)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Gate code, specific delivery instructions, or general order notes..." 
                            className="resize-none" 
                            rows={3} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-1/3">
              <Card className="sticky top-24 shadow-md border-primary/20">
                <CardHeader className="bg-muted/50 border-b border-border pb-4">
                  <CardTitle className="font-serif text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 max-h-[300px] overflow-y-auto space-y-4">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.cutOption}`} className="flex justify-between gap-4 text-sm">
                        <div className="flex gap-3">
                          <span className="font-medium text-muted-foreground">{item.quantity}x</span>
                          <div>
                            <p className="font-medium text-foreground">{item.product.name}</p>
                            {item.cutOption && <p className="text-xs text-muted-foreground">Cut: {item.cutOption}</p>}
                          </div>
                        </div>
                        <span className="font-medium shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-muted/20 border-t border-border space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-medium">{watchFulfillment === "pickup" ? "Free" : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-3xl text-primary">${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-14 font-bold text-lg"
                      disabled={createOrder.isPending}
                    >
                      {createOrder.isPending ? "Processing..." : "Proceed to Secure Payment"}
                      {!createOrder.isPending && <CreditCard className="ml-2 h-5 w-5" />}
                    </Button>
                    
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground font-medium">Or</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="lg" 
                      className="w-full h-14 font-medium border-primary text-primary hover:bg-primary/5"
                      onClick={handleWhatsAppOrder}
                      disabled={isWhatsApping}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Send Order on WhatsApp
                    </Button>

                    <p className="text-xs text-muted-foreground text-center pt-2">
                      We accept secure online payment (Pesepay), cash or EcoCash on delivery/pickup, and diaspora orders for family here in Zimbabwe.{" "}
                      <Link href="/delivery" className="text-primary underline underline-offset-2">Learn more</Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

          </form>
        </Form>
      </div>
    </Layout>
  );
}
