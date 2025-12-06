
import React, { useState } from 'react';
import { 
  BookOpen, AlertTriangle, GitMerge, Compass, Smartphone, 
  ShoppingBag, Heart, Activity, Shield, BarChart2, Info, Lock, Repeat, ZapOff, CheckCircle,
  X, ChevronRight, Brain, MousePointerClick, ArrowRight, Gavel, Scale, Briefcase, EyeOff
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

// --- DATA FOR CHARTS ---
const TREATMENT_DATA = [
  { name: "Joc d'apostes", value: 75, fill: '#f97316' },
  { name: 'Xarxes/Pantalles', value: 15, fill: '#3b82f6' },
  { name: 'Altres', value: 10, fill: '#94a3b8' },
];

const RISK_DATA = [
  { name: 'Risc Elevat', value: 13.2, color: '#ef4444' },
  { name: 'Risc Moderat', value: 33.5, color: '#f59e0b' },
  { name: 'Sense Risc', value: 53.3, color: '#10b981' },
];

// Data from "Anàlisi d'hàbits"
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
    color: "bg-orange-50 border-orange-200 text-orange-800",
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
          ? 'bg-orange-50 text-orange-700 border border-orange-100 shadow-sm' 
          : 'text-slate-600 hover:bg-slate-50'
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
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn max-w-7xl mx-auto p-4 md:p-8 relative">
      
      {/* Sidebar Navigation */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-4">
          <div className="mb-4 px-2">
            <h3 className="font-bold text-slate-800">Marc Teòric</h3>
            <p className="text-xs text-slate-500">ACENCAS Prevenció</p>
          </div>
          <nav className="space-y-1">
            <SectionButton id="intro" label="Introducció" icon={BookOpen} />
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
          <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm p-4 md:p-8 rounded-3xl animate-fadeIn overflow-y-auto min-h-screen">
            <button 
              onClick={() => setSelectedDetail(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-30"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
            
            <div className="max-w-3xl mx-auto mt-8 pb-20">
              <div className={`p-6 rounded-2xl mb-8 ${ADDICTION_DETAILS[selectedDetail].color}`}>
                <div className="text-5xl mb-4">{ADDICTION_DETAILS[selectedDetail].icon}</div>
                <h2 className="text-3xl font-bold mb-4">{ADDICTION_DETAILS[selectedDetail].title}</h2>
                <p className="text-lg opacity-90 leading-relaxed">{ADDICTION_DETAILS[selectedDetail].description}</p>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600"/> Mecanismes de l'Addicció
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {ADDICTION_DETAILS[selectedDetail].mechanisms.map((m: any, i: number) => (
                      <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <h4 className="font-bold text-slate-700 mb-2 text-sm">{m.title}</h4>
                        <p className="text-xs text-slate-500">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
                    <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5"/> Riscos i Conseqüències
                    </h3>
                    <ul className="space-y-2">
                      {ADDICTION_DETAILS[selectedDetail].risks.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-red-700 text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                    <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                      <Repeat className="w-5 h-5"/> Pensaments Trampa
                    </h3>
                    <ul className="space-y-3">
                      {ADDICTION_DETAILS[selectedDetail].traps.map((t: string, i: number) => (
                        <li key={i} className="bg-white/60 p-3 rounded-lg text-amber-900 text-sm italic border border-amber-100">
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
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h1 className="text-3xl font-bold text-slate-800 mb-6 border-l-4 border-orange-500 pl-4">
                Un repte social creixent
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Les addiccions socials o comportamentals, especialment les vinculades a les pantalles i al joc, representen un dels reptes més significatius per a la salut pública actual. L'ús generalitzat de la tecnologia ha transformat la nostra manera de comunicar-nos, treballar i gaudir de l'oci, però també ha generat noves formes de dependència.
              </p>
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex items-start gap-4">
                <Info className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-orange-800 mb-1">Missió d'ACENCAS</h4>
                  <p className="text-orange-700 text-sm">
                    Prevenir, detectar i investigar aquestes conductes per millorar la qualitat de vida de les persones afectades i les seves famílies. Aquesta eina transforma les dades de l'Observatori en coneixement accionable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Observatory Section (Charts) */}
        {activeSection === 'observatori' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 gap-4">
              <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-orange-500 pl-4">
                Dades de l'Observatori
              </h2>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setObservatoryTab('general')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${observatoryTab === 'general' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
                >
                  General
                </button>
                <button 
                  onClick={() => setObservatoryTab('joves')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${observatoryTab === 'joves' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
                >
                  Joves
                </button>
                <button 
                  onClick={() => setObservatoryTab('genere')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${observatoryTab === 'genere' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
                >
                  Gènere
                </button>
                <button 
                  onClick={() => setObservatoryTab('evolucio')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${observatoryTab === 'evolucio' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
                >
                  Evolució
                </button>
              </div>
            </div>
            
            {observatoryTab === 'general' && (
              <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-700 mb-4 text-center">Motius de Tractament (Cat, 2023)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={TREATMENT_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                        <RechartsTooltip />
                        <Bar dataKey="value" name="%" radius={[0, 4, 4, 0]}>
                          {TREATMENT_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-center text-slate-500 mt-2">El 75% de les sol·licituds van ser per joc d'apostes.</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl text-center shadow-lg flex flex-col justify-center">
                  <h3 className="font-bold text-lg opacity-90">Apostes Online</h3>
                  <p className="text-6xl font-extrabold my-4">43.2%</p>
                  <p className="text-sm opacity-90">dels pacients en tractament juguen online.</p>
                </div>
              </div>
            )}

            {observatoryTab === 'joves' && (
              <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-700 mb-4 text-center">Risc d'addicció al mòbil</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={RISK_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {RISK_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-center text-slate-500 mt-2">1 de cada 10 joves presenta un risc elevat.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <Activity className="w-12 h-12 text-blue-500 mb-4"/>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">Factor de Vulnerabilitat</h3>
                  <p className="text-slate-500 max-w-xs">L'addicció es presenta amb més freqüència i gravetat en contextos de vulnerabilitat socioeconòmica.</p>
                </div>
              </div>
            )}

            {observatoryTab === 'genere' && (
              <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4 text-center">Bretxa de Gènere en Conductes de Risc</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={GENDER_COMPARISON_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{fontSize: 10}} />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Bar dataKey="nois" name="Nois" fill="#3b82f6" />
                                <Bar dataKey="noies" name="Noies" fill="#ec4899" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-2">
                      Els nois dominen en Joc i Pornografia; les noies pateixen més malestar emocional i ús de xarxes.
                    </p>
                 </div>

                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4 text-center">Evolució Estat Ànim Positiu</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOOD_EVOLUTION_DATA}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis domain={[0, 100]} />
                                <RechartsTooltip />
                                <Legend />
                                <Line type="monotone" dataKey="nois" stroke="#3b82f6" strokeWidth={3} name="Nois" />
                                <Line type="monotone" dataKey="noies" stroke="#ec4899" strokeWidth={3} name="Noies" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-2">La bretxa de benestar emocional s'eixampla, afectant més a les noies.</p>
                 </div>
              </div>
            )}

            {observatoryTab === 'evolucio' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-fadeIn">
                 <h3 className="font-bold text-slate-700 mb-4 text-center">Evolució de Sol·licituds (Simulació)</h3>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={EVOLUTION_DATA}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="requests" stroke="#f97316" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                 </div>
                 <p className="text-xs text-center text-slate-500 mt-2">Tendència a l'alça en els darrers 5 anys.</p>
              </div>
            )}
          </div>
        )}

        {/* Addiction Types */}
        {activeSection === 'tipus' && !selectedDetail && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-orange-500 pl-4">Principals Addiccions Socials</h2>
            <p className="text-slate-500 mb-4">Selecciona una targeta per veure'n els detalls, mecanismes i riscos específics.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { id: 'gambling', title: "Joc d'Atzar", icon: "🎲", desc: "Apostes esportives, casino, pòquer. Greus conseqüències econòmiques." },
                { id: 'screens', title: "Pantalles i Xarxes", icon: "📱", desc: "Necessitat constant de validació (likes) i por a perdre's alguna cosa (FOMO)." },
                { id: 'gaming', title: "Videojocs", icon: "🎮", desc: "Sistemes de recompensa variable, immersió total i evasió de la realitat." },
                { id: 'shopping', title: "Compres (Oniomania)", icon: "🛍️", desc: "Compres compulsives com a regulació emocional facilitades per l'accés 24/7." },
                { id: 'porn', title: "Pornografia i CSAM", icon: "🔞", desc: "Consum compulsiu, distorsió de la sexualitat i riscos legals greus." },
                { id: 'emotional', title: "Dependència Emocional", icon: "❤️‍🔥", desc: "Cerca de validació externa patològica i relacions digitals tòxiques." },
                { id: 'work', title: "Workaholism", icon: "💼", desc: "Incapacitat de desconnectar de la feina, afavorida per la tecnologia mòbil." },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{item.icon}</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{item.desc}</p>
                    <button 
                      onClick={() => openDetail(item.id)}
                      className="inline-flex items-center text-orange-600 font-bold text-sm hover:text-orange-700"
                    >
                      Veure detalls complets <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-10 -mb-10 group-hover:bg-orange-100 transition-colors"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legal & Forensic Section (New) */}
        {activeSection === 'forense' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
             <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-orange-500 pl-4">Anàlisi Forense i Legal</h2>
             
             <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                   <Gavel className="w-8 h-8 text-orange-500 mt-1" />
                   <div>
                      <h3 className="text-xl font-bold">CSAM vs Pornografia</h3>
                      <p className="opacity-80 text-sm mt-2">És crític distingir entre pornografia legal (adults, consentida) i CSAM (Material d'Abús Sexual Infantil).</p>
                   </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                      <h4 className="font-bold text-red-400 mb-2">CSAM (Delicte)</h4>
                      <p className="text-xs opacity-90 leading-relaxed">
                         Documentació visual d'un delicte. No és "porno infantil", sinó evidència d'abús. La tinença, distribució o producció és un delicte greu segons el Codi Penal.
                      </p>
                   </div>
                   <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                      <h4 className="font-bold text-blue-400 mb-2">Grooming</h4>
                      <p className="text-xs opacity-90 leading-relaxed">
                         Procés de manipulació on un adult es guanya la confiança d'un menor per a fins sexuals. Fases: Selecció, "Love Bombing", Aïllament, Desensibilització i Abús.
                      </p>
                   </div>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Scale className="w-5 h-5"/> Marc Legal (LOPIVI)</h3>
                   <ul className="space-y-3 text-sm text-slate-600">
                      <li>• Reconeix la violència digital com a violència contra la infància.</li>
                      <li>• Obliga a les plataformes a tenir canals de denúncia.</li>
                      <li>• Augmenta els terminis de prescripció dels delictes greus.</li>
                   </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><EyeOff className="w-5 h-5"/> Sextorsió per Gènere</h3>
                   <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={SEXTORTION_DATA} layout="vertical">
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
                              <RechartsTooltip />
                              <Bar dataKey="value" barSize={20}>
                                {SEXTORTION_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                   </div>
                   <p className="text-xs text-center text-slate-400 mt-2">Les noies són extorsionades per més contingut sexual; els nois, per diners.</p>
                </div>
             </div>
          </div>
        )}

        {/* Theoretical Models (Marlatt Interactive) */}
        {activeSection === 'mecanismes' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-orange-500 pl-4">Model de Recaiguda</h2>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-xl mb-2 text-center">Simulador del Procés de Recaiguda (Marlatt)</h3>
              <p className="text-center text-slate-500 mb-8 text-sm">Fes clic als passos per veure què passa a cada etapa.</p>
              
              <div className="flex flex-col items-center max-w-2xl mx-auto relative">
                {/* Step 1: Trigger */}
                <button 
                  onClick={() => setMarlattStep(1)}
                  className={`w-full p-4 rounded-xl text-center border-2 transition-all mb-8 relative z-10 ${marlattStep === 1 ? 'bg-red-50 border-red-400 shadow-md scale-105' : 'bg-white border-red-100 hover:border-red-300'}`}
                >
                  <span className="font-bold text-red-800 block text-lg">1. Situació d'Alt Risc (SAR)</span>
                  <span className="text-xs text-red-600">Estrès, conflicte, pressió social...</span>
                  {marlattStep === 1 && (
                    <div className="mt-3 p-3 bg-white rounded border border-red-100 text-left text-sm text-slate-600 animate-fadeIn">
                      És el desencadenant. Pot ser extern (veure un anunci) o intern (sentir tristesa). No és la recaiguda en si, sinó el desafiament.
                    </div>
                  )}
                </button>

                {/* Arrow */}
                <div className="absolute top-20 bottom-20 w-0.5 bg-slate-200 -z-0"></div>

                <div className="grid grid-cols-2 gap-8 w-full relative z-10">
                   {/* Left Path: Coping */}
                   <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => setMarlattStep(2)}
                        className={`p-4 rounded-xl text-center border-2 transition-all ${marlattStep === 2 ? 'bg-green-50 border-green-400 shadow-md scale-105' : 'bg-white border-green-100 hover:border-green-300'}`}
                      >
                        <span className="font-bold text-green-800 text-sm">2A. Resposta Eficaç</span>
                      </button>
                      
                      {marlattStep === 2 && (
                        <div className="p-3 bg-green-50 rounded border border-green-200 text-xs text-green-800 animate-fadeIn">
                          Utilitzes les eines: trucar a algú, esperar 10 minuts, respirar. Augmenta la teva sensació de control (Autoeficàcia).
                        </div>
                      )}

                      <div className={`p-2 rounded text-center text-xs font-bold transition-all mt-auto ${marlattStep === 2 ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        RESULTAT: NO RECAIGUDA
                      </div>
                   </div>

                   {/* Right Path: No Coping */}
                   <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => setMarlattStep(3)}
                        className={`p-4 rounded-xl text-center border-2 transition-all ${marlattStep === 3 ? 'bg-orange-50 border-orange-400 shadow-md scale-105' : 'bg-white border-orange-100 hover:border-orange-300'}`}
                      >
                        <span className="font-bold text-orange-800 text-sm">2B. Resposta Ineficaç</span>
                      </button>

                      {marlattStep === 3 && (
                        <div className="p-3 bg-orange-50 rounded border border-orange-200 text-xs text-orange-800 animate-fadeIn">
                          No tens eines o no les uses. Disminueix l'autoeficàcia i apareixen les expectatives positives del consum ("em relaxarà").
                        </div>
                      )}

                      <button 
                        onClick={() => setMarlattStep(4)}
                        className={`p-4 rounded-xl text-center border-2 transition-all ${marlattStep === 4 ? 'bg-red-50 border-red-600 shadow-md scale-105' : 'bg-white border-red-100 hover:border-red-300'}`}
                      >
                        <span className="font-bold text-red-800 text-sm">3. Efecte Violació Abstinència</span>
                      </button>

                      {marlattStep === 4 && (
                        <div className="p-3 bg-red-50 rounded border border-red-200 text-xs text-red-800 animate-fadeIn">
                          Després de la primera caiguda (Lapse), apareix la culpa intensa i el pensament "total, ja l'he liat". Això porta a la recaiguda total.
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>

            {/* ACT Section */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl">
               <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                 <Compass className="w-6 h-6 text-purple-400"/> Teràpia d'Acceptació i Compromís (ACT)
               </h3>
               <p className="mb-6 opacity-80">L'objectiu no és eliminar el malestar, sinó canviar la nostra relació amb ell per viure una vida rica i amb sentit.</p>
               <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-default">
                    <h4 className="font-bold text-purple-300 mb-2">Acceptació</h4>
                    <p className="text-xs opacity-80">Obrir-se al malestar (ansietat, craving) sense lluitar contra ell ni evitar-lo.</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-default">
                    <h4 className="font-bold text-purple-300 mb-2">Defusió</h4>
                    <p className="text-xs opacity-80">Veure els pensaments com el que són (paraules i sons), no com a veritats absolutes o ordres.</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-default">
                    <h4 className="font-bold text-purple-300 mb-2">Acció Compromesa</h4>
                    <p className="text-xs opacity-80">Fer el que és important (valors) encara que sigui difícil o incòmode.</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Symptoms */}
        {activeSection === 'simptomes' && !selectedDetail && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-orange-500 pl-4">Senyals d'Alerta</h2>
            <div className="grid md:grid-cols-2 gap-4">
               {[
                 { t: "Aïllament Social", d: "Preferència pel món digital sobre el presencial. Pèrdua de contacte amb amics." },
                 { t: "Irritabilitat", d: "Malestar intens, canvis d'humor o agressivitat quan no es pot connectar." },
                 { t: "Pèrdua d'interès", d: "Abandonament d'aficions prèvies (esport, lectura) que abans eren importants." },
                 { t: "Alteració del son", d: "Ús nocturn que afecta la qualitat del descans i el rendiment diürn." },
                 { t: "Baix rendiment", d: "Problemes escolars o laborals deguts a la manca d'atenció o cansament." },
                 { t: "Mentides", d: "Ocultació del temps real d'ús o de la despesa econòmica a familiars." }
               ].map((s, i) => (
                 <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-orange-50 p-2 rounded-full h-fit">
                      <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{s.t}</h4>
                      <p className="text-sm text-slate-500 mt-1">{s.d}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Strategies */}
        {activeSection === 'prevencio' && !selectedDetail && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-orange-500 pl-4">Estratègies de Prevenció</h2>
            
            {/* Risk Traffic Light */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-center">Semàfor d'Autoavaluació</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center hover:shadow-md transition-shadow cursor-default">
                  <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-3 shadow-lg shadow-green-200"></div>
                  <h4 className="font-bold text-green-800 mb-2">Ús Saludable</h4>
                  <p className="text-xs text-green-700">L'ús és una eina o diversió, no una necessitat. Pots parar quan vols sense malestar.</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center hover:shadow-md transition-shadow cursor-default">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-3 shadow-lg shadow-yellow-200"></div>
                  <h4 className="font-bold text-yellow-800 mb-2">Ús de Risc</h4>
                  <p className="text-xs text-yellow-700">Comences a postergar tasques. Et sents molest si t'interrompen. Menteixes sobre el temps d'ús.</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center hover:shadow-md transition-shadow cursor-default">
                  <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-3 shadow-lg shadow-red-200 animate-pulse"></div>
                  <h4 className="font-bold text-red-800 mb-2">Addicció</h4>
                  <p className="text-xs text-red-700">Pèrdua total de control. Afectació greu de la vida personal, laboral o acadèmica. Necessitat d'ajuda professional.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-blue-800 text-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5"/> Consells Pràctics de Prevenció
                </h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="bg-white/60 p-3 rounded-lg text-sm text-blue-900 border border-blue-100">
                    <strong>Desconnexió Digital:</strong> Estableix zones lliures de pantalles (dormitori, taula de menjar).
                  </li>
                  <li className="bg-white/60 p-3 rounded-lg text-sm text-blue-900 border border-blue-100">
                    <strong>Alternativa Saludable:</strong> Substitueix el temps de pantalla per esport o lectura física.
                  </li>
                  <li className="bg-white/60 p-3 rounded-lg text-sm text-blue-900 border border-blue-100">
                    <strong>Control Econòmic:</strong> No guardis targetes de crèdit al navegador o apps de jocs.
                  </li>
                  <li className="bg-white/60 p-3 rounded-lg text-sm text-blue-900 border border-blue-100">
                    <strong>Higiene del Son:</strong> Deixa les pantalles 1 hora abans d'anar a dormir.
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
