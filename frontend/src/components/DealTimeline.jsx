import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Info,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function DealTimeline({ timeline = [], dealName }) {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'negative':
        return {
          icon: <XCircle size={11} color="#fb7185" />,
          color: '#fb7185',
          bg: 'rgba(244, 63, 94, 0.12)',
          border: 'rgba(244, 63, 94, 0.35)',
          label: '✕ REJECTED'
        };
      case 'positive':
        return {
          icon: <CheckCircle2 size={11} color="#34d399" />,
          color: '#34d399',
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.35)',
          label: '✓ VALIDATED'
        };
      case 'alert':
        return {
          icon: <AlertCircle size={11} color="#f59e0b" />,
          color: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.35)',
          label: '⚠ PIVOT TRIGGER'
        };
      case 'neutral':
      default:
        return {
          icon: <Info size={11} color="#38bdf8" />,
          color: '#38bdf8',
          bg: 'rgba(56, 189, 248, 0.12)',
          border: 'rgba(56, 189, 248, 0.35)',
          label: '● DISCOVERY'
        };
    }
  };

  return (
    <div className="glass-card" style={{ padding: '14px 16px', marginBottom: '14px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Activity size={14} color="var(--accent-blue)" />
          <h4 style={{ fontSize: '0.84rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Compact Deal Timeline (Action vs Observed Outcome)
          </h4>
        </div>
        <span style={{ fontSize: '0.66rem', color: 'var(--text-sub)' }}>
          {timeline.length} chronological milestones recorded
        </span>
      </div>

      {/* Streamlined compact timeline rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {timeline.map((event, idx) => {
          const badge = getStatusBadge(event.status);
          return (
            <div
              key={event.sequence || idx}
              style={{
                background: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '7px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              {/* Row Header: Phase, Title & Outcome Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    background: 'rgba(30, 41, 59, 0.8)',
                    padding: '1px 5px',
                    borderRadius: '3px',
                    flexShrink: 0
                  }}>
                    {event.time_label}
                  </span>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {event.title}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.60rem',
                  fontWeight: 800,
                  color: badge.color,
                  background: badge.bg,
                  border: `1px solid ${badge.border}`,
                  padding: '1px 6px',
                  borderRadius: '3px',
                  flexShrink: 0
                }}>
                  {badge.icon}
                  {badge.label}
                </div>
              </div>

              {/* Action vs Observed Outcome Inlined */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                background: 'rgba(7, 11, 20, 0.45)',
                borderRadius: '4px',
                padding: '5px 8px',
                fontSize: '0.70rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-sub)', fontWeight: 700, fontSize: '0.62rem', textTransform: 'uppercase' }}>
                    Action:
                  </span>{' '}
                  <span style={{ color: '#cbd5e1' }}>{event.action}</span>
                </div>
                <div>
                  <span style={{ color: badge.color, fontWeight: 700, fontSize: '0.62rem', textTransform: 'uppercase' }}>
                    Outcome:
                  </span>{' '}
                  <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{event.outcome}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
