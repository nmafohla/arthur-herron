import { useRoute, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, MapPin, Calendar, Clock, ShoppingBag, MessageCircle, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:orderNumber");
  const orderNumber = params?.orderNumber || "";

  const { data: order, isLoading } = useGetOrder(orderNumber, {
    query: { enabled: !!orderNumber }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 flex justify-center">
          <div className="animate-pulse flex flex-col items-center w-full max-w-2xl">
            <div className="h-20 w-20 bg-muted rounded-full mb-8"></div>
            <div className="h-10 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/2 mb-12"></div>
            <div className="w-full h-64 bg-muted rounded-xl"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find an order with that number.</p>
          <Link href="/shop">
            <Button>Return to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you, {order.fullName.split(' ')[0]}. Your order <span className="font-mono font-bold text-foreground">#{order.orderNumber}</span> has been received.
          </p>
        </div>

        <Card className="mb-8 border-primary/20 shadow-md overflow-hidden">
          <div className="bg-primary/5 p-6 md:p-8 border-b border-border">
            <h2 className="font-bold text-xl mb-6">Order Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/> Fulfillment</span>
                <span className="font-medium capitalize">{order.fulfillmentType}</span>
                {order.fulfillmentType === 'delivery' && order.areaZoneName && (
                  <span className="text-sm text-muted-foreground">{order.areaZoneName}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3"/> Date</span>
                <span className="font-medium">{new Date(order.preferredDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> Time Window</span>
                <span className="font-medium">{order.preferredTimeWindow}</span>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6 md:p-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" /> Items
            </h3>
            
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-medium">
                      <span className="text-muted-foreground mr-2">{item.quantity}x</span> 
                      {item.productName}
                    </p>
                    {item.cutOption && <p className="text-sm text-muted-foreground ml-6">Cut: {item.cutOption}</p>}
                  </div>
                  <span className="font-medium">${item.lineTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-lg text-foreground">
                <span>Total</span>
                <span className="text-2xl text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-primary/20 shadow-md overflow-hidden">
          <CardContent className="p-6 md:p-8 text-center">
            <h3 className="font-bold text-xl mb-3">Complete Your Payment</h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Secure your order by paying with Paynow, or confirm directly with us on WhatsApp. Your meat will only be prepared once payment is confirmed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                onClick={() =>
                  window.open(
                    `https://wa.me/263771234567?text=${encodeURIComponent(
                      `Hi Arthur Herron! I've placed order #${order.orderNumber} for $${order.total.toFixed(2)} and would like to arrange Paynow payment.`
                    )}`,
                    "_blank"
                  )
                }
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Pay with Paynow
              </Button>
              <a
                href={`https://wa.me/263771234567?text=${encodeURIComponent(
                  `Hi Arthur Herron! I've placed order #${order.orderNumber} for $${order.total.toFixed(2)} and would like to confirm it.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Confirm on WhatsApp
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted/50 rounded-xl p-6 md:p-8 text-center">
          <h3 className="font-bold text-xl mb-3">What happens next?</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Our master butchers are reviewing your order. We'll prepare it fresh on your preferred date. You will receive an email or SMS update when your order is ready.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop">
              <Button variant="outline" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
