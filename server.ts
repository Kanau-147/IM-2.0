import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Shared Google GenAI client (Server-Side)
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Resilient Gemini model caller with automatic fallback for external environments
async function callGemini(contents: any, config?: any) {
  if (!ai) {
    throw new Error('Gemini API is not configured on the server. Set GEMINI_API_KEY environment variable.');
  }
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  try {
    return await ai.models.generateContent({
      model: primaryModel,
      contents,
      config,
    });
  } catch (err: any) {
    if (err?.message?.includes('not found') || err?.status === 404) {
      console.warn(`Model ${primaryModel} not found, falling back to gemini-2.5-flash...`);
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config,
      });
    }
    throw err;
  }
}

// Built-in curated historical investigation dataset
interface InvestigationRecord {
  id: string;
  url: string;
  domain: string;
  title: string;
  investigatedAt: string;
  status: 'Active' | 'Defunct' | 'Redirected' | 'Parked' | 'Rebranded';
  httpStatus: number;
  redirectTarget?: string;
  redirectChain: { from: string; to: string; code: number }[];
  firstCaptured: string;
  lastCaptured: string;
  totalCaptures: number;
  timelineSnapshots: {
    year: number;
    date: string;
    title: string;
    snippet: string;
    waybackUrl: string;
    keyChange: string;
  }[];
  currentLive: {
    available: boolean;
    title: string;
    finalUrl: string;
    contentSample: string;
  };
  aiAnalysis: {
    executiveSummary: string;
    historicalSignificance: string;
    whatHappenedAutopsy: string;
    fateCategory: 'Acquired & Sunset' | 'Defunct / Inactive' | 'Domain Squatted / Parked' | 'Radical Pivot' | 'Operational Evolution';
    keyMilestones: { year: string; event: string; impact: string }[];
    semanticDrift: {
      peakEraValueProp: string;
      currentStatusProp: string;
      discrepancyNote: string;
    };
    preservationRisk: 'Low' | 'Moderate' | 'Critical' | 'Lost';
    evidenceTakeaways: string[];
  };
  evidenceTags: string[];
}

const investigationsStore: Map<string, InvestigationRecord> = new Map();

// Seed with famous historical investigations
const seedInvestigations: InvestigationRecord[] = [
  {
    id: 'inv-vine',
    url: 'https://vine.co',
    domain: 'vine.co',
    title: 'Vine · The Short-Form Video Pioneer',
    investigatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
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
      whatHappenedAutopsy: 'Acquired by Twitter in 2012 prior to public launch, Vine scaled explosively but struggled with creator retention when Instagram introduced 15-second video in 2013 without Vine offering direct creator ad-revenue sharing. In October 2016, amid company-wide restructuring, Twitter announced the shutdown of Vine.',
      fateCategory: 'Acquired & Sunset',
      keyMilestones: [
        { year: '2012', event: 'Founded in NYC; Acquired by Twitter for $30M', impact: 'Secured instant distribution via Twitter graph' },
        { year: '2013-2015', event: 'Peak global adoption, over 200M active viewers', impact: 'Birthed modern internet humor and creator culture' },
        { year: '2016', event: 'Creator exodus and Twitter shutdown announcement', impact: 'Creators migrated to YouTube and Instagram' },
        { year: '2017-2019', event: 'Vine Archive read-only transition', impact: 'Historic loops preserved in static mode' },
        { year: '2026', event: 'Domain redirecting to X', impact: 'Original portal deprecated' },
      ],
      semanticDrift: {
        peakEraValueProp: 'A mobile playground to capture and explore 6-second looping life stories.',
        currentStatusProp: 'Corporate 301 redirect to X homepage.',
        discrepancyNote: 'Zero traces of original video playback mechanics remain on the live host.',
      },
      preservationRisk: 'Critical',
      evidenceTakeaways: [
        'Over 39 billion historical loops were orphaned when read-only video hosting was decommissioned.',
        'Captures between 2013 and 2015 contain high media dependency risks (missing CDN MP4 shards).',
        'Wayback Machine contains the only surviving index of early Vine metadata.',
      ],
    },
    evidenceTags: ['Short-Form Video', 'Twitter Acquisition', 'Creator Economy', 'Decommissioned'],
  },
  {
    id: 'inv-theranos',
    url: 'https://theranos.com',
    domain: 'theranos.com',
    title: 'Theranos · Breakthrough Diagnostic Blood Testing',
    investigatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'Defunct',
    httpStatus: 404,
    redirectChain: [],
    firstCaptured: '2004-03-24',
    lastCaptured: '2024-06-12',
    totalCaptures: 14210,
    timelineSnapshots: [
      {
        year: 2004,
        date: '2004-04-18',
        title: 'Real-Time Cures / Theranos Concept',
        snippet: 'Early medical device startup page featuring micro-fluidic drug delivery and personalized therapeutic monitoring.',
        waybackUrl: 'https://web.archive.org/web/20040418000000*/theranos.com',
        keyChange: 'Initial patent registration showcase and venture deck presence.',
      },
      {
        year: 2014,
        date: '2014-09-12',
        title: 'Theranos - One tiny drop changes everything',
        snippet: 'Sleek consumer healthcare portal announcing Walgreens wellness centers, revolutionary fingerstick blood tests, and $9B valuation claims.',
        waybackUrl: 'https://web.archive.org/web/20140912000000*/theranos.com',
        keyChange: 'Consumer branding launch, lab test menu with exact pricing (e.g., $2.99 glucose).',
      },
      {
        year: 2016,
        date: '2016-04-10',
        title: 'Theranos · An open letter to our patients and partners',
        snippet: 'CMS regulatory inspection fallout, defense statements against Wall Street Journal investigative reports by John Carreyrou.',
        waybackUrl: 'https://web.archive.org/web/20160410000000*/theranos.com',
        keyChange: 'Consumer marketing stripped; replaced by regulatory compliance statements and legal responses.',
      },
      {
        year: 2018,
        date: '2018-09-04',
        title: 'Theranos Liquidation and Formal Dissolution',
        snippet: 'Official company announcement notifying shareholders and creditors of formal dissolution and asset liquidation.',
        waybackUrl: 'https://web.archive.org/web/20180904000000*/theranos.com',
        keyChange: 'Final legal notice before DNS records lapsed.',
      },
    ],
    currentLive: {
      available: false,
      title: 'Host Unreachable / Domain Parked',
      finalUrl: 'https://theranos.com',
      contentSample: 'DNS NXDOMAIN or connection refused. The corporate host was decommissioned following legal dissolution.',
    },
    aiAnalysis: {
      executiveSummary: 'Theranos operated one of Silicon Valley\'s most notorious corporate frauds, promising fingerstick blood testing that never worked, leading to federal criminal convictions and complete corporate dissolution.',
      historicalSignificance: 'A landmark cautionary tale in healthcare technology due diligence, FDA regulatory oversight, and the perils of secrecy in biomedical engineering.',
      whatHappenedAutopsy: 'Founded in 2003 by Elizabeth Holmes, Theranos raised over $700M. The Wall Street Journal uncovered in late 2015 that the proprietary Edison devices were unreliable and tests were run on modified commercial Siemens analyzers. Regulatory bans, investor lawsuits, and SEC fraud charges culminated in dissolution in 2018 and prison sentences for Holmes and Ramesh Balwani.',
      fateCategory: 'Defunct / Inactive',
      keyMilestones: [
        { year: '2003', event: 'Company founded by 19-year-old Stanford dropout', impact: 'Began decade of stealth venture fundraising' },
        { year: '2013', event: 'Partnership launched with Walgreens', impact: 'Opened 40+ consumer wellness centers in Arizona' },
        { year: '2015', event: 'John Carreyrou WSJ expose published', impact: 'FDA and CMS unannounced laboratory audits' },
        { year: '2018', event: 'SEC fraud settlement and formal company dissolution', impact: 'Total loss for private equity and retail investors' },
        { year: '2022', event: 'Criminal conviction and federal sentencing', impact: '11-year prison sentence for founder' },
      ],
      semanticDrift: {
        peakEraValueProp: 'Accurate diagnostic testing with just a few drops of blood at a fraction of traditional lab costs.',
        currentStatusProp: 'Offline / Completely erased.',
        discrepancyNote: 'Claims of proprietary Edison micro-fluidic testing vanished when regulatory sanction notices were published.',
      },
      preservationRisk: 'Moderate',
      evidenceTakeaways: [
        'Archive records document the exact evolution of pricing transparency ($2.99 cholesterol test) before rapid removal.',
        'Press release archives reveal early board member endorsements (George Shultz, Henry Kissinger) subsequently scrubbed.',
        'Wayback captures served as factual evidence during federal court proceedings.',
      ],
    },
    evidenceTags: ['Biotech', 'Corporate Fraud', 'Dissolved', 'Regulatory Enforcement'],
  },
  {
    id: 'inv-geocities',
    url: 'https://geocities.com',
    domain: 'geocities.com',
    title: 'GeoCities · The Original Neighborhood Web',
    investigatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'Redirected',
    httpStatus: 301,
    redirectTarget: 'https://yahoo.com',
    redirectChain: [
      { from: 'https://geocities.com', to: 'https://help.yahoo.com/kb/geocities', code: 301 },
    ],
    firstCaptured: '1996-10-22',
    lastCaptured: '2026-03-01',
    totalCaptures: 789120,
    timelineSnapshots: [
      {
        year: 1996,
        date: '1996-12-22',
        title: 'GeoCities - Welcome to our 29 Neighborhoods!',
        snippet: 'The foundational web hosting service organized by themed neighborhoods: SiliconValley for tech, Hollywood for film, Heartland for pets.',
        waybackUrl: 'https://web.archive.org/web/19961222000000*/geocities.com',
        keyChange: 'Early web 1.0 directory layout with animated GIFs and webrings.',
      },
      {
        year: 1999,
        date: '1999-05-18',
        title: 'Yahoo! GeoCities - Build your free home on the web',
        snippet: 'Yahoo acquires GeoCities for $3.57 billion at the absolute peak of the dot-com bubble. 38 million user pages.',
        waybackUrl: 'https://web.archive.org/web/19990518000000*/geocities.com',
        keyChange: 'Yahoo single-sign-on integration and banner ad insertions.',
      },
      {
        year: 2009,
        date: '2009-10-26',
        title: 'GeoCities is closed as of October 26, 2009',
        snippet: 'Yahoo permanently closes the free web hosting service. Internet Archive and Archive Team launch emergency preservation campaigns.',
        waybackUrl: 'https://web.archive.org/web/20091026000000*/geocities.com',
        keyChange: 'Permanent service shutdown notice; all user directories made inaccessible.',
      },
    ],
    currentLive: {
      available: true,
      title: 'Yahoo Help',
      finalUrl: 'https://help.yahoo.com',
      contentSample: 'Legacy documentation page explaining that GeoCities was discontinued in 2009.',
    },
    aiAnalysis: {
      executiveSummary: 'GeoCities was the birthplace of user-generated content on the World Wide Web, hosting tens of millions of early personal homepages before its closure triggered the birth of the modern web preservation movement.',
      historicalSignificance: 'The pre-eminent cultural artifact of the 1990s open web, pioneering free personal expression, HTML literacy, and digital folk art.',
      whatHappenedAutopsy: 'Yahoo paid $3.57B in stock in 1999. Inability to modernize the file manager, rising server storage costs, and the ascent of social platforms (MySpace, Facebook, WordPress) led Yahoo to shutter the service on October 26, 2009.',
      fateCategory: 'Acquired & Sunset',
      keyMilestones: [
        { year: '1994', event: 'Founded as Beverly Hills Internet by David Bohnett', impact: 'Created neighborhood-based web hosting model' },
        { year: '1999', event: 'Acquired by Yahoo! for $3.57 Billion', impact: 'Third most visited website on the global internet' },
        { year: '2009', event: 'US and Global operations shut down', impact: 'Prompted Archive Team to salvage ~1 Terabyte of torrent archives' },
        { year: '2019', event: 'Japan GeoCities (last surviving subsidiary) closes', impact: 'Final chapter of the GeoCities domain' },
      ],
      semanticDrift: {
        peakEraValueProp: 'Your free address in the digital metropolis of the global internet.',
        currentStatusProp: 'Yahoo support ticket and redirection.',
        discrepancyNote: 'From the third most-visited community on the planet to a static knowledge base article.',
      },
      preservationRisk: 'Critical',
      evidenceTakeaways: [
        'Over 35 million personal homepages were eradicated in the 2009 shutdown.',
        'Internet Archive and Archive Team\'s "One Terabyte of Kilobyte Age" preserved millions of assets that would otherwise be permanently extinct.',
      ],
    },
    evidenceTags: ['Web 1.0', 'Yahoo Acquisition', 'Digital Folk Art', 'Preservation Pioneer'],
  },
  {
    id: 'inv-google-reader',
    url: 'https://google.com/reader',
    domain: 'google.com/reader',
    title: 'Google Reader · The RSS Feed Standard',
    investigatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    status: 'Redirected',
    httpStatus: 301,
    redirectTarget: 'https://google.com',
    redirectChain: [
      { from: 'https://google.com/reader', to: 'https://google.com', code: 301 },
    ],
    firstCaptured: '2005-10-08',
    lastCaptured: '2025-12-14',
    totalCaptures: 198400,
    timelineSnapshots: [
      {
        year: 2005,
        date: '2005-10-12',
        title: 'Google Reader (Labs) - Put an end to endless surfing',
        snippet: 'Google Labs launches lightweight browser-based RSS reader created by engineer Chris Wetherell.',
        waybackUrl: 'https://web.archive.org/web/20051012000000*/google.com/reader',
        keyChange: 'Initial beta interface with keyboard shortcuts (J/K navigation).',
      },
      {
        year: 2011,
        date: '2011-10-31',
        title: 'Google Reader with Google+ Integration',
        snippet: 'Controversial redesign stripping native social sharing and Friending in favor of forced Google+ circles.',
        waybackUrl: 'https://web.archive.org/web/20111031000000*/google.com/reader',
        keyChange: 'Original social features removed; Google+ sharing enforced.',
      },
      {
        year: 2013,
        date: '2013-07-02',
        title: 'Google Reader has been retired',
        snippet: 'Official sunset notice. Users prompted to export subscriptions via Google Takeout.',
        waybackUrl: 'https://web.archive.org/web/20130702000000*/google.com/reader',
        keyChange: 'Sunset banner; reader feeds stopped refreshing.',
      },
    ],
    currentLive: {
      available: true,
      title: 'Google',
      finalUrl: 'https://google.com',
      contentSample: 'Redirects to main Google homepage. Reader service discontinued July 1, 2013.',
    },
    aiAnalysis: {
      executiveSummary: 'Google Reader was the definitive RSS aggregator that powered digital journalism, blogs, and curation for nearly a decade before its cancellation sparked the renaissance of independent RSS platforms like Feedly.',
      historicalSignificance: 'The central hub of early social sharing and open web feed syndication prior to algorithmically curated social feeds.',
      whatHappenedAutopsy: 'Announced during Google\'s "spring cleaning" in March 2013, the shutdown took effect on July 1, 2013. Google cited declining usage and a company-wide concentration of resources on Google+ and algorithmic content channels.',
      fateCategory: 'Acquired & Sunset',
      keyMilestones: [
        { year: '2005', event: 'Launched in Google Labs', impact: 'Set universal standard for RSS consumption with fast J/K keyboard navigation' },
        { year: '2007-2010', event: 'Golden era of Reader Social Sharing', impact: 'Vibrant commenting community emerged around shared items' },
        { year: '2011', event: 'Social sharing stripped for Google+', impact: 'Alienated core enthusiast community' },
        { year: '2013', event: 'Permanent retirement on July 1', impact: 'Prompted 500,000+ users to migrate to Feedly and open-source readers in 48 hours' },
      ],
      semanticDrift: {
        peakEraValueProp: 'Fast, synchronized feed reader that connects you directly to the pulse of the web without intermediaries.',
        currentStatusProp: 'Standard search engine homepage.',
        discrepancyNote: 'Transition from decentralized RSS subscriptions to centralized algorithmic distribution.',
      },
      preservationRisk: 'Low',
      evidenceTakeaways: [
        'The Google Takeout export format (subscriptions.xml OPML) became the universal migration standard.',
        'RSS survived Google Reader\'s demise, fostering a resilient ecosystem of independent feed readers.',
      ],
    },
    evidenceTags: ['RSS Syndication', 'Open Web', 'Google Graveyard', 'Syndication'],
  },
];

seedInvestigations.forEach((inv) => investigationsStore.set(inv.id, inv));

// In-memory dataset items (for user's custom datasets and imports)
let datasetItems: {
  id: string;
  url: string;
  name: string;
  yearFounded?: string | number;
  yearSunset?: string | number;
  category: string;
  fate?: string;
  notes?: string;
  investigationId?: string;
}[] = [
  { id: 'ds-1', url: 'https://vine.co', name: 'Vine', yearFounded: 2012, yearSunset: 2017, category: 'Video / Social', fate: 'Acquired & Sunset', investigationId: 'inv-vine' },
  { id: 'ds-2', url: 'https://theranos.com', name: 'Theranos', yearFounded: 2003, yearSunset: 2018, category: 'Biotech / MedTech', fate: 'Fraud / Liquidation', investigationId: 'inv-theranos' },
  { id: 'ds-3', url: 'https://geocities.com', name: 'GeoCities', yearFounded: 1994, yearSunset: 2009, category: 'Web Hosting', fate: 'Acquired & Closed', investigationId: 'inv-geocities' },
  { id: 'ds-4', url: 'https://google.com/reader', name: 'Google Reader', yearFounded: 2005, yearSunset: 2013, category: 'RSS / Publishing', fate: 'Sunsetted', investigationId: 'inv-google-reader' },
  { id: 'ds-5', url: 'https://pebble.com', name: 'Pebble Technology', yearFounded: 2012, yearSunset: 2016, category: 'Wearables / Hardware', fate: 'Acquired by Fitbit', notes: 'Pioneered e-paper smartwatches via Kickstarter.' },
  { id: 'ds-6', url: 'https://altavista.com', name: 'AltaVista', yearFounded: 1995, yearSunset: 2013, category: 'Search Engine', fate: 'Acquired by Yahoo', notes: 'Early web search powerhouse before Google dominance.' },
  { id: 'ds-7', url: 'https://justin.tv', name: 'Justin.tv', yearFounded: 2007, yearSunset: 2014, category: 'Live Streaming', fate: 'Pivoted to Twitch', notes: 'Began as lifelogging stream; gaming vertical became Twitch.' },
  { id: 'ds-8', url: 'https://friendster.com', name: 'Friendster', yearFounded: 2002, yearSunset: 2015, category: 'Social Network', fate: 'Pivoted to Gaming then Closed', notes: 'First modern social network before MySpace and Facebook.' },
];

// Helper: Normalize URL
function cleanUrl(input: string): { normalizedUrl: string; domain: string } {
  let cleaned = input.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  try {
    const parsed = new URL(cleaned);
    return { normalizedUrl: parsed.origin + (parsed.pathname === '/' ? '' : parsed.pathname), domain: parsed.hostname };
  } catch {
    return { normalizedUrl: cleaned, domain: cleaned.replace(/https?:\/\//, '').split('/')[0] };
  }
}

// 0. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey) });
});

// 1. Get all investigations
app.get('/api/investigations', (_req: Request, res: Response) => {
  const list = Array.from(investigationsStore.values());
  res.json({ investigations: list });
});

// 2. Get single investigation
app.get('/api/investigations/:id', (req: Request, res: Response) => {
  const record = investigationsStore.get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Investigation record not found' });
  }
  res.json({ investigation: record });
});

// 3. Perform AI Investigation on any URL
app.post('/api/investigate', async (req: Request, res: Response) => {
  try {
    const { url, customNotes, category } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const { normalizedUrl, domain } = cleanUrl(url);

    // Check if we already have an investigation for this domain
    const existing = Array.from(investigationsStore.values()).find(
      (inv) => inv.domain.toLowerCase() === domain.toLowerCase() || inv.url.toLowerCase() === normalizedUrl.toLowerCase()
    );

    if (existing && !customNotes) {
      return res.json({ success: true, investigation: existing, cached: true });
    }

    if (!ai) {
      return res.status(500).json({ error: 'Gemini API is not configured on the server.' });
    }

    // Call Gemini 3.8 Flash to conduct digital web archeology
    const prompt = `You are a world-class digital forensic historian and web archeologist for "The Internet's Memory".
Perform a detailed, factual investigation of the website/URL: "${normalizedUrl}" (Domain: "${domain}").
Additional Context / Notes: "${customNotes || 'None'}"
Category: "${category || 'Web Platform'}"

Analyze what happened to this website over its lifespan. Provide:
1. Executive summary of its rise and eventual fate.
2. Historical significance to technology and culture.
3. Detailed forensic autopsy explaining why and how it changed or disappeared (acquisitions, bankruptcy, pivot, server shutdown, rebranding, or ongoing evolution).
4. Fate classification (Must be one of: "Acquired & Sunset", "Defunct / Inactive", "Domain Squatted / Parked", "Radical Pivot", "Operational Evolution").
5. Timeline snapshots across 3 to 4 distinct eras (Year, date, title, snippet of what the site offered, estimated key change).
6. Semantic drift comparison between its peak era value proposition vs current live state.
7. Preservation risk rating ("Low", "Moderate", "Critical", "Lost").
8. 3 concrete evidence takeaways.
9. Redirect status and current availability estimation.

Format your response strictly as valid raw JSON matching this schema:
{
  "title": "string (e.g. 'Brand · Subtitle')",
  "status": "Active" | "Defunct" | "Redirected" | "Parked" | "Rebranded",
  "httpStatus": 200 | 301 | 404 | 0,
  "redirectTarget": "string or empty",
  "firstCaptured": "YYYY-MM-DD",
  "lastCaptured": "YYYY-MM-DD",
  "totalCaptures": number,
  "timelineSnapshots": [
    {
      "year": number,
      "date": "YYYY-MM-DD",
      "title": "string",
      "snippet": "string",
      "waybackUrl": "string",
      "keyChange": "string"
    }
  ],
  "currentLive": {
    "available": boolean,
    "title": "string",
    "finalUrl": "string",
    "contentSample": "string"
  },
  "aiAnalysis": {
    "executiveSummary": "string",
    "historicalSignificance": "string",
    "whatHappenedAutopsy": "string",
    "fateCategory": "Acquired & Sunset" | "Defunct / Inactive" | "Domain Squatted / Parked" | "Radical Pivot" | "Operational Evolution",
    "keyMilestones": [
      {
        "year": "string",
        "event": "string",
        "impact": "string"
      }
    ],
    "semanticDrift": {
      "peakEraValueProp": "string",
      "currentStatusProp": "string",
      "discrepancyNote": "string"
    },
    "preservationRisk": "Low" | "Moderate" | "Critical" | "Lost",
    "evidenceTakeaways": ["string", "string", "string"]
  },
  "evidenceTags": ["string", "string", "string"]
}
`;

    const response = await callGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const rawText = response.text || '{}';
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(cleaned);
    }

    const newId = `inv-${Date.now()}`;
    const newRecord: InvestigationRecord = {
      id: newId,
      url: normalizedUrl,
      domain: domain,
      title: data.title || `${domain} Investigation`,
      investigatedAt: new Date().toISOString(),
      status: data.status || 'Defunct',
      httpStatus: data.httpStatus || 200,
      redirectTarget: data.redirectTarget || (data.status === 'Redirected' ? `https://${domain}` : undefined),
      redirectChain: data.status === 'Redirected' ? [{ from: normalizedUrl, to: data.redirectTarget || 'https://x.com', code: 301 }] : [],
      firstCaptured: data.firstCaptured || '2000-01-01',
      lastCaptured: data.lastCaptured || '2026-01-01',
      totalCaptures: data.totalCaptures || 25000,
      timelineSnapshots: data.timelineSnapshots || [],
      currentLive: data.currentLive || {
        available: false,
        title: 'Status Unknown',
        finalUrl: normalizedUrl,
        contentSample: 'No live response detected.',
      },
      aiAnalysis: data.aiAnalysis || {
        executiveSummary: 'Investigation conducted.',
        historicalSignificance: 'Historical internet artifact.',
        whatHappenedAutopsy: 'Service underwent significant evolution or sunset.',
        fateCategory: 'Defunct / Inactive',
        keyMilestones: [],
        semanticDrift: {
          peakEraValueProp: 'Original web service',
          currentStatusProp: 'Current state',
          discrepancyNote: 'Transformed over time.',
        },
        preservationRisk: 'Moderate',
        evidenceTakeaways: ['Archive captured.'],
      },
      evidenceTags: data.evidenceTags || [category || 'Web History', 'Investigation'],
    };

    investigationsStore.set(newId, newRecord);

    // Update dataset item if linked
    const linkedItem = datasetItems.find((d) => d.url.toLowerCase() === normalizedUrl.toLowerCase() || d.name.toLowerCase() === domain.toLowerCase());
    if (linkedItem) {
      linkedItem.investigationId = newId;
      linkedItem.fate = newRecord.aiAnalysis.fateCategory;
    }

    res.json({ success: true, investigation: newRecord });
  } catch (error: any) {
    console.error('Error during investigation:', error);
    res.status(500).json({ error: error.message || 'Investigation failed' });
  }
});

// 4. Snapshot Comparison / Semantic Diff
app.post('/api/ai/compare-snapshots', async (req: Request, res: Response) => {
  try {
    const { domain, snapshotA, snapshotB, yearA, yearB } = req.body;

    if (!ai) {
      return res.status(500).json({ error: 'Gemini API not configured' });
    }

    const prompt = `Compare the following two historical website snapshots for "${domain}":
Era A (${yearA || 'Earlier Snapshot'}):
"${snapshotA}"

Era B (${yearB || 'Later Snapshot'}):
"${snapshotB}"

Analyze the semantic drift and organizational evolution between these two eras.
Provide:
1. Core Value Proposition Shift
2. Features or Promises Removed or Added
3. Tone & Positioning Divergence
4. Cultural & Business Interpretation
Keep it sharp, editorial, and concise. Format as clean Markdown.`;

    const response = await callGemini(prompt);

    res.json({ success: true, comparison: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Comparison failed' });
  }
});

// 5. Dataset Management (Get items, Import custom CSV/JSON, Export)
app.get('/api/dataset', (_req: Request, res: Response) => {
  res.json({
    items: datasetItems,
    totalCount: datasetItems.length,
  });
});

app.post('/api/dataset/import', (req: Request, res: Response) => {
  try {
    const { format, rawContent } = req.body;
    if (!rawContent || typeof rawContent !== 'string') {
      return res.status(400).json({ error: 'rawContent string is required' });
    }

    let parsedItems: any[] = [];

    if (format === 'json') {
      const data = JSON.parse(rawContent);
      parsedItems = Array.isArray(data) ? data : data.websites || [data];
    } else {
      // CSV format parser
      const lines = rawContent.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length > 0) {
        const header = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
          const item: any = {};
          header.forEach((h, idx) => {
            item[h] = values[idx] || '';
          });
          parsedItems.push(item);
        }
      }
    }

    // Sanitize into DatasetItem[]
    const formatted = parsedItems.map((p, idx) => ({
      id: `ds-user-${Date.now()}-${idx}`,
      url: p.url || (p.domain ? `https://${p.domain}` : `https://${p.name || 'unknown'}.com`),
      name: p.name || p.title || p.domain || 'Unnamed Site',
      yearFounded: p.yearfounded || p.year_founded || p.founded || p.year || undefined,
      yearSunset: p.yearsunset || p.year_sunset || p.sunset || p.closed || undefined,
      category: p.category || p.sector || 'General Web',
      fate: p.fate || p.status || undefined,
      notes: p.notes || p.description || p.reason || undefined,
    }));

    datasetItems = [...formatted, ...datasetItems];

    res.json({
      success: true,
      importedCount: formatted.length,
      dataset: datasetItems,
    });
  } catch (err: any) {
    res.status(400).json({ error: `Import failed: ${err.message}` });
  }
});

// 5. Batch Dataset Analysis & Macro Trend Synthesis
app.post('/api/dataset/batch-analyze', async (req: Request, res: Response) => {
  try {
    const { rawDataset, items } = req.body;

    let parsedItems: any[] = items || [];

    if (!parsedItems || parsedItems.length === 0) {
      if (typeof rawDataset === 'string') {
        const text = rawDataset.trim();
        if (text.startsWith('[') || text.startsWith('{')) {
          try {
            const data = JSON.parse(text);
            parsedItems = Array.isArray(data) ? data : data.websites || [data];
          } catch {}
        }
        
        if (parsedItems.length === 0) {
          // Parse lines (CSV or newline-separated URLs)
          const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
          if (lines.length > 0) {
            const isCsv = lines[0].includes(',');
            if (isCsv) {
              const header = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
              for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
                const item: any = {};
                header.forEach((h, idx) => {
                  item[h] = values[idx] || '';
                });
                parsedItems.push(item);
              }
            } else {
              // Plain list of URLs or domains
              parsedItems = lines.map((line) => ({
                url: line.startsWith('http') ? line : `https://${line}`,
                name: line.replace(/https?:\/\//, '').split('/')[0],
              }));
            }
          }
        }
      }
    }

    if (parsedItems.length === 0) {
      return res.status(400).json({ error: 'No valid records detected in dataset input' });
    }

    // Format sanitized items
    const formattedList = parsedItems.slice(0, 50).map((p, idx) => ({
      id: `ds-batch-${Date.now()}-${idx}`,
      url: p.url || (p.domain ? `https://${p.domain}` : `https://${p.name || 'site'}.com`),
      name: p.name || p.title || (p.url ? p.url.replace(/https?:\/\//, '').split('/')[0] : `Site ${idx + 1}`),
      yearFounded: p.yearfounded || p.year_founded || p.founded || undefined,
      yearSunset: p.yearsunset || p.year_sunset || p.sunset || undefined,
      category: p.category || p.sector || 'Web Service',
      fate: p.fate || p.status || 'Under Investigation',
      notes: p.notes || p.description || undefined,
    }));

    // Add to global dataset items
    datasetItems = [...formattedList, ...datasetItems];

    // If Gemini AI is available, generate macro analysis across the dataset
    let macroAnalysis = null;
    if (ai) {
      const summaryPrompt = `You are a digital historian analyzing a dataset of ${formattedList.length} websites / platforms:
${JSON.stringify(formattedList.map((f) => ({ name: f.name, url: f.url, category: f.category, founded: f.yearFounded, sunset: f.yearSunset, notes: f.notes })))}

Analyze this entire group as a cohesive historical cohort.
Provide a structured synthesis in valid raw JSON:
{
  "datasetTitle": "string (e.g. 'Early 2010s Social & Media Platforms Cohort')",
  "totalAnalyzed": ${formattedList.length},
  "macroHypothesis": "string (1-2 sentences summarizing the overarching historical trend)",
  "commonFailurePatterns": [
    "string",
    "string",
    "string"
  ],
  "survivalRatio": "string (e.g. '12% active, 88% defunct or acquired')",
  "keyLessonsForBuilders": [
    "string",
    "string"
  ]
}
Return ONLY valid JSON.`;

      try {
        const response = await callGemini(summaryPrompt, {
          responseMimeType: 'application/json',
        });

        const rawJson = response.text || '{}';
        macroAnalysis = JSON.parse(rawJson);
      } catch (e) {
        console.error('Error generating macro analysis:', e);
      }
    }

    res.json({
      success: true,
      recordsCount: formattedList.length,
      records: formattedList,
      macroAnalysis,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Batch dataset processing failed' });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`The Internet's Memory Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
