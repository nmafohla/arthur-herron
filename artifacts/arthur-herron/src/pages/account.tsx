import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser, useClerk } from "@clerk/react";
import { useGetMe, useGetMyOrders } from "@workspace/api-client-react";
import { Award, Package, LogOut, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const statusLabels: Record<string, { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800 border-green-200" },
  pending_payment: { label: "Awaiting Payment", className: "bg-amber-100 text-amber-800 border-amber-200" },
  payment_failed: { label: "Payment Failed", className: "bg-red-100 text-red-800 border-red-200" },
};

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function Account() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { data: profile, isLoading: profileLoading } = useGetMe();
  const { data: orders, isLoading: ordersLoading } = useGetMyOrders();

  const displayName =
    profile?.fullName || user?.fullName || user?.primaryEmailAddress?.emailAddress || "there";
  const points = profile?.loyaltyPoints ?? 0;

  return (
    <Layout>
      <section className="container mx-auto px-4 md:px-6 py-10 md:py-16 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground">My Account</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {displayName}.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
            className="self-start sm:self-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>

        {/* Loyalty points */}
        <Card className="mb-8 overflow-hidden border-primary/20">
          <CardContent className="p-6 md:p-8 bg-primary text-primary-foreground flex items-center gap-5">
            <div className="h-14 w-14 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-primary-foreground/80">
                Loyalty Points
              </p>
              <p className="text-3xl md:text-4xl font-bold">
                {profileLoading ? "…" : points.toLocaleString()}
              </p>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Earn 10 points for every $1 spent on confirmed orders.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order history */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <p className="text-muted-foreground py-6 text-center">Loading your orders…</p>
            ) : !orders || orders.length === 0 ? (
              <div className="py-10 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">
                  You haven't placed any orders yet.
                </p>
                <Link href="/shop">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {orders.map((order) => {
                  const status = statusLabels[order.status] ?? {
                    label: order.status,
                    className: "bg-muted text-muted-foreground border-border",
                  };
                  return (
                    <div key={order.id} className="py-5 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div>
                          <Link
                            href={`/order-confirmation/${order.orderNumber}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {order.orderNumber}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)} · {order.fulfillmentType === "delivery" ? "Delivery" : "Pickup"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={status.className}>
                            {status.label}
                          </Badge>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.map((item, idx) => (
                          <span key={item.id}>
                            {item.quantity} × {item.productName}
                            {idx < order.items.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                      {order.status === "confirmed" && order.userId && (
                        <p className="text-xs text-primary mt-2 flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          +{Math.floor(order.total * 10).toLocaleString()} points earned
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <Separator className="my-0" />
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
