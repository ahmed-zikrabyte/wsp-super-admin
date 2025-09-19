"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Eye,
  FolderPlus,
  GripVertical,
  Image as ImageIcon,
  MoreHorizontal,
  Package,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CategoryTreeNode } from "@/types/category.types";

interface CategoryTreeItemProps {
  category: CategoryTreeNode;
  level: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpanded: () => void;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onCreateSubcategory: () => void;
  childrenItems?: React.ReactNode;
}

export function CategoryTreeItem({
  category,
  level,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpanded,
  onEdit,
  onView,
  onDelete,
  onCreateSubcategory,
  childrenItems,
}: CategoryTreeItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const paddingLeft = level * 24 + 12;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative", isDragging && "opacity-50")}
    >
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50",
          isSelected && "bg-primary/10 border-primary/20",
          isDragging && "bg-background shadow-lg"
        )}
        style={{ paddingLeft }}
        onClick={onSelect}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpanded();
          }}
          disabled={!category.hasChildren}
        >
          {category.hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>

        {/* Category Image */}
        {category.metadata?.image ? (
          <img
            src={category.metadata.image}
            alt={category.name}
            className="h-6 w-6 rounded object-cover"
          />
        ) : (
          <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
            <ImageIcon className="h-3 w-3 text-muted-foreground" />
          </div>
        )}

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{category.name}</span>

            {/* Status Badge */}
            <Badge
              variant={category.isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {category.isActive ? "Active" : "Inactive"}
            </Badge>

            {/* Level Badge */}
            <Badge variant="outline" className="text-xs">
              L{category.level}
            </Badge>

            {/* Product Count */}
            {category.productCount !== undefined && (
              <Badge variant="outline" className="text-xs gap-1">
                <Package className="h-3 w-3" />
                {category.productCount}
              </Badge>
            )}

            {/* Gender Support */}
            {category.attributes?.hasGenderVariants && (
              <Badge variant="outline" className="text-xs">
                Gender Variants
              </Badge>
            )}
          </div>

          {/* Description */}
          {category.metadata?.description && (
            <p className="text-xs text-muted-foreground truncate mt-1">
              {category.metadata.description}
            </p>
          )}

          {/* Path */}
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {category.path}
          </p>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Category
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onCreateSubcategory();
              }}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Add Subcategory
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {childrenItems && <div className="mt-1">{childrenItems}</div>}
    </div>
  );
}
