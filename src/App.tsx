import { useState } from 'react';
import { forgeAttack } from './api';

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
    <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 800 }}>
      <h1>MirrorTrap 🪞</h1>

      <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
        <input placeholder="Name" value={profile.name}
          onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
        <input placeholder="Role" value={profile.role}
          onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} />
        <input placeholder="Organization" value={profile.organization}
          onChange={e => setProfile(p => ({ ...p, organization: e.target.value }))} />
        <input placeholder="Recent Activity" value={profile.recentActivity}
          onChange={e => setProfile(p => ({ ...p, recentActivity: e.target.value }))} />
        <input placeholder="Connection" value={profile.connection}
          onChange={e => setProfile(p => ({ ...p, connection: e.target.value }))} />
      </div>

      <button onClick={handleSimulate} disabled={loading}
        style={{ padding: '12px 24px', fontSize: 16, cursor: 'pointer' }}>
        {loading ? 'AI Analyzing...' : 'Simulate Attack'}
      </button>

      {result && (
        <div style={{ marginTop: 30, padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
          <h2>Exposure Score: {result.exposure_score}/100</h2>
          <p><strong>Verdict:</strong> {result.overall_verdict}</p>
          <p><strong>Sender:</strong> {result.sender_identity}</p>
          <p><strong>Message:</strong> {result.attack_message}</p>

          <h3>Exploited Details:</h3>
          {result.exploited_details?.map((detail: any, i: number) => (
            <div key={i} style={{ marginBottom: 12, padding: 10, background: 'white', borderRadius: 4 }}>
              <p><strong>Trigger:</strong> {detail.trigger}</p>
              <p><strong>Why it works:</strong> {detail.why_it_works}</p>
              <p><strong>Counter:</strong> {detail.counter}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}