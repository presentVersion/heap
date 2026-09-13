import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  onClose?: () => void;
}

export const SolarpunkWelcomeModal: React.FC<Props> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: '/images/solar/solarpunk-biocanopy.jpg',
      title: 'Solarpunk Bio-Canopy Towers',
      subtitle: 'Hexagonal photovoltaic tree canopies generating clean solar power while nurturing vertical hydroponics.',
      tag: 'BIOPHILIC CLEAN ENERGY'
    },
    {
      image: '/images/solar/solarpunk-algae.jpg',
      title: 'Biophilic Micro-Algae Facades',
      subtitle: 'Helical photobioreactors capturing carbon emissions and producing clean biomass alongside solar glass.',
      tag: 'BIO-SOLAR ARCHITECTURE'
    },
    {
      image: '/images/solar/solarpunk-plaza.jpg',
      title: 'Solar Flower Smart Plazas',
      subtitle: 'Astronomical dual-axis solar flowers following the sun to generate clean community power.',
      tag: 'CIVIC CO-CREATION'
    }
  ];

  // Check if first time loading website
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = sessionStorage.getItem('solterra_welcome_seen');
      if (!hasSeenWelcome) {
        setIsOpen(true);
      }
    }
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isOpen, slides.length]);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('solterra_welcome_seen', 'true');
    }
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  if (!isOpen) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div 
        className="w-full max-w-4xl border border-emerald-500/40 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(0,245,155,0.2)] flex flex-col md:flex-row relative"
        style={{
          background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.98) 0%, rgba(2, 12, 7, 1) 100%)'
        }}
      >
        {/* Close / Cancel Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/70 hover:bg-emerald-500/30 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          title="Cancel to see City Twin"
          aria-label="Close welcome modal"
        >
          <X size={20} />
        </button>

        {/* Left Side: Solarpunk Image Carousel */}
        <div className="w-full md:w-1/2 relative min-h-[280px] md:min-h-[480px] overflow-hidden bg-black flex items-center justify-center">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover transition-all duration-500 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020c07] via-transparent to-black/30" />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/80 hover:bg-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/80 hover:bg-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all h-2 cursor-pointer ${
                  idx === currentIndex 
                    ? 'w-8 bg-[#00f59b]' 
                    : 'w-3 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Image Tag */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider uppercase bg-[#00f59b] text-slate-950 shadow-lg">
              {currentSlide.tag}
            </span>
          </div>
        </div>

        {/* Right Side: Website Information */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#00f59b] animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00f59b]">
                WELCOME TO SOLTERRA TWIN
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white leading-tight">
              {currentSlide.title}
            </h2>

            <p className="text-base sm:text-lg text-emerald-200 font-semibold leading-relaxed">
              {currentSlide.subtitle}
            </p>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="text-sm text-slate-200 font-medium leading-relaxed">
                SolTerra is an interactive digital twin replicating Kurnool's clean energy grid, combining 3D spatial simulation, predictive solar farm maintenance, and solarpunk civic co-creation.
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-sm font-mono text-emerald-300 font-bold">
                <div className="p-3 bg-white/5 border border-white/10 flex items-center gap-2">
                  <Zap size={16} className="text-[#00f59b]" />
                  <span>3D Digital Twin</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#00f59b]" />
                  <span>Solar Diagnostics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
            <button
              onClick={handleClose}
              className="text-sm font-bold text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              Skip Welcome
            </button>

            <button
              onClick={handleClose}
              className="px-7 py-4 bg-[#00f59b] hover:bg-[#00f59b]/90 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <span>Explore City Twin</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarpunkWelcomeModal;
