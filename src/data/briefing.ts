import type { BriefingIssue } from './types';

export const latestIssue: BriefingIssue = {
  id: 'issue-002',
  date: '2026-07-27',
  issueLabel: 'Issue 2 · July 2026',
  coverageWindow: 'Coverage window: July 20–26, 2026',
  headline: 'Vertical Is Not One Business',
  deck: 'Five buyers, one screen shape, and completely different reasons to say yes.',
  readTime: '6-minute briefing',
  substackUrl: 'https://thepickupco.substack.com/',
  atAGlance: [
    'vertTV launched a subscription-based vertical micro-series service with a 200-plus-title vault and a monthly original-release strategy.',
    'S4C ordered a second 60-episode Welsh-language vertical drama for its youth-facing Hansh TikTok channel.',
    'TikTok is testing LimeShorts, a paid U.S. microdrama app built around free samples, subscriptions and episode unlocks.',
    'Beast Industries is building both a dedicated full-scale vertical-production team and Vyro, a paid creator-distribution platform for outside brands.',
    'Albertsons Media Collective, Procter & Gamble, Minivela and Brilla Media made a 22-episode microdrama for retail, e-commerce and social distribution.',
  ],
  signalThisWeek: [
    'Vertical is no longer one app-category business. It is being used as a subscription destination, a paid-unlock product, a public-broadcaster commissioning lane, an in-house production capability and a retail-media format.',
    'The screen shape is common. The underlying buyer economics are not. A producer pitching a paid-unlock app is selling a conversion engine; a broadcaster is buying against an audience remit; a retailer is testing whether entertainment can create measurable commerce attention.',
    'The commissioner lane is likely the most durable model for an independent producer, though it is narrow by design. The wildcard is retail media: it already has brands, first-party data and owned screens, but still needs a repeatable entertainment format that proves its value.',
  ],
  moneyMoves: [
    {
      headline: 'vertTV launches a subscription platform, 200-plus-title vault and original slate',
      move: 'Los Angeles-based vertTV launched its iOS and Android subscription service with more than 200 exclusive titles and original vertical micro-series. The company says it will release original programming monthly, beginning with Lone Star Hearts, starring Cindy Busby and Josh Henderson.',
      read: 'This is a conventional streaming model compressed into a phone-first format: recognizable cast, a catalog, recurring originals and an integrated production-to-distribution operation. vertTV is also seeking partnerships with established creators, independent producers and library holders.',
      recordMatch: 'vertTV launches premium vertical micro-series platform',
      sources: [{ name: 'vertTV launch announcement', url: 'https://www.morningstar.com/news/pr-newswire/20260722fl10194/hollywood-veterans-launch-verttv-a-filmmaker-led-studio-and-premium-vertical-micro-series-platform' }],
    },
    {
      headline: 'S4C turns vertical drama into a repeat commissioning lane',
      move: 'S4C ordered 60-episode Welsh-language vertical drama Signal for Hansh, its TikTok channel, following earlier vertical series Yr Alwad. Mojo Productions will produce the series.',
      read: 'The repeat commission is the signal. S4C is using mobile serialization for a familiar broadcaster purpose—young audiences, local language and a clear cultural remit—rather than treating vertical as a one-off social experiment.',
      recordMatch: 'S4C commissions 60-episode vertical drama Signal',
      sources: [{ name: 'Televisual', url: 'https://www.televisual.com/news/s4c-orders-new-vertical-drama-signal/' }],
    },
    {
      headline: 'Albertsons and P&G bring scripted microdrama into retail media',
      move: 'Albertsons Media Collective, Procter & Gamble, Minivela and Brilla Media launched Rico’s Tacos, a 22-episode scripted microdrama distributed through Albertsons in-store screens, e-commerce and social channels.',
      read: 'Retail media already has brand budgets, shopper data and owned screens. The meaningful test is whether recurring scripted entertainment proves more useful to brands and shoppers than another conventional ad unit.',
      recordMatch: 'Albertsons Media Collective tests branded microdrama',
      sources: [{ name: 'Modern Retail', url: 'https://www.modernretail.co/marketing/albertsons-new-micro-sitcom-is-a-big-deal-for-retail-media/' }],
    },
  ],
  mandatesForming: [
    {
      buyer: 'TikTok / ByteDance tests a paid vertical-serial product',
      confidence: 'medium',
      signal: 'TikTok has reportedly tested LimeShorts in the U.S. since March. The microdrama app lets viewers watch several episodes free before paying to unlock more, with reported weekly, annual and episode-level purchase options.',
      whyItMatters: 'Major social platforms may become owners of the checkout, not merely places where vertical series are promoted. A paid-unlock buyer needs a serial engine built around repeat conversion, not a conventional pilot.',
      evidence: [{ name: 'Tubefilter', url: 'https://www.tubefilter.com/2026/07/23/tiktok-lime-shorts-paid-microdrama-app/' }],
    },
    {
      buyer: 'Beast Industries builds vertical production and paid creator distribution',
      confidence: 'high',
      signal: 'Beast is staffing a dedicated Vertical team for full-scale social productions while separately building Vyro, a creator-led platform that pays independent creators to turn brand assets into social-native clips.',
      whyItMatters: 'Beast is building an operating system around attention: original vertical production on one side, and campaign activation and creator-network distribution on the other.',
      evidence: [
        { name: 'Beast Vertical Creative Producer posting', url: 'https://www.linkedin.com/jobs/view/4444489078/' },
        { name: 'Vyro Community Manager posting', url: 'https://www.linkedin.com/jobs/view/4409015282/' },
      ],
    },
    {
      buyer: 'DramaBox adds third-party AI-produced microdrama distribution',
      confidence: 'medium',
      signal: 'DramaBox took worldwide distribution of Loomi Entertainment Group and Globavend Holdings’ AI-produced English-language microdrama.',
      whyItMatters: 'The agreement is concrete evidence that a leading vertical platform will distribute at least one third-party AI-produced series globally, adding a new variable to its existing mobile-fiction and localization pipeline.',
      evidence: [{ name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/dramabox-globavend-announce-global-distribution-130000474.html' }],
    },
  ],
  buyerToWatch: {
    name: 'vertTV',
    buyerMatch: 'verttv',
    apparentMandate: 'Subscription-first vertical micro-series, built around a catalog, star-driven originals and partnerships with creators, independent producers and library holders.',
    route: 'Partnership ambition stated; no public acquisition or submissions route identified.',
    namedExecutive: 'Jeffrey Schenck, Barry Barnholtz and Peter Sullivan, co-founders.',
    unknown: 'How the platform will price, acquire and retain subscribers, and what commercial structure it will offer outside partners.',
  },
  quickCuts: [
    {
      headline: 'Netflix expands digital-publisher licensing beyond individual creators',
      summary: 'Netflix licensed lifestyle programming from BuzzFeed Studios, Condé Nast, Hearst Magazines, People Inc., PMX and Tastemade for release across six English-language markets. The package includes both archive and ongoing series.',
      sourceName: 'Netflix',
      sourceUrl: 'https://about.netflix.com/en/news/netflix-licenses-lifestyle-programming-from-leading-digital-publishers',
    },
    {
      headline: 'GammaTime and COL Group commit to four original microseries',
      summary: 'The companies will co-finance and co-produce four original microseries, starting with a FlareFlow license, She Means Justice, and a sequel.',
      sourceName: 'Episode Magazine',
      sourceUrl: 'https://episodemag.com/gammatime-and-col-group-plan-original-microseries/',
    },
    {
      headline: 'Rakuten TV and Sony Pictures launch 20 FAST channels across Europe',
      summary: 'The rollout covers eight European market groups and includes localized genre and single-IP channels, demonstrating Rakuten’s managed FAST-channel capacity for a major studio portfolio.',
      sourceName: 'Rakuten TV',
      sourceUrl: 'https://www.enterprise.rakuten.tv/press-release/rakuten-tv-expands-fast-offering-with-sony-pictures/',
    },
    {
      headline: 'Instagram for TV explores episodic and longer-form creator video',
      summary: 'Meta says its connected-TV Instagram experience is expanding beyond short-form video and exploring episodic series, longer-form video and live creator formats.',
      sourceName: 'Meta',
      sourceUrl: 'https://about.fb.com/news/2026/06/instagram-for-tv/',
    },
    {
      headline: 'Reign Maker Group takes majority stake in creator-management company Hyphen HQ',
      summary: 'The transaction pairs a creator-management acquisition with HyphenShare, a profit-sharing and options program for creators and talent managers.',
      sourceName: 'Net Influencer',
      sourceUrl: 'https://www.netinfluencer.com/reign-maker-group-acquires-hyphen-bets-equity-will-end-creator-managements-poaching-cycle',
    },
  ],
};
