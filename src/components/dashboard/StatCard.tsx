
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "condicional";
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const valueBasedClass = !isNaN(numericValue)
    ? numericValue === 0
      ? 'bg-green-50 border-green-100'
      : numericValue >= 1 && numericValue <= 8
      ? 'bg-yellow-50 border-yellow-100'
      : numericValue >= 9
      ? 'bg-red-200 border-red-300'
      : ''
    : '';

  const variantClasses = {
    default: "bg-white",
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    condicional:"bg-white"
  };

  return (
    <Card className={cn(
      "border shadow-sm",
      variant === "condicional" ? valueBasedClass : variantClasses[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className={cn("text-sm font-medium",  variant === "condicional" ? "text-black" : variant !== "default" ? "text-white/80" : "text-gray-500")}>
              {title}
            </p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {description && (
              <p className={cn("text-sm mt-1", 
                variant === "condicional" ? "text-black" :
                variant !== "default" ? "text-white/70" : "text-gray-500"
              )}>
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.positive 
                      ? variant !== "default" ? "text-white/90" : "text-green-600" 
                      : variant !== "default" ? "text-white/90" : "text-red-600"
                  )}
                >
                  {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  desde o último período
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn(
              "p-2 rounded-md", 
              variant === "default" ? "bg-gray-100" : "bg-white/10"
            )}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
