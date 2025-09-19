export interface CategoryMetadata {
  description?: string;
  image?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface CategoryAttributes {
  hasGenderVariants?: boolean;
  supportedGenders?: ("men" | "women" | "kids" | "unisex")[];
  hasSizeGuide?: boolean;
  requiresFitting?: boolean;
  template?: {
    required?: string[];
    optional?: string[];
    validation?: Record<string, any>;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  path: string;
  level: number;
  parentId?: string;
  rootId?: string;
  isActive: boolean;
  displayOrder: number;
  metadata?: CategoryMetadata;
  attributes?: CategoryAttributes;
  children?: Category[];
  parent?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  productCount?: number;
  hasChildren: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  parentId?: string;
  description?: string;
  image?: File | string;
  supportedGenders?: string[];
  hasGenderVariants?: boolean;
  hasSizeGuide?: boolean;
  requiresFitting?: boolean;
  displayOrder?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  isActive?: boolean;
}

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  categoriesByLevel: Record<number, number>;
  totalProducts: number;
  categoriesWithProducts: number;
  topCategories: Array<{
    category: Category;
    productCount: number;
  }>;
}

export interface CategoryFilters {
  search?: string;
  level?: number | string;
  parentId?: string;
  isActive?: boolean;
  status?: string;
  hasProducts?: boolean;
  supportedGenders?: string[];
  sortBy?: "name" | "createdAt" | "updatedAt" | "displayOrder" | "productCount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: CategoryFilters;
}

export interface MoveCategoryRequest {
  newParentId?: string;
  newDisplayOrder?: number;
}

export interface BulkUpdateDisplayOrderRequest {
  updates: Array<{
    categoryId: string;
    displayOrder: number;
  }>;
}

export interface CategoryApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface CategoryImage {
  url: string;
  alt?: string;
  size?: number;
  type?: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  parentId: string;
  image: File | null;
  imageUrl: string;
  supportedGenders: string[];
  hasGenderVariants: boolean;
  hasSizeGuide: boolean;
  requiresFitting: boolean;
  displayOrder: number;
  isActive: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export type CategoryViewMode = "tree" | "list" | "grid";
export type CategoryModalMode = "create" | "edit" | "view";
