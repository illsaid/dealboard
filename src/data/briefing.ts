import type { BriefingIssue } from './types';

export const latestIssue: BriefingIssue = {
  id: 'issue-prototype',
  date: '2026-07-14',
  issueLabel: 'Prototype Issue \u00b7 July 2026',
  headline: 'Microdrama Production Goes Physical as FAST Channels Commission Originals',
  deck: 'Two separate categories of buyer committed real capital to infrastructure this week.',
  signalThisWeek: 'ReelShort is building production space. StreamCast is commissioning originals at professional budgets. Both are investing in capacity rather than announcing slates. Physical commitments and per-episode budgets are harder to walk back than development announcements. The professional implications are specific: crew and writers in Atlanta, producers with true-crime library content, and creators already working in vertical formats.',
  moneyMoves: ['rec-001', 'rec-005', 'rec-004'],
  mandatesForming: [
    {
      signalType: 'Executive Hiring',
      confidence: 'medium',
      explanation: 'Netflix has posted three mobile gaming roles with content acquisition responsibilities, suggesting possible expansion into narrative interactive.',
      whyItMatters: 'Would compress the opportunity window for independent interactive platforms if Netflix enters.',
      evidenceUrl: 'https://linkedin.com/jobs',
    },
    {
      signalType: 'Platform Expansion',
      confidence: 'high',
      explanation: 'TikTok Series paywall feature expanded eligibility from 1M to 100K followers.',
      whyItMatters: 'Direct monetization path for mid-tier creators that competes with microdrama platforms for talent.',
      evidenceUrl: 'https://techcrunch.com',
    },
    {
      signalType: 'Regional Activity',
      confidence: 'low',
      explanation: 'Unusual volume of SAG-AFTRA micro-budget new-media agreements in Dallas-Fort Worth — approximately 3x normal monthly rate.',
      whyItMatters: 'Could indicate a new regional production hub or stealth buyer. Evidence insufficient for attribution.',
      evidenceUrl: 'https://sagaftra.org',
    },
  ],
  legacyCrossovers: ['rec-008'],
  buyerToWatch: 'flashframe',
  quickCuts: [
    {
      headline: 'Roku Expands Originals Budget 40% for 2027',
      summary: 'Confirmed at investor day; focused on FAST-native unscripted formats.',
      sourceUrl: 'https://variety.com',
    },
    {
      headline: 'YouTube Shorts Fund Transitions to Revenue Share',
      summary: '$100M fund replaced by permanent revenue-sharing model, September 2026.',
      sourceUrl: 'https://youtube.com',
    },
    {
      headline: 'Former Disney+ VP Launches Indie Microdrama Studio',
      summary: 'Sarah Park founds Tiny Epic Studios; no commissioning details yet.',
      sourceUrl: 'https://deadline.com',
    },
    {
      headline: 'UK Announces Digital Content Tax Credit',
      summary: '15% relief for short-form digital content produced in UK, effective January 2027.',
      sourceUrl: 'https://gov.uk',
    },
    {
      headline: 'Amazon Freevee Seeking Creator-Led Unscripted',
      summary: 'Actively seeking 10–30 minute creator-hosted shows for FAST programming.',
      sourceUrl: 'https://hollywoodreporter.com',
    },
  ],
};
