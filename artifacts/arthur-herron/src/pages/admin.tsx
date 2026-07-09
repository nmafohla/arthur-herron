import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useGetAdminSession,
  useAdminLogout,
  useListAdminProducts,
  useListCategories,
  useCreateAdminProduct,
  useUpdateAdminProduct,
  useDeleteAdminProduct,
} from "@workspace/api-client-react";
import type { Product } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, LogOut, Loader2 } from "lucide-react";

const emptyForm = {
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  pricingType: "fixed" as "fixed" | "per_kg" | "pack",
  price: "",
  unit: "",
  oldPrice: "",
  promoTag: "",
  availability: "in_stock" as "in_stock" | "limited" | "order_ahead",
  stockQuantity: "",
  imageUrl: "",
  galleryUrls: "",
  cutOptions: "",
  featured: false,
  preparationNote: "",
};

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: session, isLoading: sessionLoading } = useGetAdminSession();

  useEffect(() => {
    if (!sessionLoading && !session?.authenticated) {
      setLocation("/admin/login");
    }
  }, [session, sessionLoading, setLocation]);

  const { data: products, isLoading: productsLoading } = useListAdminProducts({
    query: { enabled: !!session?.authenticated },
  });
  const { data: categories } = useListCategories();
  const logoutMutation = useAdminLogout();
  const createMutation = useCreateAdminProduct();
  const updateMutation = useUpdateAdminProduct();
  const deleteMutation = useDeleteAdminProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      slug: product.slug,
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      categoryId: String(categories?.find((c) => c.slug === product.categorySlug)?.id ?? ""),
      pricingType: product.pricingType,
      price: String(product.price),
      unit: product.unit,
      oldPrice: product.oldPrice !== null ? String(product.oldPrice) : "",
      promoTag: product.promoTag ?? "",
      availability: product.availability,
      stockQuantity: product.stockQuantity !== null && product.stockQuantity !== undefined ? String(product.stockQuantity) : "",
      imageUrl: product.imageUrl,
      galleryUrls: product.galleryUrls.join(", "),
      cutOptions: product.cutOptions.join(", "),
      featured: product.featured,
      preparationNote: product.preparationNote,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      shortDescription: form.shortDescription,
      description: form.description,
      categoryId: Number(form.categoryId),
      pricingType: form.pricingType,
      price: Number(form.price),
      unit: form.unit.trim(),
      oldPrice: form.oldPrice.trim() === "" ? null : Number(form.oldPrice),
      promoTag: form.promoTag.trim() === "" ? null : form.promoTag.trim(),
      availability: form.availability,
      stockQuantity: form.stockQuantity.trim() === "" ? null : Number(form.stockQuantity),
      imageUrl: form.imageUrl.trim(),
      galleryUrls: form.galleryUrls.split(",").map((s) => s.trim()).filter(Boolean),
      cutOptions: form.cutOptions.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      preparationNote: form.preparationNote,
    };

    if (!payload.categoryId || Number.isNaN(payload.categoryId)) {
      toast({ title: "Category required", description: "Please choose a category.", variant: "destructive" });
      return;
    }
    if (Number.isNaN(payload.price)) {
      toast({ title: "Invalid price", description: "Please enter a valid price.", variant: "destructive" });
      return;
    }

    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct.id, data: payload },
        {
          onSuccess: () => {
            toast({ title: "Product updated" });
            setDialogOpen(false);
          },
          onError: (err: any) => {
            toast({ title: "Update failed", description: err?.message ?? "Something went wrong.", variant: "destructive" });
          },
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            toast({ title: "Product created" });
            setDialogOpen(false);
          },
          onError: (err: any) => {
            toast({ title: "Create failed", description: err?.message ?? "Something went wrong.", variant: "destructive" });
          },
        }
      );
    }
  };

  const handleQuickStockUpdate = (product: Product, stockQuantity: number | null) => {
    updateMutation.mutate(
      { id: product.id, data: { stockQuantity } },
      {
        onSuccess: () => toast({ title: "Stock updated" }),
        onError: () => toast({ title: "Failed to update stock", variant: "destructive" }),
      }
    );
  };

  const handleAvailabilityChange = (product: Product, availability: "in_stock" | "limited" | "order_ahead") => {
    updateMutation.mutate(
      { id: product.id, data: { availability } },
      {
        onSuccess: () => toast({ title: "Availability updated" }),
        onError: () => toast({ title: "Failed to update availability", variant: "destructive" }),
      }
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toast({ title: "Product deleted" });
          setDeleteTarget(null);
        },
        onError: () => {
          toast({ title: "Failed to delete product", variant: "destructive" });
          setDeleteTarget(null);
        },
      }
    );
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => setLocation("/admin/login"),
    });
  };

  if (sessionLoading || !session?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold">Arthur Herron Admin</h1>
            <p className="text-sm text-muted-foreground">Manage stock and products</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Products ({products?.length ?? 0})</h2>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {productsLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading products...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Stock Qty</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover bg-muted" />
                        <div>
                          <div>{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>
                      ${product.price.toFixed(2)}
                      {product.pricingType === "per_kg" && "/kg"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={product.availability}
                        onValueChange={(v) => handleAvailabilityChange(product, v as any)}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_stock">In Stock</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                          <SelectItem value="order_ahead">Order Ahead</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-20 h-8"
                        defaultValue={product.stockQuantity ?? ""}
                        placeholder="—"
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          const parsed = val === "" ? null : Number(val);
                          if (parsed !== (product.stockQuantity ?? null)) {
                            handleQuickStockUpdate(product, parsed === null || Number.isNaN(parsed) ? null : parsed);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {product.featured ? <Badge>Featured</Badge> : <span className="text-muted-foreground text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(product)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pricing Type</Label>
                <Select value={form.pricingType} onValueChange={(v) => setForm({ ...form, pricingType: v as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="per_kg">Per Kg</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Old Price ($)</Label>
                <Input type="number" step="0.01" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="e.g. kg, pack" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Availability</Label>
                <Select value={form.availability} onValueChange={(v) => setForm({ ...form, availability: v as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="order_ahead">Order Ahead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} placeholder="Leave blank if untracked" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Promo Tag</Label>
              <Input value={form.promoTag} onChange={(e) => setForm({ ...form, promoTag: e.target.value })} placeholder="e.g. New, Sale" />
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label>Gallery URLs (comma-separated)</Label>
              <Input value={form.galleryUrls} onChange={(e) => setForm({ ...form, galleryUrls: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Cut Options (comma-separated)</Label>
              <Input value={form.cutOptions} onChange={(e) => setForm({ ...form, cutOptions: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Preparation Note</Label>
              <Textarea value={form.preparationNote} onChange={(e) => setForm({ ...form, preparationNote: e.target.value })} />
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
              <Label>Featured (shown as best seller)</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the product from your shop. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
