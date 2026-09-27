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
import { WelcomeVideoPlayer } from './components/welcome/WelcomeVideoPlayer';

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
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);
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

  // Handler for "Get Started" / "Enter City Twin" button
  const handleEnterApp = () => {
    const hasVisited = localStorage.getItem('solterra_first_visit_completed');
    if (!hasVisited) {
      // First-time visit: play the 2 welcome videos sequentially with skip button
      setShowLanding(false);
      setShowWelcomeVideo(true);
    } else {
      // Returning user: go straight to the digital twin
      setShowLanding(false);
    }
  };

  // 1. First-Time Welcome Video Experience (Auto-play 2 videos in sequence with skip option)
  if (showWelcomeVideo) {
    return (
      <WelcomeVideoPlayer 
        onComplete={() => {
          localStorage.setItem('solterra_first_visit_completed', 'true');
          setShowWelcomeVideo(false);
        }}
      />
    );
  }

  // 2. Initial Interactive 100-Frame Scroll Landing Page
  if (showLanding) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  // 3. Full SolTerra Digital Twin Application Workspace (Native app feel on mobile & desktop)
  return (
    <div
      className="flex flex-col h-[100dvh] w-full max-w-[100vw] overflow-hidden relative select-none animate-fadeIn"
      style={{ background: 'var(--bg-gradient, var(--bg))', color: 'var(--text-1)', transition: 'background 0.3s, color 0.3s' }}
    >
      {/* Permanent Docked Top Navbar */}
      <TopNavbar 
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onGoToLanding={() => setShowLanding(true)}
      />

      {/* Main App Workspace (Starts cleanly below permanent navbar) */}
      <main className="flex-1 flex flex-col min-h-0 w-full overflow-hidden relative">
        {renderActiveView()}
      </main>

      {/* Global Modals */}
      <AICopilotModal />
      <SettingsModal onReplayIntro={() => setShowWelcomeVideo(true)} />
    </div>
  );
};

export default App;
