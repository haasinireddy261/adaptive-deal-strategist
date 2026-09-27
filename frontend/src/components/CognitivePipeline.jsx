import React from 'react';
import { 
  FileText, 
  History, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';

export default function CognitivePipeline() {
  const steps = [
    {
      step: '01',
      label: 'FACTS',
      sub: 'Customer statements',
      icon: <FileText size={12} color="#38bdf8" />,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.08)'
    },
    {
      step: '02',
      label: 'HISTORY / OUTCOMES',
      sub: 'What worked & failed',
      icon: <History size={12} color="#fb7185" />,
      color: '#fb7185',
      bg: 'rgba(251, 113, 133, 0.08)'
    },
    {
      step: '03',
      label: 'LEARNED STRATEGY',
      sub: 'Inferred behavioral rule',
      icon: <Lightbulb size={12} color="#f59e0b" />,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.08)'
    },
    {
      step: '04',
      label: 'STRATEGY EVOLUTION',
      sub: 'Dynamic tactical pivot',
      icon: <TrendingUp size={12} color="#c084fc" />,
      color: '#c084fc',
      bg: 'rgba(192, 132, 252, 0.12)',
      isHighlight: true
    },
    {
      step: '05',
      label: 'RECOMMENDATION',
      sub: 'Adapted meeting brief',
      icon: <Target size={12} color="#34d399" />,
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.08)'
    },
    {
      step: '06',
      label: 'WHY (CAUSAL TRACE)',
      sub: 'Memory attribution',
      icon: <Sparkles size={12} color="#a78bfa" />,
      color: '#a78bfa',
      bg: 'rgba(167, 139, 250, 0.08)'
    }
  ];

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '8px 14px', 
        marginBottom: '16px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(11, 17, 32, 0.65)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', overflowX: 'auto' }}>
        {steps.map((s, idx) => (
          <React.Fragment key={s.label}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '5px 9px',
              borderRadius: '6px',
              background: s.bg,
              border: `1px solid ${s.color}${s.isHighlight ? '50' : '25'}`,
              flex: '1 1 auto',
              minWidth: '135px',
              boxShadow: s.isHighlight ? '0 0 12px rgba(192, 132, 252, 0.15)' : 'none'
            }}>
              <div style={{
                background: 'rgba(7, 11, 18, 0.85)',
                padding: '4px',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {s.icon}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: s.color, letterSpacing: '0.03em' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '0.60rem', color: 'var(--text-sub)' }}>
                  {s.sub}
                </div>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div style={{ color: 'var(--text-sub)', opacity: 0.35, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <ChevronRight size={12} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
