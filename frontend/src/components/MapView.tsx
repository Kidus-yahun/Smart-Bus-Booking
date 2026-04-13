import { useState } from 'react';
import { MapPin, Map, Navigation } from 'lucide-react';
import { Button } from './ui/button';

export function MapView() {
  const [mapMode, setMapMode] = useState<'simple' | 'satellite'>('simple');

  return (
    <div>
      {/* Map Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Nearby Stations</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={mapMode === 'simple' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMapMode('simple')}
            className="flex items-center gap-2 text-sm"
          >
            <Map className="w-4 h-4" />
            Simple Map
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-sm"
          >
            <Navigation className="w-4 h-4" />
            Center
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden" style={{ height: '250px', minHeight: '250px' }}>
        {/* Base map background with realistic road patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          {/* Road network SVG overlay */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
            {/* Main roads */}
            <path d="M20 50 L240 50" stroke="#888" strokeWidth="3" fill="none" />
            <path d="M20 100 L240 100" stroke="#888" strokeWidth="2" fill="none" />
            <path d="M20 150 L240 150" stroke="#888" strokeWidth="2" fill="none" />
            <path d="M20 200 L240 200" stroke="#888" strokeWidth="3" fill="none" />
            
            {/* Vertical roads */}
            <path d="M60 20 L60 240" stroke="#888" strokeWidth="2" fill="none" />
            <path d="M100 20 L100 240" stroke="#888" strokeWidth="3" fill="none" />
            <path d="M150 20 L150 240" stroke="#888" strokeWidth="2" fill="none" />
            <path d="M200 20 L200 240" stroke="#888" strokeWidth="2" fill="none" />
            
            {/* Diagonal roads */}
            <path d="M20 20 L120 120" stroke="#888" strokeWidth="1.5" fill="none" />
            <path d="M120 20 L220 120" stroke="#888" strokeWidth="1.5" fill="none" />
            
            {/* Ring road */}
            <circle cx="128" cy="128" r="60" stroke="#666" strokeWidth="2" fill="none" strokeDasharray="8 4" />
            
            {/* Building blocks/areas */}
            <rect x="30" y="30" width="25" height="15" fill="#ddd" opacity="0.6" />
            <rect x="70" y="60" width="20" height="25" fill="#ddd" opacity="0.6" />
            <rect x="160" y="40" width="30" height="20" fill="#ddd" opacity="0.6" />
            <rect x="180" y="120" width="25" height="15" fill="#ddd" opacity="0.6" />
            <rect x="40" y="170" width="20" height="20" fill="#ddd" opacity="0.6" />
            <rect x="120" y="180" width="35" height="20" fill="#ddd" opacity="0.6" />
            
            {/* Parks/green spaces */}
            <circle cx="80" cy="180" r="15" fill="#90EE90" opacity="0.5" />
            <circle cx="180" cy="80" r="12" fill="#90EE90" opacity="0.5" />
            
            {/* Water feature */}
            <path d="M200 160 Q220 170 200 180 Q180 190 200 200" fill="#87CEEB" opacity="0.4" />
          </svg>
        </div>

        {/* Location Text */}
        <div className="absolute top-3 left-3 text-sm text-muted-foreground">
          📍 Addis Ababa - Drag to explore
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 bg-white/90 hover:bg-white shadow-sm"
          >
            <span className="text-xs font-medium">+</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 bg-white/90 hover:bg-white shadow-sm"
          >
            <span className="text-xs font-medium">−</span>
          </Button>
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 rounded text-xs">
          Zoom: 12
        </div>

        {/* Current Location Pin - Blue dot in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg">
              <div className="absolute inset-1 bg-white rounded-full"></div>
            </div>
            <div className="absolute inset-0 w-4 h-4 bg-blue-500/30 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Bus Station Markers - Red pins */}
        <div className="absolute" style={{ top: '25%', left: '30%' }}>
          <MapPin className="w-6 h-6 text-red-500 drop-shadow-lg" />
        </div>
        <div className="absolute" style={{ top: '60%', left: '70%' }}>
          <MapPin className="w-6 h-6 text-red-500 drop-shadow-lg" />
        </div>
        <div className="absolute" style={{ top: '75%', left: '25%' }}>
          <MapPin className="w-6 h-6 text-red-500 drop-shadow-lg" />
        </div>
        <div className="absolute" style={{ top: '35%', left: '75%' }}>
          <MapPin className="w-6 h-6 text-red-500 drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}