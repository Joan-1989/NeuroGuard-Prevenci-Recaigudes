import React, { useState } from 'react';
import { generateRoleplayScenario } from '../services/geminiService';
import { RoleplayScenario } from '../types';

const RoleplayGame: React.FC = () => {
  const [scenario, setScenario] = useState<RoleplayScenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; score: number } | null>(null);

  const startGame = async () => {
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
  };

  const closeGame = () => {
    setScenario(null);
    setFeedback(null);
  };

  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Cyberpunk decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      
      {!scenario && !loading && (
        <div className="text-center py-8">
          <h3 className="text-xl font-mono text-purple-400 mb-4 font-bold">
            &lt; PROTOCOL_DESCONNEXIÓ /&gt;
          </h3>
          <p className="text-gray-400 mb-6">Entrena't per rebutjar la pressió social.</p>
          <button
            onClick={startGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-mono py-2 px-6 rounded border border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all"
          >
            INICIAR SIMULACIÓ
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-purple-300 font-mono animate-pulse">GENERANT ESCENARI IA...</p>
        </div>
      )}

      {scenario && !loading && !feedback && (
        <div className="animate-fadeIn">
          <div className="mb-6 border-l-4 border-purple-500 pl-4">
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Context</p>
            <p className="text-gray-300 italic">{scenario.context}</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg mb-6 border border-slate-700 relative">
            <div className="absolute -top-3 -left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">
              NPC
            </div>
            <p className="text-xl text-white font-medium">"{scenario.npc_dialogue}"</p>
          </div>

          <div className="space-y-3">
            {scenario.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className="w-full text-left p-4 bg-slate-800 hover:bg-purple-900/30 border border-slate-700 hover:border-purple-500 rounded-lg transition-colors group"
              >
                <span className="text-purple-400 font-mono mr-3 group-hover:text-purple-200">
                  [{idx + 1}]
                </span>
                <span className="text-gray-300 group-hover:text-white">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <div className="text-center py-6 animate-fadeIn">
           <div className={`text-6xl mb-4 ${feedback.score > 0 ? 'text-green-400' : feedback.score < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
             {feedback.score > 0 ? 'SUCCESS' : feedback.score < 0 ? 'FAILURE' : 'WARNING'}
           </div>
           <p className="text-xl text-white mb-2 font-bold">
             Impacte: {feedback.score > 0 ? '+' : ''}{feedback.score} XP
           </p>
           <p className="text-gray-300 mb-8 max-w-lg mx-auto">{feedback.text}</p>
           <button
            onClick={closeGame}
            className="text-purple-400 hover:text-white underline font-mono"
           >
             Tornar al menú
           </button>
        </div>
      )}
    </div>
  );
};

export default RoleplayGame;
