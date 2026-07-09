import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useGetAdminSession } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: session } = useGetAdminSession();
  const loginMutation = useAdminLogin();

  useEffect(() => {
    if (session?.authenticated) {
      setLocation("/admin");
    }
  }, [session, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { data: { password } },
      {
        onSuccess: () => {
          setLocation("/admin");
        },
        onError: () => {
          toast({
            title: "Login failed",
            description: "Incorrect password. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter the admin password to manage products and stock.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
