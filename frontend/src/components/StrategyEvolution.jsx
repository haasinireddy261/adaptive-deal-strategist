import React from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Sparkles,
  TrendingUp,
  Zap,
  ShieldCheck,
  Database
} from 'lucide-react';

export default function StrategyEvolution({ evolution, dealName, dealId = 'acme-corp' }) {
  if (!evolution) {
    return (
      <div className="glass-card" style={{ padding: '18px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', marginBottom: '6px' }}>
          <Sparkles size={16} />
          <h3 style={{ fontSize: '0.94rem', fontWeight: 800 }}>Strategy Evolution — Signature Cognitive Centerpiece</h3>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-sub)', margin: 0 }}>
          Click <strong>"Prepare Next Meeting"</strong> to pull accumulated facts, outcomes, and learned patterns from Hindsight.
        </p>
      </div>
    );
  }

  const {
    previous_strategy,
    outcome_result,
    what_agent_learned,
    updated_strategy,
    current_execution_rule,
    stages = []
  } = evolution;

  const getStageStyle = (status, isLast) => {
    if (isLast) {
      return {
        text: '#34d399',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.45)',
        glow: '0 0 14px rgba(16, 185, 129, 0.12)',
        icon: <ShieldCheck size={14} color="#34d399" />
      };
    }
    switch (status) {
      case 'negative':
        return {
          text: '#fb7185',
          bg: 'rgba(244, 63, 94, 0.08)',
          border: 'rgba(244, 63, 94, 0.25)',
          glow: 'none',
          icon: <XCircle size={14} color="#fb7185" />
        };
      case 'learning':
        return {
          text: '#38bdf8',
          bg: 'rgba(56, 189, 248, 0.08)',
          border: 'rgba(56, 189, 248, 0.25)',
          glow: 'none',
          icon: <Lightbulb size={14} color="#38bdf8" />
        };
      case 'pivot':
        return {
          text: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.08)',
          border: 'rgba(245, 158, 11, 0.25)',
          glow: 'none',
          icon: <TrendingUp size={14} color="#f59e0b" />
        };
      case 'initial':
      default:
        return {
          text: '#94a3b8',
          bg: 'rgba(148, 163, 184, 0.06)',
          border: 'rgba(148, 163, 184, 0.20)',
          glow: 'none',
          icon: <GitCommit size={14} color="#94a3b8" />
        };
    }
  };

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '16px 20px', 
        marginBottom: '16px', 
        position: 'relative', 
        overflow: 'hidden',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        background: 'linear-gradient(180deg, rgba(20, 27, 45, 0.85) 0%, rgba(13, 19, 33, 0.95) 100%)'
      }}
    >
      {/* Decorative gradient glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '260px',
        height: '120px',
        background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            padding: '5px 7px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
          }}>
            <Zap size={15} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.01em', margin: 0 }}>
            STRATEGY EVOLUTION
          </h2>
          <span style={{
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#d8b4fe',
            fontSize: '0.64rem',
            fontWeight: 800,
            padding: '2px 7px',
            borderRadius: '5px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            MAIN CENTERPIECE
          </span>
        </div>

        {/* Compact Evidence Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.68rem',
          color: '#34d399',
          background: 'rgba(16, 185, 129, 0.10)',
          padding: '3px 10px',
          borderRadius: '16px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <Database size={11} />
          <span>Learned from Hindsight memories (<code>deal_{dealId}</code>)</span>
        </div>
      </div>

      {/* Subtitle / Core Story */}
      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
        Most assistants remember what happened. Our agent learns <strong>what to do differently</strong> because of what happened.
      </div>

      {/* Current Learned Strategy Hero Banner */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        boxShadow: '0 2px 12px rgba(16, 185, 129, 0.06)'
      }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          padding: '6px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={18} color="#34d399" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              CURRENT LEARNED STRATEGY
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#a7f3d0',
              padding: '1px 6px',
              borderRadius: '4px'
            }}>
              INFERRED FROM PREVIOUS OUTCOMES
            </span>
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.4 }}>
            "{updated_strategy}"
          </div>
          <div style={{ fontSize: '0.74rem', color: '#93c5fd', marginTop: '4px', fontWeight: 500 }}>
            <strong>Tactical Execution Rule:</strong> {current_execution_rule}
          </div>
        </div>
      </div>

      {/* 5-Stage Evolution Connected Stepper Flow */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        marginBottom: '14px'
      }}>
        {stages.map((stg, idx) => {
          const isLast = idx === stages.length - 1;
          const style = getStageStyle(stg.status, isLast);

          return (
            <div
              key={stg.stage_num || idx}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: '8px',
                padding: '10px 11px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: style.glow
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.60rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: style.text,
                    textTransform: 'uppercase'
                  }}>
                    {stg.label}
                  </span>
                  {style.icon}
                </div>
                
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px', lineHeight: 1.25 }}>
                  {stg.title}
                </div>
                
                <p style={{ fontSize: '0.68rem', color: '#cbd5e1', lineHeight: 1.35, margin: 0 }}>
                  {stg.description}
                </p>
              </div>

              {isLast && (
                <div style={{
                  marginTop: '8px',
                  paddingTop: '6px',
                  borderTop: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  color: '#34d399',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={11} />
                  Active Target
                </div>
              )}

              {/* Connected directional arrow */}
              {idx < stages.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: '-7px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  background: '#0a0f1d',
                  borderRadius: '50%',
                  padding: '2px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }}>
                  <ArrowRight size={10} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compact Before / After Strategy Comparison */}
      <div style={{
        background: 'rgba(10, 15, 29, 0.7)',
        borderRadius: '8px',
        padding: '12px 14px',
        border: '1px solid var(--border-color)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px'
      }}>
        {/* Left: BEFORE */}
        <div style={{ borderLeft: '3px solid #f43f5e', paddingLeft: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#fb7185', textTransform: 'uppercase' }}>
              BEFORE (WHAT FAILED)
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
            "{previous_strategy}"
          </div>
          <div style={{ fontSize: '0.70rem', color: '#fda4af', marginTop: '3px' }}>
            <strong>Observed Outcome:</strong> {outcome_result}
          </div>
        </div>

        {/* Right: AFTER */}
        <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
              AFTER (WHAT HINDSIGHT LEARNED)
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 700 }}>
            "{updated_strategy}"
          </div>
          <div style={{ fontSize: '0.70rem', color: '#93c5fd', marginTop: '3px' }}>
            <strong>Adaptation Rationale:</strong> {what_agent_learned}
          </div>
        </div>
      </div>

    </div>
  );
}
