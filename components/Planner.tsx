
import React, { useState } from 'react';
import { RelapseManual } from '../types';
import { updateDoc, doc, db } from '../services/firebase';
import { Calendar, Save, RefreshCw } from 'lucide-react';

interface PlannerProps {
  manual: RelapseManual;
  manualId: string;
  userId: string;
}

const DAYS = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'];
const AREAS = [
  { id: 'Física', label: 'Física', color: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: '🏃' },
  { id: 'Emocional', label: 'Emocional', color: 'bg-purple-50 border-purple-200 text-purple-800', icon: '🧘' },
  { id: 'Social', label: 'Social', color: 'bg-blue-50 border-blue-200 text-blue-800', icon: '👥' },
  { id: 'De sentit', label: 'De sentit', color: 'bg-amber-50 border-amber-200 text-amber-800', icon: '⭐' }
];

const Planner: React.FC<PlannerProps> = ({ manual, manualId, userId }) => {
  const [localPlan, setLocalPlan] = useState<Record<string, string>>(manual.selfCarePlan || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleCellChange = (day: string, area: string, value: string) => {
    setLocalPlan(prev => ({
      ...prev,
      [`${area}-${day}`]: value
    }));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    const manualRef = doc(db, `users/${userId}/manuals`, manualId);
    await updateDoc(manualRef, { selfCarePlan: localPlan });
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-orange-500" /> 
            Planificador Setmanal
          </h2>
          <p className="text-slate-500 mt-1">
            Estructura el teu temps. El buit és l'enemic de la recuperació.
          </p>
        </div>
        <button 
          onClick={saveChanges}
          disabled={isSaving}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all transform active:scale-95 disabled:opacity-70"
        >
          {isSaving ? <RefreshCw className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5"/>}
          {isSaving ? 'Guardant...' : 'Guardar Canvis'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-left font-bold text-slate-400 uppercase text-xs w-32 sticky left-0 bg-slate-50 z-10">Àrea</th>
                {DAYS.map(day => (
                  <th key={day} className="p-4 text-center font-bold text-slate-700 min-w-[160px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {AREAS.map(area => (
                <tr key={area.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${area.color}`}>
                      <span>{area.icon}</span> {area.label}
                    </div>
                  </td>
                  {DAYS.map(day => {
                    const key = `${area.id}-${day}`;
                    return (
                      <td key={day} className="p-2 border-r border-slate-50 last:border-0 align-top">
                        <textarea
                          value={localPlan[key] || ''}
                          onChange={(e) => handleCellChange(day, area.id, e.target.value)}
                          placeholder="Activitat..."
                          className="w-full h-24 p-3 text-sm bg-transparent border-2 border-transparent hover:border-slate-200 focus:border-orange-400 focus:bg-white rounded-lg resize-none transition-all outline-none"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y divide-slate-200">
          {DAYS.map(day => (
            <div key={day} className="p-4 bg-white">
              <h3 className="font-bold text-lg text-slate-800 mb-3 sticky top-0 bg-white py-2 z-10 border-b border-slate-100">
                {day}
              </h3>
              <div className="space-y-3">
                {AREAS.map(area => {
                  const key = `${area.id}-${day}`;
                  return (
                    <div key={key}>
                      <label className={`text-xs font-bold px-2 py-1 rounded mb-1 inline-block ${area.color}`}>
                        {area.icon} {area.label}
                      </label>
                      <textarea
                        value={localPlan[key] || ''}
                        onChange={(e) => handleCellChange(day, area.id, e.target.value)}
                        className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm min-h-[80px]"
                        placeholder={`Què faràs el ${day}?`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planner;
