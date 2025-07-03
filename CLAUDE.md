# CLAUDE.md - Tishya Foods Website

## Project Overview
Tishya Foods is a comprehensive e-commerce website for a health-focused food company specializing in protein-rich, natural foods. The website features a modern dark theme design, advanced e-commerce functionality, and enhanced user experience features.

## Tech Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Package Manager**: npm
- **Deployment**: Vercel

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── blog/              # Blog system with filtering
│   ├── compare/           # Product comparison
│   ├── contact/           # Contact page
│   ├── nutrition/         # Nutrition tracking
│   ├── products/          # Product catalog
│   ├── recipes/           # Recipe collection
│   └── layout.tsx         # Root layout with dark theme
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── home/             # Homepage sections
│   ├── blog/             # Blog components
│   ├── product/          # Product-related components
│   ├── auth/             # Authentication components
│   ├── cart/             # Shopping cart components
│   ├── checkout/         # Checkout flow
│   ├── subscription/     # Subscription management
│   ├── ai/               # AI-powered features
│   ├── nutrition/        # Nutrition tracking
│   ├── social/           # Social media integration
│   ├── loading/          # Loading states
│   ├── performance/      # Performance optimization
│   └── analytics/        # Analytics components
├── features/             # Feature-specific modules
│   ├── auth/             # Authentication system
│   ├── cart/             # Cart management
│   ├── checkout/         # Checkout process
│   ├── orders/           # Order management
│   └── loyalty/          # Loyalty program
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and data
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## Key Features Implemented

### 🎨 Design & UI
- **Dark Theme**: Comprehensive dark mode implementation across all components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Animations**: Framer Motion for smooth interactions
- **Component Library**: Shadcn/ui for consistent design system

### 🛒 E-commerce Functionality
- **Product Catalog**: Advanced filtering, search, and sorting
- **Shopping Cart**: Context-based cart management
- **Checkout Flow**: Multi-step checkout with payment integration
- **Order Management**: Order tracking and history
- **Product Comparison**: Side-by-side product comparisons

### 📝 Content Management
- **Blog System**: Full-featured blog with categories and tags
- **Recipe Collection**: Searchable recipe database
- **Product Information**: Detailed product pages with nutrition info

### 🔐 User Features
- **Authentication**: Login/register system
- **User Profiles**: Account management
- **Subscription Service**: Recurring product deliveries
- **Loyalty Program**: Points and rewards system

### 🤖 Advanced Features
- **AI Nutrition Assistant**: Personalized nutrition recommendations
- **Performance Optimization**: Virtual scrolling, image optimization
- **Analytics Integration**: Real-time monitoring
- **Error Boundaries**: Robust error handling

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow the existing dark theme color scheme:
  - Primary backgrounds: `bg-gray-900`, `bg-gray-800`
  - Text colors: `text-gray-100`, `text-gray-300`
  - Borders: `border-gray-600`, `border-gray-700`
- Use Tailwind CSS classes consistently
- Implement proper accessibility features

### Component Patterns
- Use `'use client'` directive for client components
- Implement proper loading states and error boundaries
- Use React Context for global state management
- Follow the existing component structure and naming conventions

### Testing & Quality
- Run linting and type checking before commits:
  ```bash
  npm run lint
  npm run build
  ```
- Test responsive design across different screen sizes
- Ensure dark theme consistency across all components

## Build & Deploy Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Deployment
The project is configured for Vercel deployment with automatic builds on push to main branch.

## Recent Major Updates

### Dark Theme Implementation (Latest)
- Converted entire website from light to dark theme
- Updated all page components with consistent dark styling
- Fixed form inputs and UI components for dark mode
- Maintained accessibility and contrast standards

### Blog System Enhancement
- Fixed blog API response parsing issues
- Implemented client-side rendering for dynamic content
- Added proper error handling and loading states
- Integrated with blog context for state management

### Performance Optimizations
- Implemented virtual scrolling for large product lists
- Added image optimization and lazy loading
- Optimized component rendering and state updates
- Added performance monitoring and analytics

## Known Issues & Solutions

### Blog Page Error (Resolved)
- **Issue**: Runtime error (ID: mcmpobsk) due to API response parsing
- **Solution**: Fixed blog context to properly extract `data.posts` from API response

### SSR Compatibility
- **Issue**: Event handlers in static generation
- **Solution**: Use `'use client'` directive for interactive components

### Dark Theme Consistency
- **Issue**: Inconsistent styling across components
- **Solution**: Systematic color scheme updates using bulk replacements

## Environment Setup

### Required Dependencies
```json
{
  "next": "15.3.4",
  "react": "19.0.0",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "@tailwindcss/line-clamp": "^0.4.4",
  "framer-motion": "latest",
  "lucide-react": "latest"
}
```

### Configuration Files
- `tailwind.config.ts`: Dark mode enabled, line-clamp plugin
- `next.config.js`: Optimized for Vercel deployment
- `tsconfig.json`: Strict TypeScript configuration

## Maintenance Notes

### Regular Tasks
1. Update dependencies monthly
2. Monitor performance metrics
3. Review and update content regularly
4. Test checkout flow functionality
5. Backup user data and analytics

### When Adding New Features
1. Follow existing dark theme patterns
2. Update this CLAUDE.md file
3. Add proper TypeScript types
4. Implement error boundaries
5. Test responsive design
6. Update documentation

## Contact & Support
For technical issues or questions about the codebase, refer to the git history and commit messages for detailed implementation notes. The project follows semantic versioning and maintains detailed commit messages for tracking changes.

---
Last Updated: July 2025
Project Status: Active Development
Current Version: Dark Theme Implementation Complete