import React, { useState, useEffect } from 'react';
import { useSolTerraStore } from './store/useSolTerraStore';
import { TopNavbar } from './components/navigation/TopNavbar';
import { CityTwinView } from './components/citytwin/CityTwinView';
import { AssetsView } from './components/assets/AssetsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SimulationView } from './components/simulation/SimulationView';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { CommunityView } from './components/community/CommunityView';
import { ReportsView } from './components/reports/ReportsView';
import { AICopilotModal } from './components/copilot/AICopilotModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { LandingPage } from './components/landing/LandingPage';

export const App: React.FC = () => {
  const { 
    activePage, 
    theme, 
    isCopilotOpen, 
    setIsCopilotOpen, 
    isSettingsOpen, 
    setIsSettingsOpen, 
    setSelectedAsset 
  } = useSolTerraStore();

  const [showLanding, setShowLanding] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync theme with DOM document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

  // 1. Initial Interactive 100-Frame Scroll Landing Page
  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />;
  }

  // 2. Full SolTerra Digital Twin Application Workspace (Spacious, No Sidebar, Floating Glass Nav)
  return (
    <div
      className="flex flex-col h-[100dvh] w-full max-w-[100vw] overflow-hidden relative select-none animate-fadeIn"
      style={{ background: 'var(--bg)', color: 'var(--text-1)', transition: 'background 0.3s, color 0.3s' }}
    >
      {/* Floating Non-Permanent Liquid Glass Header Navbar */}
      <TopNavbar 
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onGoToLanding={() => setShowLanding(true)}
      />

      {/* Main Full-Bleed App Workspace */}
      <main className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
        {renderActiveView()}
      </main>

      {/* Global Modals */}
      <AICopilotModal />
      <SettingsModal />
    </div>
  );
};

export default App;
