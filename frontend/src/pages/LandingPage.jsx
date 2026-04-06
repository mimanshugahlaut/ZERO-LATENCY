import { useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { NAV_ITEMS } from '../utils/constants';

export default function LandingPage({ onEnterApp }) {
  return (
    <div className="landing-container">
      <div className="bg-mesh">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      
      <div className="landing-content slide-up">
        <h1 className="landing-title">
          ChainVote
        </h1>
        <p className="landing-subtitle text-muted">
          The most secure, transparent, and user-friendly on-chain voting system.
          <br/>Zero Latency. Zero Fraud. Total Transparency.
        </p>
        
        <button 
          onClick={onEnterApp}
          className="btn btn-primary btn-lg btn-enter pulse-glow"
        >
          Enter Portal 
        </button>

        <div className="landing-features">
          {NAV_ITEMS.slice(0, 3).map((item, i) => (
            <div key={item.id} className={`feature-card glass delay-${i}`}>
              <span className="feature-icon">{item.emoji}</span>
              <h3 className="feature-label">{item.label}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
