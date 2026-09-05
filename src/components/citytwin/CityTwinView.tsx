import React from 'react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { CityTwinMap }           from './CityTwinMap';
import { AssetInspector }        from './AssetInspector';
import { TimeSimulationBar }     from './TimeSimulationBar';
import { DigitalTwinLayersCard } from './DigitalTwinLayersCard';
import { EnergyFlowWidget }      from './EnergyFlowWidget';
import { EnergyMixDonut }        from './EnergyMixDonut';
import { CityScoreWidget }       from './CityScoreWidget';
import { AiInsightWidget }       from './AiInsightWidget';
import { OverviewStatsBar }      from '../overview/OverviewStatsBar';

export const CityTwinView: React.FC = () => {
  const { selectedAsset } = useSolTerraStore();

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ gap: 0 }}>

      {/* ── KPI Stats Bar ───────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 pt-4 pb-2">
        <OverviewStatsBar />
      </div>

      {/* ── Main content: Map + optional inspector ─────────────────────── */}
      <div className="flex flex-1 min-h-0 px-5 pb-3 gap-3 overflow-hidden">

        {/* Left panel: Layer controls */}
        <div className="hidden lg:flex flex-col w-52 flex-shrink-0 gap-3">
          <DigitalTwinLayersCard />
        </div>

        {/* Centre: Map */}
        <div className="flex-1 flex flex-col min-w-0 gap-3 overflow-hidden">
          <div className="flex-1 min-h-0 rounded-2xl overflow-hidden" style={{ minHeight: 360 }}>
            <CityTwinMap />
          </div>

          {/* Time scrubber */}
          <div className="flex-shrink-0">
            <TimeSimulationBar />
          </div>
        </div>

        {/* Right panel: Asset inspector (when selected) */}
        {selectedAsset && (
          <div className="w-80 flex-shrink-0 overflow-y-auto slide-in">
            <AssetInspector />
          </div>
        )}
      </div>

      {/* ── Bottom widgets row ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 pb-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <EnergyFlowWidget />
        <EnergyMixDonut />
        <CityScoreWidget />
        <AiInsightWidget />
      </div>
    </div>
  );
};
