// Speech/Debate format configurations
export const speechTimes = {
  'Public Forum (PF)': [
    { name: 'Constructive', time: 240 },
    { name: 'Rebuttal', time: 240 },
    { name: 'Summary', time: 180 },
    { name: 'Final Focus', time: 120 },
    { name: 'Crossfire', time: 180 }
  ],
  'Lincoln-Douglas (LD)': [
    { name: 'Aff Constructive (AC)', time: 360 },
    { name: 'Neg Constructive (NC)', time: 420 },
    { name: '1st Aff Rebuttal (1AR)', time: 240 },
    { name: 'Neg Rebuttal (NR)', time: 360 },
    { name: '2nd Aff Rebuttal (2AR)', time: 180 }
  ],
  'Policy Debate (CX)': [
    { name: '1AC', time: 480 },
    { name: '1NC', time: 480 },
    { name: '2AC', time: 480 },
    { name: '2NC', time: 480 },
    { name: '1NR', time: 300 },
    { name: '1AR', time: 300 },
    { name: '2NR', time: 300 },
    { name: '2AR', time: 300 },
    { name: 'Cross-Ex', time: 180 }
  ],
  'World Schools Debate': [
    { name: 'Main Speech', time: 480 },
    { name: 'Reply Speech', time: 240 }
  ],
  'Congressional Debate': [
    { name: 'Sponsorship/Auth', time: 180 },
    { name: 'Questioning', time: 120 }
  ],
  'Big Questions Debate': [
    { name: 'Constructive', time: 300 },
    { name: 'Rebuttal', time: 180 },
    { name: 'Consolidation', time: 180 },
    { name: 'Rationale', time: 180 }
  ],
  'United States Extemp (USX)': [
    { name: 'AGD', time: 45 },
    { name: 'Background', time: 45 },
    { name: 'Umbrella/Sig', time: 30 },
    { name: 'Point 1', time: 90 },
    { name: 'Point 2', time: 90 },
    { name: 'Point 3', time: 90 },
    { name: 'Conclusion', time: 30 }
  ],
  'International Extemp (IX)': [
    { name: 'AGD', time: 45 },
    { name: 'Background', time: 45 },
    { name: 'Umbrella/Sig', time: 30 },
    { name: 'Point 1', time: 90 },
    { name: 'Point 2', time: 90 },
    { name: 'Point 3', time: 90 },
    { name: 'Conclusion', time: 30 }
  ],
  'Original Oratory (OO)': [
    { name: 'Intro', time: 90 },
    { name: 'Body 1', time: 150 },
    { name: 'Body 2', time: 150 },
    { name: 'Body 3', time: 150 },
    { name: 'Conclusion', time: 60 }
  ],
  'Informative Speaking (INFO)': [
    { name: 'Intro', time: 90 },
    { name: 'Body 1', time: 150 },
    { name: 'Body 2', time: 150 },
    { name: 'Body 3', time: 150 },
    { name: 'Conclusion', time: 60 }
  ],
  'Dramatic Interpretation (DI)': [
    { name: 'Teaser', time: 90 },
    { name: 'Intro', time: 45 },
    { name: 'Performance', time: 465 }
  ],
  'Humorous Interpretation (HI)': [
    { name: 'Teaser', time: 90 },
    { name: 'Intro', time: 45 },
    { name: 'Performance', time: 465 }
  ],
  'Duo Interpretation': [
    { name: 'Teaser', time: 90 },
    { name: 'Intro', time: 45 },
    { name: 'Performance', time: 465 }
  ],
  'Program Oral Interpretation (POI)': [
    { name: 'Teaser', time: 90 },
    { name: 'Intro', time: 45 },
    { name: 'Performance', time: 465 }
  ],
  'Impromptu': [
    { name: 'Prep', time: 120 },
    { name: 'Speech', time: 300 }
  ],
  'Parliamentary (British)': [
    { name: 'Constructive', time: 420 },
    { name: 'Rebuttal', time: 240 }
  ],
  'Parliamentary (Asian)': [
    { name: 'Constructive', time: 420 },
    { name: 'Reply', time: 240 }
  ],
  'Model UN Speech': [
    { name: 'Intro', time: 15 },
    { name: 'Points', time: 60 },
    { name: 'Call to Action', time: 15 }
  ],
  'default': [
    { name: 'Speech', time: 600 }
  ]
}

// Format categories for better organization
export const formatCategories = {
  'Debate': [
    'Public Forum (PF)',
    'Lincoln-Douglas (LD)',
    'Policy Debate (CX)',
    'World Schools Debate',
    'Congressional Debate',
    'Big Questions Debate',
    'Parliamentary (British)',
    'Parliamentary (Asian)'
  ],
  'Speech': [
    'Original Oratory (OO)',
    'Informative Speaking (INFO)',
    'United States Extemp (USX)',
    'International Extemp (IX)',
    'Impromptu'
  ],
  'Interp': [
    'Dramatic Interpretation (DI)',
    'Humorous Interpretation (HI)',
    'Duo Interpretation',
    'Program Oral Interpretation (POI)'
  ],
  'Other': [
    'Model UN Speech'
  ]
}

// All speech types flattened
export const speechTypes = Object.values(formatCategories).flat()

// Sides/positions
export const sides = [
  'Proposition/Affirmative',
  'Opposition/Negative',
  'Government',
  'Opposition',
  'Pro',
  'Con',
  'Opening Member',
  'Closing Member/Whip',
  'Sponsor (Congress)',
  'Individual/Solo',
  'Neutral/Evaluator'
]

// Format settings for timers
export const formatSettings = {
  'Public Forum (PF)': {
    type: 'debate',
    prepTime: 180,
    teamA: 'Pro',
    teamB: 'Con',
    showPrep: true
  },
  'Lincoln-Douglas (LD)': {
    type: 'debate',
    prepTime: 240,
    teamA: 'Aff',
    teamB: 'Neg',
    showPrep: true
  },
  'Policy Debate (CX)': {
    type: 'debate',
    prepTime: 480,
    teamA: 'Aff',
    teamB: 'Neg',
    showPrep: true
  },
  'World Schools Debate': {
    type: 'debate',
    prepTime: 0,
    teamA: 'Prop',
    teamB: 'Opp',
    showPrep: false
  },
  'Congressional Debate': {
    type: 'debate',
    prepTime: 0,
    teamA: 'Speaker',
    teamB: 'Chamber',
    showPrep: false
  },
  'Big Questions Debate': {
    type: 'debate',
    prepTime: 180,
    teamA: 'Pro',
    teamB: 'Con',
    showPrep: true
  },
  'default': {
    type: 'speech',
    prepTime: 0,
    teamA: 'Speaker',
    teamB: '',
    showPrep: false
  }
}

// Rubrics for each format
export const rubrics = {
  'Public Forum (PF)': `
- **Evidence & Warrants (30%)**: Quality of evidence, logical links.
- **Impact Calculus (30%)**: Magnitude, probability, timeframe.
- **Clash & Rebuttal (20%)**: Direct responsiveness to opponent.
- **Delivery (10%)**: Clarity, persuasion, speed.
- **Crossfire (10%)**: Question quality and dominance.
  `,
  'Lincoln-Douglas (LD)': `
- **Value & Criterion (30%)**: Framework clarity and application.
- **Contentions (30%)**: Logical consistency and evidence.
- **Philosophical Depth (20%)**: Understanding of core values.
- **Clash (10%)**: Direct refutation.
- **Delivery (10%)**: Persuasiveness.
  `,
  'Policy Debate (CX)': `
- **Stock Issues (30%)**: Harms, Solvency, Inherency, Topicality, Significance.
- **Evidence Quality (25%)**: Source credibility and recency.
- **Flow & Organization (20%)**: Line-by-line refutation.
- **Impact Analysis (15%)**: Terminal impacts.
- **Delivery (10%)**: Clarity (even if spreading).
  `,
  'World Schools Debate': `
- **Content (40%)**: Logic and relevance of arguments.
- **Style (40%)**: Rhetoric, delivery, tone.
- **Strategy (20%)**: Structure, timing, teamwork.
  `,
  'Congressional Debate': `
- **Argumentation (35%)**: New analysis, evidence.
- **Rhetoric (35%)**: Persuasion, delivery, style.
- **Parliamentary Procedure (15%)**: Knowledge of rules.
- **Questioning (15%)**: Engagement in chamber.
  `,
  'United States Extemp (USX)': `
- **Analysis (40%)**: Depth of answer to the question.
- **Sourcing (20%)**: Variety and quality of sources.
- **Organization (20%)**: Structure (Intro, Points, Conclusion).
- **Delivery (20%)**: Fluency, tone, and poise.
  `,
  'International Extemp (IX)': `
- **Analysis (40%)**: Depth of answer to the question.
- **Sourcing (20%)**: Variety and quality of sources.
- **Organization (20%)**: Structure (Intro, Points, Conclusion).
- **Delivery (20%)**: Fluency, tone, and poise.
  `,
  'Original Oratory (OO)': `
- **Topic/Content (40%)**: Originality, significance, and depth.
- **Delivery (40%)**: Vocal variety, movement, and emotion.
- **Structure (20%)**: Flow and organization.
  `,
  'Informative Speaking (INFO)': `
- **Topic/Content (50%)**: Educational value and originality.
- **Delivery (30%)**: Engagement and clarity.
- **Structure (20%)**: Organization.
  `,
  'Dramatic Interpretation (DI)': `
- **Characterization (40%)**: Depth and believability.
- **Cutting (30%)**: Story arc and coherence.
- **Delivery (30%)**: Vocal and physical control.
  `,
  'Humorous Interpretation (HI)': `
- **Characterization (40%)**: Distinct voices and physical comedy.
- **Cutting (30%)**: Story arc and humor.
- **Delivery (30%)**: Timing and execution.
  `,
  'default': `
- **Argumentation (40%)**: Logic, evidence, structure.
- **Delivery (30%)**: Tone, pace, clarity.
- **Strategy (20%)**: Time management, focus.
- **Responsiveness (10%)**: Engagement with the topic.
  `
}
