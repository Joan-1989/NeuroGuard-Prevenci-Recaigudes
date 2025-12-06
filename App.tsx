import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, auth, db, doc, onSnapshot, updateDoc, messaging, onMessage } from './services/firebase';
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
import { 
  BookOpen, Shield, PenTool, User as UserIcon, LogOut, Menu, X, 
  BrainCircuit, Calendar, LayoutDashboard, Camera, GraduationCap, 
  Clock, PauseCircle, Zap
} from 'lucide-react';
import { collection, addDoc, query, orderBy, serverTimestamp } from './services/firebase';

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

  // --- Diary State ---
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [newDiaryText, setNewDiaryText] = useState('');
  const [diaryLinkedActivity, setDiaryLinkedActivity] = useState<{date: string, area: string} | undefined>(undefined);

  // Auth & Profile Listener
  useEffect(() => {
    let profileUnsubscribe: () => void;

    const authUnsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Listen to User Profile changes in real-time
        // This fixes the issue where archiving a manual didn't update the UI immediately
        const userRef = doc(db, "users", u.uid);
        profileUnsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
          }
        });
      } else {
        setUserProfile(null);
        setActiveManual(null);
        if (profileUnsubscribe) profileUnsubscribe();
      }
      setLoading(false);
    });

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
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
              // Fallback if notifications are not supported or blocked in context
              console.log(`${title}: ${body}`);
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
      } else {
        // Handle case where manual ID exists in profile but doc is missing
        console.warn("Manual actiu no trobat");
      }
    });
    return unsubscribe;
  }, [user, userProfile?.activeManualId]); // Depend on activeManualId to switch listeners when archiving

  // --- Diary Logic ---
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
    
    const entryData: any = {
       text: newDiaryText,
       createdAt: serverTimestamp(),
    };

    // Only add linkedActivity if it is defined, Firestore does not accept undefined
    if (diaryLinkedActivity) {
        entryData.linkedActivity = diaryLinkedActivity;
    }

    await addDoc(collection(db, `users/${user.uid}/diaryEntries`), entryData);
    setNewDiaryText('');
    setDiaryLinkedActivity(undefined);
  };

  const handleNavigateToDiary = (activityLink: { date: string; area: string; text: string }) => {
    setNewDiaryText(`Reflexió sobre l'activitat de ${activityLink.area}: "${activityLink.text}"\n\n`);
    setDiaryLinkedActivity({ date: activityLink.date, area: activityLink.area });
    setView('diary');
  };

  // --- Memories / Loot Logic ---
  const [memories, setMemories] = useState<Memory[]>([]);
  
  useEffect(() => {
    if(!user) return;
    // In a real implementation, you would fetch memories from a subcollection here.
    // For now, we are maintaining local state for the session or would need a proper firestore hook.
  }, [user]);

  const handleAddMemory = async (note: string, imageUrl?: string) => {
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


  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-orange-600 font-bold animate-pulse">Carregant NeuroGuard...</div>;

  if (!user) return <Auth />;

  // --- NAVIGATION COMPONENT ---
  const NavItem = ({ id, label, icon: Icon, extraClass = "" }: any) => (
    <button 
      onClick={() => { setView(id); setMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === id ? 'bg-orange-100 text-orange-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100'} ${extraClass}`}
    >
      <Icon size={20} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col fixed h-full z-20 shadow-lg">
        <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-white to-orange-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200">N</div>
             <div>
               <h1 className="font-bold text-slate-800 text-lg">NeuroGuard</h1>
               <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Prevenció Activa</p>
             </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem id="dashboard" label="Panell Principal" icon={LayoutDashboard} />
          
          <div className="py-2">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Eines Terapèutiques</p>
            <NavItem id="manual" label="El Meu Manual" icon={BookOpen} />
            <NavItem id="planner" label="Planificació" icon={Calendar} />
            <NavItem id="crisis" label="Pla de Crisi" icon={Shield} />
            <NavItem id="diary" label="Diari Personal" icon={PenTool} />
            <NavItem id="loot" label="Àlbum (The Loot)" icon={Camera} />
          </div>
          
          <div className="py-2">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Creixement</p>
            <NavItem id="theory" label="Marc Teòric" icon={BrainCircuit} />
            <NavItem id="learning" label="Formació (Hub)" icon={GraduationCap} />
            <NavItem id="roleplay" label="Entrenament" icon={Zap} />
          </div>

          <div className="py-2">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Usuari</p>
            <NavItem id="profile" label="El Meu Perfil" icon={UserIcon} />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50">
          <button 
            onClick={() => setShowCoolingOff(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-600 text-white font-bold shadow-md hover:bg-teal-700 transition-all transform active:scale-95"
          >
            <PauseCircle size={20} /> Pausa Reflexiva
          </button>
          <button onClick={() => auth.signOut()} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 font-medium text-sm transition-colors">
            <LogOut size={16} /> Tancar Sessió
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-30 px-4 py-3 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">N</div>
            <span className="font-bold text-slate-800">NeuroGuard</span>
         </div>
         <div className="flex gap-3">
            <button 
                onClick={() => setShowCoolingOff(true)}
                className="p-2 bg-teal-100 text-teal-700 rounded-full"
            >
                <Clock size={20} />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
            {mobileMenuOpen ? <X /> : <Menu />}
            </button>
         </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-20 pt-20 px-4 pb-4 overflow-y-auto animate-fadeIn">
           <nav className="space-y-1">
             <NavItem id="dashboard" label="Panell Principal" icon={LayoutDashboard} />
             <div className="h-px bg-slate-100 my-2"></div>
             <NavItem id="manual" label="El Meu Manual" icon={BookOpen} />
             <NavItem id="planner" label="Planificació" icon={Calendar} />
             <NavItem id="crisis" label="Pla de Crisi" icon={Shield} />
             <NavItem id="diary" label="Diari Personal" icon={PenTool} />
             <NavItem id="loot" label="Àlbum (The Loot)" icon={Camera} />
             <div className="h-px bg-slate-100 my-2"></div>
             <NavItem id="theory" label="Marc Teòric" icon={BrainCircuit} />
             <NavItem id="learning" label="Formació (Hub)" icon={GraduationCap} />
             <NavItem id="roleplay" label="Entrenament" icon={Zap} />
             <div className="h-px bg-slate-100 my-2"></div>
             <NavItem id="profile" label="El Meu Perfil" icon={UserIcon} />
             <button onClick={() => auth.signOut()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 bg-red-50 font-medium mt-4">
               <LogOut size={20} /> Tancar Sessió
             </button>
           </nav>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 min-h-screen transition-all duration-300 md:ml-72 pt-20 md:pt-8 px-4 md:px-8 pb-24 max-w-[1600px]`}>
        
        {view === 'dashboard' && userProfile && (
            <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <Dashboard user={userProfile} data={MOCK_STATS} />
                    </div>
                    <div className="lg:w-1/3">
                        <VitalityBattery 
                            percentage={userProfile.streak > 5 ? 85 : 45} // Example dynamic logic
                            onRecharge={() => setView('loot')} 
                            draining={false} 
                        />
                    </div>
                </div>
                {/* Quick Access Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* NEW SOS BUTTON ON DASHBOARD */}
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl hover:shadow-md transition-all text-center group flex flex-col items-center justify-center cursor-pointer">
                        <SosButton profileType={userProfile.type} inline={true} />
                        <span className="text-xs text-red-600 font-bold mt-2">Emergència</span>
                    </div>

                    <button onClick={() => setView('planner')} className="p-4 bg-blue-50 border border-blue-100 rounded-xl hover:shadow-md transition-all text-center group">
                        <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform"/>
                        <span className="font-bold text-blue-700">Agenda</span>
                    </button>
                    <button onClick={() => setView('learning')} className="p-4 bg-purple-50 border border-purple-100 rounded-xl hover:shadow-md transition-all text-center group">
                        <GraduationCap className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform"/>
                        <span className="font-bold text-purple-700">Cursos</span>
                    </button>
                    <button onClick={() => setView('loot')} className="p-4 bg-teal-50 border border-teal-100 rounded-xl hover:shadow-md transition-all text-center group">
                        <Camera className="w-8 h-8 text-teal-500 mx-auto mb-2 group-hover:scale-110 transition-transform"/>
                        <span className="font-bold text-teal-700">Àlbum</span>
                    </button>
                </div>
            </div>
        )}

        {view === 'manual' && activeManual && userProfile && (
           <ManualDashboard manual={activeManual} manualId={userProfile.activeManualId} userId={user.uid} />
        )}

        {view === 'planner' && activeManual && userProfile && (
           <Planner 
             manual={activeManual} 
             manualId={userProfile.activeManualId} 
             userId={user.uid} 
             onNavigateToDiary={handleNavigateToDiary}
           />
        )}

        {view === 'crisis' && activeManual && userProfile && (
           <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
                  <h2 className="text-2xl font-bold text-red-800 mb-2">Centre de Gestió de Crisi</h2>
                  <p className="text-red-700">Tens eines per superar aquest moment. Respira i segueix el teu pla.</p>
              </div>
              
              <CrisisComponent 
                plan={activeManual.crisisPlan} 
                onUpdate={(newPlan) => {
                  const manualRef = doc(db, `users/${user.uid}/manuals`, userProfile.activeManualId);
                  updateDoc(manualRef, { crisisPlan: newPlan });
                }} 
              />
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg flex flex-col items-center text-center hover:border-blue-300 transition-colors">
                    <h3 className="font-bold text-xl mb-4 text-slate-800">Protocol d'Emergència</h3>
                    <p className="text-sm text-slate-500 mb-6">Si sents que perds el control, activa l'Urge Surfing.</p>
                    <SosButton profileType="adult" inline={true} /> 
                 </div>
                 
                 <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg flex flex-col justify-center items-center text-center hover:border-teal-300 transition-colors">
                    <h3 className="font-bold text-xl mb-4 text-slate-800">Temps de Reflexió</h3>
                    <p className="text-sm text-slate-500 mb-6">Abans d'una compra o acció impulsiva, activa el comptador.</p>
                    <button 
                        onClick={() => setShowCoolingOff(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-teal-200"
                    >
                        <Clock className="w-5 h-5" /> Iniciar 20 Min
                    </button>
                 </div>
              </div>
           </div>
        )}

        {view === 'diary' && (
           <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-800 font-sans">El Meu Diari</h2>
                <span className="text-sm text-slate-500 italic">{new Date().toLocaleDateString()}</span>
              </div>
              
              {diaryLinkedActivity && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm mb-2 flex justify-between items-center">
                  <span>Vinculat a l'activitat de {diaryLinkedActivity.area} ({new Date(diaryLinkedActivity.date).toLocaleDateString()})</span>
                  <button onClick={() => setDiaryLinkedActivity(undefined)} className="text-blue-500 hover:text-blue-700">✕</button>
                </div>
              )}

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <textarea 
                  value={newDiaryText} 
                  onChange={e => setNewDiaryText(e.target.value)} 
                  className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 min-h-[150px] mb-4 resize-none text-lg placeholder:text-slate-400"
                  placeholder="Com et sents avui? Què has aconseguit?..."
                />
                <div className="flex justify-end">
                   <button onClick={handleAddDiary} className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-md shadow-orange-200 transform active:scale-95">
                     Guardar Entrada
                   </button>
                </div>
              </div>
              
              <div className="space-y-4 mt-8">
                 <h3 className="text-xl font-bold text-slate-700 mb-4">Entrades Anteriors</h3>
                 {diaryEntries.length === 0 && <p className="text-slate-400 italic">Encara no has escrit res.</p>}
                 {diaryEntries.map(entry => (
                   <div key={entry.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleString() : 'Just ara'}
                        </p>
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{entry.text}</p>
                      {entry.linkedActivity && (
                        <div className="mt-3 pt-3 border-t border-slate-50 text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3"/> Activitat: {entry.linkedActivity.area}
                        </div>
                      )}
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
        
        {view === 'roleplay' && <div className="max-w-4xl mx-auto pt-8"><RoleplayGame /></div>}

        {view === 'profile' && userProfile && <Profile user={userProfile} />}

      </main>

      {/* Cooling Off Timer Overlay */}
      {showCoolingOff && (
          <CoolingOffTimer 
            onCancel={() => setShowCoolingOff(false)}
            onComplete={() => {
                setShowCoolingOff(false);
                // In a real app, maybe trigger a confetti or journal prompt here
            }}
          />
      )}

    </div>
  );
}