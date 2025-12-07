import React, { useState, useEffect } from 'react';
import { 
  BookOpen, AlertTriangle, GitMerge, Compass, Smartphone, 
  ShoppingBag, Heart, Activity, Shield, BarChart2, Info, Lock, Repeat, ZapOff, CheckCircle,
  X, ChevronRight, Brain, MousePointerClick, ArrowRight, Gavel, Scale, Briefcase, EyeOff,
  User as UserIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

// --- DATA FOR CHARTS ---
const TREATMENT_DATA = [
  { name: "Joc d'apostes", value: 75, fill: '#ea580c' },
  { name: 'Xarxes/Pantalles', value: 15, fill: '#3b82f6' },
  { name: 'Altres', value: 10, fill: '#94a3b8' },
];

const RISK_DATA = [
  { name: 'Risc Elevat', value: 13.2, color: '#ef4444' },
  { name: 'Risc Moderat', value: 33.5, color: '#f59e0b' },
  { name: 'Sense Risc', value: 53.3, color: '#10b981' },
];

const GENDER_COMPARISON_DATA = [
  { name: 'Pornografia', nois: 78.4, noies: 41.2 },
  { name: 'Joc Online', nois: 15.0, noies: 4.0 },
  { name: 'Ús Excessiu Xarxes', nois: 39.2, noies: 42.7 },
  { name: 'Malestar Emocional', nois: 24.7, noies: 53.0 },
];

const MOOD_EVOLUTION_DATA = [
  { year: '2015', noies: 68.5, nois: 81.5 },
  { year: '2019', noies: 60.5, nois: 78.7 },
  { year: '2022', noies: 44.9, nois: 72.6 },
];

const SEXTORTION_DATA = [
  { name: 'Noies (Contingut)', value: 35.6, fill: '#ec4899' },
  { name: 'Nois (Diners)', value: 26.5, fill: '#3b82f6' },
];

const EVOLUTION_DATA = [
  { year: '2019', requests: 120 },
  { year: '2020', requests: 150 },
  { year: '2021', requests: 180 },
  { year: '2022', requests: 210 },
  { year: '2023', requests: 238 },
];

// --- CONTENT DATA ---
const ADDICTION_DETAILS: Record<string, any> = {
  gambling: {
    title: "Joc d'Atzar en Línia",
    icon: "🎲",
    color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    gradient: "from-indigo-500 to-blue-500",
    description: "La ludopatia digital elimina les barreres físiques del joc tradicional. El joc esdevé un espai de construcció de 'masculinitat de risc'.",
    mechanisms: [
      { title: "Immediatesa", desc: "La reducció del temps entre l'aposta i el resultat augmenta la capacitat addictiva." },
      { title: "Pagament Invisible", desc: "L'ús de targetes de crèdit o moneders virtuals redueix la percepció de pèrdua de diners reals." },
      { title: "Publicitat Agressiva", desc: "Bonificacions i anuncis personalitzats que exploten la vulnerabilitat cognitiva." }
    ],
    risks: ["Deutes econòmics greus", "Mentides i manipulació familiar", "Activitats delictives per finançar el joc", "Construcció de masculinitat tòxica"],
    traps: ["Tinc un sistema infal·lible", "He de recuperar el que he perdut", "Avui és el meu dia de sort"]
  },
  screens: {
    title: "Pantalles i Xarxes Socials",
    icon: "📱",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    gradient: "from-blue-400 to-indigo-500",
    description: "Una dependència caracteritzada per la necessitat de validació. Afecta desproporcionadament les noies a través de la pressió estètica.",
    mechanisms: [
      { title: "Reforç Intermitent", desc: "El 'scroll infinit' i les notificacions funcionen com una màquina escurabutxaques cerebral." },
      { title: "Paradoxa de Connexió", desc: "Més ús de xarxes per buscar vincle sovint resulta en més aïllament i pressió." },
      { title: "Validació Quantificable", desc: "L'autoestima es lliga al nombre de 'likes' i seguidors." }
    ],
    risks: ["Aïllament social real", "Trastorns alimentaris (pressió estètica)", "Cyberbullying i assetjament", "Dismòrfia corporal"],
    traps: ["Només cinc minuts més", "Si no ho penjo, no ha passat", "Tothom ho està fent"]
  },
  gaming: {
    title: "Videojocs",
    icon: "🎮",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    gradient: "from-purple-500 to-violet-600",
    description: "L'ús excessiu de videojocs que interfereix en la vida diària. Els MMORPGs i MOBA són els més addictius per la seva naturalesa social i competitiva.",
    mechanisms: [
      { title: "Sistemes de Loot Boxes", desc: "Mecàniques d'atzar integrades (caixes de botí) que imiten el joc d'apostes." },
      { title: "Immersió i Flux", desc: "Estats d'alta concentració que fan perdre la noció del temps i les necessitats físiques." },
      { title: "Identitat Virtual", desc: "Preferència per l'avatar online sobre el 'jo' real a causa de l'èxit assolit al joc." }
    ],
    risks: ["Abandonament escolar", "Sedentarisme extrem", "Agressivitat per abstinència", "Despesa econòmica en microtransaccions"],
    traps: ["No puc deixar la partida a mitges", "Això millora les meves habilitats", "És la meva única forma de socialitzar"]
  },
  shopping: {
    title: "Compres (Oniomania)",
    icon: "🛍️",
    color: "bg-pink-50 border-pink-200 text-pink-800",
    gradient: "from-pink-400 to-rose-500",
    description: "Compra repetitiva utilitzada com a regulador emocional. La tecnologia facilita la impulsivitat amb botigues obertes 24/7.",
    mechanisms: [
      { title: "Facilitat d'Accés", desc: "Pagaments en un clic i enviaments ràpids eliminen la reflexió." },
      { title: "Il·lusió d'Estalvi", desc: "Ofertes flash i descomptes que creen urgència artificial." },
      { title: "Dopamina de l'Anticipació", desc: "El plaer resideix en la cerca i l'espera del paquet, no en l'ús del producte." }
    ],
    risks: ["Acumulació d'objectes innecessaris", "Problemes financers greus", "Sentiment de culpa post-compra"],
    traps: ["M'ho mereixo", "Està d'oferta, estalvio diners", "Això em farà sentir millor"]
  },
  porn: {
    title: "Pornografia i CSAM",
    icon: "🔞",
    color: "bg-red-50 border-red-200 text-red-800",
    gradient: "from-red-500 to-rose-700",
    description: "Consum compulsiu que distorsiona la sexualitat. Cal distingir entre pornografia legal i CSAM (Material d'Abús Sexual Infantil).",
    mechanisms: [
      { title: "Efecte Coolidge", desc: "La novetat constant de contingut manté l'excitació dopaminèrgica artificialment alta." },
      { title: "Escalada", desc: "Necessitat de contingut més extrem o violent per aconseguir la mateixa excitació (tolerància)." },
      { title: "Anonimat Dissociatiu", desc: "\"El que faig aquí no soc jo\". Separació de la identitat real de la digital." }
    ],
    risks: ["Disfuncions sexuals", "Normalització de la violència", "Consum accidental o buscat de CSAM (delicte)", "Cosificació"],
    traps: ["És natural, tothom ho mira", "Només és una fantasia", "Això m'ensenya com funciona el sexe"]
  },
  emotional: {
    title: "Dependència Emocional i Cibersexe",
    icon: "❤️‍🔥",
    color: "bg-rose-50 border-rose-200 text-rose-800",
    gradient: "from-rose-400 to-pink-600",
    description: "Necessitat patològica de validació a través de vincles digitals, sovint tòxics o basats en el 'sexting'.",
    mechanisms: [
      { title: "Reforç Intermitent", desc: "L'atenció impredictible (ara et contesto, ara t'ignoro) genera una addicció molt potent." },
      { title: "Idealització", desc: "Omplir els buits d'informació digital amb fantasies sobre l'altra persona." },
      { title: "Por a la Soledat", desc: "Ús de relacions virtuals com a ansiolític per evitar estar amb un mateix." }
    ],
    risks: ["Relacions tòxiques", "Sextorsió (xantatge amb imatges)", "Pèrdua d'identitat", "Ansietat severa"],
    traps: ["Sense ell/a no soc res", "Si envio aquesta foto m'estimarà més", "Només necessito que em contesti"]
  },
  work: {
    title: "Addicció al Treball (Workaholism)",
    icon: "💼",
    color: "bg-slate-50 border-slate-200 text-slate-800",
    gradient: "from-slate-500 to-gray-700",
    description: "Obsessió pel treball afavorida per la tecnologia que permet la connexió laboral permanent.",
    mechanisms: [
      { title: "Èxit com a vàlua", desc: "Confondre el rendiment professional amb el valor com a persona." },
      { title: "Por al buit", desc: "Utilitzar la feina per evitar problemes personals o emocionals." },
      { title: "Ubiquitat Digital", desc: "Portar l'oficina a la butxaca fa impossible la desconnexió real." }
    ],
    risks: ["Burnout (Síndrome del cremat)", "Deteriorament familiar i social", "Problemes cardiovasculars", "Estrès crònic"],
    traps: ["Soc imprescindible", "Només contesto aquest mail i plego", "Descansar és perdre el temps"]
  }
};

const Theory: React.FC = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [marlattStep, setMarlattStep] = useState<number | null>(null);
  const [observatoryTab, setObservatoryTab] = useState<'general' | 'joves' | 'genere' | 'evolucio'>('general');

  const SectionButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => { setActiveSection(id); setSelectedDetail(null); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        activeSection === id 
          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm translate-x-1' 
          : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const openDetail = (key: string) => {
    setSelectedDetail(key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn max-w-[1600px] mx-auto p-4 md:p-8 relative">
      
      {/* Sidebar Navigation */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-24">
          <div className="mb-6 px-2 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500"/> NeuroGuard Hub</h3>
            <p className="text-xs text-slate-500 mt-1">Recursos i dades</p>
          </div>
          <nav className="space-y-1">
            <SectionButton id="intro" label="Introducció" icon={Info} />
            <SectionButton id="observatori" label="L'Observatori" icon={BarChart2} />
            <SectionButton id="tipus" label="Tipus d'Addiccions" icon={Smartphone} />
            <SectionButton id="forense" label="Legal i Forense (CSAM)" icon={Gavel} />
            <SectionButton id="mecanismes" label="Model de Recaiguda" icon={GitMerge} />
            <SectionButton id="simptomes" label="Senyals d'Alerta" icon={AlertTriangle} />
            <SectionButton id="prevencio" label="Estratègies" icon={Shield} />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-[600px]">
        
        {/* MODAL DETALL */}
        {selectedDetail && ADDICTION_DETAILS[selectedDetail] && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md p-4 md:p-8 overflow-y-auto flex items-center justify-center animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setSelectedDetail(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition-colors z-30 text-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className={`p-10 text-white bg-gradient-to-r ${ADDICTION_DETAILS[selectedDetail].gradient}`}>
                <div className="text-6xl mb-6 filter drop-shadow-lg">{ADDICTION_DETAILS[selectedDetail].icon}</div>
                <h2 className="text-4xl font-bold mb-4">{ADDICTION_DETAILS[selectedDetail].title}</h2>
                <p className="text-lg opacity-90 leading-relaxed max-w-2xl">{ADDICTION_DETAILS[selectedDetail].description}</p>
              </div>

              <div className="p-8 space-y-10">
                <section>
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Brain className="w-8 h-8 text-purple-600"/> Mecanismes Psicològics
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {ADDICTION_DETAILS[selectedDetail].mechanisms.map((m: any, i: number) => (
                      <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <h4 className="font-bold text-slate-800 mb-3 text-lg">{m.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  <section className="bg-red-50 p-8 rounded-3xl border border-red-100">
                    <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6"/> Riscos
                    </h3>
                    <ul className="space-y-3">
                      {ADDICTION_DETAILS[selectedDetail].risks.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-red-800 font-medium">
                          <span className="mt-1.5 w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
                    <h3 className="text-xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                      <Repeat className="w-6 h-6"/> Pensaments Trampa
                    </h3>
                    <ul className="space-y-4">
                      {ADDICTION_DETAILS[selectedDetail].traps.map((t: string, i: number) => (
                        <li key={i} className="bg-white p-4 rounded-xl text-amber-900 italic border border-amber-200 shadow-sm text-center">
                          "{t}"
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Intro Section */}
        {activeSection === 'intro' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
              <h1 className="text-4xl font-bold text-slate-800 mb-6 relative z-10">
                Un repte social <span className="text-indigo-600">creixent</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-3xl relative z-10">
                Les addiccions socials o comportamentals, especialment les vinculades a les pantalles i al joc, representen un dels reptes més significatius per a la salut pública actual.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-start gap-5 relative z-10">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                    <Info className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-2">Missió de NeuroGuard</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Prevenir, detectar i investigar aquestes conductes per millorar la qualitat de vida de les persones afectades i les seves famílies. Aquesta eina transforma les dades en coneixement accionable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Observatory Section (Charts) */}
        {activeSection === 'observatori' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-6">
              <h2 className="text-3xl font-bold text-slate-800">
                Dades de l'Observatori
              </h2>
              <div className="flex gap-1 bg-slate-100 p-1.5 rounded-xl">
                {['general', 'joves', 'genere', 'evolucio'].map((tab) => (
                    <button 
                    key={tab}
                    onClick={() => setObservatoryTab(tab as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${observatoryTab === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                    {tab}
                    </button>
                ))}
              </div>
            </div>
            
            {observatoryTab === 'general' && (
              <div className="grid md:grid-cols-2 gap-8 animate-fadeIn">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-700 mb-6 text-center text-lg">Motius de Tractament (Cat, 2023)</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={TREATMENT_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="value" name="%" radius={[0, 8, 8, 0]} barSize={32}>
                          {TREATMENT_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl mt-4 text-center">
                    <p className="text-sm text-slate-600 font-medium">El <span className="text-orange-600 font-bold">75%</span> de les sol·licituds van ser per joc d'apostes.</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-8 rounded-3xl text-center shadow-xl flex flex-col justify-center items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-xl opacity-90 uppercase tracking-widest mb-2">Apostes Online</h3>
                    <p className="text-8xl font-extrabold my-6 tracking-tighter">43.2<span className="text-4xl">%</span></p>
                    <p className="text-lg opacity-90 max-w-xs mx-auto font-medium">dels pacients en tractament juguen habitualment a internet.</p>
                  </div>
                </div>
              </div>
            )}

            {observatoryTab === 'joves' && (
              <div className="grid md:grid-cols-2 gap-8 animate-fadeIn">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-700 mb-6 text-center text-lg">Risc d'addicció al mòbil</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                            data={RISK_DATA} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={70} 
                            outerRadius={100} 
                            paddingAngle={5} 
                            dataKey="value"
                            stroke="none"
                        >
                          {RISK_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        <RechartsTooltip contentStyle={{borderRadius: '12px'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center text-slate-500 font-medium mt-4">1 de cada 10 joves presenta un risc elevat.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="bg-blue-50 p-6 rounded-full mb-6">
                    <Activity className="w-12 h-12 text-blue-600"/>
                  </div>
                  <h3 className="font-bold text-slate-800 text-2xl mb-4">Factor de Vulnerabilitat</h3>
                  <p className="text-slate-600 text-lg leading-relaxed max-w-xs">
                    L'addicció es presenta amb més freqüència i gravetat en contextos de <span className="font-bold text-blue-600">vulnerabilitat socioeconòmica</span>.
                  </p>
                </div>
              </div>
            )}

            {observatoryTab === 'genere' && (
              <div className="grid lg:grid-cols-2 gap-8 animate-fadeIn">
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-6 text-center text-lg">Bretxa de Gènere en Conductes de Risc</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={GENDER_COMPARISON_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip contentStyle={{borderRadius: '12px'}} />
                                <Legend wrapperStyle={{paddingTop: '20px'}} />
                                <Bar dataKey="nois" name="Nois" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="noies" name="Noies" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-6 bg-slate-50 p-3 rounded-lg">
                      Els <strong className="text-blue-600">nois</strong> dominen en Joc i Pornografia; les <strong className="text-pink-600">noies</strong> pateixen més malestar emocional i ús de xarxes.
                    </p>
                 </div>

                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-6 text-center text-lg">Evolució Estat Ànim Positiu</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOOD_EVOLUTION_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                                <RechartsTooltip contentStyle={{borderRadius: '12px'}} />
                                <Legend wrapperStyle={{paddingTop: '20px'}} />
                                <Line type="monotone" dataKey="nois" stroke="#3b82f6" strokeWidth={4} name="Nois" dot={{r: 6}} />
                                <Line type="monotone" dataKey="noies" stroke="#ec4899" strokeWidth={4} name="Noies" dot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-6 bg-slate-50 p-3 rounded-lg">
                        La bretxa de benestar emocional s'eixampla dramàticament des de 2015.
                    </p>
                 </div>
              </div>
            )}

            {observatoryTab === 'evolucio' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-fadeIn">
                 <h3 className="font-bold text-slate-700 mb-6 text-center text-lg">Evolució de Sol·licituds de Tractament</h3>
                 <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={EVOLUTION_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <RechartsTooltip contentStyle={{borderRadius: '12px'}} />
                            <defs>
                                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Line type="monotone" dataKey="requests" stroke="#f97316" strokeWidth={4} name="Sol·licituds" dot={{r: 6, fill: '#f97316', strokeWidth: 2, stroke: '#fff'}} />
                        </LineChart>
                    </ResponsiveContainer>
                 </div>
                 <p className="text-center font-bold text-slate-700 mt-6">Tendència a l'alça constant (+98% des de 2019)</p>
              </div>
            )}
          </div>
        )}

        {/* Addiction Types */}
        {activeSection === 'tipus' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-slate-800">Principals Addiccions Socials</h2>
            <p className="text-slate-500 mb-6 text-lg">Explora els mecanismes, riscos i pensaments trampa de cada conducta.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'gambling', title: "Joc d'Atzar", icon: "🎲", desc: "Apostes esportives, casino, pòquer.", color: "text-orange-600" },
                { id: 'screens', title: "Pantalles", icon: "📱", desc: "Xarxes socials i validació externa.", color: "text-blue-600" },
                { id: 'gaming', title: "Videojocs", icon: "🎮", desc: "Immersió i sistemes de recompensa.", color: "text-purple-600" },
                { id: 'shopping', title: "Compres", icon: "🛍️", desc: "Oniomania i impulsivitat digital.", color: "text-pink-600" },
                { id: 'porn', title: "Pornografia", icon: "🔞", desc: "Distorsió sexual i riscos legals.", color: "text-red-600" },
                { id: 'emotional', title: "Dependència", icon: "❤️‍🔥", desc: "Relacions tòxiques i cibersexe.", color: "text-rose-600" },
                { id: 'work', title: "Workaholism", icon: "💼", desc: "Connexió laboral permanent.", color: "text-slate-600" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => openDetail(item.id)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl bg-slate-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div className="bg-slate-100 rounded-full p-2 group-hover:bg-slate-200 transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    </div>
                  </div>
                  <h3 className={`font-bold text-xl mb-2 ${item.color}`}>{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legal & Forensic Section (New) */}
        {activeSection === 'forense' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
             <h2 className="text-3xl font-bold text-slate-800">Anàlisi Forense i Legal</h2>
             
             <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                <div className="flex items-start gap-6 mb-8 relative z-10">
                   <div className="bg-white/10 p-4 rounded-2xl">
                     <Gavel className="w-10 h-10 text-orange-400" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-bold">CSAM vs Pornografia</h3>
                      <p className="opacity-80 mt-2 max-w-2xl leading-relaxed">És crític distingir entre pornografia legal (adults, consentida) i CSAM (Material d'Abús Sexual Infantil). El CSAM no és pornografia, és l'evidència documental d'un delicte.</p>
                   </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <h4 className="font-bold text-red-400 mb-3 text-lg flex items-center gap-2"><Lock className="w-5 h-5"/> CSAM (Delicte)</h4>
                      <p className="text-sm opacity-80 leading-relaxed">
                         La tinença, distribució o producció és un delicte greu segons el Codi Penal. Genera una revictimització permanent per a la víctima.
                      </p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <h4 className="font-bold text-blue-400 mb-3 text-lg flex items-center gap-2"><EyeOff className="w-5 h-5"/> Grooming</h4>
                      <p className="text-sm opacity-80 leading-relaxed">
                         Procés de manipulació: Selecció de la víctima, "Love Bombing" (afecte desmesurat), Aïllament de l'entorn, Desensibilització i Abús.
                      </p>
                   </div>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                   <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3 text-xl"><Scale className="w-6 h-6 text-slate-600"/> Marc Legal (LOPIVI)</h3>
                   <ul className="space-y-4">
                      {['Violència digital com a violència infantil.', 'Obligació de canals de denúncia.', 'Prescripció ampliada de delictes.'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm font-medium">{item}</span>
                          </li>
                      ))}
                   </ul>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                   <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3 text-xl"><Briefcase className="w-6 h-6 text-slate-600"/> Sextorsió per Gènere</h3>
                   <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={SEXTORTION_DATA} layout="vertical">
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 11, fontWeight: 600}} axisLine={false} tickLine={false} />
                              <RechartsTooltip cursor={{fill: 'transparent'}} />
                              <Bar dataKey="value" barSize={24} radius={[0, 6, 6, 0]}>
                                {SEXTORTION_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                   </div>
                   <p className="text-xs text-center text-slate-400 mt-4 italic bg-slate-50 p-2 rounded">Diferència clau: Objectiu sexual (noies) vs econòmic (nois).</p>
                </div>
             </div>
          </div>
        )}

        {/* Theoretical Models (Marlatt Interactive) */}
        {activeSection === 'mecanismes' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-slate-800">El Model de Recaiguda (Marlatt)</h2>
            
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-orange-400 to-green-400"></div>
              <h3 className="font-bold text-xl mb-4 text-center text-slate-700">Simulador Interactiu</h3>
              <p className="text-center text-slate-500 mb-10 text-sm max-w-md mx-auto">Fes clic als botons per veure com una decisió canvia el resultat final.</p>
              
              <div className="flex flex-col items-center max-w-3xl mx-auto relative">
                {/* Step 1: Trigger */}
                <button 
                  onClick={() => setMarlattStep(1)}
                  className={`w-full max-w-md p-6 rounded-2xl text-center border-2 transition-all mb-12 relative z-10 group ${marlattStep === 1 ? 'bg-red-50 border-red-400 shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-red-300'}`}
                >
                  <span className="font-bold text-slate-800 block text-xl mb-1 group-hover:text-red-700 transition-colors">1. Situació d'Alt Risc (SAR)</span>
                  <span className="text-sm text-slate-500">Estrès, conflicte, pressió social...</span>
                  {marlattStep === 1 && (
                    <div className="absolute top-full left-0 w-full mt-4 p-4 bg-white rounded-xl border border-red-100 text-left text-sm text-slate-600 shadow-xl z-20 animate-fadeIn">
                      <strong className="block text-red-600 mb-1">El Desencadenant:</strong> És el moment crític. Pot ser extern (veure un anunci) o intern (sentir tristesa).
                    </div>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-8 w-full relative z-10">
                   {/* Left Path: Coping */}
                   <div className="flex flex-col gap-6 items-center">
                      <button 
                        onClick={() => setMarlattStep(2)}
                        className={`w-full p-5 rounded-2xl text-center border-2 transition-all ${marlattStep === 2 ? 'bg-green-50 border-green-500 shadow-lg ring-2 ring-green-200' : 'bg-white border-slate-100 hover:border-green-300'}`}
                      >
                        <span className="font-bold text-green-700 block mb-1">2A. Resposta Eficaç</span>
                        <span className="text-xs text-green-600">Utilitzar eines apreses</span>
                      </button>
                      
                      {marlattStep === 2 && (
                        <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-sm text-green-800 animate-fadeIn shadow-inner w-full">
                          Augmenta la teva sensació de control (<strong>Autoeficàcia</strong>). El risc disminueix.
                        </div>
                      )}

                      <div className={`mt-auto px-6 py-3 rounded-full text-center text-sm font-bold transition-all ${marlattStep === 2 ? 'bg-green-600 text-white shadow-lg scale-110' : 'bg-slate-100 text-slate-400'}`}>
                        ÈXIT: RECUPERACIÓ
                      </div>
                   </div>

                   {/* Right Path: No Coping */}
                   <div className="flex flex-col gap-6 items-center">
                      <button 
                        onClick={() => setMarlattStep(3)}
                        className={`w-full p-5 rounded-2xl text-center border-2 transition-all ${marlattStep === 3 ? 'bg-orange-50 border-orange-400 shadow-lg' : 'bg-white border-slate-100 hover:border-orange-300'}`}
                      >
                        <span className="font-bold text-orange-700 block mb-1">2B. Resposta Ineficaç</span>
                        <span className="text-xs text-orange-600">No usar eines</span>
                      </button>

                      {marlattStep === 3 && (
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 text-sm text-orange-800 animate-fadeIn shadow-inner w-full">
                          Disminueix l'autoeficàcia. Apareixen les expectatives positives del consum ("em relaxarà").
                        </div>
                      )}

                      <button 
                        onClick={() => setMarlattStep(4)}
                        className={`w-full p-5 rounded-2xl text-center border-2 transition-all ${marlattStep === 4 ? 'bg-red-50 border-red-600 shadow-lg ring-2 ring-red-200' : 'bg-white border-slate-100 hover:border-red-300'}`}
                      >
                        <span className="font-bold text-red-700 block mb-1">3. Efecte Violació Abstinència</span>
                        <span className="text-xs text-red-600">Culpa i pèrdua de control</span>
                      </button>

                      {marlattStep === 4 && (
                        <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-sm text-red-800 animate-fadeIn shadow-inner w-full">
                          Després de la primera caiguda (Lapse), apareix la culpa intensa i el pensament "total, ja l'he liat". Això porta a la recaiguda total.
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>

            {/* ACT Section */}
            <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-xl">
               <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                 <Compass className="w-8 h-8 text-purple-400"/> Teràpia d'Acceptació i Compromís (ACT)
               </h3>
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 p-6 rounded-2xl hover:bg-white/20 transition-colors cursor-default border border-white/5">
                    <h4 className="font-bold text-purple-300 mb-3 text-lg">Acceptació</h4>
                    <p className="text-sm opacity-80 leading-relaxed">Obrir-se al malestar (ansietat, craving) sense lluitar contra ell ni evitar-lo. "Fer espai" a l'emoció.</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-2xl hover:bg-white/20 transition-colors cursor-default border border-white/5">
                    <h4 className="font-bold text-purple-300 mb-3 text-lg">Defusió</h4>
                    <p className="text-sm opacity-80 leading-relaxed">Veure els pensaments com el que són (paraules i sons), no com a veritats absolutes o ordres que cal obeir.</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-2xl hover:bg-white/20 transition-colors cursor-default border border-white/5">
                    <h4 className="font-bold text-purple-300 mb-3 text-lg">Acció Compromesa</h4>
                    <p className="text-sm opacity-80 leading-relaxed">Actuar segons els teus valors profunds, fins i tot quan és difícil o incòmode fer-ho.</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Symptoms */}
        {activeSection === 'simptomes' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-slate-800">Senyals d'Alerta</h2>
            <p className="text-slate-500 text-lg mb-6">Indicadors comuns que suggereixen la presència d'una addicció comportamental.</p>
            <div className="grid md:grid-cols-2 gap-6">
               {[
                 { t: "Aïllament Social", d: "Preferència pel món digital sobre el presencial. Pèrdua de contacte amb amics.", i: <UserIcon /> },
                 { t: "Irritabilitat", d: "Malestar intens, canvis d'humor o agressivitat quan no es pot connectar (Abstinència).", i: <ZapOff /> },
                 { t: "Pèrdua d'interès", d: "Abandonament d'aficions prèvies (esport, lectura) que abans eren importants.", i: <Heart /> },
                 { t: "Alteració del son", d: "Ús nocturn que afecta la qualitat del descans i el rendiment diürn.", i: <Smartphone /> },
                 { t: "Baix rendiment", d: "Problemes escolars o laborals deguts a la manca d'atenció o cansament.", i: <Briefcase /> },
                 { t: "Mentides", d: "Ocultació del temps real d'ús o de la despesa econòmica a familiars.", i: <Lock /> }
               ].map((s, i) => (
                 <div key={i} className="flex gap-5 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                    <div className="bg-orange-50 p-4 rounded-full h-fit text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      {s.i}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg mb-1">{s.t}</h4>
                      <p className="text-slate-500 leading-relaxed">{s.d}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Strategies */}
        {activeSection === 'prevencio' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-slate-800">Estratègies de Prevenció</h2>
            
            {/* Risk Traffic Light */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-xl mb-6 text-center text-slate-700">Semàfor d'Autoavaluació</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center hover:shadow-md transition-shadow cursor-default group">
                  <div className="w-10 h-10 bg-green-500 rounded-full mx-auto mb-4 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform"></div>
                  <h4 className="font-bold text-green-800 mb-2 text-lg">Ús Saludable</h4>
                  <p className="text-sm text-green-700 leading-relaxed">L'ús és una eina o diversió, no una necessitat. Pots parar quan vols sense malestar.</p>
                </div>
                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-2xl text-center hover:shadow-md transition-shadow cursor-default group">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full mx-auto mb-4 shadow-lg shadow-yellow-200 group-hover:scale-110 transition-transform"></div>
                  <h4 className="font-bold text-yellow-800 mb-2 text-lg">Ús de Risc</h4>
                  <p className="text-sm text-yellow-700 leading-relaxed">Comences a postergar tasques. Et sents molest si t'interrompen. Menteixes sobre el temps d'ús.</p>
                </div>
                <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center hover:shadow-md transition-shadow cursor-default group">
                  <div className="w-10 h-10 bg-red-500 rounded-full mx-auto mb-4 shadow-lg shadow-red-200 animate-pulse"></div>
                  <h4 className="font-bold text-red-800 mb-2 text-lg">Addicció</h4>
                  <p className="text-sm text-red-700 leading-relaxed">Pèrdua total de control. Afectació greu de la vida personal, laboral o acadèmica. Necessitat d'ajuda professional.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                <h3 className="font-bold text-blue-800 text-xl mb-6 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6"/> Consells Pràctics de Prevenció
                </h3>
                <ul className="grid md:grid-cols-2 gap-6">
                  <li className="bg-white p-5 rounded-2xl text-blue-900 border border-blue-100 shadow-sm flex items-start gap-3">
                    <span className="font-bold text-2xl text-blue-300">1</span>
                    <div>
                        <strong className="block mb-1">Desconnexió Digital</strong>
                        <span className="text-sm opacity-80">Estableix zones lliures de pantalles (dormitori, taula de menjar).</span>
                    </div>
                  </li>
                  <li className="bg-white p-5 rounded-2xl text-blue-900 border border-blue-100 shadow-sm flex items-start gap-3">
                    <span className="font-bold text-2xl text-blue-300">2</span>
                    <div>
                        <strong className="block mb-1">Alternativa Saludable</strong>
                        <span className="text-sm opacity-80">Substitueix el temps de pantalla per esport o lectura física.</span>
                    </div>
                  </li>
                  <li className="bg-white p-5 rounded-2xl text-blue-900 border border-blue-100 shadow-sm flex items-start gap-3">
                    <span className="font-bold text-2xl text-blue-300">3</span>
                    <div>
                        <strong className="block mb-1">Control Econòmic</strong>
                        <span className="text-sm opacity-80">No guardis targetes de crèdit al navegador o apps de jocs.</span>
                    </div>
                  </li>
                  <li className="bg-white p-5 rounded-2xl text-blue-900 border border-blue-100 shadow-sm flex items-start gap-3">
                    <span className="font-bold text-2xl text-blue-300">4</span>
                    <div>
                        <strong className="block mb-1">Higiene del Son</strong>
                        <span className="text-sm opacity-80">Deixa les pantalles 1 hora abans d'anar a dormir.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Theory;
