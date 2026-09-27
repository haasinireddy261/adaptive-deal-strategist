import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DealContextBar from './components/DealContextBar';
import CognitivePipeline from './components/CognitivePipeline';
import StrategyEvolution from './components/StrategyEvolution';
import MeetingBriefingView from './components/MeetingBriefingView';
import InteractionLogger from './components/InteractionLogger';
import MemoryInspector from './components/MemoryInspector';
import { Sparkles } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export default function App() {
  const [deals, setDeals] = useState([
    { id: 'acme-corp', name: 'Acme Corporation', industry: 'Enterprise FinTech', stage: 'Proposal Review' },
    { id: 'cloudscale-io', name: 'CloudScale Systems', industry: 'DevOps & Infrastructure', stage: 'Technical Validation' },
    { id: 'nexus-health', name: 'Nexus Healthcare', industry: 'HealthTech', stage: 'Executive Presentation' }
  ]);
  const [selectedDeal, setSelectedDeal] = useState('acme-corp');
  const [memories, setMemories] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [hindsightConnected, setHindsightConnected] = useState(true);
  
  const [isLoadingMemories, setIsLoadingMemories] = useState(false);
  const [isSubmittingInteraction, setIsSubmittingInteraction] = useState(false);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Auto-dismiss status messages after 5 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Check backend & Hindsight health
  const checkHealth = async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/health`, {}, 4000);
      if (res.ok) {
        const data = await res.json();
        setHindsightConnected(Boolean(data.hindsight_connected));
      } else {
        setHindsightConnected(false);
      }
    } catch {
      setHindsightConnected(false);
    }
  };

  // Fetch memories for current deal from Hindsight
  const fetchMemories = async (dealId = selectedDeal) => {
    setIsLoadingMemories(true);
    try {
      const res = await fetchWithTimeout(`${API_BASE}/deals/${dealId}/memories`, {}, 12000);
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
        return data;
      } else {
        setStatusMessage({ type: 'error', text: `Failed to recall memories (${res.status})` });
      }
    } catch (err) {
      console.error('Failed to fetch memories:', err);
      setStatusMessage({ 
        type: 'error', 
        text: err.name === 'AbortError' ? 'Memory recall timed out. Backend may be initializing.' : 'Backend connection error.' 
      });
    } finally {
      setIsLoadingMemories(false);
    }
    return null;
  };

  // Switch deal and reload its memories
  const handleSelectDeal = (dealId) => {
    setSelectedDeal(dealId);
    setBriefing(null);
    fetchMemories(dealId);
  };

  // Generate meeting briefing from Hindsight memories
  const generateBriefingInternal = async (dealId = selectedDeal) => {
    setIsGeneratingBriefing(true);
    try {
      const res = await fetchWithTimeout(`${API_BASE}/deals/${dealId}/briefing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deal_id: dealId,
          objective: 'Executive Strategy & Closing Meeting',
          attendees: 'CTO, Head of Architecture, VP Procurement'
        })
      }, 25000);

      if (res.ok) {
        const data = await res.json();
        setBriefing(data);
        return data;
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to synthesize briefing from memories.' });
      }
    } catch (err) {
      console.error('Error generating briefing:', err);
      setStatusMessage({ 
        type: 'error', 
        text: err.name === 'AbortError' ? 'Briefing synthesis timed out.' : 'Server connection error during briefing synthesis.' 
      });
    } finally {
      setIsGeneratingBriefing(false);
    }
    return null;
  };

  // Add new interaction to Hindsight and dynamically evolve strategy
  const handleAddInteraction = async (content, category) => {
    setIsSubmittingInteraction(true);
    try {
      const res = await fetchWithTimeout(`${API_BASE}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deal_id: selectedDeal,
          content,
          category
        })
      }, 25000);

      if (res.ok) {
        setStatusMessage({ 
          type: 'success', 
          text: `Retained as [${category.toUpperCase()}] in Hindsight! Evolving strategy to operational resilience...` 
        });
        await fetchMemories(selectedDeal);
        // Automatically re-synthesize strategy briefing to display immediate adaptation
        await generateBriefingInternal(selectedDeal);
        setStatusMessage({
          type: 'success',
          text: '✓ Strategy Evolution updated! Operational resilience & rollback safety prioritized.'
        });
        return true;
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to retain memory in Hindsight.' });
        return false;
      }
    } catch (err) {
      console.error('Error logging interaction:', err);
      setStatusMessage({ 
        type: 'error', 
        text: err.name === 'AbortError' ? 'Interaction retention timed out.' : 'Server connection error.' 
      });
      return false;
    } finally {
      setIsSubmittingInteraction(false);
    }
  };

  // Load Acme Demo Story
  const handleLoadDemo = async () => {
    setIsSeeding(true);
    setBriefing(null);
    try {
      setSelectedDeal('acme-corp');
      setStatusMessage({ type: 'info', text: 'Recalling Hindsight memories & analyzing previous outcomes...' });
      const res = await fetchWithTimeout(`${API_BASE}/deals/demo-seed`, { method: 'POST' }, 30000);
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: 'Acme deal experience seeded into Hindsight! Synthesizing initial Strategy Evolution...'
        });
        await fetchMemories('acme-corp');
        await generateBriefingInternal('acme-corp');
        setStatusMessage({
          type: 'success',
          text: '✓ Strategy Evolution ready: Technical walkthrough prioritized based on past rejected proposal.'
        });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to seed demo story into Hindsight.' });
      }
    } catch (err) {
      console.error('Error seeding demo:', err);
      setStatusMessage({ 
        type: 'error', 
        text: err.name === 'AbortError' ? 'Demo seeding timed out.' : 'Could not seed demo story.' 
      });
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchMemories('acme-corp').then((mems) => {
      if (mems && mems.total_memories > 0) {
        generateBriefingInternal('acme-corp');
      }
    });
  }, []);

  const currentDealObj = deals.find((d) => d.id === selectedDeal) || deals[0];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 18px' }}>
      
      {/* Toast Notification */}
      {statusMessage && (
        <div style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 9999,
          background: statusMessage.type === 'error' ? '#881337' : '#064e3b',
          color: '#fff',
          padding: '10px 16px',
          borderRadius: '6px',
          fontSize: '0.80rem',
          fontWeight: 600,
          boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
          border: `1px solid ${statusMessage.type === 'error' ? '#f43f5e' : '#10b981'}`
        }}>
          {statusMessage.text}
        </div>
      )}

      {/* 1. HERO HEADER: Brand, Deal Selector & Verified Hindsight Status */}
      <Header
        deals={deals}
        selectedDeal={selectedDeal}
        onSelectDeal={handleSelectDeal}
        onLoadDemo={handleLoadDemo}
        isSeeding={isSeeding}
        onRefresh={() => fetchMemories(selectedDeal)}
        isRefreshing={isLoadingMemories}
        onGenerateBriefing={() => generateBriefingInternal(selectedDeal)}
        isGenerating={isGeneratingBriefing}
        hindsightConnected={hindsightConnected}
        totalMemories={memories?.total_memories || 0}
      />

      {/* 2. DEAL CONTEXT: Compact Signals Bar */}
      <DealContextBar 
        deal={currentDealObj}
        dealId={selectedDeal}
      />

      {/* 3. COGNITIVE PIPELINE: Compact 6-Step Ribbon */}
      <CognitivePipeline />

      {/* 4. STRATEGY EVOLUTION — MAIN CENTERPIECE OF FIRST VIEWPORT */}
      <StrategyEvolution 
        evolution={briefing?.strategy_evolution}
        dealName={currentDealObj.name}
        dealId={selectedDeal}
      />

      {/* 5. BALANCED LOWER WORKSPACE: 58% Recommendation/Why & 42% Experience/Memory */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', 
        gap: '16px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Current Recommendation + Why & Compact Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <MeetingBriefingView
            briefing={briefing}
            dealName={currentDealObj.name}
          />
        </div>

        {/* Right Column: Interaction Logger & Hindsight Memory Evidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Add New Experience with Learning Transition Flow */}
          <InteractionLogger
            onAddInteraction={handleAddInteraction}
            isSubmitting={isSubmittingInteraction}
            totalMemories={memories?.total_memories || 0}
          />

          {/* Hindsight Memory Evidence */}
          <MemoryInspector
            memories={memories}
            dealId={selectedDeal}
            isLoading={isLoadingMemories}
          />

          {/* 60-Second Demo Sequence Helper */}
          <div className="glass-card" style={{ padding: '10px 14px', background: 'rgba(10, 15, 29, 0.55)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
              <Sparkles size={12} color="var(--accent-indigo)" />
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-indigo)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                60-Second Hackathon Demo Sequence
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
              1. <strong>Load Acme Demo Story</strong> $\rightarrow$ 2. Inspect <strong>Strategy Evolution</strong> (Feature-First $\rightarrow$ Arch-First) $\rightarrow$ 3. Click <strong>⚡ CTO RELIABILITY CONCERN</strong> $\rightarrow$ 4. <strong>RETAIN IN HINDSIGHT</strong> $\rightarrow$ 5. Watch strategy adapt to <strong>Deployment Resilience & SLAs</strong>!
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
