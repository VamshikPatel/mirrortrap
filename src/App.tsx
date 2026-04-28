import { useState } from 'react';
import { forgeAttack } from './api';

const PRESETS = [
  {
    name: 'Vamshik',
    role: 'CS Student',
    organization: 'NMIT Bengaluru',
    recentActivity: 'TechFusion hackathon',
    connection: 'Prof Sharma'
  },
  {
    name: 'Rajesh Kumar',
    role: 'CTO',
    organization: 'Infosys',
    recentActivity: 'IPO announcement',
    connection: 'Board Member'
  },
  {
    name: 'Priya Nair',
    role: 'Product Manager',
    organization: 'Swiggy',
    recentActivity: 'Series F funding',
    connection: 'LinkedIn recruiter'
  }
];

export default function MirrorTrap() {
  const [profile, setProfile] = useState({
    name: 'Vamshik',
    role: 'CS Student',
    organization: 'NMIT Bengaluru',
    recentActivity: 'TechFusion hackathon',
    connection: 'Prof Sharma'
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const data = await forgeAttack(profile);
      setResult(data);
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: 40, marginBottom: 8 }}>MirrorTrap</h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 30 }}>
        AI-powered social engineering exposure engine
      </p>

      {/* PRESET DROPDOWN */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: 'bold', marginRight: 10 }}>Quick Profile:</label>
        <select
          onChange={(e) => {
            const preset = PRESETS[parseInt(e.target.value)];
            if (preset) setProfile(preset);
          }}
          style={{ padding: '8px 12px', fontSize: 14, borderRadius: 6, border: '1px solid #ccc' }}
        >
          <option value="">-- Select a preset --</option>
          {PRESETS.map((p, i) => (
            <option key={i} value={i}>{p.name} ({p.role}, {p.organization})</option>
          ))}
        </select>
      </div>

      {/* INPUT FIELDS */}
      <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
        <input placeholder="Name" value={profile.name}
          onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
        <input placeholder="Role" value={profile.role}
          onChange={e => setProfile(p => ({ ...p, role: e.target.value }))}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
        <input placeholder="Organization" value={profile.organization}
          onChange={e => setProfile(p => ({ ...p, organization: e.target.value }))}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
        <input placeholder="Recent Activity" value={profile.recentActivity}
          onChange={e => setProfile(p => ({ ...p, recentActivity: e.target.value }))}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
        <input placeholder="Connection" value={profile.connection}
          onChange={e => setProfile(p => ({ ...p, connection: e.target.value }))}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
      </div>

      {/* BUTTON */}
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleSimulate} disabled={loading}
          style={{
            padding: '14px 32px',
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? '#ccc' : '#a855f7',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold'
          }}>
          {loading ? 'AI Analyzing...' : 'Simulate Attack'}
        </button>
      </div>

      {/* LOADING SPINNER */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div className="spinner" />
          <p style={{ color: '#6b7280' }}>AI is analyzing your digital footprint...</p>
        </div>
      )}

      {/* RESULT CARD */}
      {!loading && result && (
        <div style={{
          marginTop: 30,
          padding: 24,
          background: '#f9fafb',
          borderRadius: 12,
          border: '1px solid #e5e7eb'
        }}>
          {/* SCORE METER */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 'bold', fontSize: 18 }}>Exposure Score</span>
              <span style={{ fontWeight: 'bold', fontSize: 18 }}>{result.exposure_score}/100</span>
            </div>
            <div style={{ width: '100%', height: 24, background: '#e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{
                width: `${result.exposure_score}%`,
                height: '100%',
                background: result.exposure_score >= 70 ? '#ef4444' : result.exposure_score >= 40 ? '#f59e0b' : '#22c55e',
                borderRadius: 12,
                transition: 'width 1s ease-out'
              }} />
            </div>
            <p style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>
              {result.exposure_score >= 70 ? '🔴 High Risk — Immediate attention required' :
               result.exposure_score >= 40 ? '🟡 Medium Risk — Review recommended' :
               '🟢 Low Risk — Good security posture'}
            </p>
          </div>

          {/* VERDICT */}
          <p style={{ fontSize: 20, marginBottom: 16 }}>
            <strong>Verdict:</strong>{' '}
            <span style={{
              color: result.overall_verdict === 'Dangerous' ? '#ef4444' :
                     result.overall_verdict === 'Suspicious' ? '#f59e0b' : '#22c55e',
              fontWeight: 'bold'
            }}>
              {result.overall_verdict}
            </span>
          </p>

          <p style={{ marginBottom: 8 }}><strong>Sender:</strong> {result.sender_identity}</p>
          <p style={{ marginBottom: 20, lineHeight: 1.6 }}>
            <strong>Message:</strong> {result.attack_message}
          </p>
          <p style={{ marginBottom: 16, padding: 12, background: '#fef3c7', borderRadius: 6, borderLeft: '4px solid #f59e0b' }}>
  <strong>🎯 Attacker Goal:</strong> {result.attacker_goal}
          </p>

          {/* EXPLOITED DETAILS */}
          <h3 style={{ marginBottom: 12, borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
            Exploited Details:
          </h3>
          {result.exploited_details?.map((detail: any, i: number) => (
            <div key={i} style={{
              marginBottom: 16,
              padding: 16,
              background: 'white',
              borderRadius: 8,
              border: '1px solid #e5e7eb'
            }}>

              <div style={{ marginTop: 20, padding: 16, background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                <h4 style={{ margin: '0 0 12px', color: '#065f46' }}>🛡️ Immediate Defense Actions</h4>
                <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
                  <li>Verify <strong>{result.sender_identity}</strong> through official channels before responding</li>
                  <li>Never click links in unsolicited WhatsApp/email messages</li>
                  <li>Confirm deadlines and offers directly on official websites</li>
                  <li>Report suspicious patterns to your IT security team</li>
                </ol>
              </div>
              <p style={{ fontSize: 16, fontWeight: 'bold', color: '#a855f7', marginBottom: 8 }}>
                Trigger: {detail.trigger}
              </p>
              <p style={{ marginBottom: 6, lineHeight: 1.5 }}>
                <strong>Why it works:</strong> {detail.why_it_works}
              </p>
              <p style={{ marginBottom: 0, lineHeight: 1.5, color: '#059669' }}>
                <strong>Counter:</strong> {detail.counter}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}