
import React, { useState, useEffect } from 'react';
import { RelapseManual, DiaryEntry } from '../types';
import { updateDoc, doc, db, collection, query, orderBy, onSnapshot } from '../services/firebase';
import { Calendar, Save, RefreshCw, ChevronLeft, ChevronRight, Layout, Maximize, BookOpen, PenTool } from 'lucide-react';

interface PlannerProps {
  manual: RelapseManual;
  manualId: string;
  userId: string;
  onNavigateToDiary: (activityLink: { date: string; area: string; text: string }) => void;
}

const DAYS = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'];
const AREAS = [
  { id: 'Física', label: 'Física', color: 'bg-emerald-50 border-emerald-200 text-emerald-800', ring: 'focus:ring-emerald-500', icon: '🏃' },
  { id: 'Emocional', label: 'Emocional', color: 'bg-purple-50 border-purple-200 text-purple-800', ring: 'focus:ring-purple-500', icon: '🧘' },
  { id: 'Social', label: 'Social', color: 'bg-blue-50 border-blue-200 text-blue-800', ring: 'focus:ring-blue-500', icon: '👥' },
  { id: 'De sentit', label: 'De sentit', color: 'bg-amber-50 border-amber-200 text-amber-800', ring: 'focus:ring-amber-500', icon: '⭐' }
];

const Planner: React.FC<PlannerProps> = ({ manual, manualId, userId, onNavigateToDiary }) => {
  const [localPlan, setLocalPlan] = useState<Record<string, string>>(manual.selfCarePlan || {});
  const [isSaving, setIsSaving] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  
  // Date & View State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('day');

  // Sync local state with manual prop when it changes (e.g. background updates)
  useEffect(() => {
    setLocalPlan(manual.selfCarePlan || {});
  }, [manual]);

  // Load Diary Entries to check for links
  useEffect(() => {
    const q = query(collection(db, `users/${userId}/diaryEntries`), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
       const entries = snap.docs.map(d => ({ id: d.id, ...d.data() } as DiaryEntry));
       setDiaryEntries(entries);
    });
    return unsub;
  }, [userId]);

  const getDayName = (date: Date) => {
    const jsDay = date.getDay(); 
    const mappedIndex = jsDay === 0 ? 6 : jsDay - 1; 
    return DAYS[mappedIndex];
  };

  const getFormattedDate = (date: Date) => date.toISOString().split('T')[0];

  // Helper to get dates for the current week view
  const getWeekDates = (baseDate: Date) => {
    const currentDay = baseDate.getDay(); // 0 (Sun) to 6 (Sat)
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Calculate diff to Monday
    const mondayDate = new Date(baseDate);
    mondayDate.setDate(baseDate.getDate() + mondayOffset);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + i);
      return {
        dateObj: d,
        dateStr: getFormattedDate(d),
        dayName: DAYS[i]
      };
    });
  };

  const handleCellChange = (dateKey: string, area: string, value: string) => {
    setLocalPlan(prev => ({
      ...prev,
      [`${area}-${dateKey}`]: value
    }));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    const manualRef = doc(db, `users/${userId}/manuals`, manualId);
    await updateDoc(manualRef, { selfCarePlan: localPlan });
    setTimeout(() => setIsSaving(false), 1000);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(new Date(e.target.value));
    }
  };

  const currentDayName = getDayName(selectedDate);
  const currentDateStr = getFormattedDate(selectedDate);
  const weekDates = getWeekDates(selectedDate);

  const getLinkedEntry = (dateStr: string, areaId: string) => {
    return diaryEntries.find(e => 
      e.linkedActivity?.date === dateStr && 
      e.linkedActivity?.area === areaId
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-orange-500" /> 
            Planificador
          </h2>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Estructura el teu temps. El buit és l'enemic de la recuperació.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          {/* View Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto">
            <button 
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'day' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Maximize className="w-4 h-4" /> Dia
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'week' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Layout className="w-4 h-4" /> Setmana
            </button>
          </div>

          {/* Date Controls */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-xl">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <input 
              type="date" 
              value={currentDateStr}
              onChange={handleDateInput}
              className="bg-transparent border-none text-slate-800 font-bold text-sm focus:ring-0 cursor-pointer"
            />
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={saveChanges}
            disabled={isSaving}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all transform active:scale-95 disabled:opacity-70 ml-auto xl:ml-0"
          >
            {isSaving ? <RefreshCw className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5"/>}
            {isSaving ? '...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* VIEW: DAY MODE */}
      {viewMode === 'day' && (
        <div className="animate-fadeIn">
          <div className="flex items-baseline gap-3 mb-6">
            <h3 className="text-2xl font-bold text-slate-800 capitalize">{currentDayName}</h3>
            <span className="text-slate-400 font-medium">
              {selectedDate.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AREAS.map(area => {
              const key = `${area.id}-${currentDateStr}`; // Specific Date Key
              const linkedEntry = getLinkedEntry(currentDateStr, area.id);
              const activityText = localPlan[key] || '';

              return (
                <div key={area.id} className={`p-6 rounded-3xl border-2 transition-all hover:shadow-md ${area.color.replace('text-', 'border-').replace('800', '100')} bg-white relative group`}>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm ${area.color} bg-white`}>
                        {area.icon}
                      </div>
                      <h4 className={`font-bold text-lg ${area.color.split(' ')[2]}`}>{area.label}</h4>
                    </div>
                    
                    {activityText && (
                      <button 
                        onClick={() => onNavigateToDiary({ 
                          date: currentDateStr, 
                          area: area.id, 
                          text: activityText 
                        })}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          linkedEntry 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-white border border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-200'
                        }`}
                        title={linkedEntry ? "Veure reflexió" : "Escriure reflexió al diari"}
                      >
                        {linkedEntry ? <BookOpen className="w-3 h-3"/> : <PenTool className="w-3 h-3"/>}
                        {linkedEntry ? 'Reflexió Feta' : 'Reflexionar'}
                      </button>
                    )}
                  </div>

                  <textarea
                    value={activityText}
                    onChange={(e) => handleCellChange(currentDateStr, area.id, e.target.value)}
                    placeholder={`Activitat per ${currentDayName} (${area.label})...`}
                    className={`w-full h-32 p-4 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 outline-none resize-none transition-all text-slate-700 placeholder:text-slate-400 ${area.ring}`}
                  />
                  
                  {linkedEntry && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100 text-xs text-green-800 italic">
                      " {linkedEntry.text.substring(0, 60)}... "
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: WEEK MODE (TABLE) */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-left font-bold text-slate-400 uppercase text-xs w-32 sticky left-0 bg-slate-50 z-10">Àrea</th>
                  {weekDates.map(d => (
                    <th key={d.dateStr} className={`p-4 text-center min-w-[160px] ${d.dateStr === currentDateStr ? 'bg-orange-50' : ''}`}>
                      <div className={`font-bold ${d.dateStr === currentDateStr ? 'text-orange-600' : 'text-slate-700'}`}>{d.dayName}</div>
                      <div className="text-xs text-slate-400 font-normal">{new Date(d.dateObj).getDate()}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {AREAS.map(area => (
                  <tr key={area.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${area.color}`}>
                        <span>{area.icon}</span> {area.label}
                      </div>
                    </td>
                    {weekDates.map(d => {
                      const key = `${area.id}-${d.dateStr}`;
                      const isSelected = d.dateStr === currentDateStr;
                      return (
                        <td key={d.dateStr} className={`p-2 border-r border-slate-50 last:border-0 align-top ${isSelected ? 'bg-orange-50/30' : ''}`}>
                          <textarea
                            value={localPlan[key] || ''}
                            onChange={(e) => handleCellChange(d.dateStr, area.id, e.target.value)}
                            placeholder="..."
                            className={`w-full h-24 p-3 text-sm bg-transparent border-2 border-transparent hover:border-slate-200 focus:bg-white rounded-lg resize-none transition-all outline-none ${isSelected ? 'focus:border-orange-400' : 'focus:border-slate-300'}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
