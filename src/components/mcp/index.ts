/**
 * Main export file for MCP components
 * This file re-exports all components from the MCP directory
 * to provide a clean import interface
 */

// Layout components
export { MainLayout } from '../layout/main-layout';

// Section components
export { HeroSection } from './hero-section';
export { MCPSection } from './mcp-section';
export { UserCollections } from './user-collections';

// Card components
export { MCPCard } from './mcp-card';
export { SectionHeader } from './section-header';

// Other components
export { ErrorBoundary } from '../common/error-boundary';
export { ThemeProvider } from '../ui/theme-provider';
