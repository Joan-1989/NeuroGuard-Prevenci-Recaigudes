
import React, { useState } from 'react';
import { RelapseManual, Trigger, TrapThought, SupportPerson, MotivationItem } from '../types';
import { updateDoc, doc, db, arrayUnion, arrayRemove } from '../services/firebase';
import { Compass, AlertTriangle, Shield, TrendingUp, Book, Trash2, Plus } from 'lucide-react';

interface ManualDashboardProps {
  manual: RelapseManual;
  manualId: string;
  userId: string;
}

const ALL_VALUES = ['Honestedat', 'Connexió', 'Respecte', 'Creativitat', 'Aprenentatge', 'Salut', 'Seguretat', 'Aventura', 'Compassió', 'Llibertat', 'Família', 'Amistat', 'Creixement', 'Pau interior', 'Diversió'];

// --- SUB-COMPONENTS ---

const MotivationsSection = ({ manual, manualRef }: { manual: RelapseManual, manualRef: any }) => {
  const [input, setInput] = useState('');

  const addMotivation = async (text: string) => {
    if(!text.trim()) return;
    const newItem: MotivationItem = { id: Date.now(), text };
    await updateDoc(manualRef, { motivations: arrayUnion(newItem) });
  };

  const removeMotivation = async (item: MotivationItem) => {
    await updateDoc(manualRef, { motivations: arrayRemove(item) });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
       <h3 className="text-xl font-bold text-slate-800">El meu punt de partida: Motivacions</h3>
       <p className="text-slate-500">Per què vull canviar? Quina vida vull viure?</p>
       <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border p-3 rounded-xl" placeholder="Escriu una motivació..." />
          <button onClick={() => { addMotivation(input); setInput(''); }} className="bg-orange-600 text-white px-6 rounded-xl font-bold">Afegir</button>
       </div>
       <div className="space-y-2">
          {manual.motivations?.map(m => (
            <div key={m.id} className="bg-white p-3 border rounded-xl flex justify-between items-center shadow-sm">
              <span>{m.text}</span>
              <button onClick={() => removeMotivation(m)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
            </div>
          ))}
       </div>
    </div>
  );
};

const ValuesSection = ({ manual, manualRef }: { manual: RelapseManual, manualRef: any }) => {
  const toggleValue = async (val: string) => {
    let current = [...(manual.values?.selected || [])];
    if (current.includes(val)) {
      current = current.filter(v => v !== val);
    } else {
      if (current.length >= 7) return alert("Màxim 7 valors.");
      current.push(val);
    }
    await updateDoc(manualRef, { 'values.selected': current });
  };

  const updateValueDetail = async (val: string, field: string, value: any) => {
    await updateDoc(manualRef, { [`values.details.${val}.${field}`]: value });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-slate-800">Els meus Valors (La Brúixola)</h3>
      <div className="flex flex-wrap gap-2">
        {ALL_VALUES.map(v => (
          <button 
            key={v} 
            onClick={() => toggleValue(v)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${manual.values?.selected?.includes(v) ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            {v}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {manual.values?.selected?.map(v => {
          const detail = manual.values.details?.[v] || { definition: '', importance: 5, alignment: 5 };
          return (
            <div key={v} className="bg-white p-4 border rounded-xl shadow-sm">
              <h4 className="font-bold text-orange-700 text-lg mb-2">{v}</h4>
              <textarea 
                placeholder="Què significa per a tu?" 
                className="w-full border p-2 rounded-lg text-sm mb-3"
                value={detail.definition}
                onChange={(e) => updateValueDetail(v, 'definition', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-slate-500">Importància: {detail.importance}</label>
                   <input type="range" min="0" max="10" className="w-full accent-orange-500" value={detail.importance} onChange={e => updateValueDetail(v, 'importance', parseInt(e.target.value))} />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500">Alineació: {detail.alignment}</label>
                   <input type="range" min="0" max="10" className="w-full accent-orange-500" value={detail.alignment} onChange={e => updateValueDetail(v, 'alignment', parseInt(e.target.value))} />
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PatternsSection = ({ manual, manualRef }: { manual: RelapseManual, manualRef: any }) => {
  const [triggerInput, setTriggerInput] = useState('');
  const [triggerType, setTriggerType] = useState('external');
  const [trapInput, setTrapInput] = useState('');

  const addTrigger = async (desc: string, type: string) => {
    const t: Trigger = { id: Date.now(), external: type === 'external' ? desc : '', internal: type === 'internal' ? desc : '', physical: type === 'physical' ? desc : '' };
    await updateDoc(manualRef, { triggers: arrayUnion(t) });
  };

  const addTrap = async (text: string) => {
    const t: TrapThought = { id: Date.now(), thought: text, reframe: '' };
    await updateDoc(manualRef, { trapThoughts: arrayUnion(t) });
  };

  const updateTrapReframe = async (trap: TrapThought, reframe: string) => {
    const newTraps = manual.trapThoughts.map(t => t.id === trap.id ? { ...t, reframe } : t);
    await updateDoc(manualRef, { trapThoughts: newTraps });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Triggers */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle className="text-red-500"/> Senyals d'Alerta</h3>
        <div className="flex gap-2 mb-4">
           <select value={triggerType} onChange={e => setTriggerType(e.target.value)} className="border p-3 rounded-xl bg-white">
              <option value="external">Extern</option>
              <option value="internal">Intern</option>
              <option value="physical">Físic</option>
           </select>
           <input value={triggerInput} onChange={e => setTriggerInput(e.target.value)} className="flex-1 border p-3 rounded-xl" placeholder="Descripció..." />
           <button onClick={() => { addTrigger(triggerInput, triggerType); setTriggerInput(''); }} className="bg-red-500 text-white px-4 rounded-xl font-bold">+</button>
        </div>
        <div className="grid gap-2">
          {manual.triggers?.map(t => (
            <div key={t.id} className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm flex justify-between">
              <span>
                <strong className="text-red-800 uppercase text-xs mr-2">{t.external ? 'EXT' : t.internal ? 'INT' : 'FIS'}</strong> 
                {t.external || t.internal || t.physical}
              </span>
              <button onClick={() => updateDoc(manualRef, { triggers: arrayRemove(t) })} className="text-red-300 hover:text-red-600">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Trap Thoughts */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp className="text-amber-500"/> Pensaments Trampa</h3>
        <div className="flex gap-2 mb-4">
           <input value={trapInput} onChange={e => setTrapInput(e.target.value)} className="flex-1 border p-3 rounded-xl" placeholder="Pensament: 'Per un no passa res...'" />
           <button onClick={() => { addTrap(trapInput); setTrapInput(''); }} className="bg-amber-500 text-white px-4 rounded-xl font-bold">+</button>
        </div>
        <div className="space-y-4">
           {manual.trapThoughts?.map(t => (
             <div key={t.id} className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="flex justify-between mb-2">
                  <p className="font-bold text-amber-900 italic">"{t.thought}"</p>
                  <button onClick={() => updateDoc(manualRef, { trapThoughts: arrayRemove(t) })} className="text-amber-400 hover:text-amber-700">×</button>
                </div>
                <textarea 
                  placeholder="Resposta racional/alternativa..." 
                  className="w-full p-2 rounded border border-amber-200 text-sm"
                  value={t.reframe}
                  onChange={(e) => updateTrapReframe(t, e.target.value)}
                />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const SupportSection = ({ manual, manualRef }: { manual: RelapseManual, manualRef: any }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('');

  const addSupport = async () => {
     if(!name) return;
     const p: SupportPerson = { id: Date.now(), name, contact, role };
     await updateDoc(manualRef, { supportNetwork: arrayUnion(p) });
     setName(''); setContact(''); setRole('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Support Network */}
      <div>
         <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield className="text-green-600"/> Xarxa de Suport</h3>
         <div className="grid md:grid-cols-3 gap-2 mb-4">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom" className="border p-2 rounded-lg" />
            <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Contacte" className="border p-2 rounded-lg" />
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="Rol (ex: escolta)" className="border p-2 rounded-lg" />
         </div>
         <button onClick={addSupport} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold mb-4">Afegir Persona</button>
         
         <div className="grid md:grid-cols-2 gap-4">
           {manual.supportNetwork?.map(p => (
             <div key={p.id} className="p-4 border border-green-200 bg-green-50 rounded-xl relative">
                <h4 className="font-bold text-green-800">{p.name}</h4>
                <p className="text-sm text-green-700">{p.contact}</p>
                <span className="text-xs bg-white px-2 py-1 rounded border border-green-100 mt-2 inline-block text-green-600">{p.role}</span>
                <button onClick={() => updateDoc(manualRef, { supportNetwork: arrayRemove(p) })} className="absolute top-2 right-2 text-green-300 hover:text-green-700">×</button>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

const ManualDashboard: React.FC<ManualDashboardProps> = ({ manual, manualId, userId }) => {
  const [activeSection, setActiveSection] = useState('motivations');
  const manualRef = doc(db, `users/${userId}/manuals`, manualId);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
       {/* Sidebar Navigation */}
       <div className="md:w-64 bg-slate-50 border-r border-slate-100 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
          <button onClick={() => setActiveSection('motivations')} className={`p-4 text-left font-bold text-sm ${activeSection === 'motivations' ? 'bg-white text-orange-600 border-l-4 border-orange-600' : 'text-slate-500'}`}>1. PUNT DE PARTIDA</button>
          <button onClick={() => setActiveSection('values')} className={`p-4 text-left font-bold text-sm ${activeSection === 'values' ? 'bg-white text-orange-600 border-l-4 border-orange-600' : 'text-slate-500'}`}>2. VALORS</button>
          <button onClick={() => setActiveSection('patterns')} className={`p-4 text-left font-bold text-sm ${activeSection === 'patterns' ? 'bg-white text-orange-600 border-l-4 border-orange-600' : 'text-slate-500'}`}>3. PATRONS</button>
          <button onClick={() => setActiveSection('support')} className={`p-4 text-left font-bold text-sm ${activeSection === 'support' ? 'bg-white text-orange-600 border-l-4 border-orange-600' : 'text-slate-500'}`}>4. SUPORT</button>
       </div>

       {/* Content Area */}
       <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeSection === 'motivations' && <MotivationsSection manual={manual} manualRef={manualRef} />}
          {activeSection === 'values' && <ValuesSection manual={manual} manualRef={manualRef} />}
          {activeSection === 'patterns' && <PatternsSection manual={manual} manualRef={manualRef} />}
          {activeSection === 'support' && <SupportSection manual={manual} manualRef={manualRef} />}
       </div>
    </div>
  );
};

export default ManualDashboard;
