
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, auth, db, doc, onSnapshot, getUserProfile, updateDoc, messaging, onMessage } from './services/firebase';
import { UserProfile, RelapseManual, DiaryEntry, Memory, DailyStat } from './types';
import Auth from './components/Auth';
import ManualDashboard from './components/ManualDashboard';
import CrisisComponent from './components/CrisisComponent';
import Theory from './components/Theory';
import Profile from './components/Profile';
import RoleplayGame from './components/RoleplayGame';
import SosButton from './components/SosButton';
import Planner from './components/Planner';
import Dashboard from './components/Dashboard';
import VitalityBattery from './components/VitalityBattery';
import RealLifeAlbum from './components/RealLifeAlbum';
import CorporateLearningHub from './components/CorporateLearningHub';
import CoolingOffTimer from './components/CoolingOffTimer';
import { BookOpen, Shield, PenTool, User as UserIcon, LogOut, Menu, X, BrainCircuit, Calendar, LayoutDashboard, Camera, GraduationCap, Clock } from 'lucide-react';
import { collection, addDoc, query, orderBy, serverTimestamp, arrayUnion } from './services/firebase';

// Mock Data for Dashboard
const MOCK_STATS: DailyStat[] = [
  { day: 'Dl', anxiety: 65, screentime: 4.5 },
  { day: 'Dt', anxiety: 55, screentime: 3.2 },
  { day: 'Dc', anxiety: 40, screentime: 2.8 },
  { day: 'Dj', anxiety: 45, screentime: 3.0 },
  { day: 'Dv', anxiety: 30, screentime: 2.1 },
  { day: 'Ds', anxiety: 25, screentime: 1.5 },
  { day: 'Dg', anxiety: 20, screentime: 1.2 },
];

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeManual, setActiveManual] = useState<RelapseManual | null>(null);
  const [view, setView] = useState<'dashboard' | 'manual' | 'theory' | 'diary' | 'profile' | 'crisis' | 'roleplay' | 'planner' | 'loot' | 'learning'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCoolingOff, setShowCoolingOff] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch Profile
        const profile = await getUserProfile(u.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
        setActiveManual(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Notification Listener (Foreground)
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      if (payload.notification) {
          const { title, body } = payload.notification;
          if (Notification.permission === 'granted') {
              new Notification(title || 'Nova notificació', {
                  body: body || '',
                  icon: '/logo.ico'
              });
          } else {
              alert(`${title}: ${body}`);
          }
      }
    });
  }, []);

  // Manual Listener
  useEffect(() => {
    if (!user || !userProfile?.activeManualId) return;
    
    const manualRef = doc(db, `users/${user.uid}/manuals`, userProfile.activeManualId);
    const unsubscribe = onSnapshot(manualRef, (doc) => {
      if (doc.exists()) {
        setActiveManual({ id: doc.id, ...doc.data() } as RelapseManual);
      }
    });
    return unsubscribe;
  }, [user, userProfile]);

  // --- Diary Logic ---
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [newDiaryText, setNewDiaryText] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/diaryEntries`), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
       const entries = snap.docs.map(d => ({ id: d.id, ...d.data() } as DiaryEntry));
       setDiaryEntries(entries);
    });
    return unsub;
  }, [user]);

  const handleAddDiary = async () => {
    if(!newDiaryText.trim()) return;
    await addDoc(collection(db, `users/${user.uid}/diaryEntries`), {
       text: newDiaryText,
       createdAt: serverTimestamp()
    });
    setNewDiaryText('');
  };

  // --- Memories / Loot Logic ---
  const [memories, setMemories] = useState<Memory[]>([]);
  
  useEffect(() => {
    if(!user) return;
    // For demo purposes, we are fetching memories from a subcollection or the user profile directly
    // Ideally this would be a real-time listener on a subcollection
    // Here we simulate it with local state or fetching if implemented
  }, [user]);

  const handleAddMemory = async (note: string, imageUrl?: string) => {
      // In a real app, save to Firestore subcollection
      const newMemory: Memory = {
          id: Date.now(),
          note,
          date: new Date().toLocaleDateString(),
          type: 'Moment Real',
          imageUrl: imageUrl
      };
      setMemories([newMemory, ...memories]);
      // Also update vitality battery as a reward
      if(userProfile) {
          const newCurrency = userProfile.currency + 50; // XP
          await updateDoc(doc(db, "users", user.uid), { currency: newCurrency });
      }
  };


  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Carregant NeuroGuard...</div>;

  if (!user) return <Auth />;

  // --- NAVIGATION COMPONENT ---
  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => { setView(id); setMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === id ? 'bg-orange-100 text-orange-700 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
    >
      <Icon size={20} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
             <div>
               <h1 className="font-bold text-slate-800">NeuroGuard</h1>
               <p className="text-xs text-slate-500 uppercase tracking-wider">Prevenció Activa</p>
             </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem id="dashboard" label="Panell Principal" icon={LayoutDashboard} />
          
          <p className="px-4 text-xs font-bold text-slate-400 uppercase mt-4 mb-2">Eines Terapèutiques</p>
          <NavItem id="manual" label="El Meu Manual" icon={BookOpen} />
          <NavItem id="planner" label="Planificació" icon={Calendar} />
          <NavItem id="crisis" label="Pla de Crisi" icon={Shield} />
          <NavItem id="diary" label="Diari Personal" icon={PenTool} />
          <NavItem id="loot" label="Àlbum (The Loot)" icon={Camera} />
          
          <p className="px-4 text-xs font-bold text-slate-400 uppercase mt-6 mb-2">Aprenentatge</p>
          <NavItem id="theory" label="Marc Teòric" icon={BrainCircuit} />
          <NavItem id="learning" label="Formació (Hub)" icon={GraduationCap} />
          <NavItem id="roleplay" label="Entrenament" icon={UserIcon} />

          <p className="px-4 text-xs font-bold text-slate-400 uppercase mt-6 mb-2">Configuració</p>
          <NavItem id="profile" label="El Meu Perfil" icon={UserIcon} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={() => auth.signOut()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors">
            <LogOut size={20} /> Tancar Sessió
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-20 px-4 py-3 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <span className="font-bold text-slate-800">NeuroGuard</span>
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
           {mobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-10 pt-20 px-4 pb-4 overflow-y-auto">
           <nav className="space-y-2">
             <NavItem id="dashboard" label="Panell Principal" icon={LayoutDashboard} />
             <NavItem id="manual" label="El Meu Manual" icon={BookOpen} />
             <NavItem id="planner" label="Planificació" icon={Calendar} />
             <NavItem id="crisis" label="Pla de Crisi" icon={Shield} />
             <NavItem id="diary" label="Diari Personal" icon={PenTool} />
             <NavItem id="loot" label="Àlbum (The Loot)" icon={Camera} />
             <NavItem id="theory" label="Marc Teòric" icon={BrainCircuit} />
             <NavItem id="learning" label="Formació (Hub)" icon={GraduationCap} />
             <NavItem id="roleplay" label="Entrenament" icon={UserIcon} />
             <NavItem id="profile" label="El Meu Perfil" icon={UserIcon} />
             <div className="h-px bg-slate-100 my-4"></div>
             <button onClick={() => auth.signOut()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 bg-red-50 font-medium">
               <LogOut size={20} /> Tancar Sessió
             </button>
           </nav>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 min-h-screen transition-all duration-300 ${mobileMenuOpen ? 'blur-sm md:blur-none' : ''} md:ml-72 pt-20 md:pt-8 px-4 md:px-8 pb-24`}>
        
        {view === 'dashboard' && userProfile && (
            <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <Dashboard user={userProfile} data={MOCK_STATS} />
                    </div>
                    <div className="lg:w-1/3">
                        <VitalityBattery 
                            percentage={75} 
                            onRecharge={() => setView('loot')} 
                            draining={false} 
                        />
                    </div>
                </div>
            </div>
        )}

        {view === 'manual' && activeManual && userProfile && (
           <ManualDashboard manual={activeManual} manualId={userProfile.activeManualId} userId={user.uid} />
        )}

        {view === 'planner' && activeManual && userProfile && (
           <Planner manual={activeManual} manualId={userProfile.activeManualId} userId={user.uid} />
        )}

        {view === 'crisis' && activeManual && userProfile && (
           <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
              <CrisisComponent 
                plan={activeManual.crisisPlan} 
                onUpdate={(newPlan) => {
                  const manualRef = doc(db, `users/${user.uid}/manuals`, userProfile.activeManualId);
                  updateDoc(manualRef, { crisisPlan: newPlan });
                }} 
              />
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-center">Protocol SOS</h3>
                    <SosButton profileType="adult" /> 
                    <p className="text-center text-xs text-slate-400 mt-4">Activar el botó obrirà la pantalla d'Urge Surfing.</p>
                 </div>
                 
                 <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                    <h3 className="font-bold text-lg mb-4">Temps de Reflexió</h3>
                    <p className="text-sm text-slate-500 mb-6">Abans d'una compra o acció impulsiva, activa el comptador.</p>
                    <button 
                        onClick={() => setShowCoolingOff(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all"
                    >
                        <Clock className="w-5 h-5" /> Iniciar 20 Min
                    </button>
                 </div>
              </div>
           </div>
        )}

        {view === 'diary' && (
           <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-slate-800">El Meu Diari</h2>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <textarea 
                  value={newDiaryText} 
                  onChange={e => setNewDiaryText(e.target.value)} 
                  className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 min-h-[120px] mb-3 resize-none"
                  placeholder="Com et sents avui?..."
                />
                <div className="flex justify-end">
                   <button onClick={handleAddDiary} className="bg-teal-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-teal-700">Guardar Entrada</button>
                </div>
              </div>
              <div className="space-y-4">
                 {diaryEntries.map(entry => (
                   <div key={entry.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                        {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleString() : 'Just ara'}
                      </p>
                      <p className="text-slate-700 whitespace-pre-wrap">{entry.text}</p>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {view === 'loot' && (
            <div className="h-[calc(100vh-120px)] animate-fadeIn">
                <RealLifeAlbum 
                    memories={memories} 
                    onAddMemory={(note, img) => handleAddMemory(note, img)} 
                    canAdd={true} 
                />
            </div>
        )}

        {view === 'learning' && userProfile && (
            <CorporateLearningHub user={userProfile} />
        )}

        {view === 'theory' && <Theory />}
        
        {view === 'roleplay' && <div className="max-w-3xl mx-auto"><RoleplayGame /></div>}

        {view === 'profile' && userProfile && <Profile user={userProfile} />}

      </main>

      {/* Cooling Off Timer Overlay */}
      {showCoolingOff && (
          <CoolingOffTimer 
            onCancel={() => setShowCoolingOff(false)}
            onComplete={() => {
                setShowCoolingOff(false);
                alert("Temps de reflexió completat. Com et sents ara?");
            }}
          />
      )}

    </div>
  );
}
