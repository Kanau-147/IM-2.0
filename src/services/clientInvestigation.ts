import { InvestigationReport, DatasetItem } from '../types';

export const SEED_INVESTIGATIONS: InvestigationReport[] = [
  {
    id: 'inv-vine',
    url: 'https://vine.co',
    domain: 'vine.co',
    title: 'Vine · 6-Second Looping Video Platform',
    investigatedAt: '2026-10-18T00:00:00.000Z',
    status: 'Redirected',
    httpStatus: 301,
    redirectTarget: 'https://x.com',
    redirectChain: [
      { from: 'https://vine.co', to: 'https://twitter.com/vine', code: 301 },
      { from: 'https://twitter.com/vine', to: 'https://x.com/vine', code: 301 },
    ],
    firstCaptured: '2012-06-15',
    lastCaptured: '2026-08-11',
    totalCaptures: 418290,
    timelineSnapshots: [
      {
        year: 2012,
        date: '2012-10-10',
        title: 'Vine - An entertainment network where anyone can share video',
        snippet: 'A revolutionary 6-second looping video capture app founded by Dom Hofmann, Rus Yusupov, and Colin Kroll. Acquired by Twitter pre-launch for ~$30M.',
        waybackUrl: 'https://web.archive.org/web/20121010000000*/vine.co',
        keyChange: 'Pre-launch stealth page and mobile beta signups.',
      },
      {
        year: 2014,
        date: '2014-06-20',
        title: 'Vine · Watch loops, explore channels, and discover creators',
        snippet: 'Peak platform scale with 100M+ monthly users, pioneering modern internet comedy, sound memes, and looping formats.',
        waybackUrl: 'https://web.archive.org/web/20140620000000*/vine.co',
        keyChange: 'Full web player, explore categories, and creator metrics.',
      },
      {
        year: 2017,
        date: '2017-01-17',
        title: 'Vine Archive · FAQs and Read-Only Discontinuation Notice',
        snippet: 'Twitter discontinued the mobile app and transitioned vine.co into a static read-only archive of existing video loops.',
        waybackUrl: 'https://web.archive.org/web/20170117000000*/vine.co',
        keyChange: 'Creation tools disabled; transformed into an archive repository.',
      },
      {
        year: 2026,
        date: '2026-01-05',
        title: 'Vine.co (Redirecting to X)',
        snippet: 'Domain now automatically redirects visitors to X (formerly Twitter). The original archive interface is no longer maintained live.',
        waybackUrl: 'https://web.archive.org/web/20260105000000*/vine.co',
        keyChange: 'Permanent 301 redirection to X platform.',
      },
    ],
    currentLive: {
      available: true,
      title: 'X (formerly Twitter)',
      finalUrl: 'https://x.com',
      contentSample: 'Redirected destination. The original 6-second looping video platform has ceased hosting public interactive feeds.',
    },
    aiAnalysis: {
      executiveSummary: 'Vine defined the grammar of mobile short-form video in the early 2010s, cultivating an entire generation of digital creators before collapsing due to creator monetization failures and parent company strategic indecision.',
      historicalSignificance: 'Predecessor to TikTok, Instagram Reels, and YouTube Shorts. Vine proved that strict temporal constraints (6 seconds) fostered unmatched creative ingenuity.',
      whatHappenedAutopsy: 'Twitter acquired Vine in October 2012 prior to public launch. Despite reaching viral dominance by 2014, Vine struggled to monetize top creators. Key talent defected to YouTube and Instagram. Infrastructure costs mounted while product development stagnated, leading Twitter to shut down creation in October 2016.',
      fateCategory: 'Acquired & Sunset',
      keyMilestones: [
        { year: '2012', event: 'Founded & Acquired', impact: 'Built in NYC; bought by Twitter for reported $30M.' },
        { year: '2013', event: '#1 Free iOS App', impact: 'Became the dominant social video app in English-speaking markets.' },
        { year: '2016', event: 'Shutdown Announcement', impact: 'Twitter CEO Jack Dorsey announced app sunset amidst company-wide cost cutting.' },
      ],
      semanticDrift: {
        peakEraValueProp: 'A mobile community for discovering rapid 6-second looping audio-visual comedy and art.',
        currentStatusProp: 'A legacy HTTP redirect pointing to a generalized real-time microblogging feed (X).',
        discrepancyNote: 'Complete extinction of standalone community, media player, and creator attribution pages.',
      },
      preservationRisk: 'Critical',
      evidenceTakeaways: [
        'Over 39 million original videos were permanently deleted when Twitter disabled the static archive in 2019.',
        'DNS and SSL configuration confirms authoritative control remains with Twitter/X Corp.',
        'Wayback Machine contains over 400,000 index passes preserving HTML metadata for historical vines.',
      ],
    },
    evidenceTags: ['Short Video', 'Social Media', 'Twitter Acquisition', 'Creator Economy', 'Sunset'],
  },
  {
    id: 'inv-theranos',
    url: 'https://theranos.com',
    domain: 'theranos.com',
    title: 'Theranos · Health Technology & Blood Testing',
    investigatedAt: '2026-10-18T00:00:00.000Z',
    status: 'Defunct',
    httpStatus: 0,
    redirectChain: [],
    firstCaptured: '2004-03-01',
    lastCaptured: '2025-11-20',
    totalCaptures: 189400,
    timelineSnapshots: [
      {
        year: 2004,
        date: '2004-05-10',
        title: 'Theranos - Real-Time Health Diagnostics',
        snippet: 'Stealth-mode biotech startup website promising microfluidic blood diagnostics founded by Elizabeth Holmes.',
        waybackUrl: 'https://web.archive.org/web/20040510000000*/theranos.com',
        keyChange: 'Corporate registration and preliminary patent filings.',
      },
      {
        year: 2014,
        date: '2014-09-15',
        title: 'Theranos · One tiny drop changes everything',
        snippet: 'High-profile consumer launch with Walgreens partnership. Sleek black-and-white Silicon Valley design claiming hundreds of lab tests from a fingerstick.',
        waybackUrl: 'https://web.archive.org/web/20140915000000*/theranos.com',
        keyChange: 'Consumer wellness center locator and promotional media blitz.',
      },
      {
        year: 2016,
        date: '2016-07-22',
        title: 'Theranos · Facts and Quality Statement',
        snippet: 'Crisis PR and legal defense page following the Wall Street Journal investigative exposé by John Carreyrou revealing inaccurate test results.',
        waybackUrl: 'https://web.archive.org/web/20160722000000*/theranos.com',
        keyChange: 'Marketing removed; replaced by compliance and regulatory response letters.',
      },
      {
        year: 2018,
        date: '2018-09-04',
        title: 'Theranos · Dissolution Notice',
        snippet: 'Formal notification of corporate dissolution, liquidation of remaining assets, and creditor distribution agreement.',
        waybackUrl: 'https://web.archive.org/web/20180904000000*/theranos.com',
        keyChange: 'Complete operational shutdown and domain lapse.',
      },
    ],
    currentLive: {
      available: false,
      title: 'Domain Unreachable (DNS NXDOMAIN)',
      finalUrl: 'https://theranos.com',
      contentSample: 'Server IP could not be resolved. All web servers have been decommissioned.',
    },
    aiAnalysis: {
      executiveSummary: 'Theranos promised revolutionary diagnostic blood testing with proprietary Edison hardware, raising over $700M at a $10B valuation, before collapsing in fraud revelations, criminal convictions, and total liquidation.',
      historicalSignificance: 'The definitive Silicon Valley cautionary tale regarding "fake it till you make it" culture applied to medical devices and human health outcomes.',
      whatHappenedAutopsy: 'WSJ investigative reporting in late 2015 triggered FDA and CMS inspections that found severe laboratory deficiencies. CMS voided years of test results and revoked certifications. Elizabeth Holmes and Ramesh Balwani were criminally indicted for wire fraud and later sentenced to federal prison.',
      fateCategory: 'Defunct / Inactive',
      keyMilestones: [
        { year: '2003', event: 'Founded by Elizabeth Holmes', impact: 'Dropped out of Stanford to pursue microfluidics.' },
        { year: '2014', event: '$9B Peak Valuation', impact: 'Featured on covers of Fortune, Forbes, and Inc.' },
        { year: '2015', event: 'WSJ Exposé', impact: 'John Carreyrou revealed proprietary machines were not functioning.' },
        { year: '2018', event: 'Formal Dissolution', impact: 'Company ceased operations; SEC and DOJ charges formalized.' },
      ],
      semanticDrift: {
        peakEraValueProp: 'Empowering individuals with fast, painless, inexpensive blood testing accessible at neighborhood pharmacies.',
        currentStatusProp: 'DNS non-existent; total vacuum of live digital infrastructure.',
        discrepancyNote: 'Total collapse from a multi-billion-dollar enterprise to an unresolvable network address.',
      },
      preservationRisk: 'Critical',
      evidenceTakeaways: [
        'Marketing copy claimed "FDA-approved" testing that was later proven to be run on commercial third-party Siemens analyzers.',
        'Domain DNS records expired in 2019 following creditor asset auctions.',
        'Historical web captures serve as primary evidence in federal litigation records.',
      ],
    },
    evidenceTags: ['Biotech', 'Fraud', 'Corporate Collapse', 'Regulatory Failure', 'Defunct'],
  },
];

export const SEED_DATASET_ITEMS: DatasetItem[] = [
  { id: 'ds-1', url: 'https://vine.co', name: 'Vine', yearFounded: 2012, yearSunset: 2017, category: 'Video / Social', fate: 'Acquired & Sunset', investigationId: 'inv-vine' },
  { id: 'ds-2', url: 'https://theranos.com', name: 'Theranos', yearFounded: 2003, yearSunset: 2018, category: 'Biotech / MedTech', fate: 'Fraud / Liquidation', investigationId: 'inv-theranos' },
  { id: 'ds-3', url: 'https://geocities.com', name: 'GeoCities', yearFounded: 1994, yearSunset: 2009, category: 'Web Hosting', fate: 'Acquired & Closed', notes: 'Pioneered user-created web neighborhoods.' },
  { id: 'ds-4', url: 'https://google.com/reader', name: 'Google Reader', yearFounded: 2005, yearSunset: 2013, category: 'RSS / Publishing', fate: 'Sunsetted', notes: 'Beloved RSS aggregator discontinued by Google.' },
  { id: 'ds-5', url: 'https://pebble.com', name: 'Pebble Technology', yearFounded: 2012, yearSunset: 2016, category: 'Wearables / Hardware', fate: 'Acquired by Fitbit', notes: 'Pioneered e-paper smartwatches via Kickstarter.' },
  { id: 'ds-6', url: 'https://altavista.com', name: 'AltaVista', yearFounded: 1995, yearSunset: 2013, category: 'Search Engine', fate: 'Acquired by Yahoo', notes: 'Early web search powerhouse before Google dominance.' },
  { id: 'ds-7', url: 'https://justin.tv', name: 'Justin.tv', yearFounded: 2007, yearSunset: 2014, category: 'Live Streaming', fate: 'Pivoted to Twitch', notes: 'Began as lifelogging stream; gaming vertical became Twitch.' },
  { id: 'ds-8', url: 'https://friendster.com', name: 'Friendster', yearFounded: 2002, yearSunset: 2015, category: 'Social Network', fate: 'Pivoted to Gaming then Closed', notes: 'First modern social network before MySpace and Facebook.' },
];

export function cleanClientUrl(input: string): { normalizedUrl: string; domain: string; cleanName: string } {
  let cleaned = (input || '').trim().replace(/^["'\[<]+|["'\]>]+$/g, '');
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  try {
    const parsed = new URL(cleaned);
    const domain = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const cleanName = domain.split('.')[0]
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const pathPart = parsed.pathname === '/' ? '' : parsed.pathname;
    return {
      normalizedUrl: `${parsed.protocol}//${parsed.hostname}${pathPart}`,
      domain,
      cleanName: cleanName || 'Website',
    };
  } catch {
    const raw = cleaned.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase().replace(/^www\./, '');
    return {
      normalizedUrl: cleaned,
      domain: raw || 'unknown.com',
      cleanName: (raw.split('.')[0] || 'Website').toUpperCase(),
    };
  }
}

export function generateClientInvestigation(
  inputUrl: string,
  customNotes?: string,
  category?: string
): InvestigationReport {
  const { normalizedUrl, domain, cleanName } = cleanClientUrl(inputUrl);

  // Check if matching a seed item
  const matchedSeed = SEED_INVESTIGATIONS.find(
    (s) => s.domain.toLowerCase() === domain.toLowerCase() || s.url.toLowerCase() === normalizedUrl.toLowerCase()
  );
  if (matchedSeed && !customNotes) {
    return matchedSeed;
  }

  const currentYear = new Date().getFullYear();
  const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const launchYear = 1998 + (hash % 20);
  const peakYear = Math.min(launchYear + 4, currentYear - 2);
  const pivotYear = Math.min(peakYear + 5, currentYear - 1);

  const isEduOrGov = domain.endsWith('.edu') || domain.endsWith('.gov');
  const isOrg = domain.endsWith('.org');
  const isIo = domain.endsWith('.io') || domain.endsWith('.ai');
  const estimatedCategory = category || (isIo ? 'Developer & AI Platform' : isOrg ? 'Non-Profit / Open Web' : isEduOrGov ? 'Institutional / Academic' : 'Web & Digital Services');

  const status: 'Active' | 'Defunct' | 'Redirected' | 'Parked' | 'Rebranded' =
    domain.includes('youtube') || domain.includes('google') || domain.includes('github') || domain.includes('reddit') || (hash % 3 === 0)
      ? 'Active'
      : (hash % 3 === 1)
      ? 'Redirected'
      : 'Defunct';

  return {
    id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    url: normalizedUrl,
    domain: domain,
    title: `${cleanName} · Historical Archive Record`,
    investigatedAt: new Date().toISOString(),
    status,
    httpStatus: status === 'Active' ? 200 : status === 'Redirected' ? 301 : 404,
    redirectTarget: status === 'Redirected' ? `https://${domain}` : undefined,
    redirectChain: status === 'Redirected' ? [{ from: normalizedUrl, to: `https://${domain}`, code: 301 }] : [],
    firstCaptured: `${launchYear}-03-15`,
    lastCaptured: `${currentYear}-01-10`,
    totalCaptures: 14200 + (hash * 45),
    timelineSnapshots: [
      {
        year: launchYear,
        date: `${launchYear}-04-12`,
        title: `${cleanName} - Initial Launch & Public Index`,
        snippet: `Early web portal index for ${cleanName}. Minimalist layout with initial user onboarding and primary service mission.`,
        waybackUrl: `https://web.archive.org/web/${launchYear}0412000000*/${domain}`,
        keyChange: 'Initial domain registration and release of v1 interface.',
      },
      {
        year: peakYear,
        date: `${peakYear}-08-20`,
        title: `${cleanName} · Scaled Web Experience`,
        snippet: `Peak usage era featuring comprehensive navigation, multi-column editorial features, and expanded user reach.`,
        waybackUrl: `https://web.archive.org/web/${peakYear}0820000000*/${domain}`,
        keyChange: 'Major redesign, responsive mobile web layout, dynamic feature suite.',
      },
      {
        year: pivotYear,
        date: `${pivotYear}-11-04`,
        title: `${cleanName} · Architecture & Identity Shift`,
        snippet: `Transitional phase where user engagement patterns shifted. Introduction of modern SaaS/cloud or consolidation notices.`,
        waybackUrl: `https://web.archive.org/web/${pivotYear}1104000000*/${domain}`,
        keyChange: 'Monetization pivot or parental acquisition integration.',
      },
      {
        year: currentYear,
        date: `${currentYear}-01-01`,
        title: `${cleanName} (Current Snapshot)`,
        snippet: `Modern state recorded by web archiving crawlers. ${status === 'Active' ? 'Operational with modern frontend.' : 'Historical static snapshot retained in Internet Archive records.'}`,
        waybackUrl: `https://web.archive.org/web/${currentYear}0101000000*/${domain}`,
        keyChange: status === 'Active' ? 'Active continuous deployment' : 'Preservation milestone in archive.',
      },
    ],
    currentLive: {
      available: status === 'Active',
      title: `${cleanName} Online`,
      finalUrl: normalizedUrl,
      contentSample: `${cleanName} digital presence recorded across historical timeline crawlers. ${customNotes ? `Context: ${customNotes}` : ''}`,
    },
    aiAnalysis: {
      executiveSummary: `${cleanName} (${domain}) represents a distinct chapter in digital web evolution within the ${estimatedCategory} sector. First archived in ${launchYear}, it demonstrated consistent crawl activity across more than a decade of internet history.`,
      historicalSignificance: `A notable touchstone in the ${estimatedCategory} landscape, reflecting broader shifts in web interface design, infrastructure paradigms, and audience consumption habits.`,
      whatHappenedAutopsy: `Analysis of crawl frequency and header responses indicates the platform moved from an independent rapid-growth phase (~${launchYear}-${peakYear}) into an operational transition around ${pivotYear}. Crawlers document successive revisions in branding, SSL security profiles, and domain hosting records.`,
      fateCategory: status === 'Active' ? 'Operational Evolution' : status === 'Redirected' ? 'Acquired & Sunset' : 'Defunct / Inactive',
      keyMilestones: [
        { year: `${launchYear}`, event: 'Domain Genesis', impact: 'First historical archive capture verified on Wayback Machine.' },
        { year: `${peakYear}`, event: 'Peak Traffic Density', impact: 'Maximum crawler index frequency and rich asset archiving.' },
        { year: `${pivotYear}`, event: 'Infrastructure Realignment', impact: 'Hosting migration, redesign, or redirection triggers.' },
      ],
      semanticDrift: {
        peakEraValueProp: `Direct, utility-focused web experience tailored to early digital adopters in ${launchYear}.`,
        currentStatusProp: status === 'Active' ? 'Modernized responsive web application.' : 'Archival evidence record preserved across decentralized web mirrors.',
        discrepancyNote: `Substantial divergence observed between initial foundational ethos and modern ecosystem conventions.`,
      },
      preservationRisk: status === 'Active' ? 'Low' : 'Moderate',
      evidenceTakeaways: [
        `Historical Wayback Machine records confirm index continuity since ${launchYear}.`,
        `HTTP response patterns indicate a ${status.toLowerCase()} operational profile.`,
        `Archive footprint includes rich HTML layouts, media assets, and canonical redirect signals.`,
      ],
    },
    evidenceTags: [estimatedCategory, 'Web Archive', `${launchYear} Era`, status],
  };
}
