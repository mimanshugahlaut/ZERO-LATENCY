import { useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { NAV_ITEMS } from '../utils/constants';

export default function LandingPage({ onEnterApp }) {
  return (
    <div className="min-h-screen bg-[#0f111a] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          ChainVote
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          The most secure, transparent, and user-friendly on-chain voting system.
          Zero Latency. Zero Fraud. Total Transparency.
        </p>
        
        <button 
          onClick={onEnterApp}
          className="bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
        >
          Enter Portal 
        </button>

        <div className="mt-20 grid grid-cols-3 gap-8">
          {NAV_ITEMS.slice(0, 3).map(item => (
            <div key={item.id} className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              <span className="text-3xl mb-2 block">{item.emoji}</span>
              <h3 className="font-bold">{item.label}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
