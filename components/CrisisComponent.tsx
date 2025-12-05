
import React, { useState, useEffect, useRef } from 'react';
import { CrisisPlan } from '../types';

interface CrisisComponentProps {
  plan: CrisisPlan;
  onUpdate: (newPlan: CrisisPlan) => void;
}

const CrisisComponent: React.FC<CrisisComponentProps> = ({ plan, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPlan, setTempPlan] = useState(plan);
  const [isSaving, setIsSaving] = useState(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Autosave logic
  useEffect(() => {
    if (isEditing) {
      autosaveTimerRef.current = setInterval(() => {
        setIsSaving(true);
        onUpdate(tempPlan);
        setTimeout(() => setIsSaving(false), 1000); // Show "Saving..." for 1s
      }, 30000); // Autosave every 30 seconds
    } else {
        // Clear interval when not editing
        if (autosaveTimerRef.current) {
            clearInterval(autosaveTimerRef.current);
            autosaveTimerRef.current = null;
        }
    }

    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
    };
  }, [isEditing, tempPlan, onUpdate]);


  const handleSave = () => {
    onUpdate(tempPlan);
    setIsEditing(false);
  };

  const handleChange = (field: keyof CrisisPlan, value: string) => {
    setTempPlan({ ...tempPlan, [field]: value });
  };

  return (
    <div className="w-full">
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        {/* Header Visual */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              <span className="text-2xl">🛡️</span>
            </div>
            <h2 className="text-2xl font-bold text-emerald-900">Pla d'Acció Urgent</h2>
          </div>
          <div className="flex items-center gap-3">
             {isSaving && <span className="text-xs text-emerald-600 font-medium animate-pulse">Guardant...</span>}
             <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-emerald-700 hover:text-emerald-900 text-sm font-bold underline"
              >
                {isEditing ? 'Cancel·lar' : 'Editar Targeta'}
              </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 animate-fadeIn relative z-10">
            <div>
              <label className="block text-sm font-bold text-emerald-800 mb-1">1. Reconeixement (Quan noti...)</label>
              <input 
                type="text" 
                value={tempPlan.signal} 
                onChange={(e) => handleChange('signal', e.target.value)}
                className="w-full p-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Ex: Tensió a l'estómac, pensaments repetitius..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-emerald-800 mb-1">2. Acció Immediata (Faré...)</label>
              <input 
                type="text" 
                value={tempPlan.action} 
                onChange={(e) => handleChange('action', e.target.value)}
                className="w-full p-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Ex: Sortir a caminar 15 minuts, respirar..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-emerald-800 mb-1">3. Contacte Clau (Trucaré a...)</label>
              <input 
                type="text" 
                value={tempPlan.contact} 
                onChange={(e) => handleChange('contact', e.target.value)}
                className="w-full p-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Ex: La meva parella, el terapeuta..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-emerald-800 mb-1">4. Recordatori de Valor (M'acosta a...)</label>
              <input 
                type="text" 
                value={tempPlan.reminder} 
                onChange={(e) => handleChange('reminder', e.target.value)}
                className="w-full p-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Ex: La meva llibertat, la meva família..."
              />
            </div>
            <button 
              onClick={handleSave}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md mt-2"
            >
              Guardar Canvis
            </button>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            {/* Targeta Visualització */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-100 shadow-sm">
              <span className="block text-xs uppercase tracking-wider text-emerald-600 font-bold mb-1">SI NOTO...</span>
              <p className="text-lg font-medium text-slate-800">{plan.signal || "Encara no definit"}</p>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-100 shadow-sm flex-1">
                <span className="block text-xs uppercase tracking-wider text-emerald-600 font-bold mb-1">ACCIÓ</span>
                <p className="text-lg font-medium text-slate-800">{plan.action || "Encara no definit"}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-100 shadow-sm flex-1">
                <span className="block text-xs uppercase tracking-wider text-emerald-600 font-bold mb-1">CONTACTE</span>
                <p className="text-lg font-medium text-slate-800">{plan.contact || "Encara no definit"}</p>
              </div>
            </div>

            <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-center">
              <span className="block text-xs opacity-80 uppercase tracking-wider font-bold mb-1">AIXÒ M'ACOSTA A</span>
              <p className="text-xl font-bold">"{plan.reminder || "La meva recuperació"}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrisisComponent;
