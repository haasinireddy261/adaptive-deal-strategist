import React from 'react';
import { Brain, Building2, PlayCircle, RefreshCw, Cpu } from 'lucide-react';

export default function Header({
  deals,
  selectedDeal,
  onSelectDeal,
  onLoadDemo,
  isSeeding,
  onRefresh,
  isRefreshing,
  onGenerateBriefing,
  isGenerating,
  hindsightConnected = true,
  totalMemories = 0
}) {
  const currentDeal = deals.find((d) => d.id === selectedDeal) || deals[0];

  return (
    <header 
      className="glass-card" 
      style={{ 
        padding: '12px 18px', 
        marginBottom: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.85)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Brand & Value Proposition */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(79, 70, 229, 0.3)',
            flexShrink: 0
          }}>
            <Brain size={20} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.20rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }} className="gradient-text">
                ADAPTIVE DEAL STRATEGIST
              </h1>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2px 7px',
                borderRadius: '5px'
              }}>
                <Building2 size={11} color="var(--accent-blue)" />
                <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#f8fafc' }}>
                  {currentDeal.name}
                </span>
                <span style={{ fontSize: '0.64rem', color: 'var(--text-sub)' }}>
                  · Deal Intelligence
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '1px 0 0 0', fontWeight: 500 }}>
              "Turn deal history into better next moves."
            </p>
          </div>
        </div>

        {/* Action Controls & Real-Time Hindsight Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Deal Picker */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(10, 15, 29, 0.7)',
            padding: '5px 9px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)'
          }}>
            <select
              value={selectedDeal}
              onChange={(e) => onSelectDeal(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.78rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {deals.map((d) => (
                <option key={d.id} value={d.id} style={{ background: '#0f172a', color: '#fff' }}>
                  {d.name} ({d.industry})
                </option>
              ))}
            </select>
          </div>

          {/* Primary Demo Trigger: Load Acme Demo Story */}
          <button
            onClick={onLoadDemo}
            disabled={isSeeding}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#fff',
              padding: '6px 13px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              opacity: isSeeding ? 0.7 : 1,
              cursor: isSeeding ? 'not-allowed' : 'pointer'
            }}
          >
            <PlayCircle size={13} />
            {isSeeding ? 'Seeding Hindsight...' : 'Load Acme Demo Story'}
          </button>

          {/* Prepare Next Meeting button in header */}
          {onGenerateBriefing && (
            <button
              onClick={onGenerateBriefing}
              disabled={isGenerating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                padding: '6px 13px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                opacity: isGenerating ? 0.7 : 1,
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }}
            >
              <Cpu size={13} className={isGenerating ? 'animate-spin' : ''} />
              {isGenerating ? 'Synthesizing...' : 'Prepare Next Meeting'}
            </button>
          )}

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Hindsight memory bank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(15, 23, 42, 0.7)',
              color: 'var(--text-muted)',
              padding: '6px 9px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 600,
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          {/* Verified Hindsight Status Badge */}
          <div className="pulse-badge" style={{
            background: hindsightConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
            border: `1px solid ${hindsightConnected ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`,
            color: hindsightConnected ? '#34d399' : '#fb7185',
            padding: '4px 10px',
            fontSize: '0.70rem'
          }}>
            <span className="pulse-dot" style={{ background: hindsightConnected ? '#10b981' : '#f43f5e' }}></span>
            {hindsightConnected ? (
              <span>HINDSIGHT ACTIVE · <strong>{totalMemories}</strong> experiences recalled</span>
            ) : (
              <span>HINDSIGHT CONNECTING...</span>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
