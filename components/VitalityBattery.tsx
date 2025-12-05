
import React from 'react';

interface VitalityBatteryProps {
  percentage: number;
  onRecharge: () => void;
  draining: boolean;
}

const VitalityBattery: React.FC<VitalityBatteryProps> = ({ percentage, onRecharge, draining }) => {
  // Determine color based on percentage (Teal for high, Coral for low)
  const getColor = () => {
    if (percentage > 60) return 'text-[#00897B] stroke-[#00897B]'; // Teal
    if (percentage > 30) return 'text-yellow-600 stroke-yellow-600';
    return 'text-[#FF7043] stroke-[#FF7043]'; // Coral
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-slate-800 mb-6 font-sans">Bateria de Vitalitat</h3>
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Ring Background */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="16"
            fill="none"
          />
          {/* Progress Ring */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            className={`transition-all duration-1000 ease-out ${getColor()}`}
            strokeWidth="16"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Content */}
        <div className="flex flex-col items-center z-10">
          <span className={`text-6xl font-bold font-sans tracking-tighter ${getColor().replace('stroke', 'text').split(' ')[0]}`}>
            {Math.round(percentage)}%
          </span>
          <span className="text-slate-400 text-sm mt-1 uppercase tracking-wide font-medium">
            {draining ? 'Drenant...' : 'Estable'}
          </span>
        </div>

        {/* Pulse effect if draining */}
        {draining && (
          <div className="absolute inset-0 rounded-full border-4 border-red-100 animate-ping opacity-20 pointer-events-none"></div>
        )}
      </div>

      <p className="text-center text-slate-500 mt-4 mb-6 max-w-xs text-lg leading-relaxed">
        {percentage < 30 
          ? "Nivells crítics. Desconnecta per recarregar." 
          : "Sistema estable. Mantingues l'equilibri offline."}
      </p>

      <button
        onClick={onRecharge}
        className="w-full max-w-xs bg-[#00897B] hover:bg-[#00796B] text-white font-bold py-4 px-8 rounded-xl transition-all transform active:scale-95 text-lg shadow-lg shadow-teal-100 flex items-center justify-center gap-2"
        style={{ minHeight: '56px' }}
      >
        <span>⚡</span> Registrar Activitat Offline
      </button>
    </div>
  );
};

export default VitalityBattery;
