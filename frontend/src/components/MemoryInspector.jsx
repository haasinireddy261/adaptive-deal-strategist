import React, { useState } from 'react';
import { Database, FileText, History, Lightbulb, Clock, Layers, ShieldCheck } from 'lucide-react';

export default function MemoryInspector({ memories, dealId, isLoading }) {
  const { facts = [], outcomes = [], strategies = [], total_memories = 0 } = memories || {};
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '16px 18px', 
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.75)'
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '0.90rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '7px', margin: 0 }}>
            <Database size={15} color="var(--accent-indigo)" />
            HINDSIGHT MEMORY EVIDENCE
          </h3>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-sub)', margin: '1px 0 0 0' }}>
            Underlying persistent graph evidence grounding the agent's strategy evolution
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            background: 'rgba(99, 102, 241, 0.12)',
            color: '#a5b4fc',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.68rem',
            fontWeight: 700,
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            {total_memories} Evidence Units
          </span>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-sub)', fontSize: '0.78rem' }}>
          Recalling memories from Hindsight...
        </div>
      ) : total_memories === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: 'rgba(10, 15, 29, 0.5)',
          borderRadius: '6px',
          border: '1px dashed var(--border-color)',
          color: 'var(--text-muted)'
        }}>
          <Layers size={22} style={{ opacity: 0.35, marginBottom: '6px' }} />
          <p style={{ fontSize: '0.78rem', fontWeight: 600, margin: 0 }}>No interactions retained yet.</p>
          <p style={{ fontSize: '0.70rem', color: 'var(--text-sub)', margin: '2px 0 0 0' }}>
            Click <strong>"Load Acme Demo Story"</strong> to seed realistic deal interactions into Hindsight.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          
          {/* Column 1: FACTS */}
          <div style={{
            background: 'rgba(10, 15, 29, 0.65)',
            borderRadius: '8px',
            padding: '10px 12px',
            border: '1px solid rgba(56, 189, 248, 0.18)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8' }}>
                <FileText size={12} />
                FACTS ({facts.length})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {facts.length === 0 ? (
                <span style={{ fontSize: '0.70rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>No facts recorded</span>
              ) : (
                facts.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      background: 'rgba(20, 27, 45, 0.75)',
                      padding: '6px 8px',
                      borderRadius: '5px',
                      fontSize: '0.72rem',
                      borderLeft: '2px solid #38bdf8',
                      color: '#f1f5f9',
                      lineHeight: 1.35
                    }}
                  >
                    <div>{m.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: HISTORY / OUTCOMES */}
          <div style={{
            background: 'rgba(10, 15, 29, 0.65)',
            borderRadius: '8px',
            padding: '10px 12px',
            border: '1px solid rgba(251, 113, 133, 0.18)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 800, color: '#fb7185' }}>
                <History size={12} />
                HISTORY / OUTCOMES ({outcomes.length})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {outcomes.length === 0 ? (
                <span style={{ fontSize: '0.70rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>No outcomes recorded</span>
              ) : (
                outcomes.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      background: 'rgba(20, 27, 45, 0.75)',
                      padding: '6px 8px',
                      borderRadius: '5px',
                      fontSize: '0.72rem',
                      borderLeft: '2px solid #fb7185',
                      color: '#f1f5f9',
                      lineHeight: 1.35
                    }}
                  >
                    <div>{m.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: LEARNED STRATEGY */}
          <div style={{
            background: 'rgba(10, 15, 29, 0.65)',
            borderRadius: '8px',
            padding: '10px 12px',
            border: '1px solid rgba(168, 85, 247, 0.18)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 800, color: '#c084fc' }}>
                <Lightbulb size={12} />
                LEARNED STRATEGY ({strategies.length})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {strategies.length === 0 ? (
                <span style={{ fontSize: '0.70rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>No strategic rules</span>
              ) : (
                strategies.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      background: 'rgba(20, 27, 45, 0.75)',
                      padding: '6px 8px',
                      borderRadius: '5px',
                      fontSize: '0.72rem',
                      borderLeft: '2px solid #c084fc',
                      color: '#f1f5f9',
                      lineHeight: 1.35
                    }}
                  >
                    <div>{m.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
