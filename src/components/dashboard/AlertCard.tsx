
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type AlertSeverity = "low" | "medium" | "high" | "critical";

interface AlertCardProps {
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AlertCard({
  title,
  description,
  severity,
  timestamp,
  actionLabel = "Resolver",
  onAction,
}: AlertCardProps) {
  const severityConfig: Record<
    AlertSeverity,
    { color: string; label: string }
  > = {
    low: { color: "bg-green-100 text-green-800", label: "Baixa" },
    medium: { color: "bg-yellow-100 text-yellow-800", label: "Média" },
    high: { color: "bg-orange-100 text-orange-800", label: "Alta" },
    critical: { color: "bg-red-100 text-red-800", label: "Crítica" },
  };

  return (
    <Card className="border shadow-sm bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{title}</h3>
              <Badge
                className={cn(
                  "text-xs font-medium",
                  severityConfig[severity].color
                )}
              >
                {severityConfig[severity].label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
            <p className="text-xs text-gray-400 mt-2">{timestamp}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onAction}
            className="ml-4 mt-1"
          >
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
