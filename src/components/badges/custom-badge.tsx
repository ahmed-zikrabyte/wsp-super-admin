// components/ui/status-badge.tsx

import clsx from "clsx";
import { Badge } from "@/components/ui/badge";

type Status =
  | "active"
  | "inactive"
  | "pending"
  | "banned"
  | "public"
  | "private"
  | "pickup_scheduled"
  | "visible"
  | "hidden"
  | string;

interface StatusBadgeProps {
  status: Status;
}

const statusColorMap: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  banned: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
  public: "bg-green-100 text-green-800",
  private: "bg-red-100 text-red-800",
  confirmed: "bg-green-100 text-green-800",
  success: "bg-green-100 text-green-800",
  pickup_scheduled: "bg-blue-100 text-blue-800",
  "in-stock": "bg-green-100 text-green-800",
  "out-of-stock": "bg-red-100 text-red-800",
  visible: "bg-green-100 text-green-800",
  hidden: "bg-red-100 text-red-800",
  not_approved: "bg-yellow-100 text-yellow-800",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClasses =
    statusColorMap[status.toLowerCase()] || "bg-muted text-muted-foreground";

  return (
    <Badge className={clsx("capitalize", colorClasses)}>
      {status.split("_").join(" ")}
    </Badge>
  );
}
