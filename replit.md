# Rivela - Personal Finance Explorer

## Overview

Rivela is a comprehensive React-based personal finance application that helps users explore and understand their financial situation through an interactive, question-driven approach with advanced AI-powered insights. The application provides sophisticated financial data visualization, emotional context tracking, detailed simulations, hidden fees detection, and personalized insights to help users make informed financial decisions. It features an advanced dashboard, comprehensive journal system, learning modules, and multiple export/sharing options.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript, implementing a component-based architecture with custom hooks for state management. The application uses a screen-based navigation system with five main screens: Question, Mapping, Advanced Revelation, Journal, and Learning. State is managed locally using React hooks and localStorage for persistence, with advanced AI-powered analysis and insights generation.

### Advanced Features
The application now includes sophisticated financial analysis tools:
- **Advanced Dashboard**: Real-time financial health scoring, comprehensive metrics visualization, trend analysis, and actionable recommendations
- **AI-Powered Insights**: Deep learning-based financial pattern recognition, personality profiling, risk assessment, and personalized recommendations
- **Advanced Simulator**: Custom scenario builder allowing users to create detailed "what-if" simulations with probability analysis and impact projections
- **Hidden Fees Detector**: Intelligent scanning for potential hidden costs, subscription overlaps, and optimization opportunities
- **Export & Share System**: Multi-format export capabilities (PDF, CSV, JSON, PNG) with privacy-conscious social sharing options

### UI/UX Design System
The application uses Tailwind CSS for styling with an expanded custom design system featuring 10 nature-inspired themes (Classic, Sunset, Ocean, Forest, Aurora, Cosmic, Desert, Glacial, Volcanic, Tropical). It implements a glassmorphism design aesthetic with gradient backgrounds and includes a comprehensive component library based on Radix UI primitives. The design is fully responsive with mobile-first considerations and advanced animations using Framer Motion.

### Data Management & Analytics
Local storage is used as the primary data persistence mechanism, enhanced with advanced financial calculation engines. The application uses TypeScript interfaces for type safety across complex financial data structures including income, expenses, debts, goals, assets, and historical tracking. Real-time AI-powered calculations perform deep financial analysis, trend prediction, and personalized insight generation.

### Component Structure
The architecture follows a modular component design with specialized advanced components:
- **AdvancedDashboard**: Comprehensive financial overview with interactive charts and metrics
- **DeepInsights**: AI-powered analysis with confidence scoring and personality profiling  
- **AdvancedSimulator**: Custom scenario builder with probability calculations
- **HiddenFeesDetector**: Intelligent cost optimization scanner
- **ExportShareSystem**: Multi-format export and privacy-conscious sharing

### Theme System
An expanded context-based theme system allows users to switch between 10 nature-inspired visual themes. The ThemeProvider manages theme state and applies CSS custom properties for dynamic styling. Each theme includes unique gradient backgrounds, color schemes, and typography settings inspired by natural environments.

### Development Tools
The project uses Vite for development and build tooling with hot module replacement. ESBuild handles production builds for both client and server code. TypeScript provides compile-time type checking with strict mode enabled.

## External Dependencies

### Core React Ecosystem
- React 18 with TypeScript for the main application framework
- React DOM for rendering and React hooks for state management
- Vite for development server and build tooling with React plugin

### UI Component Library
- Radix UI components for accessible, unstyled UI primitives including dialogs, dropdowns, tooltips, and form controls
- Tailwind CSS for utility-first styling and responsive design
- Class Variance Authority for component variant management

### Data Handling
- React Hook Form with Hookform Resolvers for form management and validation
- UUID library for generating unique identifiers for financial items and journal entries
- Date-fns with French locale for date formatting and manipulation

### Database & Backend (Optional)
- Drizzle ORM configured for PostgreSQL with Neon Database serverless driver
- Express.js server setup for potential API endpoints
- Connect-pg-simple for PostgreSQL session storage (if authentication is added)

### Development & Build Tools
- TypeScript for type safety and better development experience
- PostCSS with Autoprefixer for CSS processing
- ESBuild for efficient production builds
- Replit-specific plugins for development environment integration

### Animation & Interaction
- Framer Motion for smooth animations and transitions (referenced in components)
- Embla Carousel for carousel/slider functionality
- Lucide React for consistent icon library

### State Management & Utilities
- TanStack React Query for server state management (configured but not actively used)
- CLSX and Tailwind Merge for conditional CSS class handling
- Custom hooks for localStorage integration and mobile detection