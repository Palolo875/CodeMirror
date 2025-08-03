# Rivela - Personal Finance Explorer

## Overview

Rivela is a modern React-based personal finance application that helps users explore and understand their financial situation through an interactive, question-driven approach. The application provides financial data visualization, emotional context tracking, and personalized insights to help users make better financial decisions. It features a journal system for tracking financial explorations over time and includes learning modules for financial education.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript, implementing a component-based architecture with custom hooks for state management. The application uses a screen-based navigation system with five main screens: Question, Mapping, Revelation, Journal, and Learning. State is managed locally using React hooks and localStorage for persistence, with no external backend dependency for core functionality.

### UI/UX Design System
The application uses Tailwind CSS for styling with a custom design system featuring multiple themes (Classic, Sunset, Ocean, Forest). It implements a glassmorphism design aesthetic with gradient backgrounds and includes a comprehensive component library based on Radix UI primitives. The design is fully responsive with mobile-first considerations.

### Data Management
Local storage is used as the primary data persistence mechanism, storing user journal entries, session counts, and preferences. The application uses TypeScript interfaces for type safety across financial data structures including income, expenses, debts, goals, and assets. Real-time calculations are performed on the frontend for financial insights and projections.

### Component Structure
The architecture follows a modular component design with specialized components for financial input, emotional context tracking, data visualization, and learning modules. Screen components manage their own state and pass data through props to child components. Utility functions handle financial calculations, data export, and local storage operations.

### Theme System
A context-based theme system allows users to switch between different visual themes. The ThemeProvider manages theme state and applies CSS custom properties for dynamic styling. Each theme includes gradient backgrounds, color schemes, and typography settings.

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