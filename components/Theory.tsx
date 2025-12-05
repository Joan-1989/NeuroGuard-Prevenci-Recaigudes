
import React, { useState } from 'react';
import { BookOpen, AlertTriangle, GitMerge, Compass, Smartphone, ShoppingBag, Heart } from 'lucide-react';

const Theory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('intro');

  const renderContent = () => {
    switch(activeTab) {
      case 'intro':
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800">Introducció: cap a una recuperació conscient</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Aquest espai interactiu està dissenyat per entendre el "perquè" darrere de les addiccions comportamentals i la prevenció de recaigudes. 
              Comprendre els mecanismes que ens afecten és el primer pas per poder canviar-los.
            </p>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="py-1"><BookOpen className="w-6 h-6 mr-3 text-orange-500" /></div>
                <div>
                  <p className="font-bold text-orange-800">La recaiguda com a aprenentatge</p>
                  <p className="text-orange-700 text-sm mt-1">
                    En lloc de veure una caiguda com un fracàs, la presentem com una oportunitat per aprendre. 
                    Cada dificultat ens dona informació valuosa per enfortir el nostre camí de recuperació.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'definitions':
        return (
          <div className="space-y-6 animate-fadeIn">
             <h2 className="text-2xl font-bold text-slate-800">Què són les addiccions socials i comportamentals?</h2>
             <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Pèrdua de control", desc: "Incapacitat progressiva per controlar l'inici o freqüència.", icon: AlertTriangle },
                  { title: "Persistència", desc: "Continuar malgrat les conseqüències negatives.", icon: GitMerge },
                  { title: "Tolerància", desc: "Necessitat d'augmentar la 'dosi' o el temps.", icon: Compass },
                  { title: "Abstinència", desc: "Malestar físic i emocional en aturar la conducta.", icon: Heart }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold flex items-center gap-2 text-slate-800">
                      <item.icon className="w-5 h-5 text-orange-500"/> {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
                  </div>
                ))}
             </div>
             <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                 <p className="font-medium text-blue-800">
                   La pregunta clau no és "per què no puc parar?", sinó "què m'aporta aquesta conducta que no estic aconseguint d'una altra manera?".
                 </p>
             </div>
          </div>
        );
      case 'marlatt':
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800">El model de Marlatt</h2>
            <p className="text-slate-600">La recaiguda és un procés, no un esdeveniment aïllat.</p>
            
            <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
              <div className="w-full bg-red-100 border-2 border-red-300 p-4 rounded-xl text-center">
                <span className="font-bold text-red-800">Situació d'Alt Risc</span>
                <p className="text-xs text-red-600">Estrès, conflicte, pressió social...</p>
              </div>
              <div className="h-8 w-0.5 bg-slate-300"></div>
              
              <div className="grid grid-cols-2 gap-8 w-full">
                 <div className="flex flex-col gap-2">
                    <div className="bg-green-100 p-3 rounded-lg text-center border border-green-300">
                      <span className="font-bold text-green-800 text-sm">Resposta Eficaç</span>
                    </div>
                    <div className="text-center text-xs">⬇️ Autoeficàcia ⬆️</div>
                    <div className="bg-white border-2 border-green-500 p-2 rounded text-center font-bold text-green-600 text-sm">No Recaiguda</div>
                 </div>
                 
                 <div className="flex flex-col gap-2">
                    <div className="bg-red-100 p-3 rounded-lg text-center border border-red-300">
                      <span className="font-bold text-red-800 text-sm">Resposta Ineficaç</span>
                    </div>
                    <div className="text-center text-xs">⬇️ Autoeficàcia ⬇️</div>
                    <div className="bg-red-500 text-white p-2 rounded text-center font-bold text-sm">CAIGUDA (Lapse)</div>
                 </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700">Índex Teòric</div>
          <nav className="flex flex-col">
            <button onClick={() => setActiveTab('intro')} className={`p-3 text-left hover:bg-slate-50 text-sm ${activeTab === 'intro' ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-600'}`}>Introducció</button>
            <button onClick={() => setActiveTab('definitions')} className={`p-3 text-left hover:bg-slate-50 text-sm ${activeTab === 'definitions' ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-600'}`}>Definició Addiccions</button>
            <button onClick={() => setActiveTab('marlatt')} className={`p-3 text-left hover:bg-slate-50 text-sm ${activeTab === 'marlatt' ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-600'}`}>Model de Recaiguda</button>
          </nav>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
        {renderContent()}
      </div>
    </div>
  );
};

export default Theory;
