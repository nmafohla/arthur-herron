import { Header } from "./header";
import { Footer } from "./footer";
import { WhatsappButton } from "./whatsapp-button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <WhatsappButton />
    </div>
  );
}
