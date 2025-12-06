
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, auth, db, doc, onSnapshot, getUserProfile, updateDoc, messaging, onMessage } from './services/firebase';
import { UserProfile, RelapseManual, DiaryEntry } from './types';
import Auth from './components/Auth';
import ManualDashboard from './components/ManualDashboard';
import CrisisComponent from './components/CrisisComponent';
import Theory from './components/Theory';
import Profile from './components/Profile';
import RoleplayGame from './components/RoleplayGame'; // Bonus feature retained
import SosButton from './components/SosButton';
import Planner from './components/Planner';
import { BookOpen, Shield, PenTool, User as UserIcon, LogOut, Menu, X, BrainCircuit, Calendar } from 'lucide-react';
import { collection, addDoc, query, orderBy, serverTimestamp } from './services/firebase';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeManual, setActiveManual] = useState<RelapseManual | null>(null);
  const [view, setView] = useState<'manual' | 'theory' | 'diary' | 'profile' | 'crisis' | 'roleplay' | 'planner'>('manual');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      // Optional: Display a toast or custom alert here
      if (payload.notification) {
          const { title, body } = payload.notification;
          // Simple browser notification if allowed
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

  // --- Diary Logic (Simplified inside App for now) ---
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
          <p className="px-4 text-xs font-bold text-slate-400 uppercase mt-4 mb-2">Principal</p>
          <NavItem id="manual" label="El Meu Manual" icon={BookOpen} />
          <NavItem id="planner" label="Planificació" icon={Calendar} />
          <NavItem id="crisis" label="Pla de Crisi" icon={Shield} />
          <NavItem id="diary" label="Diari Personal" icon={PenTool} />
          
          <p className="px-4 text-xs font-bold text-slate-400 uppercase mt-6 mb-2">Aprenentatge</p>
          <NavItem id="theory" label="Marc Teòric" icon={BrainCircuit} />
          <NavItem id="roleplay" label="Entrenament (Roleplay)" icon={UserIcon} />

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
             <NavItem id="manual" label="El Meu Manual" icon={BookOpen} />
             <NavItem id="planner" label="Planificació" icon={Calendar} />
             <NavItem id="crisis" label="Pla de Crisi" icon={Shield} />
             <NavItem id="diary" label="Diari Personal" icon={PenTool} />
             <NavItem id="theory" label="Marc Teòric" icon={BrainCircuit} />
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
        
        {view === 'manual' && activeManual && userProfile && (
           <ManualDashboard manual={activeManual} manualId={userProfile.activeManualId} userId={user.uid} />
        )}

        {view === 'planner' && activeManual && userProfile && (
           <Planner manual={activeManual} manualId={userProfile.activeManualId} userId={user.uid} />
        )}

        {view === 'crisis' && activeManual && userProfile && (
           <div className="max-w-2xl mx-auto space-y-6">
              <CrisisComponent 
                plan={activeManual.crisisPlan} 
                onUpdate={(newPlan) => {
                  const manualRef = doc(db, `users/${user.uid}/manuals`, userProfile.activeManualId);
                  updateDoc(manualRef, { crisisPlan: newPlan });
                }} 
              />
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm mt-6">
                <h3 className="font-bold text-lg mb-4 text-center">Necessites una pausa ara mateix?</h3>
                <SosButton profileType="adult" /> 
                <p className="text-center text-xs text-slate-400 mt-4">Activar el botó obrirà la pantalla d'Urge Surfing.</p>
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

        {view === 'theory' && <Theory />}
        
        {view === 'roleplay' && <div className="max-w-3xl mx-auto"><RoleplayGame /></div>}

        {view === 'profile' && userProfile && <Profile user={userProfile} />}

      </main>

    </div>
  );
}
