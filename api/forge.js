export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { profile } = req.body;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'YOUR_NEW_KEY_HERE') {
    return res.json({
      attack_message: `Hi ${profile?.name || 'there'}, this is IT support from ${profile?.organization || 'your org'}. We've flagged your account. Please verify your credentials immediately.`,
      message_type: "whatsapp",
      sender_identity: "IT Support",
      exploited_details: [
        { detail_type: "name", phrase: `Hi ${profile?.name}`, trigger: "SOCIAL_PROOF", why_it_works: "Personalization creates false familiarity.", counter: "Verify sender through official channels." },
        { detail_type: "organization", phrase: `from ${profile?.organization}`, trigger: "FAKE_AUTHORITY", why_it_works: "Impersonating internal authority bypasses skepticism.", counter: "Contact IT directly via known email." }
      ],
      exposure_score: 78,
      attacker_goal: "Harvest credentials for unauthorized system access.",
      overall_verdict: "Dangerous"
    });
  }

  const SYSTEM_PROMPT = `You are an elite red-team social engineer. Analyze the profile and generate a hyper-realistic spear-phishing attack simulation. Output ONLY a JSON object with this exact structure:
{
  "attack_message": "realistic message under 150 words",
  "message_type": "whatsapp",
  "sender_identity": "fake sender name",
  "exploited_details": [
    {
      "detail_type": "name|role|organization|recentActivity|connection",
      "phrase": "exact phrase from attack_message",
      "trigger": "URGENCY|FAKE_AUTHORITY|SCARCITY|FEAR|RECIPROCITY|SOCIAL_PROOF",
      "why_it_works": "2 sentences explaining the psychology",
      "counter": "one sentence practical advice"
    }
  ],
  "exposure_score": 0-100,
  "attacker_goal": "one sentence",
  "overall_verdict": "safe|Suspicious|Dangerous"
}`;

  try {
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173',
        'X-Title': 'MirrorTrap'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Profile: ${JSON.stringify(profile)}` }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter error:', data);
      return res.status(500).json({ error: 'OpenRouter API error', details: data });
    }

    const raw = data.choices?.[0]?.message?.content || '';
    
    // Extract JSON from markdown code blocks if wrapped
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/```\s*([\s\S]*?)\s*```/);
    const cleanJson = jsonMatch ? jsonMatch[1].trim() : raw.trim();

    let result;
    try {
      result = JSON.parse(cleanJson);
    } catch (e) {
      console.error('JSON parse failed. Raw response:', raw);
      return res.status(500).json({ error: 'Invalid JSON from model', raw });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
  }
}
