import { useState, useEffect, useCallback } from 'react';
import {
  LogOut, Plus, ChevronUp, ChevronDown, Trash2, Save, Send, Loader2, AlertCircle, CheckCircle2,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { supabase as dataSupabase } from '../data/supabase';
import { supabase as libSupabase } from '../lib/supabase';
import { RichTextEditor } from '../components/RichTextEditor';

const supabase = dataSupabase || libSupabase;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

interface MandateRow {
  signal_type: string;
  confidence: 'low' | 'medium' | 'high';
  explanation: string;
  why_it_matters: string;
  evidence_url: string;
}

interface QuickCutRow {
  headline: string;
  summary: string;
  source_url: string;
}

interface BriefingSummary {
  id: string;
  date: string;
  headline: string;
  is_published: boolean;
}

interface RecordOption {
  id: string;
  headline: string;
  date: string;
}

interface BuyerOption {
  id: string;
  name: string;
}

const emptyMandate = (): MandateRow => ({
  signal_type: '', confidence: 'medium', explanation: '', why_it_matters: '', evidence_url: '',
});

const emptyQuickCut = (): QuickCutRow => ({
  headline: '', summary: '', source_url: '',
});

// ---------------------------------------------------------------------------
// Reorderable list helpers
// ---------------------------------------------------------------------------

function moveUp<T>(arr: T[], i: number): T[] {
  if (i <= 0) return arr;
  const next = [...arr];
  [next[i - 1], next[i]] = [next[i], next[i - 1]];
  return next;
}

function moveDown<T>(arr: T[], i: number): T[] {
  if (i >= arr.length - 1) return arr;
  const next = [...arr];
  [next[i], next[i + 1]] = [next[i + 1], next[i]];
  return next;
}

// ---------------------------------------------------------------------------
// Feedback banner
// ---------------------------------------------------------------------------

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
};

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

function Banner({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border ${
      type === 'success'
        ? 'bg-forest-50 text-forest-800 border-forest-300'
        : 'bg-red-50 text-red-800 border-red-300'
    }`}>
      {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline section label
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-inkred border-t-2 border-ink-900 pt-3 mt-8 mb-4">
      {children}
    </h3>
  );
}

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { setError('Supabase not configured'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Admin — The Pickup</h1>
        <p className="text-sm text-ink-500">Sign in to manage briefings.</p>
        {error && <Banner type="error" message={error} />}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-700 mb-1">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-inkred" />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-700 mb-1">Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-inkred" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-ink-900 text-cream-50 px-4 py-2.5 text-sm font-semibold hover:bg-ink-800 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 size={14} className="animate-spin" />} Sign In
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin page (exported)
// ---------------------------------------------------------------------------

export function AdminPage() {
  // Auth state
  const [user, setUser] = useState<unknown>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Briefing list
  const [briefings, setBriefings] = useState<BriefingSummary[]>([]);

  // Options for pickers
  const [recordOptions, setRecordOptions] = useState<RecordOption[]>([]);
  const [buyerOptions, setBuyerOptions] = useState<BuyerOption[]>([]);

  // Form state
  const [formId, setFormId] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formIssueLabel, setFormIssueLabel] = useState('');
  const [formHeadline, setFormHeadline] = useState('');
  const [formDeck, setFormDeck] = useState('');
  const [formSignal, setFormSignal] = useState('');
  const [formMoneyMoves, setFormMoneyMoves] = useState<string[]>([]);
  const [formLegacyCrossovers, setFormLegacyCrossovers] = useState<string[]>([]);
  const [formBuyerToWatch, setFormBuyerToWatch] = useState('');
  const [formMandates, setFormMandates] = useState<MandateRow[]>([emptyMandate()]);
  const [formQuickCuts, setFormQuickCuts] = useState<QuickCutRow[]>([emptyQuickCut()]);

  // Auto-slug tracking
  const [slugManual, setSlugManual] = useState(false);

  // UI state
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ---------- Auth ----------
  useEffect(() => {
    if (!supabase) { setAuthChecked(true); return; }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        setAuthChecked(true);
      })();
    });
    // Initial check
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u ?? null);
      setAuthChecked(true);
    })();
    return () => { subscription.unsubscribe(); };
  }, []);

  // ---------- Load data when authenticated ----------
  const loadBriefings = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('briefings')
      .select('id, date, headline, is_published')
      .order('date', { ascending: false });
    if (data) setBriefings(data);
  }, []);

  const loadOptions = useCallback(async () => {
    if (!supabase) return;
    const [recRes, buyRes] = await Promise.all([
      supabase.from('records').select('id, headline, date').eq('is_published', true).order('date', { ascending: false }),
      supabase.from('buyers').select('id, name').eq('is_published', true).order('name'),
    ]);
    if (recRes.data) setRecordOptions(recRes.data);
    if (buyRes.data) setBuyerOptions(buyRes.data);
  }, []);

  useEffect(() => {
    if (user) { loadBriefings(); loadOptions(); }
  }, [user, loadBriefings, loadOptions]);

  // ---------- Load existing briefing into form ----------
  const loadBriefing = async (id: string) => {
    if (!supabase) return;
    const [bRes, mRes, qRes] = await Promise.all([
      supabase.from('briefings').select('*').eq('id', id).single(),
      supabase.from('briefing_mandates').select('*').eq('briefing_id', id).order('position'),
      supabase.from('briefing_quick_cuts').select('*').eq('briefing_id', id).order('position'),
    ]);
    if (!bRes.data) return;
    const b = bRes.data;
    setEditingId(id);
    setFormId(b.id);
    setFormDate(b.date);
    setFormIssueLabel(b.issue_label);
    setFormHeadline(b.headline);
    setFormDeck(b.deck || '');
    setFormSignal(b.signal_this_week || '');
    setFormMoneyMoves(b.money_moves || []);
    setFormLegacyCrossovers(b.legacy_crossovers || []);
    setFormBuyerToWatch(b.buyer_to_watch || '');
    setSlugManual(true);

    if (mRes.data && mRes.data.length > 0) {
      setFormMandates(mRes.data.map((m: MandateRow) => ({
        signal_type: m.signal_type, confidence: m.confidence,
        explanation: m.explanation, why_it_matters: m.why_it_matters, evidence_url: m.evidence_url,
      })));
    } else {
      setFormMandates([emptyMandate()]);
    }

    if (qRes.data && qRes.data.length > 0) {
      setFormQuickCuts(qRes.data.map((q: QuickCutRow) => ({
        headline: q.headline, summary: q.summary, source_url: q.source_url,
      })));
    } else {
      setFormQuickCuts([emptyQuickCut()]);
    }

    setFeedback(null);
  };

  // ---------- Clear form ----------
  const clearForm = () => {
    setEditingId(null);
    setFormId('');
    setFormDate('');
    setFormIssueLabel('');
    setFormHeadline('');
    setFormDeck('');
    setFormSignal('');
    setFormMoneyMoves([]);
    setFormLegacyCrossovers([]);
    setFormBuyerToWatch('');
    setFormMandates([emptyMandate()]);
    setFormQuickCuts([emptyQuickCut()]);
    setSlugManual(false);
    setFeedback(null);
  };

  // ---------- Headline → slug ----------
  const handleHeadlineChange = (val: string) => {
    setFormHeadline(val);
    if (!slugManual) setFormId(toSlug(val));
  };

  // ---------- Save ----------
  const handleSave = async (publish: boolean) => {
    if (!supabase) { setFeedback({ type: 'error', message: 'Supabase not configured' }); return; }
    if (!formId || !formDate || !formIssueLabel || !formHeadline) {
      setFeedback({ type: 'error', message: 'ID, date, issue label, and headline are required.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      // 1. Upsert briefing
      const { error: upsertErr } = await supabase.from('briefings').upsert({
        id: formId,
        date: formDate,
        issue_label: formIssueLabel,
        headline: formHeadline,
        deck: sanitizeHtml(formDeck),
        signal_this_week: sanitizeHtml(formSignal),
        money_moves: formMoneyMoves,
        legacy_crossovers: formLegacyCrossovers,
        buyer_to_watch: formBuyerToWatch,
        is_published: publish,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (upsertErr) throw upsertErr;

      // 2. Replace mandates
      await supabase.from('briefing_mandates').delete().eq('briefing_id', formId);
      const validMandates = formMandates.filter(m => m.signal_type.trim());
      if (validMandates.length > 0) {
        const { error: mErr } = await supabase.from('briefing_mandates').insert(
          validMandates.map((m, i) => ({
            ...m,
            explanation: sanitizeHtml(m.explanation),
            why_it_matters: sanitizeHtml(m.why_it_matters),
            briefing_id: formId,
            position: i,
          })),
        );
        if (mErr) throw mErr;
      }

      // 3. Replace quick cuts
      await supabase.from('briefing_quick_cuts').delete().eq('briefing_id', formId);
      const validCuts = formQuickCuts.filter(q => q.headline.trim());
      if (validCuts.length > 0) {
        const { error: qErr } = await supabase.from('briefing_quick_cuts').insert(
          validCuts.map((q, i) => ({
            ...q,
            summary: sanitizeHtml(q.summary),
            briefing_id: formId,
            position: i,
          })),
        );
        if (qErr) throw qErr;
      }

      setEditingId(formId);
      setSlugManual(true);
      setFeedback({ type: 'success', message: publish ? 'Published successfully.' : 'Draft saved.' });
      await loadBriefings();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  // ---------- Sign out ----------
  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  // ---------- Toggle helpers for record checkbox lists ----------
  const toggleRecord = (list: string[], setList: (v: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

  // ---------- Render ----------

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-ink-400" />
      </div>
    );
  }

  if (!user) return <LoginForm />;

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Top bar */}
      <div className="border-b border-ink-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-extrabold tracking-tight text-ink-900">Briefing Editor</h1>
          <button onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-inkred">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ====== Briefing list ====== */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink-900">Briefings</h2>
            <button onClick={clearForm}
              className="flex items-center gap-1 text-xs font-semibold text-inkred hover:text-inkred-700">
              <Plus size={14} /> New Briefing
            </button>
          </div>
          <div className="border border-ink-200 divide-y divide-ink-100 bg-white">
            {briefings.length === 0 && (
              <p className="px-4 py-6 text-sm text-ink-400 text-center">No briefings yet.</p>
            )}
            {briefings.map(b => (
              <button key={b.id} onClick={() => loadBriefing(b.id)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between gap-4 hover:bg-cream-50 transition-colors ${editingId === b.id ? 'bg-cream-50' : ''}`}>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-ink-900 truncate block">{b.headline || b.id}</span>
                  <span className="text-xs text-ink-500">{b.id} · {b.date}</span>
                </div>
                <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                  b.is_published
                    ? 'bg-forest-100 text-forest-800'
                    : 'bg-ink-100 text-ink-600'
                }`}>
                  {b.is_published ? 'Published' : 'Draft'}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ====== Feedback ====== */}
        {feedback && <Banner type={feedback.type} message={feedback.message} />}

        {/* ====== Editor form ====== */}
        <section className="space-y-6">
          <SectionLabel>
            {editingId ? `Editing: ${editingId}` : 'New Briefing'}
          </SectionLabel>

          {/* ID + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-700 mb-1">ID / Slug</label>
              <input type="text" value={formId}
                onChange={e => { setFormId(e.target.value); setSlugManual(true); }}
                placeholder="issue-003"
                className="w-full border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-inkred" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-700 mb-1">Date</label>
              <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)}
                className="w-full border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-inkred" />
            </div>
          </div>

          {/* Issue label */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-700 mb-1">Issue Label</label>
            <input type="text" value={formIssueLabel} onChange={e => setFormIssueLabel(e.target.value)}
              placeholder="Issue 3 · August 2026"
              className="w-full border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-inkred" />
          </div>

          {/* Headline */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-700 mb-1">Headline</label>
            <input type="text" value={formHeadline} onChange={e => handleHeadlineChange(e.target.value)}
              className="w-full border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-inkred" />
          </div>

          {/* Deck */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-700 mb-1">Deck</label>
            <RichTextEditor value={formDeck} onChange={setFormDeck} rows={2} />
          </div>

          {/* Signal this week */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-700 mb-1">Signal This Week</label>
            <RichTextEditor value={formSignal} onChange={setFormSignal} rows={5} />
          </div>

          {/* ====== Money Moves ====== */}
          <SectionLabel>Money Moves (select published records)</SectionLabel>
          <div className="border border-ink-200 bg-white divide-y divide-ink-100 max-h-64 overflow-y-auto">
            {recordOptions.length === 0 && (
              <p className="px-4 py-3 text-sm text-ink-400">No published records.</p>
            )}
            {recordOptions.map(r => {
              const checked = formMoneyMoves.includes(r.id);
              return (
                <label key={r.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 cursor-pointer">
                  <input type="checkbox" checked={checked}
                    onChange={() => toggleRecord(formMoneyMoves, setFormMoneyMoves, r.id)}
                    className="accent-inkred" />
                  <span className="text-sm text-ink-900 truncate flex-1">{r.headline}</span>
                  <span className="text-xs text-ink-400 shrink-0">{r.date}</span>
                </label>
              );
            })}
          </div>
          {/* Reorder selected */}
          {formMoneyMoves.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500 mb-1">Selected order</p>
              {formMoneyMoves.map((id, i) => {
                const rec = recordOptions.find(r => r.id === id);
                return (
                  <div key={id} className="flex items-center gap-2 text-sm text-ink-700">
                    <button onClick={() => setFormMoneyMoves(moveUp(formMoneyMoves, i))} disabled={i === 0}
                      className="p-0.5 text-ink-400 hover:text-ink-900 disabled:opacity-30"><ChevronUp size={14} /></button>
                    <button onClick={() => setFormMoneyMoves(moveDown(formMoneyMoves, i))} disabled={i === formMoneyMoves.length - 1}
                      className="p-0.5 text-ink-400 hover:text-ink-900 disabled:opacity-30"><ChevronDown size={14} /></button>
                    <span className="truncate">{rec?.headline ?? id}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ====== Legacy Crossovers ====== */}
          <SectionLabel>Legacy Crossovers (select published records)</SectionLabel>
          <div className="border border-ink-200 bg-white divide-y divide-ink-100 max-h-64 overflow-y-auto">
            {recordOptions.length === 0 && (
              <p className="px-4 py-3 text-sm text-ink-400">No published records.</p>
            )}
            {recordOptions.map(r => {
              const checked = formLegacyCrossovers.includes(r.id);
              return (
                <label key={r.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 cursor-pointer">
                  <input type="checkbox" checked={checked}
                    onChange={() => toggleRecord(formLegacyCrossovers, setFormLegacyCrossovers, r.id)}
                    className="accent-inkred" />
                  <span className="text-sm text-ink-900 truncate flex-1">{r.headline}</span>
                  <span className="text-xs text-ink-400 shrink-0">{r.date}</span>
                </label>
              );
            })}
          </div>
          {formLegacyCrossovers.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500 mb-1">Selected order</p>
              {formLegacyCrossovers.map((id, i) => {
                const rec = recordOptions.find(r => r.id === id);
                return (
                  <div key={id} className="flex items-center gap-2 text-sm text-ink-700">
                    <button onClick={() => setFormLegacyCrossovers(moveUp(formLegacyCrossovers, i))} disabled={i === 0}
                      className="p-0.5 text-ink-400 hover:text-ink-900 disabled:opacity-30"><ChevronUp size={14} /></button>
                    <button onClick={() => setFormLegacyCrossovers(moveDown(formLegacyCrossovers, i))} disabled={i === formLegacyCrossovers.length - 1}
                      className="p-0.5 text-ink-400 hover:text-ink-900 disabled:opacity-30"><ChevronDown size={14} /></button>
                    <span className="truncate">{rec?.headline ?? id}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ====== Buyer to Watch ====== */}
          <SectionLabel>Buyer to Watch</SectionLabel>
          <select value={formBuyerToWatch} onChange={e => setFormBuyerToWatch(e.target.value)}
            className="w-full border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-inkred">
            <option value="">— None —</option>
            {buyerOptions.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          {/* ====== Mandates ====== */}
          <SectionLabel>Briefing Mandates</SectionLabel>
          <div className="space-y-4">
            {formMandates.map((m, i) => (
              <div key={i} className="border border-ink-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500">Mandate {i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setFormMandates(moveUp(formMandates, i))} disabled={i === 0}
                      className="p-1 text-ink-400 hover:text-ink-900 disabled:opacity-30"><ChevronUp size={14} /></button>
                    <button onClick={() => setFormMandates(moveDown(formMandates, i))} disabled={i === formMandates.length - 1}
                      className="p-1 text-ink-400 hover:text-ink-900 disabled:opacity-30"><ChevronDown size={14} /></button>
                    <button onClick={() => setFormMandates(formMandates.filter((_, j) => j !== i))}
                      className="p-1 text-ink-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-600 mb-1">Signal Type</label>
                    <input type="text" value={m.signal_type}
                      onChange={e => { const next = [...formMandates]; next[i] = { ...m, signal_type: e.target.value }; setFormMandates(next); }}
                      className="w-full border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-900 focus:outline-none focus:border-inkred" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-600 mb-1">Confidence</label>
                    <select value={m.confidence}
                      onChange={e => { const next = [...formMandates]; next[i] = { ...m, confidence: e.target.value as MandateRow['confidence'] }; setFormMandates(next); }}
                      className="w-full border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-900 focus:outline-none focus:border-inkred">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-600 mb-1">Explanation</label>
                  <RichTextEditor value={m.explanation} onChange={val => { const next = [...formMandates]; next[i] = { ...m, explanation: val }; setFormMandates(next); }} rows={2} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-600 mb-1">Why It Matters</label>
                  <RichTextEditor value={m.why_it_matters} onChange={val => { const next = [...formMandates]; next[i] = { ...m, why_it_matters: val }; setFormMandates(next); }} rows={2} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-600 mb-1">Evidence URL</label>
                  <input type="text" value={m.evidence_url}
                    onChange={e => { const next = [...formMandates]; next[i] = { ...m, evidence_url: e.target.value }; setFormMandates(next); }}
                    className="w-full border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-900 focus:outline-none focus:border-inkred" />
                </div>
              </div>
            ))}
            <button onClick={() => setFormMandates([...formMandates, emptyMandate()])}
              className="flex items-center gap-1 text-xs font-semibold text-inkred hover:text-inkred-700">
              <Plus size={14} /> Add Mandate
            </button>
          </div>

          {/* ====== Quick Cuts ====== */}
          <SectionLabel>Briefing Quick Cuts</SectionLabel>
          <div className="space-y-4">
            {formQuickCuts.map((q, i) => (
              <div key={i} className="border border-ink-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500">Quick Cut {i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setFormQuickCuts(moveUp(formQuickCuts, i))} disabled={i === 0}
                      className="p-1 text-ink-400 hover:text-ink-900 disabled:opacity-30"><ChevronUp size={14} /></button>
                    <button onClick={() => setFormQuickCuts(moveDown(formQuickCuts, i))} disabled={i === formQuickCuts.length - 1}
                      className="p-1 text-ink-400 hover:text-ink-900 disabled:opacity-30"><ChevronDown size={14} /></button>
                    <button onClick={() => setFormQuickCuts(formQuickCuts.filter((_, j) => j !== i))}
                      className="p-1 text-ink-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-600 mb-1">Headline</label>
                  <input type="text" value={q.headline}
                    onChange={e => { const next = [...formQuickCuts]; next[i] = { ...q, headline: e.target.value }; setFormQuickCuts(next); }}
                    className="w-full border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-900 focus:outline-none focus:border-inkred" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-600 mb-1">Summary</label>
                  <RichTextEditor value={q.summary} onChange={val => { const next = [...formQuickCuts]; next[i] = { ...q, summary: val }; setFormQuickCuts(next); }} rows={2} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-600 mb-1">Source URL</label>
                  <input type="text" value={q.source_url}
                    onChange={e => { const next = [...formQuickCuts]; next[i] = { ...q, source_url: e.target.value }; setFormQuickCuts(next); }}
                    className="w-full border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-900 focus:outline-none focus:border-inkred" />
                </div>
              </div>
            ))}
            <button onClick={() => setFormQuickCuts([...formQuickCuts, emptyQuickCut()])}
              className="flex items-center gap-1 text-xs font-semibold text-inkred hover:text-inkred-700">
              <Plus size={14} /> Add Quick Cut
            </button>
          </div>

          {/* ====== Save actions ====== */}
          <div className="border-t-2 border-ink-900 pt-4 mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={() => handleSave(false)} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 border border-ink-900 text-ink-900 px-4 py-2.5 text-sm font-semibold hover:bg-ink-900 hover:text-cream-50 disabled:opacity-50 transition-colors">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-inkred text-cream-50 px-4 py-2.5 text-sm font-semibold hover:bg-inkred-700 disabled:opacity-50 transition-colors">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Publish
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
