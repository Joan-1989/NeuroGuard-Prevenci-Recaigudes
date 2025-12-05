import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { UserProfile, DailyStat } from '../types';

interface DashboardProps {
  user: UserProfile;
  data: DailyStat[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, data }) => {
  const isAdolescent = user.type === 'adolescent';
  const isElderly = user.type === 'elderly';

  const chartColor = isAdolescent ? '#8b5cf6' : isElderly ? '#16a34a' : '#3b82f6';
  const bgColor = isAdolescent ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100';
  const textColor = isAdolescent ? 'text-gray-100' : 'text-gray-800';

  return (
    <div className={`p-6 rounded-xl border shadow-sm ${bgColor} ${textColor} mb-8`}>
      <h2 className={`text-2xl font-bold mb-6 ${isAdolescent ? 'font-mono uppercase tracking-wider text-purple-400' : ''}`}>
        {isAdolescent ? 'Estadístiques del Sistema' : isElderly ? 'El meu progrés' : 'Tauler de Control: Benestar Digital'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-4 rounded-lg ${isAdolescent ? 'bg-slate-800' : 'bg-blue-50'}`}>
          <p className="text-sm opacity-70 mb-1">
             {isAdolescent ? 'Dies sense glitch' : 'Dies de ratxa'}
          </p>
          <p className="text-3xl font-bold">{user.streak}</p>
        </div>
        <div className={`p-4 rounded-lg ${isAdolescent ? 'bg-slate-800' : 'bg-green-50'}`}>
          <p className="text-sm opacity-70 mb-1">
            {isAdolescent ? 'XP Acumulada' : isElderly ? 'Segells aconseguits' : 'Hores recuperades'}
          </p>
          <p className="text-3xl font-bold">{user.currency}</p>
        </div>
        <div className={`p-4 rounded-lg ${isAdolescent ? 'bg-slate-800' : 'bg-purple-50'}`}>
          <p className="text-sm opacity-70 mb-1">Nivell Actual</p>
          <p className="text-3xl font-bold">Nv. {user.level}</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <h3 className="text-lg font-semibold mb-4">
            {isAdolescent ? 'Nivells de Dopamina (Simulat)' : 'Evolució de l\'Ansietat'}
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={isAdolescent ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="day" stroke={isAdolescent ? '#94a3b8' : '#64748b'} />
            <YAxis stroke={isAdolescent ? '#94a3b8' : '#64748b'} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isAdolescent ? '#1e293b' : '#fff',
                borderColor: isAdolescent ? '#475569' : '#e2e8f0',
                color: isAdolescent ? '#fff' : '#000'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="anxiety" 
              name="Ansietat/Estrès" 
              stroke={chartColor} 
              strokeWidth={3}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!isElderly && (
        <div className="h-64 w-full mt-8">
            <h3 className="text-lg font-semibold mb-4">Temps de Pantalla vs Objectiu</h3>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isAdolescent ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="day" stroke={isAdolescent ? '#94a3b8' : '#64748b'} />
                    <YAxis stroke={isAdolescent ? '#94a3b8' : '#64748b'} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="screentime" name="Hores d'ús" fill={isAdolescent ? '#f43f5e' : '#64748b'} radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
