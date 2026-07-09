import { Link } from "wouter";
import { Category } from "@workspace/api-client-react/src/generated/api.schemas";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/shop?categorySlug=${category.slug}`}>
      <Card className="overflow-hidden group hover:shadow-md transition-shadow cursor-pointer h-full border-transparent bg-card">
        <div className="relative aspect-[4/3] overflow-hidden">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
            <h3 className="font-serif font-bold text-2xl text-white mb-1">
              {category.name}
            </h3>
            <div className="flex items-center text-white/80 text-sm">
              <span>{category.productCount} Products</span>
              <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
