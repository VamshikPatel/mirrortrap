import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import type { HistoryEntry, AttackResult } from '../api';

interface AttackHistoryProps {
  open: boolean;
  onClose: () => void;
  entries: HistoryEntry[];
  onSelect: (result: AttackResult) => void;
  onClear: () => void;
}

export default function AttackHistory({ open, onClose, entries, onSelect, onClear }: AttackHistoryProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)', zIndex: 200,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, maxWidth: '90vw',
              background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-subtle)',
              zIndex: 201, display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 20px 16px', borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>Attack History</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {entries.length} simulation{entries.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {entries.length > 0 && (
                  <button
                    onClick={onClear}
                    style={{
                      padding: '6px 10px', fontSize: 12, fontWeight: 500,
                      color: '#ef4444', background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                )}
                <button
                  onClick={onClose}
                  style={{
                    padding: 6, background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
              {entries.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  color: 'var(--text-muted)', fontSize: 14,
                }}>
                  <Clock size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p>No simulations yet</p>
                  <p style={{ fontSize: 12 }}>Run your first attack simulation to see it here</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {entries.map((entry, i) => (
                    <motion.button
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => { onSelect(entry.result); onClose(); }}
                      className="glass-card"
                      style={{
                        width: '100%', padding: 14, cursor: 'pointer',
                        textAlign: 'left', fontFamily: 'var(--font-sans)',
                        display: 'flex', flexDirection: 'column', gap: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {entry.profile.name}
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                          color: entry.result.overall_verdict === 'Dangerous' ? '#fca5a5' : entry.result.overall_verdict === 'Suspicious' ? '#fcd34d' : '#86efac',
                          background: entry.result.overall_verdict === 'Dangerous' ? 'rgba(239,68,68,0.1)' : entry.result.overall_verdict === 'Suspicious' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                        }}>
                          {entry.result.exposure_score}/100
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {entry.profile.role} at {entry.profile.organization}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                        <Clock size={11} />
                        {new Date(entry.timestamp).toLocaleString()}
                        <span style={{ marginLeft: 'auto' }}>
                          <AlertTriangle size={11} style={{
                            color: entry.result.overall_verdict === 'Dangerous' ? '#ef4444' : '#f59e0b',
                          }} />
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
