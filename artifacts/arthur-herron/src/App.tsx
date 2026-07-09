import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/cart";

// Pages
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import OrderConfirmation from "@/pages/order-confirmation";
import Delivery from "@/pages/delivery";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin-login";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/shop/:slugOrId" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation/:orderNumber" component={OrderConfirmation} />
      <Route path="/delivery" component={Delivery} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
