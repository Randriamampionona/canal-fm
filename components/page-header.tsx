import { cn } from "@/lib/utils";

interface PageHeaderProps {
  badge: string;
  title: string;
  highlight?: string;
  description: string;
  className?: string;
}

export function PageHeader({
  badge,
  title,
  highlight,
  description,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/10 pb-12 md:pb-16",
        className,
      )}
    >
      <div className="space-y-4 md:space-y-6">
        {/* UPPER BADGE */}
        <div className="inline-flex">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase border border-primary/20">
            {badge}
          </span>
        </div>

        {/* MAIN TITLE */}
        <h1 className="text-4xl md:text-7xl font-[1000] tracking-[-0.05em] uppercase leading-[0.9] text-balance">
          {title}{" "}
          {highlight && (
            <span className="text-primary italic">{highlight}</span>
          )}
        </h1>
      </div>

      {/* DESCRIPTION */}
      <p className="max-w-xs text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-widest leading-relaxed">
        {description}
      </p>
    </div>
  );
}
