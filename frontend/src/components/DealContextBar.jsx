import React from 'react';
import { 
  Building2, 
  DollarSign, 
  Cpu, 
  XCircle, 
  CheckCircle2, 
  AlertTriangle,
  Layers
} from 'lucide-react';

export default function DealContextBar({ deal, dealId }) {
  const signals = [
    {
      type: 'pricing',
      icon: <DollarSign size={12} color="#fb7185" />,
      label: 'PRICING CONCERN',
      detail: 'Comparing with Competitor X; values engineering over discounts',
      color: '#fb7185',
      bg: 'rgba(244, 63, 94, 0.08)',
      border: 'rgba(244, 63, 94, 0.25)'
    },
    {
      type: 'api',
      icon: <Cpu size={12} color="#38bdf8" />,
      label: 'API & LATENCY',
      detail: 'CTO requires sub-100ms latency & webhook delivery guarantees',
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.08)',
      border: 'rgba(56, 189, 248, 0.25)'
    },
    {
      type: 'rejection',
      icon: <XCircle size={12} color="#f43f5e" />,
      label: 'PROPOSAL REJECTED',
      detail: 'Initial feature-heavy generic deck rejected as off-the-shelf',
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.08)',
      border: 'rgba(244, 63, 94, 0.25)'
    },
    {
      type: 'success',
      icon: <CheckCircle2 size={12} color="#34d399" />,
      label: 'ARCH WALKTHROUGH WON',
      detail: 'CTO responded enthusiastically to deep-dive architecture session',
      color: '#34d399',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.25)'
    },
    {
      type: 'reliability',
      icon: <AlertTriangle size={12} color="#f59e0b" />,
      label: 'LATEST: RELIABILITY',
      detail: 'Production deployment resilience & rollback safety prioritized',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.25)'
    }
  ];

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '10px 14px', 
        marginBottom: '14px',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        background: 'rgba(10, 15, 29, 0.75)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        
        {/* Deal Identity Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.12)',
            padding: '5px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <Building2 size={13} color="var(--accent-blue)" />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f8fafc' }}>
              {deal?.name || 'Acme Corporation'}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>
              ({deal?.stage || 'Proposal Review'})
            </span>
          </div>
          <span style={{
            fontSize: '0.66rem',
            color: 'var(--text-sub)',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '3px 7px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            Bank: <code style={{ color: 'var(--accent-blue)' }}>deal_{dealId}</code>
          </span>
        </div>

        {/* 5 Compact Acme Signals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, overflowX: 'auto', paddingBottom: '2px' }}>
          {signals.map((sig, idx) => (
            <div
              key={idx}
              title={sig.detail}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: sig.bg,
                border: `1px solid ${sig.border}`,
                flex: '1 1 auto',
                minWidth: '170px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {sig.icon}
              <div style={{ lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <div style={{ fontSize: '0.64rem', fontWeight: 800, color: sig.color, letterSpacing: '0.03em' }}>
                  {sig.label}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sig.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
