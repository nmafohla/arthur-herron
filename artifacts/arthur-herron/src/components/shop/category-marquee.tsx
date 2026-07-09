import { motion } from "framer-motion";
import type { Category } from "@workspace/api-client-react";
import { ArrowRight } from "lucide-react";

interface CategoryMarqueeProps {
  categories: Category[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
}

export function CategoryMarquee({ categories, selectedSlug, onSelect }: CategoryMarqueeProps) {
  if (!categories.length) return null;

  // Duplicate the list so the scroll loops seamlessly (translateX -50%).
  const items = [...categories, ...categories];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-background border-b border-border py-8 md:py-10 overflow-hidden"
    >
      <div className="container mx-auto px-4 mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-secondary text-xs font-bold uppercase tracking-[0.2em] mb-1">
            Explore
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Shop by Category
          </h2>
        </div>
        <span className="hidden sm:inline text-sm text-muted-foreground">
          Tap a category to browse
        </span>
      </div>

      <div className="marquee-container relative">
        {/* Soft edge fades in the cream background colour */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        <div
          className="animate-marquee flex w-max"
          style={{ "--marquee-duration": "42s" } as React.CSSProperties}
        >
          {items.map((cat, i) => {
            const active = cat.slug === selectedSlug;
            const isDuplicate = i >= categories.length;
            return (
              <button
                key={`${cat.id}-${i}`}
                type="button"
                onClick={() => onSelect(cat.slug)}
                aria-label={`Browse ${cat.name}`}
                aria-hidden={isDuplicate}
                tabIndex={isDuplicate ? -1 : 0}
                className={`group relative shrink-0 mr-4 md:mr-5 w-44 sm:w-52 aspect-[4/5] rounded-2xl overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  active ? "ring-2 ring-secondary" : ""
                }`}
              >
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-serif font-bold text-lg text-white leading-tight">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                    <span>{cat.productCount} items</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                </div>
                {active && (
                  <span className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
