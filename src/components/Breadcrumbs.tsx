import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 p-1 rounded hover:text-primary hover:bg-primary/5 transition-all"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
            {item.href && index < items.length - 1 ? (
              <Link
                to={item.href}
                className="px-1.5 py-0.5 rounded hover:text-primary hover:bg-primary/5 transition-all"
              >
                {item.label}
              </Link>
            ) : (
              <span className="px-1.5 py-0.5 text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
