import React from 'react';
import {
  IoGlobeOutline,
  IoBarChartOutline,
  IoCubeOutline,
  IoFlashOutline,
  IoConstructOutline,
  IoSparklesOutline,
  IoPeopleOutline,
  IoDocumentTextOutline
} from 'react-icons/io5';

export interface MenuItem {
  id?: string;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
}

interface GradientMenuProps {
  items?: MenuItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

const DEFAULT_ITEMS: MenuItem[] = [
  { id: 'citytwin', title: 'City Twin', icon: <IoGlobeOutline /> },
  { id: 'analytics', title: 'Analytics', icon: <IoBarChartOutline /> },
  { id: 'assets', title: 'Assets', icon: <IoCubeOutline /> },
  { id: 'simulation', title: 'Simulate', icon: <IoFlashOutline /> },
  { id: 'maintenance', title: 'Maintain', icon: <IoConstructOutline />, badge: '2' },
  { id: 'copilot', title: 'Copilot', icon: <IoSparklesOutline /> },
  { id: 'community', title: 'Community', icon: <IoPeopleOutline /> },
  { id: 'reports', title: 'Reports', icon: <IoDocumentTextOutline /> }
];

export const GradientMenu: React.FC<GradientMenuProps> = ({
  items = DEFAULT_ITEMS,
  activeId,
  onSelect,
  className = ''
}) => {
  return (
    <ul className={`flex items-center gap-2 select-none ${className}`}>
      {items.map((item, idx) => {
        const isActive = activeId ? activeId === item.id : item.active;

        return (
          <li
            key={item.id || idx}
            onClick={() => {
              if (item.onClick) item.onClick();
              else if (onSelect && item.id) onSelect(item.id);
            }}
            className={`
              relative h-[44px] rounded-full flex items-center justify-center
              transition-all duration-400 ease-out group cursor-pointer
              ${isActive ? 'w-[140px] bg-[#00f59b]/15 border border-[#00f59b]/40 text-[#00f59b]' : 'w-[44px] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-[#00f59b]/35 hover:w-[140px] text-slate-300 hover:text-white'}
            `}
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
            title={item.title}
          >
            {/* Subtle glow on hover or active */}
            <span
              className={`
                absolute inset-0 rounded-full blur-[10px] -z-10 transition-opacity duration-400
                ${isActive ? 'opacity-40 bg-[#00f59b]' : 'opacity-0 group-hover:opacity-25 bg-[#00f59b]'}
              `}
            />

            {/* Icon - centered at rest, hidden or scaled on hover */}
            <span
              className={`
                relative z-10 transition-all duration-300 flex items-center justify-center text-lg
                ${isActive ? 'hidden' : 'group-hover:scale-0 group-hover:opacity-0 delay-0'}
              `}
            >
              {item.icon}
            </span>

            {/* Title - revealed on hover, or permanently shown if active */}
            <span
              className={`
                uppercase tracking-widest text-[11px] font-semibold transition-all duration-300 whitespace-nowrap px-3
                ${isActive ? 'block text-[#00f59b]' : 'absolute scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 delay-100 text-white'}
              `}
            >
              {item.title}
            </span>

            {/* Badge if present */}
            {item.badge && !isActive && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f59e0b] text-[9px] font-bold text-black flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default GradientMenu;
