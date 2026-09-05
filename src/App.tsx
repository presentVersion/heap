import React, { useState, useEffect } from 'react';
import { useSolTerraStore } from './store/useSolTerraStore';
import { TopNavbar } from './components/navigation/TopNavbar';
import { Sidebar } from './components/navigation/Sidebar';
import { CityTwinView } from './components/citytwin/CityTwinView';
import { AssetsView } from './components/assets/AssetsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SimulationView } from './components/simulation/SimulationView';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { CommunityView } from './components/community/CommunityView';
import { ReportsView } from './components/reports/ReportsView';
import { AICopilotModal } from './components/copilot/AICopilotModal';
import { SettingsModal } from './components/settings/SettingsModal';

export const App: React.FC = () => {
  const { 
    activePage, 
    theme, 
    mapboxToken,
    isCopilotOpen, 
    setIsCopilotOpen, 
    isSettingsOpen, 
    setIsSettingsOpen, 
    setSelectedAsset 
  } = useSolTerraStore();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync theme with DOM document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auto-open Settings modal on first load if no Mapbox token is set
  useEffect(() => {
    if (!mapboxToken) {
      const timer = setTimeout(() => setIsSettingsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K for Copilot/Search, Escape to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCopilotOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCopilotOpen(false);
        setIsSettingsOpen(false);
        setSelectedAsset(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCopilotOpen, setIsSettingsOpen, setSelectedAsset]);

  const renderActiveView = () => {
    switch (activePage) {
      case 'citytwin':
        return <CityTwinView />;
      case 'assets':
        return <AssetsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'simulation':
        return <SimulationView />;
      case 'maintenance':
        return <MaintenanceView />;
      case 'community':
        return <CommunityView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <CityTwinView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text-1)', transition: 'background 0.3s, color 0.3s' }}>
      {/* Top Header Navbar */}
      <TopNavbar 
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main App Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Collapsible Left Navigation Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Viewport Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <AICopilotModal />
      <SettingsModal />
    </div>
  );
};

export default App;
