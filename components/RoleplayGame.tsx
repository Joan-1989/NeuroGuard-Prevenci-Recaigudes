import React, { useState, useEffect } from 'react';
import { generateRoleplayScenario } from '../services/geminiService';
import { RoleplayScenario } from '../types';
import { 
  Brain, Users, Compass, Trophy, Star, ArrowRight, RefreshCw, 
  CheckCircle, XCircle, Zap, Target, LayoutGrid, Timer, MousePointer2, Shuffle,
  Heart, Wind, Activity
} from 'lucide-react';

type GameMode = 'menu' | 'roleplay' | 'cognitive' | 'values' | 'focus' | 'association' | 'emotional' | 'breathing';

const RoleplayGame: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('menu');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  
  // Roleplay State
  const [scenario, setScenario] = useState<RoleplayScenario | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; score: number } | null>(null);

  // Cognitive State
  const [cognitiveStep, setCognitiveStep] = useState(0);
  const [cognitiveCorrect, setCognitiveCorrect] = useState<boolean | null>(null);

  // Values State
  const [valuesStep, setValuesStep] = useState(0);

  // Focus Game State
  const [focusTargets, setFocusTargets] = useState<{id: number, type: 'good'|'bad', x: number, y: number}[]>([]);
  const [focusScore, setFocusScore] = useState(0);
  const [focusTimeLeft, setFocusTimeLeft] = useState(30);
  const [focusActive, setFocusActive] = useState(false);

  // Association Game State
  const [associationCards, setAssociationCards] = useState<{id: number, text: string, type: 'trigger'|'coping', matchId: number, matched: boolean, selected: boolean}[]>([]);
  const [associationMatches, setAssociationMatches] = useState(0);

  // Emotional Lab State
  const [emotionalStep, setEmotionalStep] = useState(0);
  const [emotionalFeedback, setEmotionalFeedback] = useState<string | null>(null);

  // Breathing Challenge State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathScore, setBreathScore] = useState(0);

  // --- ROLEPLAY LOGIC ---
  const startRoleplay = async () => {
    setMode('roleplay');
    setLoading(true);
    setFeedback(null);
    const result = await generateRoleplayScenario("pressió de grup en apostes esportives");
    setScenario(result);
    setLoading(false);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (!scenario) return;
    const selected = scenario.options[optionIndex];
    setFeedback({ text: selected.feedback, score: selected.score_impact });
    setScore(prev => prev + selected.score_impact);
  };

  // --- COGNITIVE GAME DATA ---
  const COGNITIVE_CHALLENGES = [
    {
      distortion: "Si no jugo avui, perdona la ratxa i soc un fracassat.",
      type: "Pensament Polaritzat (Tot o Res)",
      correct_reframing: "La meva vàlua no depèn d'una ratxa. Descansar és part de l'èxit.",
      options: [
        "És veritat, he de jugar sigui com sigui.",
        "La meva vàlua no depèn d'una ratxa. Descansar és part de l'èxit.",
        "Potser puc jugar només una mica per no perdre-la."
      ],
      correctIndex: 1
    },
    {
      distortion: "Segur que tothom s'ho està passant bé menys jo.",
      type: "Lectura de Pensament / Sobregeneralització",
      correct_reframing: "Les xarxes mostren només el millor. Tothom té moments avorrits.",
      options: [
        "Sí, la meva vida és avorrida.",
        "Les xarxes mostren només el millor. Tothom té moments avorrits.",
        "Hauria de sortir més encara que no en tingui ganes."
      ],
      correctIndex: 1
    },
    {
      distortion: "M'he gastat 50€. Ara he de recuperar-los com sigui.",
      type: "Fal·làcia del Cost Enfonsat",
      correct_reframing: "Els diners ja s'han perdut. Jugar més només augmentarà la pèrdua.",
      options: [
        "Tinc un sistema per recuperar-ho.",
        "Els diners ja s'han perdut. Jugar més només augmentarà la pèrdua.",
        "Demana un préstec ràpid."
      ],
      correctIndex: 1
    }
  ];

  const handleCognitiveAnswer = (index: number) => {
    if (index === COGNITIVE_CHALLENGES[cognitiveStep].correctIndex) {
        setCognitiveCorrect(true);
        setScore(prev => prev + 20);
        setTimeout(() => {
            setCognitiveCorrect(null);
            setCognitiveStep(prev => (prev + 1) % COGNITIVE_CHALLENGES.length);
        }, 1500);
    } else {
        setCognitiveCorrect(false);
        setTimeout(() => setCognitiveCorrect(null), 1000);
    }
  };

  // --- VALUES GAME DATA ---
  const VALUES_SCENARIOS = [
      {
          context: "Et conviden a una festa on saps que hi haurà consum.",
          dilemma: "El teu valor principal és la SALUT.",
          options: [
              { text: "Hi vaig però prometo no consumir.", alignment: "low" },
              { text: "Proposo un pla alternatiu d'esport als amics.", alignment: "high" },
              { text: "Em quedo a casa jugant a la consola.", alignment: "neutral" }
          ],
          feedback_high: "Perfecte! Has liderat amb el teu valor i creat una alternativa saludable."
      },
      {
        context: "Has rebut uns diners inesperats.",
        dilemma: "El teu valor principal és la SEGURETAT (Estalvi).",
        options: [
            { text: "Els poso directament al compte d'estalvi.", alignment: "high" },
            { text: "Em compro aquell joc que volia.", alignment: "low" },
            { text: "Convido als amics a sopar.", alignment: "neutral" }
        ],
        feedback_high: "Excel·lent. Prioritzar la seguretat futura et dona pau mental."
    }
  ];

  const handleValuesChoice = (alignment: string) => {
      if (alignment === 'high') {
          setScore(prev => prev + 30);
          alert(VALUES_SCENARIOS[valuesStep].feedback_high);
      } else {
          alert("Aquesta opció no s'alinea del tot amb el teu valor. Torna-ho a provar.");
      }
      setValuesStep(prev => (prev + 1) % VALUES_SCENARIOS.length);
  };

  // --- FOCUS ZEN GAME LOGIC ---
  const startFocusGame = () => {
      setMode('focus');
      setFocusActive(true);
      setFocusScore(0);
      setFocusTimeLeft(30);
      setFocusTargets([]);
  };

  useEffect(() => {
      if (!focusActive) return;
      
      const timer = setInterval(() => {
          setFocusTimeLeft(prev => {
              if (prev <= 1) {
                  setFocusActive(false);
                  setScore(s => s + focusScore);
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);

      const spawner = setInterval(() => {
          setFocusTargets(prev => {
              if (prev.length > 5) return prev; // Limit items on screen
              const type = Math.random() > 0.3 ? 'good' : 'bad';
              return [...prev, {
                  id: Date.now(),
                  type,
                  x: Math.random() * 80 + 10, // 10% to 90%
                  y: Math.random() * 80 + 10
              }];
          });
      }, 800);

      return () => {
          clearInterval(timer);
          clearInterval(spawner);
      };
  }, [focusActive, focusScore]);

  const handleFocusClick = (id: number, type: 'good'|'bad') => {
      if (type === 'good') {
          setFocusScore(s => s + 10);
      } else {
          setFocusScore(s => Math.max(0, s - 20)); // Penalty
      }
      setFocusTargets(prev => prev.filter(t => t.id !== id));
  };

  // --- ASSOCIATION GAME LOGIC ---
  const startAssociationGame = () => {
      setMode('association');
      const pairs = [
          { trigger: "Estrès Laboral", coping: "Pausa de 5 minuts" },
          { trigger: "Avorriment", coping: "Llegir un llibre" },
          { trigger: "Discussió", coping: "Trucar a un amic" },
          { trigger: "Solitud", coping: "Anar al parc" }
      ];
      
      let cards: any[] = [];
      pairs.forEach((p, idx) => {
          cards.push({ id: idx * 2, text: p.trigger, type: 'trigger', matchId: idx, matched: false, selected: false });
          cards.push({ id: idx * 2 + 1, text: p.coping, type: 'coping', matchId: idx, matched: false, selected: false });
      });
      
      // Shuffle
      cards.sort(() => Math.random() - 0.5);
      setAssociationCards(cards);
      setAssociationMatches(0);
  };

  const handleCardClick = (id: number) => {
      const clickedCard = associationCards.find(c => c.id === id);
      if (clickedCard?.matched || clickedCard?.selected) return;

      const newCards = associationCards.map(c => c.id === id ? { ...c, selected: true } : c);
      setAssociationCards(newCards);

      const selectedCards = newCards.filter(c => c.selected && !c.matched);
      
      if (selectedCards.length === 2) {
          if (selectedCards[0].matchId === selectedCards[1].matchId) {
              // Match found
              setTimeout(() => {
                  setAssociationCards(prev => prev.map(c => 
                      c.matchId === selectedCards[0].matchId ? { ...c, matched: true, selected: false } : c
                  ));
                  setAssociationMatches(m => m + 1);
                  setScore(s => s + 20);
              }, 500);
          } else {
              // No match
              setTimeout(() => {
                  setAssociationCards(prev => prev.map(c => ({ ...c, selected: false })));
              }, 1000);
          }
      }
  };

  // --- EMOTIONAL LAB LOGIC ---
  const EMOTIONAL_SCENARIOS = [
      {
          text: "Sents una pressió al pit i les mans et suen abans de parlar en públic.",
          emotion: "Ansietat",
          options: ["Tristesa", "Ansietat", "Enuig", "Alegria"],
          feedback: "Correcte. Els símptomes físics indiquen una resposta d'alerta."
      },
      {
          text: "Et sents pesat, sense energia i res et motiva, ni tan sols el que abans t'agradava.",
          emotion: "Apatia/Tristesa",
          options: ["Apatia/Tristesa", "Por", "Calma", "Ràbia"],
          feedback: "Exacte. L'anhedonia (falta de plaer) és clau aquí."
      }
  ];

  const handleEmotionalAnswer = (option: string) => {
      const current = EMOTIONAL_SCENARIOS[emotionalStep];
      if (option === current.emotion) {
          setEmotionalFeedback(current.feedback);
          setScore(s => s + 15);
          setTimeout(() => {
              setEmotionalFeedback(null);
              setEmotionalStep(p => (p + 1) % EMOTIONAL_SCENARIOS.length);
          }, 2000);
      } else {
          setEmotionalFeedback("No exactament. Torna-ho a intentar observant els símptomes.");
          setTimeout(() => setEmotionalFeedback(null), 1500);
      }
  };

  // --- BREATHING CHALLENGE LOGIC ---
  const startBreathingGame = () => {
      setMode('breathing');
      setBreathingActive(true);
      setBreathScore(0);
  };

  useEffect(() => {
      if (!breathingActive) return;
      const cycle = setInterval(() => {
          setBreathPhase(p => {
              if (p === 'inhale') return 'hold';
              if (p === 'hold') return 'exhale';
              return 'inhale';
          });
      }, 4000); // 4-4-4 cycle
      return () => clearInterval(cycle);
  }, [breathingActive]);

  const handleBreathClick = () => {
      // Simple mechanic: click only during exhale to "release" tension
      if (breathPhase === 'exhale') {
          setBreathScore(s => s + 5);
      } else {
          setBreathScore(s => Math.max(0, s - 2)); // Penalty
      }
  };


  // --- MAIN MENU RENDER ---
  if (mode === 'menu') {
    return (
        <div className="space-y-8 animate-fadeIn pb-20">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                <div className="relative z-10 text-center">
                    <h2 className="text-3xl font-bold mb-2">NeuroGym</h2>
                    <p className="text-purple-200 mb-6">Entrena el teu cervell per a la recuperació.</p>
                    <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-purple-500/30">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="font-mono font-bold text-lg">{score} XP</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                
                {/* Cognitive Section */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Entrenament Cognitiu</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <button onClick={() => setMode('cognitive')} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <Brain size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Refutació de Pensaments</h3>
                                <p className="text-xs text-slate-500">Detecta i desmunta trampes mentals.</p>
                            </div>
                        </button>
                        <button onClick={startFocusGame} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                <Target size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Focus Zen</h3>
                                <p className="text-xs text-slate-500">Millora el control d'impulsos (Inhibició).</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Behavioral Section */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Entrenament Conductual</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <button onClick={startRoleplay} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Simulació Social</h3>
                                <p className="text-xs text-slate-500">Practica l'assertivitat amb IA.</p>
                            </div>
                        </button>
                        <button onClick={startAssociationGame} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                <Shuffle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Associació d'Eines</h3>
                                <p className="text-xs text-slate-500">Connecta problemes amb solucions.</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Emotional & Values Section */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Emocions i Valors</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <button onClick={() => setMode('values')} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <Compass size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Dilemes Ètics</h3>
                                <p className="text-xs text-slate-500">Pren decisions alineades amb valors.</p>
                            </div>
                        </button>
                        <button onClick={() => setMode('emotional')} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Laboratori Emocional</h3>
                                <p className="text-xs text-slate-500">Millora la teva alfabetització emocional.</p>
                            </div>
                        </button>
                        <button onClick={startBreathingGame} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group text-left flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                                <Wind size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Repte de Respiració</h3>
                                <p className="text-xs text-slate-500">Sincronitza't per calmar l'ansietat.</p>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
  }

  // --- FOCUS GAME RENDER ---
  if (mode === 'focus') {
      return (
          <div className="max-w-3xl mx-auto h-[600px] bg-slate-900 rounded-3xl relative overflow-hidden shadow-2xl animate-fadeIn cursor-crosshair border-4 border-slate-700">
              {/* HUD */}
              <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
                  <div className="text-white font-mono text-xl flex items-center gap-2"><Trophy className="text-yellow-400"/> {focusScore}</div>
                  <div className={`font-mono text-2xl font-bold ${focusTimeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      {focusTimeLeft}s
                  </div>
                  <button onClick={() => setMode('menu')} className="bg-slate-700 text-white px-3 py-1 rounded hover:bg-slate-600 text-xs">Sortir</button>
              </div>

              {/* Game Area */}
              {focusActive ? (
                  <div className="w-full h-full relative">
                      {focusTargets.map(t => (
                          <button
                            key={t.id}
                            style={{ left: `${t.x}%`, top: `${t.y}%` }}
                            className={`absolute w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-lg animate-bounce ${t.type === 'good' ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}
                            onClick={() => handleFocusClick(t.id, t.type)}
                          >
                              {t.type === 'good' ? <Zap className="text-white w-8 h-8"/> : <XCircle className="text-white w-8 h-8"/>}
                          </button>
                      ))}
                  </div>
              ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30 text-center">
                      <h2 className="text-4xl font-bold text-white mb-4">Temps Esgotat!</h2>
                      <p className="text-2xl text-yellow-400 mb-8 font-mono">Puntuació Final: {score}</p>
                      <button onClick={() => setMode('menu')} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all">
                          Tornar al Menú
                      </button>
                  </div>
              )}
              
              {/* Instructions Overlay if waiting to start */}
              {!focusActive && focusTimeLeft === 30 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 text-center p-8">
                      <Target className="w-20 h-20 text-green-500 mb-6" />
                      <h2 className="text-3xl font-bold text-white mb-4">Focus Zen</h2>
                      <p className="text-gray-300 mb-8 max-w-md">
                          Entrena la teva inhibició. Clica els <span className="text-green-400 font-bold">raigs verds</span> (positius). Evita les <span className="text-red-400 font-bold">creus vermelles</span> (negatius).
                      </p>
                      <button onClick={startFocusGame} className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all animate-pulse">
                          COMENÇAR
                      </button>
                  </div>
              )}
          </div>
      )
  }

  // --- ASSOCIATION GAME RENDER ---
  if (mode === 'association') {
      return (
          <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Shuffle className="w-6 h-6 text-orange-500"/> Associació d'Eines</h3>
                  <button onClick={() => setMode('menu')} className="text-slate-400 hover:text-slate-600">Sortir</button>
              </div>
              
              {associationMatches === 4 ? (
                  <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center animate-fadeIn">
                      <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
                      <h2 className="text-3xl font-bold text-green-800 mb-2">Entrenament Completat!</h2>
                      <p className="text-green-700 mb-8">Has connectat correctament les eines amb els seus problemes.</p>
                      <button onClick={() => setMode('menu')} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all">
                          Tornar al Menú
                      </button>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {associationCards.map(card => (
                          <button
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            disabled={card.matched}
                            className={`h-32 p-4 rounded-xl border-2 flex items-center justify-center text-center font-medium transition-all transform ${
                                card.matched 
                                    ? 'bg-green-100 border-green-300 text-green-800 opacity-50 scale-95' 
                                    : card.selected 
                                        ? 'bg-blue-50 border-blue-500 text-blue-800 scale-105 shadow-lg' 
                                        : 'bg-white border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-700'
                            }`}
                          >
                              {card.text}
                          </button>
                      ))}
                  </div>
              )}
              <p className="text-center text-slate-400 text-sm mt-8">Troba les parelles: Situació ↔ Solució</p>
          </div>
      )
  }

  // --- EMOTIONAL LAB RENDER ---
  if (mode === 'emotional') {
      const current = EMOTIONAL_SCENARIOS[emotionalStep];
      return (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border-4 border-pink-100 animate-fadeIn text-center">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-pink-900 flex items-center gap-2"><Heart className="w-6 h-6"/> Laboratori Emocional</h3>
                  <button onClick={() => setMode('menu')} className="text-slate-400 hover:text-slate-600">Sortir</button>
              </div>
              
              <div className="mb-8">
                  <p className="text-lg text-slate-700 italic">"{current.text}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  {current.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleEmotionalAnswer(opt)}
                        className="p-4 rounded-xl border-2 border-slate-100 hover:border-pink-400 hover:bg-pink-50 transition-all font-medium text-slate-700"
                      >
                          {opt}
                      </button>
                  ))}
              </div>
              {emotionalFeedback && (
                  <div className="mt-6 p-4 bg-pink-50 text-pink-800 rounded-xl animate-fadeIn">
                      {emotionalFeedback}
                  </div>
              )}
          </div>
      );
  }

  // --- BREATHING CHALLENGE RENDER ---
  if (mode === 'breathing') {
      return (
          <div className="max-w-xl mx-auto bg-slate-900 p-8 rounded-3xl shadow-2xl animate-fadeIn text-center relative overflow-hidden">
              <button onClick={() => setMode('menu')} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
              
              <h3 className="text-2xl font-bold text-sky-400 mb-8 flex items-center justify-center gap-2"><Wind /> Sincronització</h3>
              
              <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
                  <div className={`absolute inset-0 bg-sky-500/20 rounded-full blur-xl transition-all duration-[4000ms] ${breathPhase === 'inhale' ? 'scale-125' : 'scale-75'}`}></div>
                  <div className={`w-40 h-40 border-4 border-sky-400 rounded-full flex items-center justify-center transition-all duration-[4000ms] ${breathPhase === 'inhale' ? 'scale-110' : 'scale-90'}`}>
                      <span className="text-2xl font-bold text-white uppercase">{breathPhase}</span>
                  </div>
              </div>

              <button 
                onClick={handleBreathClick}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-900/50 active:scale-95 transition-all"
              >
                Expira Tensions (Clica quan expiris)
              </button>
              
              <div className="mt-6 text-sky-200 font-mono">Punts de Calma: {breathScore}</div>
          </div>
      );
  }

  // --- COGNITIVE GAME RENDER (Legacy updated) ---
  if (mode === 'cognitive') {
      const challenge = COGNITIVE_CHALLENGES[cognitiveStep];
      return (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border-4 border-purple-100 animate-fadeIn">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2"><Brain className="w-6 h-6"/> Laboratori de Pensament</h3>
                  <button onClick={() => setMode('menu')} className="text-slate-400 hover:text-slate-600">Sortir</button>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 text-center relative overflow-hidden">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pensament Trampa Detectat</p>
                  <p className="text-2xl font-serif italic text-slate-800">"{challenge.distortion}"</p>
                  {cognitiveCorrect !== null && (
                      <div className={`absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity ${cognitiveCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {cognitiveCorrect ? <CheckCircle size={64} /> : <XCircle size={64} />}
                      </div>
                  )}
              </div>

              <p className="text-center text-slate-600 mb-4">Quin és el pensament alternatiu més saludable?</p>

              <div className="space-y-3">
                  {challenge.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleCognitiveAnswer(idx)}
                        className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition-all text-left font-medium text-slate-700"
                      >
                          {opt}
                      </button>
                  ))}
              </div>
          </div>
      );
  }

  // --- VALUES GAME RENDER ---
  if (mode === 'values') {
      const scenario = VALUES_SCENARIOS[valuesStep];
      return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border-4 border-emerald-100 animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2"><Compass className="w-6 h-6"/> Brúixola de Decisions</h3>
                <button onClick={() => setMode('menu')} className="text-slate-400 hover:text-slate-600">Sortir</button>
            </div>

            <div className="mb-8">
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl mb-4 text-center font-bold border border-emerald-200">
                    {scenario.dilemma}
                </div>
                <p className="text-xl text-center text-slate-700 leading-relaxed">{scenario.context}</p>
            </div>

            <div className="grid gap-4">
                {scenario.options.map((opt, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleValuesChoice(opt.alignment)}
                        className="p-5 rounded-xl bg-white border-2 border-slate-100 hover:border-emerald-500 hover:shadow-md transition-all text-left font-medium text-slate-700 flex items-center justify-between group"
                    >
                        {opt.text}
                        <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                ))}
            </div>
        </div>
      );
  }

  // --- ROLEPLAY RENDER (Legacy) ---
  return (
    <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-3xl mx-auto">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-mono text-blue-400 font-bold flex items-center gap-2">
            <Users /> SIMULACIÓ SOCIAL
          </h3>
          <button onClick={() => setMode('menu')} className="text-slate-500 hover:text-white">✕</button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-blue-300 font-mono animate-pulse tracking-widest">CARREGANT ESCENARI IA...</p>
        </div>
      )}

      {scenario && !loading && !feedback && (
        <div className="animate-fadeIn">
          <div className="mb-8 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <p className="text-xs text-blue-400 uppercase tracking-widest mb-2 font-bold">CONTEXT</p>
            <p className="text-gray-300 text-lg leading-relaxed">{scenario.context}</p>
          </div>

          <div className="bg-white text-slate-900 p-6 rounded-2xl mb-8 relative shadow-lg transform rotate-1">
            <div className="absolute -top-3 -left-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
              AMIC (NPC)
            </div>
            <p className="text-2xl font-bold font-serif">"{scenario.npc_dialogue}"</p>
          </div>

          <div className="space-y-4">
            {scenario.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className="w-full text-left p-5 bg-slate-800 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-500 rounded-xl transition-all group flex items-start gap-4"
              >
                <span className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm shrink-0 group-hover:bg-blue-500 transition-colors">
                  {idx + 1}
                </span>
                <span className="text-gray-300 group-hover:text-white text-lg">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <div className="text-center py-10 animate-fadeIn">
           <div className={`text-7xl mb-6 ${feedback.score > 0 ? 'text-green-400' : feedback.score < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
             {feedback.score > 0 ? <CheckCircle size={80} className="mx-auto"/> : <XCircle size={80} className="mx-auto"/>}
           </div>
           <h4 className="text-2xl text-white mb-2 font-bold">
             {feedback.score > 0 ? 'Resposta Assertiva!' : 'Resposta de Risc'}
           </h4>
           <div className="inline-block bg-slate-800 px-4 py-1 rounded-full text-sm font-mono text-blue-300 mb-8">
             XP: {feedback.score > 0 ? '+' : ''}{feedback.score}
           </div>
           <p className="text-gray-300 text-lg mb-10 max-w-lg mx-auto leading-relaxed border-t border-b border-slate-800 py-6">{feedback.text}</p>
           <button
            onClick={() => setMode('menu')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-900/50"
           >
             Tornar al Centre d'Entrenament
           </button>
        </div>
      )}
    </div>
  );
};

export default RoleplayGame;