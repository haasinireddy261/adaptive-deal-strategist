import React, { useState } from 'react';
import { Send, FileText, History, Lightbulb, CheckCircle2, Zap, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

export default function InteractionLogger({ onAddInteraction, isSubmitting, totalMemories = 0, isEvolved = false }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('fact');
  const [lastSaved, setLastSaved] = useState(null);

  const presets = [
    {
      cat: 'fact',
      text: "Acme's CTO is now primarily concerned about deployment reliability and rollback safety.",
      label: '⚡ CTO RELIABILITY CONCERN (Demo Step 5)',
      isHighlight: true
    },
    {
      cat: 'fact',
      text: 'Acme is concerned about pricing and is comparing us with Competitor X.',
      label: 'Acme Pricing Concern',
      isHighlight: false
    },
    {
      cat: 'fact',
      text: "Acme's CTO is worried about API integration latency and webhook reliability.",
      label: 'CTO API Latency Worry',
      isHighlight: false
    },
    {
      cat: 'outcome',
      text: 'We sent a feature-heavy generic proposal and Acme rejected it because it lacked technical substance.',
      label: 'Generic Proposal Rejected',
      isHighlight: false
    },
    {
      cat: 'outcome',
      text: 'We gave a deep-dive technical architecture walkthrough and the CTO responded very positively.',
      label: 'Architecture Walkthrough Won',
      isHighlight: false
    },
    {
      cat: 'strategy',
      text: 'Acme values engineering transparency and architectural alignment far more than generic discount haggling.',
      label: 'Transparency > Discounts',
      isHighlight: false
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const success = await onAddInteraction(content.trim(), category);
    if (success) {
      setLastSaved({ content: content.trim(), category });
      setContent('');
    }
  };

  const handleSelectPreset = (preset) => {
    setContent(preset.text);
    setCategory(preset.cat);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* SECTION 7: ADD NEW EXPERIENCE */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '16px 18px', 
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Zap size={15} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '0.90rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
              ADD NEW EXPERIENCE
            </h3>
          </div>
          <span style={{ fontSize: '0.66rem', color: 'var(--text-sub)' }}>
            Retains directly into Hindsight memory bank
          </span>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {[
            { id: 'fact', label: '1. Fact', desc: 'Customer statement', color: '#38bdf8' },
            { id: 'outcome', label: '2. History / Outcome', desc: 'What happened', color: '#fb7185' },
            { id: 'strategy', label: '3. Learned Strategy', desc: 'Behavioral rule', color: '#c084fc' }
          ].map((c) => {
            const isSelected = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  borderRadius: '6px',
                  background: isSelected ? `${c.color}18` : 'rgba(10, 15, 29, 0.5)',
                  border: `1px solid ${isSelected ? c.color : 'var(--border-color)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '1px',
                  transition: 'all 0.15s',
                  textAlign: 'left'
                }}
              >
                <span style={{ color: isSelected ? c.color : 'var(--text-muted)', fontWeight: 700, fontSize: '0.72rem' }}>
                  {c.label}
                </span>
                <span style={{ fontSize: '0.58rem', color: isSelected ? '#cbd5e1' : 'var(--text-sub)' }}>
                  {c.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Preset Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPreset(p)}
              style={{
                fontSize: '0.66rem',
                fontWeight: p.isHighlight ? 700 : 500,
                padding: p.isHighlight ? '3px 9px' : '2px 7px',
                borderRadius: '5px',
                background: p.isHighlight ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                color: p.isHighlight ? '#c7d2fe' : 'var(--text-muted)',
                border: p.isHighlight ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.15s'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <textarea
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              category === 'fact'
                ? "e.g., Acme's CTO is now primarily concerned about deployment reliability and rollback safety..."
                : category === 'outcome'
                ? "e.g., We sent a feature-heavy generic proposal and Acme rejected it because it felt off-the-shelf..."
                : "e.g., Acme values engineering transparency and architectural alignment far more than discounts..."
            }
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'rgba(7, 11, 20, 0.75)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '0.78rem',
              resize: 'vertical',
              outline: 'none',
              marginBottom: '8px',
              lineHeight: 1.4
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-indigo)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-sub)' }}>
              Stores into Hindsight's vector & relational memory.
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                opacity: isSubmitting || !content.trim() ? 0.5 : 1,
                transition: 'all 0.2s',
                cursor: isSubmitting || !content.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              <Send size={12} />
              {isSubmitting ? 'Retaining in Hindsight...' : 'RETAIN IN HINDSIGHT'}
            </button>
          </div>
        </form>
      </div>

      {/* LEARNING TRANSITION VISUALIZER */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '14px 16px', 
          border: '1px solid rgba(168, 85, 247, 0.25)',
          background: 'rgba(13, 19, 33, 0.85)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '0.76rem', fontWeight: 800 }}>
            <Sparkles size={13} color="#a855f7" />
            LEARNING TRANSITION FLOW
          </div>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-sub)' }}>
            Real Experience $\rightarrow$ Strategy Shift
          </span>
        </div>

        {/* 5-Step Learning Transition Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.72rem' }}>
          {/* Step 1: Before */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '5px 8px',
            borderRadius: '5px',
            borderLeft: '2px solid #fb7185',
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#fb7185', minWidth: '95px' }}>
              BEFORE:
            </span>
            <span style={{ color: '#cbd5e1' }}>
              Lead with technical API architecture walkthrough.
            </span>
          </div>

          {/* Step 2: New Experience */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.10)',
            padding: '5px 8px',
            borderRadius: '5px',
            borderLeft: '2px solid #818cf8',
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#818cf8', minWidth: '95px' }}>
              NEW EXPERIENCE:
            </span>
            <span style={{ color: '#e0e7ff', fontWeight: 600 }}>
              Deployment reliability and rollback safety are now the CTO's priority.
            </span>
          </div>

          {/* Step 3: Memory Updated */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            padding: '5px 8px',
            borderRadius: '5px',
            borderLeft: '2px solid #38bdf8',
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#38bdf8', minWidth: '95px' }}>
              MEMORY UPDATED:
            </span>
            <span style={{ color: '#bae6fd' }}>
              Hindsight bank count updated ({totalMemories} experiences retained).
            </span>
          </div>

          {/* Step 4: Strategy Updated */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            padding: '5px 8px',
            borderRadius: '5px',
            borderLeft: '2px solid #f59e0b',
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#f59e0b', minWidth: '95px' }}>
              STRATEGY UPDATED:
            </span>
            <span style={{ color: '#fde68a' }}>
              Operational resilience is now required in addition to technical architecture.
            </span>
          </div>

          {/* Step 5: New Recommendation */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            padding: '5px 8px',
            borderRadius: '5px',
            borderLeft: '2px solid #34d399',
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#34d399', minWidth: '95px' }}>
              NEW RECOMMENDATION:
            </span>
            <span style={{ color: '#a7f3d0', fontWeight: 700 }}>
              Lead with deployment architecture, rollback safety and reliability before pricing.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
