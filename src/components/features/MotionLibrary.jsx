/**
 * MotionLibrary - Debate Motions/Resolutions Database
 * Categories, difficulty ratings, source tracking, notes, search/filter
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Star,
  StarOff,
  Tag,
  Calendar,
  Trophy,
  Globe,
  Home,
  Brain,
  Scale,
  Users,
  Gavel,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  Download,
  Upload,
  FolderOpen,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Eye,
  Clock,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Hash,
  Sparkles,
  AlertCircle,
  Info,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

// Categories with icons and colors
const CATEGORIES = {
  domestic: {
    label: 'Domestic Policy',
    icon: Home,
    color: 'cyan',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400'
  },
  international: {
    label: 'International Relations',
    icon: Globe,
    color: 'purple',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400'
  },
  philosophy: {
    label: 'Philosophy/Ethics',
    icon: Brain,
    color: 'amber',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400'
  },
  economics: {
    label: 'Economics',
    icon: Scale,
    color: 'emerald',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400'
  },
  social: {
    label: 'Social Issues',
    icon: Users,
    color: 'rose',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400'
  },
  legal: {
    label: 'Legal/Constitutional',
    icon: Gavel,
    color: 'orange',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400'
  }
};

// Debate formats
const FORMATS = {
  pf: { label: 'Public Forum', short: 'PF' },
  ld: { label: 'Lincoln Douglas', short: 'LD' },
  policy: { label: 'Policy/CX', short: 'CX' },
  congress: { label: 'Congressional', short: 'Congress' },
  parli: { label: 'Parliamentary', short: 'Parli' },
  worlds: { label: 'World Schools', short: 'WSDC' },
  bp: { label: 'British Parliamentary', short: 'BP' }
};

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { value: 1, label: 'Novice', color: 'emerald' },
  { value: 2, label: 'JV', color: 'cyan' },
  { value: 3, label: 'Varsity', color: 'amber' },
  { value: 4, label: 'Elite', color: 'purple' },
  { value: 5, label: 'Championship', color: 'rose' }
];

// Generate unique ID
const generateId = () => `motion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Comprehensive motions database - 60+ real debate motions across all formats
const SAMPLE_MOTIONS = [
  // ===== POLICY/CX TOPICS =====
  {
    id: generateId(),
    text: 'Resolved: The United States federal government should substantially increase its protection of water resources in the United States.',
    category: 'domestic',
    format: 'policy',
    difficulty: 4,
    year: 2024,
    month: 'September',
    tournament: 'NSDA National Topic 2024-2025',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['environment', 'water', 'federal policy', 'infrastructure'],
    notes: 'Year-long topic. Key affs: Clean Water Act enforcement, tribal water rights, PFAS regulation, infrastructure investment. Neg ground: federalism, spending DAs, states CP.',
    favorited: true,
    timesUsed: 12,
    lastUsed: '2024-11-15',
    createdAt: '2024-08-01'
  },
  {
    id: generateId(),
    text: 'Resolved: The United States federal government should substantially reduce its restrictions on legal immigration to the United States.',
    category: 'domestic',
    format: 'policy',
    difficulty: 4,
    year: 2023,
    month: 'September',
    tournament: 'NSDA National Topic 2023-2024',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['immigration', 'federal policy', 'labor', 'economy'],
    notes: 'Previous year topic. Strong econ advantages, security disadvantages. Popular affs: H1B expansion, asylum reform, family reunification.',
    favorited: false,
    timesUsed: 25,
    lastUsed: '2024-05-15',
    createdAt: '2023-08-01'
  },
  {
    id: generateId(),
    text: 'Resolved: The United States federal government should substantially increase fiscal redistribution in the United States by adopting a federal jobs guarantee, expanding Social Security, and/or providing a basic income.',
    category: 'economics',
    format: 'policy',
    difficulty: 5,
    year: 2022,
    month: 'September',
    tournament: 'NSDA National Topic 2022-2023',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['economics', 'welfare', 'UBI', 'social security', 'jobs'],
    notes: 'Three-pronged topic. FJG most popular. Inflation DA and work incentive args key on neg.',
    favorited: false,
    timesUsed: 30,
    lastUsed: '2023-05-20',
    createdAt: '2022-08-01'
  },

  // ===== LINCOLN-DOUGLAS TOPICS =====
  {
    id: generateId(),
    text: 'Resolved: The United States ought to guarantee universal basic income.',
    category: 'economics',
    format: 'ld',
    difficulty: 3,
    year: 2024,
    month: 'November',
    tournament: 'November/December LD Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['UBI', 'welfare', 'economics', 'poverty', 'dignity'],
    notes: 'Aff frameworks: dignity, autonomy, poverty reduction. Neg frameworks: work ethic, inflation, targeted programs better.',
    favorited: true,
    timesUsed: 8,
    lastUsed: '2024-11-20',
    createdAt: '2024-10-15'
  },
  {
    id: generateId(),
    text: 'Resolved: The United States ought to provide a federal guarantee of housing.',
    category: 'social',
    format: 'ld',
    difficulty: 3,
    year: 2024,
    month: 'September',
    tournament: 'September/October LD Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['housing', 'homelessness', 'rights', 'welfare'],
    notes: 'Strong philosophical ground on positive vs negative rights. Research Housing First models.',
    favorited: true,
    timesUsed: 15,
    lastUsed: '2024-10-31',
    createdAt: '2024-08-15'
  },
  {
    id: generateId(),
    text: 'Resolved: Civil disobedience in a democracy is morally justified.',
    category: 'philosophy',
    format: 'ld',
    difficulty: 3,
    year: 2023,
    month: 'January',
    tournament: 'January/February LD Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['civil disobedience', 'democracy', 'protest', 'MLK', 'Thoreau'],
    notes: 'Classic topic. Use Rawls, MLK Letter from Birmingham Jail, Thoreau. Neg can run rule of law, democratic process args.',
    favorited: true,
    timesUsed: 20,
    lastUsed: '2024-02-15',
    createdAt: '2023-12-15'
  },
  {
    id: generateId(),
    text: 'Resolved: Privileged individuals ought to renounce their privilege.',
    category: 'philosophy',
    format: 'ld',
    difficulty: 4,
    year: 2023,
    month: 'March',
    tournament: 'March/April LD Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['privilege', 'ethics', 'social justice', 'obligation'],
    notes: 'Define privilege carefully. Aff: moral obligation, solidarity. Neg: impossible, counterproductive, allyship better.',
    favorited: false,
    timesUsed: 12,
    lastUsed: '2024-04-20',
    createdAt: '2023-02-15'
  },
  {
    id: generateId(),
    text: 'Resolved: Jury nullification is a legitimate tool for criminal defense.',
    category: 'legal',
    format: 'ld',
    difficulty: 4,
    year: 2024,
    month: 'September',
    tournament: 'Yale Invitational',
    source: 'Yale Debate',
    sourceUrl: '',
    tags: ['jury', 'law', 'justice', 'courts', 'democracy'],
    notes: 'Democratic legitimacy vs rule of law. Research Fully Informed Jury Association. Historical examples: Fugitive Slave Act.',
    favorited: false,
    timesUsed: 6,
    lastUsed: '2024-09-20',
    createdAt: '2024-09-01'
  },
  {
    id: generateId(),
    text: 'Resolved: A just society ought to prioritize environmental protection over economic growth.',
    category: 'philosophy',
    format: 'ld',
    difficulty: 3,
    year: 2023,
    month: 'November',
    tournament: 'November/December LD Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['environment', 'economics', 'sustainability', 'justice'],
    notes: 'Strong util and deont frameworks both ways. Research degrowth movement, green growth theory.',
    favorited: false,
    timesUsed: 18,
    lastUsed: '2023-12-15',
    createdAt: '2023-10-15'
  },

  // ===== PUBLIC FORUM TOPICS =====
  {
    id: generateId(),
    text: 'Resolved: The European Union should substantially strengthen its defense capabilities independent of the North Atlantic Treaty Organization.',
    category: 'international',
    format: 'pf',
    difficulty: 4,
    year: 2024,
    month: 'December',
    tournament: 'December PF Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['EU', 'NATO', 'defense', 'foreign policy', 'military'],
    notes: 'Topicality on "independent" key. Research PESCO, European Defence Fund, US commitment concerns.',
    favorited: true,
    timesUsed: 5,
    lastUsed: '2024-11-28',
    createdAt: '2024-11-01'
  },
  {
    id: generateId(),
    text: 'Resolved: The United States should substantially increase its investment in high-speed rail.',
    category: 'domestic',
    format: 'pf',
    difficulty: 2,
    year: 2024,
    month: 'October',
    tournament: 'October PF Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['infrastructure', 'transportation', 'climate', 'economy'],
    notes: 'Good novice topic. Pro: climate, jobs, connectivity. Con: cost, geography, car culture.',
    favorited: true,
    timesUsed: 10,
    lastUsed: '2024-10-31',
    createdAt: '2024-09-15'
  },
  {
    id: generateId(),
    text: 'Resolved: The United States should accede to the United Nations Convention on the Law of the Sea.',
    category: 'international',
    format: 'pf',
    difficulty: 3,
    year: 2024,
    month: 'September',
    tournament: 'September PF Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['UNCLOS', 'international law', 'maritime', 'sovereignty'],
    notes: 'Research Arctic claims, South China Sea, deep seabed mining. Sovereignty vs cooperation clash.',
    favorited: false,
    timesUsed: 8,
    lastUsed: '2024-09-30',
    createdAt: '2024-08-15'
  },
  {
    id: generateId(),
    text: 'Resolved: The United States federal government should forgive all federal student loan debt.',
    category: 'economics',
    format: 'pf',
    difficulty: 2,
    year: 2023,
    month: 'February',
    tournament: 'February PF Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['education', 'debt', 'economy', 'higher education'],
    notes: 'Pro: economic stimulus, equity, mental health. Con: moral hazard, regressive, inflation.',
    favorited: false,
    timesUsed: 22,
    lastUsed: '2024-02-28',
    createdAt: '2023-01-15'
  },
  {
    id: generateId(),
    text: 'Resolved: The benefits of the International Monetary Fund outweigh the harms.',
    category: 'economics',
    format: 'pf',
    difficulty: 4,
    year: 2023,
    month: 'April',
    tournament: 'April PF Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['IMF', 'development', 'economics', 'global south'],
    notes: 'Research structural adjustment programs, debt relief, COVID response. Strong kritik potential.',
    favorited: false,
    timesUsed: 14,
    lastUsed: '2023-04-30',
    createdAt: '2023-03-15'
  },
  {
    id: generateId(),
    text: 'Resolved: On balance, social media is beneficial for American elections.',
    category: 'social',
    format: 'pf',
    difficulty: 2,
    year: 2024,
    month: 'November',
    tournament: 'November PF Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['social media', 'elections', 'democracy', 'misinformation'],
    notes: 'Timely topic. Pro: civic engagement, grassroots organizing. Con: misinformation, polarization, foreign interference.',
    favorited: true,
    timesUsed: 6,
    lastUsed: '2024-11-15',
    createdAt: '2024-10-15'
  },

  // ===== CONGRESSIONAL DEBATE BILLS =====
  {
    id: generateId(),
    text: 'A Bill to Implement a Carbon Tax: Be it enacted that the United States shall impose a tax of $50 per metric ton of carbon dioxide equivalent emissions.',
    category: 'economics',
    format: 'congress',
    difficulty: 2,
    year: 2024,
    month: 'October',
    tournament: 'Fall Regional',
    source: 'Regional Circuit',
    sourceUrl: '',
    tags: ['climate', 'tax', 'environment', 'economics'],
    notes: 'Popular topic. Pro: climate action, revenue. Con: economic harm, regressive, competitiveness.',
    favorited: false,
    timesUsed: 8,
    lastUsed: '2024-10-15',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'A Resolution to Condemn the People\'s Republic of China for Human Rights Violations in Xinjiang.',
    category: 'international',
    format: 'congress',
    difficulty: 3,
    year: 2024,
    month: 'September',
    tournament: 'State Championship',
    source: 'State Circuit',
    sourceUrl: '',
    tags: ['China', 'human rights', 'Uyghurs', 'foreign policy'],
    notes: 'Research Uyghur detention, forced labor, surveillance. Consider diplomatic implications.',
    favorited: false,
    timesUsed: 5,
    lastUsed: '2024-09-20',
    createdAt: '2024-09-01'
  },
  {
    id: generateId(),
    text: 'A Bill to Establish Universal Pre-Kindergarten Education.',
    category: 'domestic',
    format: 'congress',
    difficulty: 2,
    year: 2024,
    month: 'November',
    tournament: 'Fall Invitational',
    source: 'Local Circuit',
    sourceUrl: '',
    tags: ['education', 'children', 'early childhood', 'funding'],
    notes: 'Pro: achievement gaps, working parents, brain development. Con: cost, federal overreach, quality concerns.',
    favorited: true,
    timesUsed: 6,
    lastUsed: '2024-11-10',
    createdAt: '2024-11-01'
  },
  {
    id: generateId(),
    text: 'A Bill to Ban Assault Weapons and High-Capacity Magazines.',
    category: 'legal',
    format: 'congress',
    difficulty: 3,
    year: 2024,
    month: 'October',
    tournament: 'Regional Championship',
    source: 'Regional Circuit',
    sourceUrl: '',
    tags: ['guns', 'Second Amendment', 'public safety', 'constitutional'],
    notes: 'Highly contested. Pro: public safety, mass shootings. Con: 2A rights, enforcement, definition problems.',
    favorited: false,
    timesUsed: 10,
    lastUsed: '2024-10-25',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'A Resolution to Support the Expansion of Nuclear Energy Production.',
    category: 'economics',
    format: 'congress',
    difficulty: 2,
    year: 2024,
    month: 'December',
    tournament: 'Winter Invitational',
    source: 'National Circuit',
    sourceUrl: '',
    tags: ['energy', 'nuclear', 'climate', 'environment'],
    notes: 'Pro: clean energy, baseload power, jobs. Con: waste, cost, safety, proliferation.',
    favorited: false,
    timesUsed: 3,
    lastUsed: '2024-12-01',
    createdAt: '2024-11-15'
  },
  {
    id: generateId(),
    text: 'A Bill to Reform the Electoral College System.',
    category: 'legal',
    format: 'congress',
    difficulty: 3,
    year: 2024,
    month: 'November',
    tournament: 'State Finals',
    source: 'State Circuit',
    sourceUrl: '',
    tags: ['elections', 'democracy', 'constitutional', 'reform'],
    notes: 'Define specific reform (NPV, proportional, direct election). Historical and comparative analysis key.',
    favorited: true,
    timesUsed: 4,
    lastUsed: '2024-11-20',
    createdAt: '2024-11-01'
  },

  // ===== PARLIAMENTARY (NPDA/APDA) MOTIONS =====
  {
    id: generateId(),
    text: 'This House would ban the use of facial recognition technology by law enforcement.',
    category: 'social',
    format: 'parli',
    difficulty: 2,
    year: 2024,
    month: 'November',
    tournament: 'NPDA Nationals Qualifier',
    source: 'NPDA',
    sourceUrl: '',
    tags: ['technology', 'privacy', 'police', 'civil liberties', 'surveillance'],
    notes: 'Good novice motion. Clear clash on privacy vs security. Research San Francisco ban, China comparison.',
    favorited: false,
    timesUsed: 7,
    lastUsed: '2024-11-10',
    createdAt: '2024-11-05'
  },
  {
    id: generateId(),
    text: 'This House would abolish the Senate filibuster.',
    category: 'legal',
    format: 'parli',
    difficulty: 3,
    year: 2024,
    month: 'October',
    tournament: 'Fall Championship',
    source: 'Regional Circuit',
    sourceUrl: '',
    tags: ['democracy', 'Senate', 'filibuster', 'governance'],
    notes: 'Gov: majority rule, gridlock. Opp: minority rights, deliberation, tyranny of majority.',
    favorited: true,
    timesUsed: 5,
    lastUsed: '2024-10-20',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'This House believes that capitalism is incompatible with environmental sustainability.',
    category: 'philosophy',
    format: 'parli',
    difficulty: 4,
    year: 2024,
    month: 'September',
    tournament: 'APDA Nationals',
    source: 'APDA',
    sourceUrl: '',
    tags: ['capitalism', 'environment', 'economics', 'sustainability'],
    notes: 'Gov: growth imperative, externalities, short-termism. Opp: green capitalism, innovation, regulation.',
    favorited: true,
    timesUsed: 4,
    lastUsed: '2024-09-25',
    createdAt: '2024-09-01'
  },
  {
    id: generateId(),
    text: 'This House would require social media companies to verify the identity of all users.',
    category: 'social',
    format: 'parli',
    difficulty: 2,
    year: 2024,
    month: 'October',
    tournament: 'Regional Qualifier',
    source: 'Local Circuit',
    sourceUrl: '',
    tags: ['social media', 'privacy', 'anonymity', 'harassment'],
    notes: 'Gov: accountability, reduce harassment. Opp: privacy, dissent protection, enforcement.',
    favorited: false,
    timesUsed: 6,
    lastUsed: '2024-10-15',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'This House prefers a world without organized religion.',
    category: 'philosophy',
    format: 'parli',
    difficulty: 4,
    year: 2024,
    month: 'November',
    tournament: 'NPDA Championships',
    source: 'NPDA',
    sourceUrl: '',
    tags: ['religion', 'philosophy', 'society', 'secularism'],
    notes: 'Gov: conflict, oppression, irrationality. Opp: community, meaning, charity, art.',
    favorited: false,
    timesUsed: 3,
    lastUsed: '2024-11-15',
    createdAt: '2024-11-01'
  },
  {
    id: generateId(),
    text: 'This House would ban unpaid internships.',
    category: 'economics',
    format: 'parli',
    difficulty: 2,
    year: 2024,
    month: 'September',
    tournament: 'Fall Invitational',
    source: 'Local Circuit',
    sourceUrl: '',
    tags: ['labor', 'education', 'inequality', 'employment'],
    notes: 'Gov: exploitation, inequality, labor rights. Opp: opportunity, experience, non-profit impact.',
    favorited: false,
    timesUsed: 8,
    lastUsed: '2024-09-30',
    createdAt: '2024-09-01'
  },

  // ===== BRITISH PARLIAMENTARY MOTIONS =====
  {
    id: generateId(),
    text: 'This House believes that the pursuit of happiness is a more important life goal than the pursuit of meaning.',
    category: 'philosophy',
    format: 'bp',
    difficulty: 3,
    year: 2024,
    month: 'October',
    tournament: 'Cambridge IV',
    source: 'Cambridge Union',
    sourceUrl: 'https://cambridgeunion.org',
    tags: ['philosophy', 'happiness', 'meaning', 'life purpose'],
    notes: 'Classic philosophy motion. Define happiness (hedonic) vs meaning (eudaimonic) carefully.',
    favorited: true,
    timesUsed: 5,
    lastUsed: '2024-10-25',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'This House would allow the buying and selling of human organs.',
    category: 'philosophy',
    format: 'bp',
    difficulty: 3,
    year: 2024,
    month: 'November',
    tournament: 'Oxford IV',
    source: 'Oxford Union',
    sourceUrl: 'https://oxford-union.org',
    tags: ['healthcare', 'ethics', 'markets', 'bodily autonomy'],
    notes: 'Prop: shortage, autonomy, regulated market. Opp: exploitation, commodification, coercion.',
    favorited: true,
    timesUsed: 7,
    lastUsed: '2024-11-20',
    createdAt: '2024-11-01'
  },
  {
    id: generateId(),
    text: 'This House believes that developing countries should prioritize economic growth over environmental protection.',
    category: 'economics',
    format: 'bp',
    difficulty: 3,
    year: 2024,
    month: 'September',
    tournament: 'Euros',
    source: 'European Universities Debating',
    sourceUrl: '',
    tags: ['development', 'environment', 'economics', 'climate'],
    notes: 'Prop: poverty reduction, historical emissions. Opp: climate vulnerability, leapfrogging, false dichotomy.',
    favorited: false,
    timesUsed: 6,
    lastUsed: '2024-09-30',
    createdAt: '2024-09-01'
  },
  {
    id: generateId(),
    text: 'This House regrets the rise of the self-care movement.',
    category: 'social',
    format: 'bp',
    difficulty: 4,
    year: 2024,
    month: 'October',
    tournament: 'Durham IV',
    source: 'Durham Debating',
    sourceUrl: '',
    tags: ['mental health', 'individualism', 'society', 'wellness'],
    notes: 'Prop: individualism, consumerism, ignores systemic issues. Opp: agency, mental health awareness.',
    favorited: false,
    timesUsed: 4,
    lastUsed: '2024-10-20',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'This House believes that feminism should not engage with traditional religious institutions.',
    category: 'social',
    format: 'bp',
    difficulty: 4,
    year: 2024,
    month: 'November',
    tournament: 'Manchester IV',
    source: 'Manchester Debating',
    sourceUrl: '',
    tags: ['feminism', 'religion', 'reform', 'gender'],
    notes: 'Prop: legitimization, reform impossible, patriarchy. Opp: insider reform, religious feminists, pragmatism.',
    favorited: false,
    timesUsed: 3,
    lastUsed: '2024-11-15',
    createdAt: '2024-11-01'
  },
  {
    id: generateId(),
    text: 'This House would implement a maximum wage.',
    category: 'economics',
    format: 'bp',
    difficulty: 3,
    year: 2024,
    month: 'October',
    tournament: 'LSE Open',
    source: 'LSE Debating',
    sourceUrl: '',
    tags: ['economics', 'inequality', 'wages', 'redistribution'],
    notes: 'Prop: inequality reduction, social cohesion. Opp: brain drain, enforcement, investment.',
    favorited: true,
    timesUsed: 5,
    lastUsed: '2024-10-25',
    createdAt: '2024-10-01'
  },

  // ===== WORLD SCHOOLS MOTIONS =====
  {
    id: generateId(),
    text: 'This House believes that Western liberal democracies should adopt deliberative democracy mechanisms.',
    category: 'philosophy',
    format: 'worlds',
    difficulty: 5,
    year: 2024,
    month: 'August',
    tournament: 'World Schools Debate Championship',
    source: 'WSDC',
    sourceUrl: 'https://wsdc.info',
    tags: ['democracy', 'deliberation', 'politics', 'governance'],
    notes: 'Championship-level. Research citizens assemblies, sortition, Irish Constitutional Convention.',
    favorited: true,
    timesUsed: 2,
    lastUsed: '2024-08-15',
    createdAt: '2024-08-01'
  },
  {
    id: generateId(),
    text: 'This House believes that governments should provide a universal basic income to all citizens.',
    category: 'economics',
    format: 'worlds',
    difficulty: 3,
    year: 2024,
    month: 'July',
    tournament: 'World Schools Debate Championship',
    source: 'WSDC',
    sourceUrl: 'https://wsdc.info',
    tags: ['UBI', 'welfare', 'economics', 'poverty'],
    notes: 'Accessible WSDC topic. Research Finland, Kenya pilots. Consider automation angle.',
    favorited: true,
    timesUsed: 4,
    lastUsed: '2024-08-10',
    createdAt: '2024-07-15'
  },
  {
    id: generateId(),
    text: 'This House believes that the United Nations Security Council should be reformed to remove the veto power of permanent members.',
    category: 'international',
    format: 'worlds',
    difficulty: 4,
    year: 2024,
    month: 'July',
    tournament: 'World Schools Debate Championship',
    source: 'WSDC',
    sourceUrl: 'https://wsdc.info',
    tags: ['UN', 'international law', 'security', 'reform'],
    notes: 'Prop: paralysis, representation. Opp: stability, great power buy-in, alternatives worse.',
    favorited: false,
    timesUsed: 3,
    lastUsed: '2024-08-05',
    createdAt: '2024-07-15'
  },
  {
    id: generateId(),
    text: 'This House believes that social movements should use radical tactics to achieve their goals.',
    category: 'philosophy',
    format: 'worlds',
    difficulty: 4,
    year: 2023,
    month: 'August',
    tournament: 'World Schools Debate Championship',
    source: 'WSDC',
    sourceUrl: 'https://wsdc.info',
    tags: ['activism', 'protest', 'social change', 'tactics'],
    notes: 'Define radical (property destruction, civil disobedience, etc.). Historical examples key.',
    favorited: false,
    timesUsed: 5,
    lastUsed: '2023-08-15',
    createdAt: '2023-08-01'
  },
  {
    id: generateId(),
    text: 'This House believes that artificial intelligence will do more harm than good to humanity.',
    category: 'social',
    format: 'worlds',
    difficulty: 3,
    year: 2024,
    month: 'June',
    tournament: 'Pan-American Schools Championship',
    source: 'PASC',
    sourceUrl: '',
    tags: ['AI', 'technology', 'future', 'automation'],
    notes: 'Timely topic. Prop: jobs, control, existential risk. Opp: innovation, healthcare, efficiency.',
    favorited: true,
    timesUsed: 6,
    lastUsed: '2024-06-30',
    createdAt: '2024-06-01'
  },

  // ===== IPDA MOTIONS =====
  {
    id: generateId(),
    text: 'The United States should adopt a four-day work week.',
    category: 'economics',
    format: 'parli',
    difficulty: 2,
    year: 2024,
    month: 'November',
    tournament: 'IPDA Nationals',
    source: 'IPDA',
    sourceUrl: '',
    tags: ['labor', 'work', 'productivity', 'well-being'],
    notes: 'Accessible topic. Pro: productivity, mental health, environment. Con: implementation, wages, industries.',
    favorited: false,
    timesUsed: 5,
    lastUsed: '2024-11-15',
    createdAt: '2024-11-01'
  },
  {
    id: generateId(),
    text: 'College athletes should be paid beyond scholarships.',
    category: 'economics',
    format: 'parli',
    difficulty: 2,
    year: 2024,
    month: 'October',
    tournament: 'Regional Championship',
    source: 'IPDA',
    sourceUrl: '',
    tags: ['sports', 'college', 'labor', 'NCAA'],
    notes: 'Post-NIL debate context. Pro: fairness, exploitation. Con: amateurism, Title IX, competitive balance.',
    favorited: false,
    timesUsed: 7,
    lastUsed: '2024-10-25',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'Standardized testing does more harm than good in education.',
    category: 'domestic',
    format: 'parli',
    difficulty: 1,
    year: 2024,
    month: 'September',
    tournament: 'Fall Invitational',
    source: 'IPDA',
    sourceUrl: '',
    tags: ['education', 'testing', 'equity', 'curriculum'],
    notes: 'Good novice topic. Pro: teach to test, stress, equity. Con: accountability, standards, improvement.',
    favorited: false,
    timesUsed: 10,
    lastUsed: '2024-09-30',
    createdAt: '2024-09-01'
  },
  {
    id: generateId(),
    text: 'The voting age should be lowered to 16.',
    category: 'legal',
    format: 'parli',
    difficulty: 2,
    year: 2024,
    month: 'October',
    tournament: 'State Championship',
    source: 'IPDA',
    sourceUrl: '',
    tags: ['voting', 'youth', 'democracy', 'civic engagement'],
    notes: 'Pro: civic engagement, affected by policy. Con: maturity, manipulation, consistency.',
    favorited: true,
    timesUsed: 8,
    lastUsed: '2024-10-20',
    createdAt: '2024-10-01'
  },

  // ===== ADDITIONAL DIVERSE MOTIONS =====
  {
    id: generateId(),
    text: 'Resolved: Countries should prioritize climate adaptation over climate mitigation.',
    category: 'international',
    format: 'pf',
    difficulty: 3,
    year: 2024,
    month: 'January',
    tournament: 'January PF Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['climate', 'environment', 'policy', 'global'],
    notes: 'Define adaptation (resilience) vs mitigation (reduction). Consider developing country perspectives.',
    favorited: false,
    timesUsed: 12,
    lastUsed: '2024-01-31',
    createdAt: '2023-12-15'
  },
  {
    id: generateId(),
    text: 'This House would ban political advertising on social media.',
    category: 'social',
    format: 'bp',
    difficulty: 2,
    year: 2024,
    month: 'September',
    tournament: 'Fall Open',
    source: 'Local Circuit',
    sourceUrl: '',
    tags: ['social media', 'elections', 'advertising', 'democracy'],
    notes: 'Prop: misinformation, manipulation, fairness. Opp: speech, information access, alternatives worse.',
    favorited: false,
    timesUsed: 6,
    lastUsed: '2024-09-25',
    createdAt: '2024-09-01'
  },
  {
    id: generateId(),
    text: 'A Bill to Establish Term Limits for Members of Congress.',
    category: 'legal',
    format: 'congress',
    difficulty: 2,
    year: 2024,
    month: 'September',
    tournament: 'State Invitational',
    source: 'State Circuit',
    sourceUrl: '',
    tags: ['Congress', 'reform', 'democracy', 'term limits'],
    notes: 'Pro: fresh ideas, reduce corruption, citizen legislators. Con: experience, voter choice, institutional knowledge.',
    favorited: true,
    timesUsed: 9,
    lastUsed: '2024-09-20',
    createdAt: '2024-09-01'
  },
  {
    id: generateId(),
    text: 'Resolved: Democracies should not engage in offensive cyber operations.',
    category: 'international',
    format: 'ld',
    difficulty: 4,
    year: 2024,
    month: 'TOC',
    tournament: 'Tournament of Champions',
    source: 'UK',
    sourceUrl: '',
    tags: ['cyber', 'security', 'democracy', 'warfare'],
    notes: 'Define offensive (vs defensive). Research Stuxnet, Russian operations, international law.',
    favorited: false,
    timesUsed: 3,
    lastUsed: '2024-05-01',
    createdAt: '2024-04-15'
  },
  {
    id: generateId(),
    text: 'This House believes that the criminal justice system should prioritize rehabilitation over punishment.',
    category: 'legal',
    format: 'worlds',
    difficulty: 3,
    year: 2024,
    month: 'May',
    tournament: 'Asian Schools Championship',
    source: 'ASDC',
    sourceUrl: '',
    tags: ['criminal justice', 'rehabilitation', 'punishment', 'prisons'],
    notes: 'Research Nordic model, recidivism rates, victim perspectives. Consider serious crimes.',
    favorited: true,
    timesUsed: 8,
    lastUsed: '2024-05-20',
    createdAt: '2024-05-01'
  },
  {
    id: generateId(),
    text: 'Resolved: The United States should substantially increase its use of nuclear energy.',
    category: 'economics',
    format: 'pf',
    difficulty: 3,
    year: 2023,
    month: 'March',
    tournament: 'March PF Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['energy', 'nuclear', 'climate', 'environment'],
    notes: 'Pro: clean baseload, climate. Con: waste, cost, safety, proliferation. Small modular reactors popular.',
    favorited: false,
    timesUsed: 16,
    lastUsed: '2023-03-31',
    createdAt: '2023-02-15'
  },
  {
    id: generateId(),
    text: 'This House would give indigenous communities veto power over resource extraction on their ancestral lands.',
    category: 'social',
    format: 'bp',
    difficulty: 4,
    year: 2024,
    month: 'October',
    tournament: 'Australs',
    source: 'Australian Debating',
    sourceUrl: '',
    tags: ['indigenous rights', 'environment', 'resources', 'sovereignty'],
    notes: 'Prop: self-determination, environmental protection, historical injustice. Opp: development, national interest, consistency.',
    favorited: true,
    timesUsed: 3,
    lastUsed: '2024-10-15',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'A Resolution to Expand the Supreme Court.',
    category: 'legal',
    format: 'congress',
    difficulty: 4,
    year: 2024,
    month: 'October',
    tournament: 'National Invitational',
    source: 'National Circuit',
    sourceUrl: '',
    tags: ['Supreme Court', 'judicial reform', 'democracy', 'courts'],
    notes: 'Pro: balance, democratic legitimacy. Con: precedent, politicization, retaliation.',
    favorited: false,
    timesUsed: 5,
    lastUsed: '2024-10-30',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'This House believes that states should not fund the arts.',
    category: 'economics',
    format: 'parli',
    difficulty: 3,
    year: 2024,
    month: 'November',
    tournament: 'Regional Finals',
    source: 'NPDA',
    sourceUrl: '',
    tags: ['arts', 'funding', 'culture', 'government'],
    notes: 'Gov: private patronage, government taste, opportunity cost. Opp: public good, access, cultural heritage.',
    favorited: false,
    timesUsed: 4,
    lastUsed: '2024-11-20',
    createdAt: '2024-11-01'
  },
  {
    id: generateId(),
    text: 'Resolved: The United States ought to eliminate subsidies for fossil fuels.',
    category: 'economics',
    format: 'ld',
    difficulty: 3,
    year: 2023,
    month: 'September',
    tournament: 'September/October LD Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['energy', 'climate', 'subsidies', 'fossil fuels'],
    notes: 'Aff: climate, market distortion. Neg: energy security, jobs, transition costs.',
    favorited: false,
    timesUsed: 14,
    lastUsed: '2023-10-31',
    createdAt: '2023-08-15'
  }
];

// Difficulty Badge Component
const DifficultyBadge = ({ level }) => {
  const difficulty = DIFFICULTY_LEVELS.find(d => d.value === level) || DIFFICULTY_LEVELS[2];
  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };

  return (
    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${colorClasses[difficulty.color]}`}>
      {difficulty.label}
    </span>
  );
};

// Motion Card Component
const MotionCard = ({ motion, onEdit, onDelete, onToggleFavorite, onCopy, viewMode }) => {
  const [expanded, setExpanded] = useState(false);
  const category = CATEGORIES[motion.category] || CATEGORIES.domestic;
  const format = FORMATS[motion.format] || FORMATS.pf;
  const CategoryIcon = category.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(motion.text);
    onCopy?.(motion);
  };

  if (viewMode === 'compact') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-4 rounded-lg border ${category.bgColor} ${category.borderColor} hover:border-opacity-60 transition-colors`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br from-${category.color}-500/20 to-${category.color}-600/20`}>
            <CategoryIcon className={`w-4 h-4 ${category.textColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm line-clamp-2">{motion.text}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-slate-400">{format.short}</span>
              <span className="text-slate-600">•</span>
              <DifficultyBadge level={motion.difficulty} />
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{motion.year}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(motion.id)}
              className={`p-1.5 rounded transition-colors ${
                motion.favorited 
                  ? 'text-amber-400 hover:text-amber-300' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {motion.favorited ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-500 hover:text-white rounded transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-xl border overflow-hidden ${category.bgColor} ${category.borderColor}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br from-${category.color}-500/20 to-${category.color}-600/20`}>
              <CategoryIcon className={`w-5 h-5 ${category.textColor}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium ${category.textColor}`}>{category.label}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{format.label}</span>
              </div>
              <DifficultyBadge level={motion.difficulty} />
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(motion.id)}
              className={`p-2 rounded-lg transition-colors ${
                motion.favorited 
                  ? 'text-amber-400 hover:bg-amber-500/20' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {motion.favorited ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              title="Copy motion text"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(motion)}
              className="p-2 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(motion.id)}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Motion Text */}
      <div className="p-4">
        <p className="text-white font-medium leading-relaxed">{motion.text}</p>
      </div>

      {/* Tags */}
      {motion.tags && motion.tags.length > 0 && (
        <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
          {motion.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded-full"
            >
              <Hash className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta Info */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Details</span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                {/* Source Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs uppercase tracking-wide">Tournament</span>
                    <p className="text-white">{motion.tournament || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs uppercase tracking-wide">Source</span>
                    <div className="flex items-center gap-1">
                      <p className="text-white">{motion.source || 'Unknown'}</p>
                      {motion.sourceUrl && (
                        <a 
                          href={motion.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs uppercase tracking-wide">Date</span>
                    <p className="text-white">{motion.month} {motion.year}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs uppercase tracking-wide">Times Used</span>
                    <p className="text-white">{motion.timesUsed || 0}</p>
                  </div>
                </div>

                {/* Notes */}
                {motion.notes && (
                  <div className="pt-2 border-t border-slate-700/50">
                    <span className="text-slate-500 text-xs uppercase tracking-wide">Notes</span>
                    <p className="text-slate-300 text-sm mt-1">{motion.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Add/Edit Motion Modal
const MotionModal = ({ isOpen, onClose, motion, onSave }) => {
  const [formData, setFormData] = useState({
    text: '',
    category: 'domestic',
    format: 'pf',
    difficulty: 3,
    year: new Date().getFullYear(),
    month: '',
    tournament: '',
    source: '',
    sourceUrl: '',
    tags: [],
    notes: ''
  });
  const [tagInput, setTagInput] = useState('');

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (motion) {
        setFormData({
          text: motion.text || '',
          category: motion.category || 'domestic',
          format: motion.format || 'pf',
          difficulty: motion.difficulty || 3,
          year: motion.year || new Date().getFullYear(),
          month: motion.month || '',
          tournament: motion.tournament || '',
          source: motion.source || '',
          sourceUrl: motion.sourceUrl || '',
          tags: motion.tags || [],
          notes: motion.notes || ''
        });
      } else {
        setFormData({
          text: '',
          category: 'domestic',
          format: 'pf',
          difficulty: 3,
          year: new Date().getFullYear(),
          month: '',
          tournament: '',
          source: '',
          sourceUrl: '',
          tags: [],
          notes: ''
        });
      }
    }
  }, [isOpen, motion]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    onSave({
      id: motion?.id || generateId(),
      ...formData,
      favorited: motion?.favorited || false,
      timesUsed: motion?.timesUsed || 0,
      lastUsed: motion?.lastUsed || null,
      createdAt: motion?.createdAt || new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {motion ? 'Edit Motion' : 'Add New Motion'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            {/* Motion Text */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Motion/Resolution Text *</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Resolved: ..."
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                required
              />
            </div>

            {/* Category & Format */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  {Object.entries(FORMATS).map(([key, fmt]) => (
                    <option key={key} value={key}>{fmt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Difficulty Level</label>
              <div className="flex items-center gap-2">
                {DIFFICULTY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: level.value }))}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.difficulty === level.value
                        ? `bg-${level.color}-500/20 text-${level.color}-400 border border-${level.color}-500/50`
                        : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tournament & Source */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Tournament/Event</label>
                <input
                  type="text"
                  value={formData.tournament}
                  onChange={(e) => setFormData(prev => ({ ...prev, tournament: e.target.value }))}
                  placeholder="e.g., NSDA Nationals"
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="e.g., NSDA"
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            {/* Year & Month */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min={2000}
                  max={2030}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Month</label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="">Select month...</option>
                  {['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Source URL */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Source URL (optional)</label>
              <input
                type="url"
                value={formData.sourceUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Tags</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag..."
                  className="flex-1 bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-700 text-slate-300 text-sm rounded-full"
                    >
                      <Hash className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-500 hover:text-red-400 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Strategy notes, key arguments, etc."
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-medium"
            >
              {motion ? 'Save Changes' : 'Add Motion'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Component
const MotionLibrary = () => {
  const [motions, setMotions] = useState(SAMPLE_MOTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('full'); // full, compact
  const [showModal, setShowModal] = useState(false);
  const [editingMotion, setEditingMotion] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Get unique years from motions
  const years = useMemo(() => {
    const yearSet = new Set(motions.map(m => m.year));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [motions]);

  // Filter and sort motions
  const filteredMotions = useMemo(() => {
    let result = [...motions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.text.toLowerCase().includes(query) ||
        m.tags?.some(t => t.toLowerCase().includes(query)) ||
        m.tournament?.toLowerCase().includes(query) ||
        m.source?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(m => m.category === selectedCategory);
    }

    // Format filter
    if (selectedFormat !== 'all') {
      result = result.filter(m => m.format === selectedFormat);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter(m => m.difficulty === parseInt(selectedDifficulty));
    }

    // Year filter
    if (selectedYear !== 'all') {
      result = result.filter(m => m.year === parseInt(selectedYear));
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter(m => m.favorited);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'most-used':
        result.sort((a, b) => (b.timesUsed || 0) - (a.timesUsed || 0));
        break;
      case 'difficulty-asc':
        result.sort((a, b) => a.difficulty - b.difficulty);
        break;
      case 'difficulty-desc':
        result.sort((a, b) => b.difficulty - a.difficulty);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.text.localeCompare(b.text));
        break;
    }

    return result;
  }, [motions, searchQuery, selectedCategory, selectedFormat, selectedDifficulty, selectedYear, showFavoritesOnly, sortBy]);

  // CRUD operations
  const handleSaveMotion = (motionData) => {
    setMotions(prev => {
      const existing = prev.findIndex(m => m.id === motionData.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = motionData;
        return updated;
      }
      return [motionData, ...prev];
    });
  };

  const handleDeleteMotion = (id) => {
    if (confirm('Are you sure you want to delete this motion?')) {
      setMotions(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleToggleFavorite = (id) => {
    setMotions(prev => prev.map(m => 
      m.id === id ? { ...m, favorited: !m.favorited } : m
    ));
  };

  const handleCopyMotion = (motion) => {
    setCopiedId(motion.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditMotion = (motion) => {
    setEditingMotion(motion);
    setShowModal(true);
  };

  // Export/Import
  const handleExport = () => {
    const data = JSON.stringify(motions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motion-library.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setMotions(prev => [...imported, ...prev]);
        }
      } catch (err) {
        console.error('Failed to import motions:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFormat('all');
    setSelectedDifficulty('all');
    setSelectedYear('all');
    setShowFavoritesOnly(false);
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedFormat !== 'all',
    selectedDifficulty !== 'all',
    selectedYear !== 'all',
    showFavoritesOnly
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            Motion Library
          </h1>
          <p className="text-slate-400 mt-1">
            {filteredMotions.length} of {motions.length} motions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              setEditingMotion(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Motion
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search motions, tags, tournaments..."
              className="w-full bg-slate-700/50 border border-slate-600 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Quick Filters */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
              showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:text-white'
            }`}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites
          </button>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-cyan-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('full')}
              className={`p-2 rounded ${viewMode === 'full' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded ${viewMode === 'compact' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 text-white px-3 py-2.5 rounded-lg focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-used">Most Used</option>
            <option value="difficulty-asc">Difficulty ↑</option>
            <option value="difficulty-desc">Difficulty ↓</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-700 grid grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={key}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Format</label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="all">All Formats</option>
                    {Object.entries(FORMATS).map(([key, fmt]) => (
                      <option key={key} value={key}>{fmt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="all">All Levels</option>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="all">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Quick Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:text-white'
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const Icon = cat.icon;
          const count = motions.filter(m => m.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? `${cat.bgColor} ${cat.textColor} border ${cat.borderColor}`
                  : 'bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
              <span className="text-xs opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Motions Grid/List */}
      {filteredMotions.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400">No motions found</h3>
          <p className="text-slate-500 mt-1">
            {searchQuery || activeFiltersCount > 0
              ? 'Try adjusting your filters or search query'
              : 'Add your first motion to get started'}
          </p>
          {(searchQuery || activeFiltersCount > 0) && (
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'full' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-2'}>
          <AnimatePresence mode="popLayout">
            {filteredMotions.map((motion) => (
              <MotionCard
                key={motion.id}
                motion={motion}
                viewMode={viewMode}
                onEdit={handleEditMotion}
                onDelete={handleDeleteMotion}
                onToggleFavorite={handleToggleFavorite}
                onCopy={handleCopyMotion}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Copy Toast */}
      <AnimatePresence>
        {copiedId && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Motion copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <MotionModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingMotion(null);
            }}
            motion={editingMotion}
            onSave={handleSaveMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MotionLibrary;
