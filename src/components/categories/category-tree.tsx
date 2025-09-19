"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FolderOpen, FolderPlus, GripVertical } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category, CategoryTreeNode } from "@/types/category.types";
import { CategoryTreeItem } from "./category-tree-item";

interface CategoryTreeProps {
  categories: CategoryTreeNode[];
  loading?: boolean;
  onCategorySelect?: (category: Category) => void;
  onCategoryEdit?: (category: Category) => void;
  onCategoryView?: (category: Category) => void;
  onCategoryDelete?: (category: Category) => void;
  onCategoryMove?: (categoryId: string, newParentId?: string) => void;
  onCreateSubcategory?: (parentCategory: Category) => void;
  selectedCategoryId?: string;
  expandedIds?: Set<string>;
  onToggleExpanded?: (categoryId: string) => void;
}

export function CategoryTree({
  categories,
  loading = false,
  onCategorySelect,
  onCategoryEdit,
  onCategoryView,
  onCategoryDelete,
  onCategoryMove,
  onCreateSubcategory,
  selectedCategoryId,
  expandedIds = new Set(),
  onToggleExpanded,
}: CategoryTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedCategory, setDraggedCategory] =
    useState<CategoryTreeNode | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    const findCategory = (
      categories: CategoryTreeNode[],
      id: string
    ): CategoryTreeNode | null => {
      for (const category of categories) {
        if (category._id === id) return category;
        const found = findCategory(category.children, id);
        if (found) return found;
      }
      return null;
    };

    const category = findCategory(categories, active.id as string);
    setDraggedCategory(category);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedCategory(null);

    if (!over || active.id === over.id) {
      return;
    }

    // Handle category movement
    if (onCategoryMove) {
      onCategoryMove(active.id as string, over.id as string);
    }
  };

  const renderTreeItems = (items: CategoryTreeNode[], level = 0) => {
    return items?.map((category) => (
      <CategoryTreeItem
        key={category._id}
        category={category}
        level={level}
        isSelected={selectedCategoryId === category._id}
        isExpanded={expandedIds.has(category._id)}
        onSelect={() => onCategorySelect?.(category)}
        onToggleExpanded={() => onToggleExpanded?.(category._id)}
        onEdit={() => onCategoryEdit?.(category)}
        onView={() => onCategoryView?.(category)}
        onDelete={() => onCategoryDelete?.(category)}
        onCreateSubcategory={() => onCreateSubcategory?.(category)}
        childrenItems={
          category.children.length > 0 && expandedIds.has(category._id)
            ? renderTreeItems(category.children, level + 1)
            : null
        }
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No categories found
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get started by creating your first category
        </p>
        <Button
          onClick={() => onCreateSubcategory?.({} as Category)}
          className="gap-2"
        >
          <FolderPlus className="h-4 w-4" />
          Create Category
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories?.map((cat) => cat._id)}
          strategy={verticalListSortingStrategy}
        >
          <ScrollArea className="h-[600px] w-full">
            <div className="space-y-1">{renderTreeItems(categories)}</div>
          </ScrollArea>
        </SortableContext>

        <DragOverlay>
          {activeId && draggedCategory ? (
            <div className="bg-background border rounded-lg p-2 shadow-lg">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{draggedCategory.name}</span>
                <Badge variant="outline" className="text-xs">
                  Level {draggedCategory.level}
                </Badge>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
