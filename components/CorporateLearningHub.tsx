
import React, { useState } from 'react';
import { Course, LeaderboardEntry, UserProfile } from '../types';

const SAMPLE_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Focus Deep Work',
    category: 'Productivitat',
    duration: '5 min',
    imageColor: 'from-blue-400 to-indigo-600',
    icon: '🧠',
    completed: true,
    points: 500
  },
  {
    id: 'c2',
    title: 'Detox Digital: Fonaments',
    category: 'Benestar',
    duration: '3 min',
    imageColor: 'from-emerald-400 to-teal-600',
    icon: '🌿',
    completed: false,
    points: 300
  },
  {
    id: 'c3',
    title: 'Ciberseguretat Bàsica',
    category: 'Seguretat',
    duration: '10 min',
    imageColor: 'from-orange-400 to-red-500',
    icon: '🛡️',
    completed: false,
    points: 800
  },
  {
    id: 'c4',
    title: 'Lideratge Empàtic',
    category: 'Soft Skills',
    duration: '7 min',
    imageColor: 'from-purple-400 to-pink-500',
    icon: '🤝',
    completed: false,
    points: 450
  }
];

const LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Marta R.', points: 2450, avatar: '👩‍💼', trend: 'up' },
  { id: '2', name: 'Joan P.', points: 2100, avatar: '👨‍💻', trend: 'neutral' },
  { id: '3', name: 'Laura G.', points: 1950, avatar: '👩‍🔬', trend: 'down' },
];

interface CorporateLearningHubProps {
  user: UserProfile;
}

const CorporateLearningHub: React.FC<CorporateLearningHubProps> = ({ user }) => {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleStartCourse = (course: Course) => {
    setActiveCourse(course);
  };

  const handleCompleteCourse = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setActiveCourse(null);
      alert(`Curs completat! Has guanyat ${activeCourse?.points} punts.`);
    }, 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
      {/* Main Content Area */}
      <div className="flex-1">
        
        {/* Banner Gamification */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Hola, {user.name}!</h2>
            <p className="opacity-90 mb-6 max-w-lg">
              Tens <span className="font-bold text-yellow-300">2 cursos pendents</span> aquesta setmana. 
              Completa'ls per mantenir la teva posició al rànquing.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="text-xs opacity-75 uppercase font-bold">Nivell</div>
                  <div className="font-bold text-lg">{user.level} (Expert)</div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="text-xs opacity-75 uppercase font-bold">Punts Totals</div>
                  <div className="font-bold text-lg">{user.currency + 2450}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute right-20 bottom-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
        </div>

        {/* Course Grid */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>📚</span> La teva biblioteca formativa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_COURSES.map((course) => (
              <div 
                key={course.id}
                onClick={() => handleStartCourse(course)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className={`h-32 bg-gradient-to-br ${course.imageColor} relative p-4 flex items-start justify-between`}>
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-2xl">
                    {course.icon}
                  </div>
                  {course.completed && (
                    <div className="bg-green-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                      COMPLETAT
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide">
                    {course.category}
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h4>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">⏱️ {course.duration}</span>
                    <span className="flex items-center gap-1 font-medium text-amber-500">
                      ⭐ {course.points} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar: Leaderboard & Badges */}
      <div className="w-full lg:w-80 space-y-8">
        
        {/* Leaderboard Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
            <span>Rànquing Equip</span>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded cursor-pointer">Veure tot</span>
          </h3>
          <div className="space-y-4">
            {LEADERBOARD.map((entry, idx) => (
              <div key={entry.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                  {idx + 1}
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  {entry.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-800 text-sm">{entry.name}</div>
                  <div className="text-xs text-gray-500">{entry.points} pts</div>
                </div>
                <div className="text-xs">
                  {entry.trend === 'up' && <span className="text-green-500">▲</span>}
                  {entry.trend === 'down' && <span className="text-red-400">▼</span>}
                  {entry.trend === 'neutral' && <span className="text-gray-400">-</span>}
                </div>
              </div>
            ))}
            {/* User Entry */}
            <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="w-6 text-center text-xs font-bold text-blue-600">4</div>
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-sm">
                👤
              </div>
              <div className="flex-1">
                <div className="font-bold text-blue-900 text-sm">Tu</div>
                <div className="text-xs text-blue-600">{user.currency + 2450} pts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Badges */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Insígnies Recents</h3>
          <div className="flex flex-wrap gap-2">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl border-2 border-white shadow-sm" title="Primer pas">🚀</div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl border-2 border-white shadow-sm" title="Focus 2h">🧠</div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl border-2 border-white shadow-sm" title="3 dies seguits">🔥</div>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl border-2 border-gray-200 border-dashed text-gray-400 opacity-50">🔒</div>
          </div>
        </div>

      </div>

      {/* Course Player Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="bg-slate-50 border-b p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{activeCourse.title}</h3>
                <p className="text-xs text-gray-500 uppercase">{activeCourse.category} • {activeCourse.points} Punts</p>
              </div>
              <button onClick={() => setActiveCourse(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm mb-8">
                <div className="aspect-video bg-slate-900 rounded-lg mb-6 flex items-center justify-center relative group cursor-pointer">
                   <div className="text-white text-center">
                     <div className="text-5xl mb-2">▶️</div>
                     <p className="font-mono text-sm opacity-70">Video Simulació: {activeCourse.duration}</p>
                   </div>
                </div>
                <h4 className="text-xl font-bold mb-4">Resum de la lliçó</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  En aquest mòdul aprendràs a identificar els "lladres de temps" digitals. 
                  La tècnica Pomodoro pot augmentar la teva productivitat un 30% reduint 
                  la fatiga visual i mental.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                  <p className="text-blue-800 font-medium">Tip Pro: Desactiva les notificacions flotants durant els blocs de concentració.</p>
                </div>
              </div>

              {/* Quiz Section */}
              <div className="max-w-2xl mx-auto">
                <h4 className="font-bold text-gray-700 mb-4">Quiz Ràpid</h4>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="font-medium mb-4">Quina és la durada recomanada d'un bloc de focus?</p>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 rounded border hover:bg-gray-50 hover:border-blue-300 transition-colors">A. 10 minuts</button>
                    <button className="w-full text-left p-3 rounded border hover:bg-gray-50 hover:border-blue-300 transition-colors">B. 25 a 50 minuts</button>
                    <button className="w-full text-left p-3 rounded border hover:bg-gray-50 hover:border-blue-300 transition-colors">C. 4 hores seguides</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t p-4 flex justify-end gap-3">
              <button 
                onClick={() => setActiveCourse(null)}
                className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
              >
                Tancar
              </button>
              <button 
                onClick={handleCompleteCourse}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform active:scale-95"
              >
                Completar i Rebre Punts
              </button>
            </div>

            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
                <div className="text-6xl animate-bounce">🎉 ⭐ 🎉</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateLearningHub;
