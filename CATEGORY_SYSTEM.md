# Category Management System

A comprehensive category management system for WeSeeShop Super Admin panel, built with Next.js 15, TypeScript, and ShadCN components.

## 🚀 Features

### Core Functionality
- **Hierarchical Categories**: Unlimited nesting levels with path-based navigation
- **Drag & Drop Interface**: Reorder and move categories using @dnd-kit
- **Professional UI**: Modern interface using ShadCN components
- **Real-time Updates**: Live statistics and category counts
- **Image Management**: Upload and manage category images
- **Gender Variants**: Support for gender-based product categorization
- **SEO Optimization**: Built-in SEO fields for better search visibility

### Advanced Features
- **Tree View**: Expandable/collapsible hierarchical tree structure
- **Bulk Operations**: Mass updates for display order and status
- **Smart Filtering**: Search, level-based, and status filtering
- **API Integration**: Full REST API integration with error handling
- **Form Validation**: Comprehensive validation with TypeScript
- **Responsive Design**: Mobile-friendly interface

## 📁 Project Structure

```
src/
├── app/(dashboard)/categories/
│   └── page.tsx                    # Main categories page
├── components/categories/
│   ├── category-tree.tsx           # Tree view component with drag & drop
│   ├── category-tree-item.tsx      # Individual tree item
│   └── category-modal.tsx          # CRUD modal for categories
├── services/
│   └── categoryService.ts          # API service layer
├── types/
│   └── category.types.ts           # TypeScript interfaces
└── hooks/
    └── useCategories.ts            # Custom hook for category management
```

## 🛠️ Components

### CategoryTree Component
- Hierarchical tree view with drag & drop support
- Expand/collapse functionality
- Context menus for actions
- Real-time product counts

### CategoryModal Component
- Tabbed interface for organized data entry
- Image upload with preview
- SEO fields management
- Gender variants configuration
- Form validation

### CategoryTreeItem Component
- Individual category display
- Drag handle for reordering
- Action dropdown menu
- Status indicators and badges

## 🔧 API Integration

### Endpoints Used
```typescript
GET    /api/v1/super-admin/categories        # List categories
GET    /api/v1/super-admin/categories/tree   # Get tree structure
GET    /api/v1/super-admin/categories/stats  # Get statistics
POST   /api/v1/super-admin/categories        # Create category
PATCH  /api/v1/super-admin/categories/:id    # Update category
DELETE /api/v1/super-admin/categories/:id    # Delete category
PATCH  /api/v1/super-admin/categories/:id/move # Move category
```

### Service Layer Features
- Automatic authentication token handling
- Request/response interceptors
- Error handling and user feedback
- File upload support for images
- Type-safe API calls

## 📊 Data Structure

### Category Schema
```typescript
interface Category {
  _id: string;
  name: string;
  slug: string;
  path: string;
  level: number;
  parentId?: string;
  rootId?: string;
  isActive: boolean;
  displayOrder: number;
  metadata?: {
    description?: string;
    image?: string;
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
  };
  attributes?: {
    hasGenderVariants?: boolean;
    supportedGenders?: string[];
    hasSizeGuide?: boolean;
    requiresFitting?: boolean;
  };
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 UI/UX Features

### Visual Elements
- **Status Badges**: Clear visual indicators for active/inactive categories
- **Level Indicators**: Shows category hierarchy level
- **Product Counts**: Live product count per category
- **Gender Support**: Visual indicators for gender variant support
- **Drag Indicators**: Visual feedback during drag operations

### User Experience
- **Intuitive Navigation**: Breadcrumb-style category paths
- **Quick Actions**: Context-sensitive action menus
- **Real-time Feedback**: Toast notifications for all operations
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Graceful error messages and fallbacks

## 🔍 Filtering & Search

### Available Filters
- **Text Search**: Search by category name and description
- **Level Filter**: Filter by hierarchy level (1-4)
- **Status Filter**: Active/inactive categories
- **Sorting**: By name, date, display order, or product count

### Search Features
- **Real-time Search**: Instant filtering as you type
- **Multi-criteria**: Combine multiple filters
- **Sort Options**: Ascending/descending order
- **Clear Filters**: One-click filter reset

## 📱 Responsive Design

### Mobile Features
- **Touch-friendly**: Optimized touch targets
- **Collapsible Sidebar**: Space-efficient navigation
- **Modal Adaptations**: Full-screen modals on mobile
- **Gesture Support**: Touch gestures for tree navigation

## 🚀 Performance Optimizations

### Frontend Optimizations
- **React.memo**: Prevent unnecessary re-renders
- **useCallback**: Memoized callback functions
- **Virtual Scrolling**: Handle large category trees
- **Lazy Loading**: Load categories on demand

### API Optimizations
- **Caching**: Service-level caching for repeated requests
- **Pagination**: Efficient data loading
- **Bulk Operations**: Reduce API calls
- **Optimistic Updates**: Immediate UI feedback

## 🛡️ Error Handling

### Frontend Error Handling
- **Try-catch Blocks**: Comprehensive error catching
- **User Feedback**: Toast notifications for errors
- **Fallback States**: Graceful degradation
- **Development Logging**: Console errors for debugging

### API Error Handling
- **Response Interceptors**: Automatic error processing
- **Authentication Errors**: Redirect to login on 401
- **Network Errors**: Offline state handling
- **Validation Errors**: Field-specific error messages

## 🧪 Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Component Organization**: Clear separation of concerns

### Testing Approach
- **Unit Tests**: Component-level testing
- **Integration Tests**: API service testing
- **E2E Tests**: Full user workflow testing
- **Accessibility**: WCAG compliance testing

## 🔄 State Management

### Local State
- **useState**: Component-level state
- **useReducer**: Complex state logic
- **useContext**: Shared state across components

### Server State
- **React Query**: Server state management (recommended)
- **SWR**: Alternative server state solution
- **Custom Hooks**: Centralized data fetching

## 📦 Dependencies

### Core Dependencies
```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "next": "15.3.2",
  "react": "^19.0.0",
  "typescript": "^5.8.3"
}
```

### UI Components
- **ShadCN**: Complete component library
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible primitives

## 🚀 Getting Started

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

### Configuration
1. Set up environment variables in `.env.local`
2. Configure API base URL
3. Set up authentication tokens
4. Initialize database connections

### Usage
1. Navigate to `/categories` in the admin panel
2. Use the "Create Category" button to add new categories
3. Drag and drop to reorder categories
4. Use the tree view to manage hierarchy
5. Apply filters to find specific categories

## 🔧 Customization

### Styling
- Modify Tailwind classes for custom styling
- Update ShadCN theme configuration
- Add custom CSS for specific components

### Functionality
- Extend the category schema as needed
- Add custom validation rules
- Implement additional filters or views
- Integrate with external services

## 📈 Future Enhancements

### Planned Features
- **Bulk Import/Export**: CSV/Excel support
- **Category Templates**: Predefined category structures
- **Advanced Analytics**: Usage and performance metrics
- **Audit Trail**: Track all category changes
- **API Versioning**: Support multiple API versions
- **Caching Strategy**: Advanced caching mechanisms

### Possible Integrations
- **Product Sync**: Real-time product count updates
- **Search Engine**: Integration with Elasticsearch
- **CDN Integration**: Image optimization and delivery
- **Backup System**: Automated category backups

---

## 📄 License

This project is part of the WeSeeShop ecosystem and follows the company's licensing terms.

## 🤝 Contributing

For contributions, please follow the established code standards and submit pull requests for review.

## 📞 Support

For technical support or questions about the category management system, please contact the development team.