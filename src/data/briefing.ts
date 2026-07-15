import type { BriefingIssue } from './types';

export const latestIssue: BriefingIssue = {
  id: 'issue-028',
  date: '2026-07-14',
  issueNumber: 28,
  headline: 'Microdrama Goes Permanent: ReelShort Builds Infrastructure While Legacy Studios Form New Divisions',
  deck: 'The week\'s clearest signal is that short-form entertainment is transitioning from experiment to committed business model across both insurgents and incumbents.',
  signalThisWeek: 'This week marks an inflection point: the buyers writing checks for short-form entertainment are no longer testing — they are building infrastructure. ReelShort\'s Atlanta expansion commits real estate and capital to multi-year production. Paramount\'s new division formalizes what was previously an executive\'s side project. StreamCast is commissioning originals at budget levels that require professional production. The common thread is permanence. These are not pilot programs or innovation labs. They are business units with mandates, headcount, and commissioning budgets. For working professionals, this means the window of opportunity in emerging formats is widening, not closing — but the standards are rising with it.',
  moneyMoves: ['rec-001', 'rec-002', 'rec-004', 'rec-005', 'rec-006'],
  mandatesForming: [
    {
      signalType: 'Executive Hiring',
      confidence: 'medium',
      explanation: 'Netflix has posted three roles in its mobile gaming division with content acquisition responsibilities, suggesting a move from pure gaming into narrative interactive content.',
      whyItMatters: 'If Netflix enters interactive narrative content, it could rapidly legitimize the format and compress the market opportunity for independents.',
      evidenceUrl: 'https://linkedin.com',
    },
    {
      signalType: 'Platform Expansion',
      confidence: 'high',
      explanation: 'TikTok Series (long-form paywall feature) has quietly expanded creator eligibility from 1M to 100K followers, dramatically widening the creator-funded content opportunity.',
      whyItMatters: 'Creates a direct monetization path for mid-tier creators that could compete with microdrama platforms for talent.',
      evidenceUrl: 'https://techcrunch.com',
    },
    {
      signalType: 'Casting Activity',
      confidence: 'low',
      explanation: 'Unusual volume of SAG-AFTRA micro-budget new-media agreements filed in Dallas-Fort Worth area over past 30 days — 3x normal rate.',
      whyItMatters: 'Could indicate a new regional production hub forming for short-form content, potentially a new buyer operating in stealth.',
      evidenceUrl: 'https://sagaftra.org',
    },
    {
      signalType: 'App Store Activity',
      confidence: 'medium',
      explanation: 'Two new microdrama apps — SnapStory and VersePlay — have appeared in US App Store top 200 Entertainment, suggesting new well-funded market entrants.',
      whyItMatters: 'More platforms mean more commissioning budgets and competition for talent, which should drive up rates.',
      evidenceUrl: 'https://appfigures.com',
    },
  ],
  legacyCrossovers: ['rec-008'],
  buyerToWatch: 'flashframe',
  quickCuts: [
    {
      headline: 'Roku Expands Originals Budget by 40% for 2027',
      summary: 'Roku confirmed expanded original content spending at investor day, focused on FAST-native unscripted formats.',
      sourceUrl: 'https://variety.com',
    },
    {
      headline: 'YouTube Shorts Fund Transitions to Revenue Share',
      summary: 'The $100M Shorts Fund is being replaced by a permanent revenue-sharing model starting September 2026.',
      sourceUrl: 'https://youtube.com',
    },
    {
      headline: 'Former Disney+ Exec Launches Indie Microdrama Studio',
      summary: 'Sarah Park, former VP of content strategy at Disney+, has launched Tiny Epic Studios focused on premium microdrama.',
      sourceUrl: 'https://deadline.com',
    },
    {
      headline: 'UK Government Announces Digital Content Tax Credit',
      summary: 'HMRC introduces 15% tax relief for short-form digital content produced in the UK, effective January 2027.',
      sourceUrl: 'https://gov.uk',
    },
    {
      headline: 'Amazon Freevee Seeks Creator-Led Unscripted Formats',
      summary: 'Amazon\'s free tier is actively seeking 10–30 minute creator-hosted unscripted shows for FAST-style programming.',
      sourceUrl: 'https://hollywoodreporter.com',
    },
    {
      headline: 'WebtoonX Adapts First Title as Live-Action Microdrama',
      summary: 'Webtoon\'s production arm greenlights live-action adaptation of popular webcomic into 80-episode vertical series.',
      sourceUrl: 'https://techcrunch.com',
    },
  ],
};
