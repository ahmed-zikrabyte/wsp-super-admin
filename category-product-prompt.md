# E-commerce Category Management System

## Core Design Principles

1. **Single Source of Truth**: One category collection that handles all levels
2. **Flexible Hierarchy**: Support unlimited nesting levels
3. **Gender as Attribute**: Treat gender as a property, not a category level
4. **Clean Separation**: Keep category structure separate from product attributes

## MongoDB Document Structure

### Categories Collection

```json
{
  "_id": "ObjectId",
  "name": "T-shirts",
  "slug": "tshirts",
  "path": "/fashion/clothing/tshirts",
  "level": 3,
  "parentId": "clothing_category_id",
  "rootId": "fashion_root_id",
  "isActive": true,
  "displayOrder": 1,
  "metadata": {
    "description": "Comfortable T-shirts for all occasions",
    "image": "tshirts-category.jpg",
    "seo": {
      "title": "Buy T-shirts Online",
      "description": "Shop latest T-shirts collection"
    }
  },
  "attributes": {
    "hasGenderVariants": true,
    "supportedGenders": ["men", "women", "kids", "unisex"],
    "hasSizeGuide": true,
    "requiresFitting": false
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Products Collection (Parent Product)

```json
{
  "_id": "ObjectId",
  "name": "Nike Dri-FIT T-shirt",
  "sku": "NIKE-TSHIRT-001",
  "categoryId": "tshirts_category_id",
  "categoryPath": "/fashion/clothing/tshirts",
  "targetAudience": ["men", "unisex"],
  "brand": "Nike",
  "basePrice": {
    "current": 1299,
    "original": 1499,
    "currency": "INR"
  },
  "commonAttributes": {
    "material": "100% Cotton",
    "fit": "regular",
    "careInstructions": "Machine wash cold"
  },
  "variantAttributes": ["size", "color"],
  "variants": [
    {
      "variantId": "NIKE-TSHIRT-001-M-BLACK",
      "sku": "NIKE-TSHIRT-001-M-BLACK",
      "attributes": {
        "size": "M",
        "color": "black"
      },
      "price": {
        "current": 1299,
        "original": 1499
      },
      "inventory": {
        "stock": 25,
        "reserved": 2
      },
      "isActive": true
    },
    {
      "variantId": "NIKE-TSHIRT-001-L-RED",
      "sku": "NIKE-TSHIRT-001-L-RED",
      "attributes": {
        "size": "L",
        "color": "red"
      },
      "price": {
        "current": 1399,
        "original": 1599
      },
      "inventory": {
        "stock": 15,
        "reserved": 1
      },
      "isActive": true
    },
    {
      "variantId": "NIKE-TSHIRT-001-XL-BLUE",
      "sku": "NIKE-TSHIRT-001-XL-BLUE",
      "attributes": {
        "size": "XL",
        "color": "blue"
      },
      "price": {
        "current": 1499,
        "original": 1699
      },
      "inventory": {
        "stock": 8,
        "reserved": 0
      },
      "isActive": true
    }
  ],
  "priceRange": {
    "min": 1299,
    "max": 1499,
    "currency": "INR"
  },
  "totalStock": 48,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Category Hierarchy Examples

### Fashion Categories Structure

```json
[
  {
    "_id": "fashion_root",
    "name": "Fashion",
    "slug": "fashion",
    "path": "/fashion",
    "level": 1,
    "parentId": null,
    "rootId": "fashion_root",
    "displayOrder": 1
  },
  {
    "_id": "clothing_cat",
    "name": "Clothing",
    "slug": "clothing",
    "path": "/fashion/clothing",
    "level": 2,
    "parentId": "fashion_root",
    "rootId": "fashion_root",
    "displayOrder": 1
  },
  {
    "_id": "tshirts_cat",
    "name": "T-shirts",
    "slug": "tshirts",
    "path": "/fashion/clothing/tshirts",
    "level": 3,
    "parentId": "clothing_cat",
    "rootId": "fashion_root",
    "attributes": {
      "hasGenderVariants": true,
      "supportedGenders": ["men", "women", "kids", "unisex"]
    },
    "displayOrder": 1
  }
]
```

## Key Management Strategies

### 1. Path-Based Navigation

- Each category has a unique path (like file system)
- Easy to build breadcrumbs and navigation
- Fast lookups using path indexing

### 2. Gender Handling

Instead of creating separate categories for each gender:

```json
// ❌ Don't do this (creates too many categories)
"/fashion/clothing/mens/tshirts"
"/fashion/clothing/womens/tshirts"

// ✅ Do this (gender as product attribute)
"/fashion/clothing/tshirts" + product.gender = "men"
```

### 3. Database Indexes

```javascript
// Essential indexes for performance
db.categories.createIndex({path: 1});
db.categories.createIndex({parentId: 1});
db.categories.createIndex({level: 1, displayOrder: 1});
db.categories.createIndex({slug: 1}, {unique: true});

db.products.createIndex({categoryId: 1});
db.products.createIndex({categoryPath: 1});
db.products.createIndex({targetAudience: 1, categoryId: 1});
db.products.createIndex({"variants.variantId": 1});
db.products.createIndex({"variants.sku": 1});
```

## API Design Examples

### Get Category Tree

```javascript
// GET /api/categories/tree
{
  "success": true,
  "data": {
    tree: [
        {
          "name": "Fashion",
          "children": [
             {
              "name": "Clothing",
              "children": [
                {
                  "name": "T-shirts",
                  "children": []
                },
                {
                  "name": "Shirts",
                  "children": []
                }
              ]
            },
            {
              "name": "Footwear",
              "children": [
                {
                  "name": "Sneakers",
                  "children": []
                }
              ]
            }
          ]
        }
    ]
  }
}
```

### Get Products by Category and Target Audience

```javascript
// GET /api/products?category=tshirts&audience=men
{
  "success": true,
  "filters": {
    "categoryPath": "/fashion/clothing/tshirts",
    "targetAudience": { "$in": ["men"] }
  },
  "data": [...products],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

### Get Product Variants with Pricing

```javascript
// GET /api/products/NIKE-TSHIRT-001/variants
{
  "success": true,
  "productId": "NIKE-TSHIRT-001",
  "variants": [
    {
      "variantId": "NIKE-TSHIRT-001-M-BLACK",
      "attributes": { "size": "M", "color": "black" },
      "price": { "current": 1299, "original": 1499 },
      "stock": 25,
      "isAvailable": true
    },
    {
      "variantId": "NIKE-TSHIRT-001-L-RED",
      "attributes": { "size": "L", "color": "red" },
      "price": { "current": 1399, "original": 1599 },
      "stock": 15,
      "isAvailable": true
    }
  ],
  "priceRange": { "min": 1299, "max": 1499 }
}
```

## Admin Management Features

### Category Operations

1. **Create Category**: Automatically generate path and level
2. **Move Category**: Update all child paths recursively
3. **Delete Category**: Soft delete with product reassignment
4. **Reorder**: Update displayOrder for siblings

### Bulk Operations

```javascript
// Update all products in a category
db.products.updateMany(
  {categoryPath: /^\/fashion\/clothing\/tshirts/},
  {$set: {newField: "value"}}
);
```

## Variant Pricing Management

### Why Variants Need Different Prices

- **Size-based pricing**: XL/XXL sizes often cost ₹100-200 more
- **Color-based pricing**: Premium colors (like gold, silver) cost more
- **Material variations**: Premium fabrics have higher prices
- **Limited editions**: Special variants at premium pricing

### Variant Pricing Strategies

#### 1. Base Price + Modifiers

```json
{
  "basePrice": 1299,
  "priceModifiers": {
    "size": {
      "XL": 100,
      "XXL": 200,
      "XXXL": 300
    },
    "color": {
      "gold": 500,
      "silver": 300,
      "premium-black": 200
    }
  },
  "variants": [
    {
      "attributes": { "size": "XL", "color": "gold" },
      "calculatedPrice": 1299 + 100 + 500, // = 1899
      "finalPrice": 1899
    }
  ]
}
```

#### 2. Direct Variant Pricing (Recommended)

```json
{
  "variants": [
    {
      "variantId": "SHIRT-001-M-BLUE",
      "attributes": {"size": "M", "color": "blue"},
      "price": {
        "current": 1299,
        "original": 1499,
        "cost": 600,
        "margin": 53.8
      }
    },
    {
      "variantId": "SHIRT-001-XL-GOLD",
      "attributes": {"size": "XL", "color": "gold"},
      "price": {
        "current": 1899,
        "original": 2199,
        "cost": 850,
        "margin": 55.2
      }
    }
  ]
}
```

### Cart & Order Management

#### Cart Item Structure

```json
{
  "cartId": "user_cart_123",
  "items": [
    {
      "productId": "NIKE-TSHIRT-001",
      "variantId": "NIKE-TSHIRT-001-L-RED",
      "quantity": 2,
      "unitPrice": 1399,
      "totalPrice": 2798,
      "selectedAttributes": {
        "size": "L",
        "color": "red"
      }
    }
  ],
  "cartTotal": 2798
}
```

#### Order Item Structure

```json
{
  "orderId": "ORDER-2024-001",
  "items": [
    {
      "productId": "NIKE-TSHIRT-001",
      "variantId": "NIKE-TSHIRT-001-L-RED",
      "productName": "Nike Dri-FIT T-shirt",
      "variantSku": "NIKE-TSHIRT-001-L-RED",
      "attributes": {
        "size": "L",
        "color": "red"
      },
      "quantity": 2,
      "unitPrice": 1399,
      "totalPrice": 2798
    }
  ]
}
```

## Advanced Features

### 1. Category Attributes Template

```json
{
  "categoryId": "tshirts_cat",
  "attributeTemplate": {
    "required": ["size", "color", "material"],
    "optional": ["fit", "neckline", "sleeve"],
    "validation": {
      "size": ["XS", "S", "M", "L", "XL", "XXL"],
      "color": "array",
      "material": "string"
    }
  }
}
```

### 2. Dynamic Filtering

```json
{
  "categoryId": "tshirts_cat",
  "availableFilters": {
    "targetAudience": ["men", "women", "kids", "unisex"],
    "size": ["S", "M", "L", "XL"],
    "color": ["black", "white", "red"],
    "priceRange": {"min": 299, "max": 2999},
    "brand": ["Nike", "Adidas", "Puma"]
  }
}
```

### 3. SEO & Marketing

```json
{
  "categoryId": "tshirts_cat",
  "seo": {
    "title": "Buy T-shirts Online - Best Collection",
    "description": "Shop from wide range of T-shirts...",
    "keywords": ["tshirts", "mens tshirts", "cotton tshirts"]
  },
  "marketing": {
    "banners": ["summer-sale-banner.jpg"],
    "featuredBrands": ["nike", "adidas"],
    "crossSell": ["shorts", "jeans"]
  }
}
```

## Benefits of This Approach

1. **Scalable**: Easy to add new categories without restructuring
2. **Flexible**: Gender handled as attribute, not rigid hierarchy
3. **Performance**: Optimized queries with proper indexing
4. **Maintainable**: Clear separation of concerns
5. **SEO-Friendly**: Clean URL structure with paths
6. **Admin-Friendly**: Easy category management interface

This system scales from small shops to marketplace-level complexity while keeping the core structure simple and intuitive.
