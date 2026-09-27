import React from 'react';
import { 
  Target, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Compass,
  Layers
} from 'lucide-react';
import DealTimeline from './DealTimeline';

export default function MeetingBriefingView({
  briefing,
  dealName
}) {
  if (!briefing) {
    return (
      <div className="glass-card" style={{
        textAlign: 'center',
        padding: '30px 20px',
        color: 'var(--text-muted)',
        marginBottom: '16px'
      }}>
        <Compass size={32} style={{ opacity: 0.35, marginBottom: '8px', color: 'var(--accent-emerald)' }} />
        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>
          Meeting Briefing & Strategy Pending
        </h4>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-sub)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.45 }}>
          Click <strong>"Prepare Next Meeting"</strong> in the top header or load the demo story to generate an adapted plan from Hindsight.
        </p>
      </div>
    );
  }

  const {
    current_deal_understanding,
    current_recommended_strategy = [],
    things_to_avoid = [],
    suggested_questions = [],
    why_this_recommendation = [],
    deal_timeline = []
  } = briefing;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* SECTION 4: CURRENT RECOMMENDATION + WHY (MAIN FOCUS) */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '16px 18px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          background: 'linear-gradient(180deg, rgba(16, 26, 42, 0.85) 0%, rgba(11, 18, 30, 0.95) 100%)'
        }}
      >
        {/* Header & Scannable Causal Journey Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Target size={16} color="#34d399" />
            <h3 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
              CURRENT RECOMMENDATION + WHY (CAUSAL REASONING)
            </h3>
          </div>
          <span style={{
            fontSize: '0.66rem',
            color: '#34d399',
            fontWeight: 700,
            background: 'rgba(16, 185, 129, 0.12)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            Real Hindsight Evidence Grounded
          </span>
        </div>

        {/* Causal Chain Breadcrumb Banner */}
        <div style={{
          background: 'rgba(10, 15, 29, 0.75)',
          borderRadius: '6px',
          padding: '6px 12px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4px',
          overflowX: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
            RECALLED MEMORY
          </div>
          <ArrowRight size={10} color="var(--text-sub)" />
          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#fb7185', textTransform: 'uppercase' }}>
            OUTCOME EVIDENCE
          </div>
          <ArrowRight size={10} color="var(--text-sub)" />
          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
            WHAT AGENT LEARNED
          </div>
          <ArrowRight size={10} color="var(--text-sub)" />
          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
            CURRENT RECOMMENDATION
          </div>
        </div>

        {/* Recommended Actions List */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#a7f3d0', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
            Adapted Execution Tactics:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {current_recommended_strategy.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '8px', 
                  background: 'rgba(16, 185, 129, 0.05)',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  fontSize: '0.78rem', 
                  color: '#f1f5f9', 
                  lineHeight: 1.4 
                }}
              >
                <CheckCircle2 size={13} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Things to Avoid (Compact Alert Box) */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldAlert size={12} color="#fb7185" />
            Things to Avoid (Pitfalls Learned from Past Rejection):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {things_to_avoid.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '8px', 
                  background: 'rgba(244, 63, 94, 0.04)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(244, 63, 94, 0.15)',
                  fontSize: '0.75rem', 
                  color: '#e2e8f0', 
                  lineHeight: 1.35 
                }}
              >
                <AlertTriangle size={12} color="#fb7185" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why This Recommendation (Memory Attribution Trace) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={12} color="#a855f7" />
              Memory Attribution (Why This Strategy):
            </div>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-sub)' }}>
              {why_this_recommendation.length} causal links
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {why_this_recommendation.map((influence, idx) => {
              const isOutcome = influence.category === 'outcome';
              const isStrategy = influence.category === 'strategy';
              const tagColor = isOutcome ? '#fb7185' : isStrategy ? '#a855f7' : '#38bdf8';
              const tagBg = isOutcome ? 'rgba(244, 63, 94, 0.12)' : isStrategy ? 'rgba(168, 85, 247, 0.12)' : 'rgba(56, 189, 248, 0.12)';

              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(10, 15, 29, 0.65)',
                    borderRadius: '5px',
                    padding: '6px 10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '3px',
                      background: tagBg,
                      color: tagColor,
                      textTransform: 'uppercase'
                    }}>
                      [{influence.category}]
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#f1f5f9', fontWeight: 600 }}>
                      "{influence.memory_text}"
                    </span>
                  </div>

                  <div style={{ fontSize: '0.68rem', color: '#93c5fd', paddingLeft: '6px', borderLeft: '2px solid rgba(99, 102, 241, 0.4)' }}>
                    <strong>Impact:</strong> {influence.influence_on_strategy}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* SECTION 5: COMPACT TIMELINE */}
      <DealTimeline 
        timeline={deal_timeline} 
        dealName={dealName} 
      />

      {/* SECTION 8: DETAILED BRIEFING (SUGGESTED QUESTIONS & CONTEXT) */}
      <div className="glass-card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-purple)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
            <HelpCircle size={13} />
            Strategic Discovery Questions
          </div>
          <span style={{ fontSize: '0.64rem', color: 'var(--text-sub)' }}>
            Grounded in historical concerns
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '6px' }}>
          {suggested_questions.map((q, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(20, 27, 45, 0.5)',
                padding: '7px 10px',
                borderRadius: '5px',
                fontSize: '0.72rem',
                color: '#e2e8f0',
                borderLeft: '2px solid var(--accent-purple)',
                lineHeight: 1.35
              }}
            >
              "{q}"
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
