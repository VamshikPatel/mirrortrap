import { motion } from 'framer-motion';
import { Eye, Search, UserCheck, Crosshair, Send, Skull, ArrowRight } from 'lucide-react';
import type { AttackResult, Profile } from '../api';

/**
 * Attack Chain / Kill Chain Visualization
 * Shows the step-by-step process an attacker uses to craft and deliver
 * a social engineering attack, using actual data from the simulation.
 */

interface AttackChainProps {
  profile: Profile;
  result: AttackResult;
}

const CHAIN_STEPS = [
  { icon: Eye, label: 'Reconnaissance', color: '#60a5fa', desc: 'Attacker gathers public data' },
  { icon: Search, label: 'OSINT Analysis', color: '#a78bfa', desc: 'Cross-referencing information' },
  { icon: UserCheck, label: 'Profile Building', color: '#c084fc', desc: 'Creating a psychological map' },
  { icon: Crosshair, label: 'Weapon Crafting', color: '#f472b6', desc: 'Personalizing the attack' },
  { icon: Send, label: 'Delivery', color: '#fb923c', desc: 'Deploying via trusted channels' },
  { icon: Skull, label: 'Exploitation', color: '#ef4444', desc: 'Extracting value from target' },
];

export default function AttackChain({ profile, result }: AttackChainProps) {
  // Map profile data to chain steps
  const stepData = [
    [`Name: ${profile.name}`, `Role: ${profile.role}`, `Organization: ${profile.organization}`],
    [`Recent: ${profile.recentActivity}`, `Connection: ${profile.connection}`, 'Social media scraping'],
    [`Trust anchor: ${profile.connection}`, `Authority: ${profile.organization}`, `Trigger: ${result.exploited_details?.[0]?.trigger || 'SOCIAL_PROOF'}`],
    [`Impersonating: ${result.sender_identity}`, `Channel: ${result.message_type}`, `Goal: ${result.attacker_goal?.slice(0, 50)}...`],
    [`Via: ${result.message_type}`, `Spoofed as: ${result.sender_identity}`, 'Personalized message sent'],
    [`Score: ${result.exposure_score}/100`, `Verdict: ${result.overall_verdict}`, `${result.exploited_details?.length || 0} vulnerabilities exploited`],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-card"
      style={{ padding: 24, marginBottom: 24 }}
    >
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--text-muted)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Crosshair size={14} style={{ color: 'var(--accent-purple)' }} />
        Attack Kill Chain
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {CHAIN_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* Timeline connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 32 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${step.color}12`, border: `1px solid ${step.color}30`,
                  }}>
                    <Icon size={15} style={{ color: step.color }} />
                  </div>
                  {i < CHAIN_STEPS.length - 1 && (
                    <div style={{ width: 1, height: 32, background: `linear-gradient(${step.color}40, ${CHAIN_STEPS[i + 1].color}40)` }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: i < CHAIN_STEPS.length - 1 ? 8 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: step.color }}>{step.label}</span>
                    <ArrowRight size={10} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step.desc}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {stepData[i].map((data, j) => (
                      <span key={j} style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 4,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                      }}>
                        {data}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
