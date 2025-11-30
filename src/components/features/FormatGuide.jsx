import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book,
  ChevronDown,
  Clock,
  Users,
  MessageSquare,
  Award,
  Info,
  CheckCircle
} from 'lucide-react';

const FORMATS = {
  ld: {
    id: 'ld',
    name: 'Lincoln-Douglas',
    shortName: 'LD',
    color: 'blue',
    description: 'One-on-one value debate focusing on philosophical arguments',
    participants: '1 vs 1',
    prepTime: '4 minutes per side',
    overview: 'Lincoln-Douglas debate centers on a resolution that poses a question of values. Debaters argue which value or value criterion should be prioritized when making decisions about the resolution.',
    structure: [
      { speech: 'Affirmative Constructive (AC)', time: '6 min', description: 'Present the affirmative case with value, criterion, and contentions' },
      { speech: 'Cross-Examination', time: '3 min', description: 'Negative questions the affirmative' },
      { speech: 'Negative Constructive (NC)', time: '7 min', description: 'Present negative case and respond to affirmative' },
      { speech: 'Cross-Examination', time: '3 min', description: 'Affirmative questions the negative' },
      { speech: '1st Affirmative Rebuttal (1AR)', time: '4 min', description: 'Respond to negative arguments, rebuild case' },
      { speech: 'Negative Rebuttal (NR)', time: '6 min', description: 'Extend arguments, crystallize the round' },
      { speech: '2nd Affirmative Rebuttal (2AR)', time: '3 min', description: 'Final summary and voting issues' }
    ],
    keyTerms: [
      { term: 'Value', definition: 'The core ideal being debated (e.g., Justice, Liberty, Security)' },
      { term: 'Value Criterion', definition: 'The standard used to measure the value' },
      { term: 'Contention', definition: 'Main arguments supporting your position' },
      { term: 'Framework', definition: 'The value and criterion together' }
    ],
    tips: [
      'Focus on the philosophical clash between values',
      'Your criterion determines how to weigh arguments',
      'Time management in 1AR is crucial',
      'Crystallize voting issues in final speeches'
    ]
  },
  pf: {
    id: 'pf',
    name: 'Public Forum',
    shortName: 'PF',
    color: 'green',
    description: 'Team debate designed to be accessible and persuasive to lay audiences',
    participants: '2 vs 2',
    prepTime: '2 minutes per team',
    overview: 'Public Forum debate focuses on current events and is designed to be understandable to the general public. Teams argue both sides of a resolution over the course of a tournament.',
    structure: [
      { speech: 'First Speaker (Team A)', time: '4 min', description: 'Present constructive case' },
      { speech: 'First Speaker (Team B)', time: '4 min', description: 'Present constructive case' },
      { speech: 'Crossfire', time: '3 min', description: 'Both first speakers question each other' },
      { speech: 'Second Speaker (Team A)', time: '4 min', description: 'Rebuttal speech' },
      { speech: 'Second Speaker (Team B)', time: '4 min', description: 'Rebuttal speech' },
      { speech: 'Crossfire', time: '3 min', description: 'Both second speakers question each other' },
      { speech: 'Summary (Team A)', time: '3 min', description: 'Narrow and weigh key arguments' },
      { speech: 'Summary (Team B)', time: '3 min', description: 'Narrow and weigh key arguments' },
      { speech: 'Grand Crossfire', time: '3 min', description: 'All four debaters participate' },
      { speech: 'Final Focus (Team A)', time: '2 min', description: 'Final persuasive appeal' },
      { speech: 'Final Focus (Team B)', time: '2 min', description: 'Final persuasive appeal' }
    ],
    keyTerms: [
      { term: 'Crossfire', definition: 'Back-and-forth questioning between opponents' },
      { term: 'Summary', definition: 'Speech to narrow down and weigh arguments' },
      { term: 'Final Focus', definition: 'Last speech to crystallize why you win' },
      { term: 'Weighing', definition: 'Explaining why your arguments matter more' }
    ],
    tips: [
      'Be persuasive - judges may not be debate experts',
      'Narrow to 1-2 key arguments in summary',
      'Final Focus should mirror Summary arguments',
      'Crossfire is for clarification, not new arguments'
    ]
  },
  policy: {
    id: 'policy',
    name: 'Policy Debate',
    shortName: 'Policy',
    color: 'purple',
    description: 'Evidence-intensive team debate on a year-long policy resolution',
    participants: '2 vs 2',
    prepTime: '8 minutes per team',
    overview: 'Policy debate involves researching and debating a single resolution for an entire year. Teams propose and defend specific policy changes, with extensive use of evidence and argumentation.',
    structure: [
      { speech: '1st Affirmative Constructive (1AC)', time: '8 min', description: 'Present the plan and advantages' },
      { speech: 'Cross-Examination', time: '3 min', description: '2N questions 1A' },
      { speech: '1st Negative Constructive (1NC)', time: '8 min', description: 'Present off-case and on-case arguments' },
      { speech: 'Cross-Examination', time: '3 min', description: '1A questions 1N' },
      { speech: '2nd Affirmative Constructive (2AC)', time: '8 min', description: 'Answer all negative arguments' },
      { speech: 'Cross-Examination', time: '3 min', description: '1N questions 2A' },
      { speech: '2nd Negative Constructive (2NC)', time: '8 min', description: 'Extend and develop arguments' },
      { speech: 'Cross-Examination', time: '3 min', description: '2A questions 2N' },
      { speech: '1st Negative Rebuttal (1NR)', time: '5 min', description: 'Cover arguments not in 2NC' },
      { speech: '1st Affirmative Rebuttal (1AR)', time: '5 min', description: 'Answer 2NC and 1NR' },
      { speech: '2nd Negative Rebuttal (2NR)', time: '5 min', description: 'Collapse to winning arguments' },
      { speech: '2nd Affirmative Rebuttal (2AR)', time: '5 min', description: 'Final summary, why aff wins' }
    ],
    keyTerms: [
      { term: 'Plan', definition: 'The specific policy action the affirmative proposes' },
      { term: 'Disadvantage (DA)', definition: 'Argument that the plan causes harm' },
      { term: 'Counterplan (CP)', definition: 'Alternative policy proposed by negative' },
      { term: 'Kritik (K)', definition: 'Argument challenging assumptions of the debate' },
      { term: 'Topicality (T)', definition: 'Argument that the plan doesn\'t fit the resolution' },
      { term: 'Solvency', definition: 'Whether the plan actually solves the problem' }
    ],
    tips: [
      'Evidence quality matters - cite your sources',
      'Flow the debate carefully to track arguments',
      'The negative block (2NC + 1NR) should coordinate',
      'Collapse to your best arguments in rebuttals'
    ]
  },
  congress: {
    id: 'congress',
    name: 'Congressional Debate',
    shortName: 'Congress',
    color: 'amber',
    description: 'Legislative simulation with multiple participants debating bills',
    participants: '10-25 per chamber',
    prepTime: 'None during session',
    overview: 'Congressional Debate simulates the U.S. legislative process. Students draft legislation, then debate and vote on bills in a parliamentary procedure format.',
    structure: [
      { speech: 'Authorship/Sponsorship', time: '3 min', description: 'Introduce and advocate for the bill' },
      { speech: 'First Negation', time: '3 min', description: 'First speech against the bill' },
      { speech: 'Following Speeches', time: '3 min', description: 'Alternate pro and con speeches' },
      { speech: 'Questioning', time: '2 min', description: 'After each speech, others may question' }
    ],
    keyTerms: [
      { term: 'PO', definition: 'Presiding Officer - runs the chamber' },
      { term: 'Precedence', definition: 'Speaking priority (new speakers go first)' },
      { term: 'Motion', definition: 'Formal request to take action' },
      { term: 'Legislation', definition: 'Bills and resolutions being debated' }
    ],
    tips: [
      'Speak early to establish precedence',
      'Reference previous speakers to show engagement',
      'Asking questions gives you speaking credit',
      'Be respectful of parliamentary procedure'
    ]
  },
  parli: {
    id: 'parli',
    name: 'Parliamentary Debate',
    shortName: 'Parli/NPDA',
    color: 'red',
    description: 'Impromptu team debate with limited prep time',
    participants: '2 vs 2',
    prepTime: '15-20 minutes before round',
    overview: 'Parliamentary debate features new topics each round with limited preparation time. No outside evidence is allowed - debaters rely on general knowledge and logical reasoning.',
    structure: [
      { speech: 'Prime Minister Constructive (PMC)', time: '7 min', description: 'Present the case for the government' },
      { speech: 'Leader of Opposition Constructive (LOC)', time: '8 min', description: 'Present opposition case and refute PMC' },
      { speech: 'Member of Government (MG)', time: '8 min', description: 'Rebuild and extend government case' },
      { speech: 'Member of Opposition (MO)', time: '8 min', description: 'Extend opposition and refute MG' },
      { speech: 'Leader of Opposition Rebuttal (LOR)', time: '4 min', description: 'Summarize opposition position' },
      { speech: 'Prime Minister Rebuttal (PMR)', time: '5 min', description: 'Final government summary' }
    ],
    keyTerms: [
      { term: 'POI', definition: 'Point of Information - question during speech' },
      { term: 'Government', definition: 'Team supporting the resolution' },
      { term: 'Opposition', definition: 'Team opposing the resolution' },
      { term: 'Protected Time', definition: 'First/last minute when POIs aren\'t allowed' }
    ],
    tips: [
      'POIs allowed during speeches (not in protected time)',
      'No outside evidence - use logic and examples',
      'New arguments not allowed in rebuttals',
      'Prepare multiple cases during prep time'
    ]
  },
  bp: {
    id: 'bp',
    name: 'British Parliamentary',
    shortName: 'BP',
    color: 'indigo',
    description: 'Four-team competitive format used in international circuit',
    participants: '4 teams of 2 (8 debaters)',
    prepTime: '15 minutes before round',
    overview: 'British Parliamentary (BP) is the most widely used format internationally, featuring four teams: Opening Government (OG), Opening Opposition (OO), Closing Government (CG), and Closing Opposition (CO). Teams are ranked 1st to 4th based on their performance.',
    structure: [
      { speech: 'Prime Minister (PM)', time: '7 min', description: 'Define motion, present case for OG' },
      { speech: 'Leader of Opposition (LO)', time: '7 min', description: 'Refute PM, present OO case' },
      { speech: 'Deputy Prime Minister (DPM)', time: '7 min', description: 'Extend OG case, refute LO' },
      { speech: 'Deputy Leader of Opposition (DLO)', time: '7 min', description: 'Extend OO case, refute DPM' },
      { speech: 'Member of Government (MG)', time: '7 min', description: 'Provide extension for CG, engage top half' },
      { speech: 'Member of Opposition (MO)', time: '7 min', description: 'Provide extension for CO, engage top half' },
      { speech: 'Government Whip (GW)', time: '7 min', description: 'Summarize gov bench, defend CG extension' },
      { speech: 'Opposition Whip (OW)', time: '7 min', description: 'Summarize opp bench, defend CO extension' }
    ],
    keyTerms: [
      { term: 'Extension', definition: 'New material that closing teams must provide to distinguish themselves' },
      { term: 'Opening Half', definition: 'OG and OO - first four speeches' },
      { term: 'Closing Half', definition: 'CG and CO - last four speeches' },
      { term: 'Whip', definition: 'Final speaker who summarizes and doesn\'t introduce new arguments' },
      { term: 'POI', definition: 'Point of Information - may be offered 1-6 minutes into speech' },
      { term: 'Knifing', definition: 'Attacking your own side (against rules)' }
    ],
    tips: [
      'Extensions must be distinct from opening half arguments',
      'Accept 1-2 POIs per speech for engagement',
      'Whip speeches should not introduce new arguments',
      'CG/CO must engage with top half, not ignore them',
      'Framing matters - define your half of the debate'
    ]
  },
  worldschools: {
    id: 'worldschools',
    name: 'World Schools',
    shortName: 'WSDC',
    color: 'cyan',
    description: 'International team format used at World Schools Debating Championships',
    participants: '3 vs 3',
    prepTime: '1 hour for prepared, 1 hour for impromptu motions',
    overview: 'World Schools Debating Championship (WSDC) format combines prepared and impromptu motions. Teams of three alternate speeches, with reply speeches delivered by first or second speakers in reverse order.',
    structure: [
      { speech: '1st Proposition', time: '8 min', description: 'Define motion, present proposition case' },
      { speech: '1st Opposition', time: '8 min', description: 'Accept/challenge definition, present opposition case' },
      { speech: '2nd Proposition', time: '8 min', description: 'Rebut 1st Opp, extend prop arguments' },
      { speech: '2nd Opposition', time: '8 min', description: 'Rebut prop case, extend opp arguments' },
      { speech: '3rd Proposition', time: '8 min', description: 'Rebut opposition, defend prop case' },
      { speech: '3rd Opposition', time: '8 min', description: 'Rebut proposition, defend opp case' },
      { speech: 'Opposition Reply', time: '4 min', description: 'Biased summary from opp perspective (1st or 2nd speaker)' },
      { speech: 'Proposition Reply', time: '4 min', description: 'Biased summary from prop perspective (1st or 2nd speaker)' }
    ],
    keyTerms: [
      { term: 'POI', definition: 'Point of Information - allowed between 1st and 7th minute' },
      { term: 'Reply Speech', definition: 'Biased summary delivered by 1st or 2nd speaker' },
      { term: 'Prepared Motion', definition: 'Topic announced weeks in advance' },
      { term: 'Impromptu Motion', definition: 'Topic announced 1 hour before round' },
      { term: 'Model', definition: 'Specific mechanism or example to illustrate your case' }
    ],
    tips: [
      'POIs should be strategic - accept 2-3 per speech',
      'Reply speeches summarize, no new arguments',
      'Third speakers must do significant rebuttal work',
      'Use real-world examples to ground abstract arguments',
      'Balance substantive and rebuttal material'
    ]
  },
  ipda: {
    id: 'ipda',
    name: 'IPDA',
    shortName: 'IPDA',
    color: 'teal',
    description: 'Accessible one-on-one debate with draw topics',
    participants: '1 vs 1',
    prepTime: '30 minutes before round (draw 5 topics)',
    overview: 'International Public Debate Association (IPDA) format is designed to be accessible and communication-focused. Debaters draw five topics, strike down to one, and have 30 minutes to prepare without electronic resources.',
    structure: [
      { speech: 'Affirmative Constructive', time: '5 min', description: 'Present affirmative case with clear contentions' },
      { speech: 'Negative Constructive', time: '5 min', description: 'Present negative case and initial refutation' },
      { speech: 'Affirmative Rebuttal', time: '5 min', description: 'Defend case, attack negative arguments' },
      { speech: 'Negative Rebuttal', time: '5 min', description: 'Defend case, attack affirmative arguments' },
      { speech: 'Affirmative Closing', time: '2 min', description: 'Final summary and crystallization' },
      { speech: 'Negative Closing', time: '2 min', description: 'Final summary and crystallization' }
    ],
    keyTerms: [
      { term: 'Strike', definition: 'Process of eliminating topics until one remains' },
      { term: 'Topic Draw', definition: 'Random selection of 5 potential topics' },
      { term: 'Lay Judge', definition: 'Non-technical judges common in IPDA' },
      { term: 'Communication', definition: 'Emphasis on clarity and persuasion over technical skill' }
    ],
    tips: [
      'Communicate clearly for lay judges',
      'Pick topics you have general knowledge about',
      'Structure is important - clear contentions win rounds',
      'No evidence cards - logical reasoning is key',
      'Closing speeches should crystallize, not introduce new args'
    ]
  },
  apda: {
    id: 'apda',
    name: 'APDA',
    shortName: 'APDA',
    color: 'emerald',
    description: 'American collegiate parliamentary format with case statements',
    participants: '2 vs 2',
    prepTime: '15 minutes, case statements allowed',
    overview: 'American Parliamentary Debate Association (APDA) is unique in allowing government teams to prepare case statements in advance. Topics are broad, and government sets the specific interpretation with their case.',
    structure: [
      { speech: 'Prime Minister Constructive (PMC)', time: '7 min', description: 'Present case statement and government arguments' },
      { speech: 'Leader of Opposition Constructive (LOC)', time: '8 min', description: 'Refute government, present opposition case' },
      { speech: 'Member of Government (MG)', time: '8 min', description: 'Rebuild and extend government case' },
      { speech: 'Member of Opposition (MO)', time: '8 min', description: 'Extend opposition, attack government' },
      { speech: 'Leader of Opposition Rebuttal (LOR)', time: '4 min', description: 'Summarize opposition winning arguments' },
      { speech: 'Prime Minister Rebuttal (PMR)', time: '5 min', description: 'Final government summary and appeal' }
    ],
    keyTerms: [
      { term: 'Case Statement', definition: 'Pre-prepared specific interpretation of the round topic' },
      { term: 'Opp Choice', definition: 'Option for opposition to choose case/side' },
      { term: 'Tight Call', definition: 'Case that unfairly advantages government' },
      { term: 'Time-Space', definition: 'When and where the case is set' },
      { term: 'POI', definition: 'Point of Information - questions during speeches' }
    ],
    tips: [
      'Government should have multiple case statements prepared',
      'Opposition can call tight call if case is unfair',
      'Case creativity is valued but fairness matters',
      'POIs are expected - take and give them generously',
      'No new arguments in rebuttals'
    ]
  },
  bigquestions: {
    id: 'bigquestions',
    name: 'Big Questions',
    shortName: 'BQ',
    color: 'sky',
    description: 'Philosophical team debate on enduring questions',
    participants: '2 vs 2',
    prepTime: '2 minutes per team',
    overview: 'Big Questions debate addresses philosophical and ethical questions that have been debated throughout human history. The format is similar to Public Forum but focuses on deeper, more abstract questions rather than current events.',
    structure: [
      { speech: 'First Pro Constructive', time: '5 min', description: 'Present pro case with philosophical grounding' },
      { speech: 'First Con Constructive', time: '5 min', description: 'Present con case with philosophical grounding' },
      { speech: 'Crossfire', time: '3 min', description: 'First speakers question each other' },
      { speech: 'Second Pro Constructive', time: '5 min', description: 'Extend pro arguments, begin refutation' },
      { speech: 'Second Con Constructive', time: '5 min', description: 'Extend con arguments, begin refutation' },
      { speech: 'Crossfire', time: '3 min', description: 'Second speakers question each other' },
      { speech: 'Pro Summary', time: '3 min', description: 'Narrow to key arguments and weigh' },
      { speech: 'Con Summary', time: '3 min', description: 'Narrow to key arguments and weigh' },
      { speech: 'Grand Crossfire', time: '3 min', description: 'All four debaters participate' },
      { speech: 'Pro Final Focus', time: '2 min', description: 'Final crystallization for pro' },
      { speech: 'Con Final Focus', time: '2 min', description: 'Final crystallization for con' }
    ],
    keyTerms: [
      { term: 'Resolution', definition: 'Year-long philosophical question being debated' },
      { term: 'Framework', definition: 'Philosophical lens through which to evaluate arguments' },
      { term: 'Burden', definition: 'What each side must prove to win' },
      { term: 'Crystallization', definition: 'Explaining the clearest reason to vote your way' }
    ],
    tips: [
      'Ground abstract concepts with real examples',
      'Establish clear frameworks for evaluation',
      'Both teams debate the resolution all year',
      'Evidence is encouraged but not required',
      'Focus on comparative analysis in later speeches'
    ]
  }
};

const getColorClasses = (color) => {
  const colors = {
    blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', badge: 'bg-blue-500' },
    green: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', badge: 'bg-green-500' },
    purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', badge: 'bg-purple-500' },
    amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', badge: 'bg-amber-500' },
    red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', badge: 'bg-red-500' },
    indigo: { bg: 'bg-indigo-500/20', border: 'border-indigo-500/50', text: 'text-indigo-400', badge: 'bg-indigo-500' },
    cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400', badge: 'bg-cyan-500' },
    teal: { bg: 'bg-teal-500/20', border: 'border-teal-500/50', text: 'text-teal-400', badge: 'bg-teal-500' },
    emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', badge: 'bg-emerald-500' },
    sky: { bg: 'bg-sky-500/20', border: 'border-sky-500/50', text: 'text-sky-400', badge: 'bg-sky-500' }
  };
  return colors[color] || colors.blue;
};

const FormatGuide = () => {
  const [activeFormat, setActiveFormat] = useState('ld');
  const [expandedSection, setExpandedSection] = useState('structure');

  const format = FORMATS[activeFormat];
  const colors = getColorClasses(format.color);

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
            <Book className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Format Guide</h1>
            <p className="text-slate-400 text-sm">Quick reference for debate format rules</p>
          </div>
        </div>

        {/* Format Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.values(FORMATS).map(f => {
            const fColors = getColorClasses(f.color);
            return (
              <button
                key={f.id}
                onClick={() => setActiveFormat(f.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFormat === f.id
                    ? `${fColors.bg} ${fColors.border} border ${fColors.text}`
                    : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                {f.shortName}
              </button>
            );
          })}
        </div>

        {/* Format Content */}
        <div className={`bg-slate-800/50 border ${colors.border} rounded-xl overflow-hidden`}>
          {/* Header */}
          <div className={`p-6 ${colors.bg}`}>
            <h2 className="text-2xl font-bold text-white mb-2">{format.name}</h2>
            <p className="text-slate-300 mb-4">{format.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-white">{format.participants}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-white">Prep: {format.prepTime}</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="p-6 border-b border-slate-700/50">
            <p className="text-slate-300 leading-relaxed">{format.overview}</p>
          </div>

          {/* Collapsible Sections */}
          <Section
            title="Speech Structure"
            icon={<MessageSquare className="w-4 h-4" />}
            isExpanded={expandedSection === 'structure'}
            onToggle={() => setExpandedSection(expandedSection === 'structure' ? null : 'structure')}
            colors={colors}
          >
            <div className="space-y-2">
              {format.structure.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 bg-slate-900/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-sm font-medium shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium">{item.speech}</span>
                      <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} rounded text-xs font-mono`}>
                        {item.time}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Key Terms"
            icon={<Info className="w-4 h-4" />}
            isExpanded={expandedSection === 'terms'}
            onToggle={() => setExpandedSection(expandedSection === 'terms' ? null : 'terms')}
            colors={colors}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {format.keyTerms.map((item, i) => (
                <div key={i} className="p-3 bg-slate-900/50 rounded-lg">
                  <span className={`font-semibold ${colors.text}`}>{item.term}</span>
                  <p className="text-slate-400 text-sm mt-1">{item.definition}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Tips & Strategy"
            icon={<Award className="w-4 h-4" />}
            isExpanded={expandedSection === 'tips'}
            onToggle={() => setExpandedSection(expandedSection === 'tips' ? null : 'tips')}
            colors={colors}
          >
            <ul className="space-y-2">
              {format.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className={`w-4 h-4 ${colors.text} shrink-0 mt-0.5`} />
                  <span className="text-slate-300">{tip}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, isExpanded, onToggle, colors, children }) => (
  <div className="border-b border-slate-700/50 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className={colors.text}>{icon}</span>
        <span className="text-white font-medium">{title}</span>
      </div>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="w-5 h-5 text-slate-400" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="p-4 pt-0">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default FormatGuide;
