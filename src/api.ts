const API_URL = 'http://localhost:3001';

export async function forgeAttack(profile: any) {
  const res = await fetch(`${API_URL}/api/forge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile })
  });
  if (!res.ok) throw new Error('API failed');
  return res.json();
}