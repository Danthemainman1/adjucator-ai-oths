// Speech/Debate format configurations
// NSDA Official Events + Supplemental Events

export const speechTimes = {
  // ==================== NSDA DEBATE EVENTS ====================
  'Public Forum (PF)': [
    { name: 'Constructive', time: 240 },
    { name: 'Crossfire', time: 180 },
    { name: 'Rebuttal', time: 240 },
    { name: 'Crossfire', time: 180 },
    { name: 'Summary', time: 180 },
    { name: 'Grand Crossfire', time: 180 },
    { name: 'Final Focus', time: 120 }
  ],
  'Lincoln-Douglas (LD)': [
    { name: 'Aff Constructive (AC)', time: 360 },
    { name: 'Cross-Examination', time: 180 },
    { name: 'Neg Constructive (NC)', time: 420 },
    { name: 'Cross-Examination', time: 180 },
    { name: '1st Aff Rebuttal (1AR)', time: 240 },
    { name: 'Neg Rebuttal (NR)', time: 360 },
    { name: '2nd Aff Rebuttal (2AR)', time: 180 }
  ],
  'Policy Debate (CX)': [
    { name: '1AC', time: 480 },
    { name: 'CX of 1AC', time: 180 },
    { name: '1NC', time: 480 },
    { name: 'CX of 1NC', time: 180 },
    { name: '2AC', time: 480 },
    { name: 'CX of 2AC', time: 180 },
    { name: '2NC', time: 480 },
    { name: 'CX of 2NC', time: 180 },
    { name: '1NR', time: 300 },
    { name: '1AR', time: 300 },
    { name: '2NR', time: 300 },
    { name: '2AR', time: 300 }
  ],
  'Congressional Debate': [
    { name: 'Authorship/Sponsorship', time: 180 },
    { name: 'First Pro', time: 180 },
    { name: 'First Con', time: 180 },
    { name: 'Subsequent Speeches', time: 180 },
    { name: 'Questioning Period', time: 120 }
  ],
  'Big Questions Debate (BQ)': [
    { name: 'Constructive', time: 300 },
    { name: 'Questioning', time: 180 },
    { name: 'Rebuttal', time: 240 },
    { name: 'Questioning', time: 180 },
    { name: 'Consolidation', time: 180 },
    { name: 'Rationale', time: 180 }
  ],
  'World Schools Debate (WSD)': [
    { name: '1st Proposition', time: 480 },
    { name: '1st Opposition', time: 480 },
    { name: '2nd Proposition', time: 480 },
    { name: '2nd Opposition', time: 480 },
    { name: '3rd Proposition', time: 480 },
    { name: '3rd Opposition', time: 480 },
    { name: 'Opposition Reply', time: 240 },
    { name: 'Proposition Reply', time: 240 }
  ],
  
  // ==================== NSDA SPEECH EVENTS ====================
  // --- Main Events ---
  'Original Oratory (OO)': [
    { name: 'Introduction', time: 60 },
    { name: 'Need/Problem', time: 120 },
    { name: 'Solution/Action', time: 180 },
    { name: 'Visualization', time: 120 },
    { name: 'Conclusion', time: 60 }
  ],
  'Informative Speaking (INF)': [
    { name: 'Attention Getter', time: 30 },
    { name: 'Introduction', time: 60 },
    { name: 'Body Point 1', time: 120 },
    { name: 'Body Point 2', time: 120 },
    { name: 'Body Point 3', time: 120 },
    { name: 'Conclusion', time: 60 }
  ],
  
  // --- Extemporaneous Speaking ---
  'United States Extemp (USX)': [
    { name: 'Attention Getter', time: 30 },
    { name: 'Background/Link', time: 45 },
    { name: 'Answer/Thesis', time: 15 },
    { name: 'Point 1', time: 90 },
    { name: 'Point 2', time: 90 },
    { name: 'Point 3', time: 90 },
    { name: 'Conclusion', time: 30 }
  ],
  'International Extemp (IX)': [
    { name: 'Attention Getter', time: 30 },
    { name: 'Background/Link', time: 45 },
    { name: 'Answer/Thesis', time: 15 },
    { name: 'Point 1', time: 90 },
    { name: 'Point 2', time: 90 },
    { name: 'Point 3', time: 90 },
    { name: 'Conclusion', time: 30 }
  ],
  'Extemporaneous Debate (EXD)': [
    { name: 'Prep Time', time: 1800 },
    { name: 'Pro Constructive', time: 300 },
    { name: 'Con Constructive', time: 300 },
    { name: 'Q&A Period', time: 180 },
    { name: 'Pro Rebuttal', time: 180 },
    { name: 'Con Rebuttal', time: 180 }
  ],
  
  // --- Limited Prep ---
  'Impromptu Speaking': [
    { name: 'Prep Time', time: 120 },
    { name: 'Introduction', time: 30 },
    { name: 'Point 1', time: 90 },
    { name: 'Point 2', time: 90 },
    { name: 'Point 3', time: 90 },
    { name: 'Conclusion', time: 30 }
  ],
  
  // ==================== NSDA INTERPRETATION EVENTS ====================
  'Dramatic Interpretation (DI)': [
    { name: 'Teaser', time: 60 },
    { name: 'Introduction', time: 30 },
    { name: 'Rising Action', time: 180 },
    { name: 'Climax', time: 180 },
    { name: 'Falling Action/Resolution', time: 120 }
  ],
  'Humorous Interpretation (HI)': [
    { name: 'Teaser', time: 60 },
    { name: 'Introduction', time: 30 },
    { name: 'Rising Action', time: 180 },
    { name: 'Climax', time: 180 },
    { name: 'Falling Action/Resolution', time: 120 }
  ],
  'Duo Interpretation': [
    { name: 'Teaser', time: 60 },
    { name: 'Introduction', time: 30 },
    { name: 'Rising Action', time: 180 },
    { name: 'Climax', time: 180 },
    { name: 'Falling Action/Resolution', time: 120 }
  ],
  'Program Oral Interpretation (POI)': [
    { name: 'Teaser', time: 60 },
    { name: 'Introduction/Theme', time: 60 },
    { name: 'Selection 1 (Poetry)', time: 120 },
    { name: 'Transition', time: 15 },
    { name: 'Selection 2 (Prose)', time: 150 },
    { name: 'Transition', time: 15 },
    { name: 'Selection 3 (Drama)', time: 120 },
    { name: 'Conclusion', time: 30 }
  ],
  'Poetry Interpretation': [
    { name: 'Introduction', time: 45 },
    { name: 'Poem 1', time: 150 },
    { name: 'Transition', time: 15 },
    { name: 'Poem 2', time: 150 },
    { name: 'Transition', time: 15 },
    { name: 'Poem 3 (Optional)', time: 120 }
  ],
  'Prose Interpretation': [
    { name: 'Introduction', time: 30 },
    { name: 'Opening/Setup', time: 120 },
    { name: 'Development', time: 240 },
    { name: 'Climax/Resolution', time: 180 }
  ],
  
  // ==================== SUPPLEMENTAL/REGIONAL EVENTS ====================
  // --- Supplemental Speech ---
  'Expository Speaking': [
    { name: 'Introduction', time: 60 },
    { name: 'Topic Overview', time: 120 },
    { name: 'Main Content', time: 240 },
    { name: 'Conclusion', time: 60 }
  ],
  'Storytelling': [
    { name: 'Introduction', time: 30 },
    { name: 'Setup', time: 60 },
    { name: 'Rising Action', time: 120 },
    { name: 'Climax', time: 90 },
    { name: 'Resolution', time: 60 }
  ],
  'Declamation': [
    { name: 'Introduction', time: 30 },
    { name: 'Performance', time: 540 },
    { name: 'Conclusion', time: 30 }
  ],
  'Oratorical Declamation': [
    { name: 'Introduction', time: 30 },
    { name: 'Performance', time: 540 },
    { name: 'Conclusion', time: 30 }
  ],
  'Rhetorical Criticism': [
    { name: 'Introduction', time: 60 },
    { name: 'Artifact Description', time: 90 },
    { name: 'Method/Framework', time: 90 },
    { name: 'Analysis', time: 180 },
    { name: 'Conclusion/Implications', time: 60 }
  ],
  'Communication Analysis': [
    { name: 'Introduction', time: 60 },
    { name: 'Description', time: 90 },
    { name: 'Analysis Framework', time: 90 },
    { name: 'Analysis Application', time: 180 },
    { name: 'Conclusion', time: 60 }
  ],
  'After Dinner Speaking (ADS)': [
    { name: 'Introduction/Hook', time: 60 },
    { name: 'Setup', time: 90 },
    { name: 'Point 1 (Humorous)', time: 120 },
    { name: 'Point 2 (Humorous)', time: 120 },
    { name: 'Serious Point', time: 90 },
    { name: 'Conclusion', time: 60 }
  ],
  'Broadcasting': [
    { name: 'Introduction', time: 30 },
    { name: 'News Package', time: 300 }
  ],
  
  // --- Supplemental Interp ---
  'Children\'s Literature': [
    { name: 'Introduction', time: 30 },
    { name: 'Story Setup', time: 60 },
    { name: 'Story Body', time: 300 },
    { name: 'Conclusion', time: 30 }
  ],
  'Contemporary Issues': [
    { name: 'Introduction', time: 60 },
    { name: 'Performance', time: 480 },
    { name: 'Resolution', time: 60 }
  ],
  
  // --- Supplemental Debate ---
  'Parliamentary Debate (Parli)': [
    { name: 'PM Constructive', time: 420 },
    { name: 'LO Constructive', time: 480 },
    { name: 'MG Constructive', time: 480 },
    { name: 'MO Constructive', time: 480 },
    { name: 'LO Rebuttal', time: 240 },
    { name: 'PM Rebuttal', time: 300 }
  ],
  'IPDA Debate': [
    { name: 'Prep Time', time: 1800 },
    { name: 'Affirmative Constructive', time: 300 },
    { name: 'Negative Cross-Ex', time: 120 },
    { name: 'Negative Constructive', time: 360 },
    { name: 'Affirmative Cross-Ex', time: 120 },
    { name: 'Affirmative Rebuttal', time: 300 },
    { name: 'Negative Rebuttal', time: 300 }
  ],
  'NFA-LD': [
    { name: 'Affirmative Constructive', time: 360 },
    { name: 'Cross-Examination', time: 180 },
    { name: 'Negative Constructive', time: 420 },
    { name: 'Cross-Examination', time: 180 },
    { name: 'Affirmative Rebuttal', time: 360 },
    { name: 'Negative Rebuttal', time: 360 }
  ],
  'Mock Trial': [
    { name: 'Opening Statement', time: 300 },
    { name: 'Direct Examination', time: 420 },
    { name: 'Cross-Examination', time: 300 },
    { name: 'Redirect', time: 120 },
    { name: 'Closing Argument', time: 300 }
  ],
  
  // --- Other Regional ---
  'Model UN Speech': [
    { name: 'Opening', time: 15 },
    { name: 'Position Statement', time: 45 },
    { name: 'Call to Action', time: 15 }
  ],
  'Student Congress': [
    { name: 'Authorship Speech', time: 180 },
    { name: 'First Affirmative', time: 180 },
    { name: 'First Negative', time: 180 },
    { name: 'Subsequent Speeches', time: 180 }
  ],
  'Spar Debate': [
    { name: 'Prep Time', time: 60 },
    { name: 'Pro Speech', time: 120 },
    { name: 'Con Speech', time: 120 },
    { name: 'Pro Rebuttal', time: 60 },
    { name: 'Con Rebuttal', time: 60 }
  ],
  
  'default': [
    { name: 'Speech', time: 600 }
  ]
}

// Format categories with subcategories for better organization
export const formatCategories = {
  'NSDA Debate': {
    'Main Events': [
      'Public Forum (PF)',
      'Lincoln-Douglas (LD)',
      'Policy Debate (CX)',
      'Congressional Debate'
    ],
    'Supplemental': [
      'Big Questions Debate (BQ)',
      'World Schools Debate (WSD)'
    ]
  },
  'NSDA Speech': {
    'Main Events': [
      'Original Oratory (OO)',
      'Informative Speaking (INF)'
    ],
    'Extemporaneous': [
      'United States Extemp (USX)',
      'International Extemp (IX)'
    ],
    'Limited Prep': [
      'Impromptu Speaking',
      'Extemporaneous Debate (EXD)'
    ]
  },
  'NSDA Interpretation': {
    'Main Events': [
      'Dramatic Interpretation (DI)',
      'Humorous Interpretation (HI)',
      'Duo Interpretation',
      'Program Oral Interpretation (POI)'
    ],
    'Supplemental': [
      'Poetry Interpretation',
      'Prose Interpretation'
    ]
  },
  'Supplemental Events': {
    'Speech': [
      'Expository Speaking',
      'Storytelling',
      'Declamation',
      'Oratorical Declamation',
      'Rhetorical Criticism',
      'Communication Analysis',
      'After Dinner Speaking (ADS)',
      'Broadcasting'
    ],
    'Interpretation': [
      'Children\'s Literature',
      'Contemporary Issues'
    ],
    'Debate': [
      'Parliamentary Debate (Parli)',
      'IPDA Debate',
      'NFA-LD',
      'Mock Trial',
      'Spar Debate'
    ],
    'Other': [
      'Model UN Speech',
      'Student Congress'
    ]
  }
}

// Flat list of all speech types
export const speechTypes = Object.values(formatCategories)
  .flatMap(category => Object.values(category).flat())

// Get subcategories for a main category
export const getSubcategories = (mainCategory) => {
  return formatCategories[mainCategory] || {}
}

// Get all main categories
export const getMainCategories = () => Object.keys(formatCategories)

// Find which category and subcategory an event belongs to
export const findEventCategory = (eventName) => {
  for (const [mainCat, subCats] of Object.entries(formatCategories)) {
    for (const [subCat, events] of Object.entries(subCats)) {
      if (events.includes(eventName)) {
        return { mainCategory: mainCat, subCategory: subCat }
      }
    }
  }
  return { mainCategory: 'Other', subCategory: 'General' }
}

// Sides/positions organized by event type
export const sides = {
  debate: [
    'Proposition/Affirmative',
    'Opposition/Negative',
    'Government',
    'Opposition',
    'Pro',
    'Con',
    'Plaintiff',
    'Defense'
  ],
  congress: [
    'Sponsor/Author',
    'First Pro',
    'First Con',
    'Subsequent Speaker',
    'Questioner'
  ],
  parli: [
    'Prime Minister',
    'Leader of Opposition',
    'Member of Government',
    'Member of Opposition'
  ],
  individual: [
    'Individual/Solo',
    'Neutral/Evaluator'
  ]
}

// Flat sides list for backwards compatibility
export const allSides = [
  ...sides.debate,
  ...sides.congress,
  ...sides.parli,
  ...sides.individual
]

// Get applicable sides for an event
export const getSidesForEvent = (eventName) => {
  const { mainCategory } = findEventCategory(eventName)
  
  if (mainCategory.includes('Debate')) {
    if (eventName.includes('Congress') || eventName.includes('Student Congress')) {
      return sides.congress
    }
    if (eventName.includes('Parliament') || eventName.includes('Parli')) {
      return sides.parli
    }
    return sides.debate
  }
  
  return sides.individual
}

// Format settings for timers
export const formatSettings = {
  'Public Forum (PF)': {
    type: 'debate',
    prepTime: 180,
    teamA: 'Pro',
    teamB: 'Con',
    showPrep: true,
    flightTime: null
  },
  'Lincoln-Douglas (LD)': {
    type: 'debate',
    prepTime: 240,
    teamA: 'Aff',
    teamB: 'Neg',
    showPrep: true,
    flightTime: null
  },
  'Policy Debate (CX)': {
    type: 'debate',
    prepTime: 480,
    teamA: 'Aff',
    teamB: 'Neg',
    showPrep: true,
    flightTime: null
  },
  'Congressional Debate': {
    type: 'congress',
    prepTime: 0,
    teamA: 'Chamber',
    teamB: '',
    showPrep: false,
    flightTime: null
  },
  'Big Questions Debate (BQ)': {
    type: 'debate',
    prepTime: 180,
    teamA: 'Pro',
    teamB: 'Con',
    showPrep: true,
    flightTime: null
  },
  'World Schools Debate (WSD)': {
    type: 'debate',
    prepTime: 900,
    teamA: 'Proposition',
    teamB: 'Opposition',
    showPrep: true,
    flightTime: null
  },
  'Parliamentary Debate (Parli)': {
    type: 'debate',
    prepTime: 900,
    teamA: 'Government',
    teamB: 'Opposition',
    showPrep: true,
    flightTime: null
  },
  'IPDA Debate': {
    type: 'debate',
    prepTime: 1800,
    teamA: 'Aff',
    teamB: 'Neg',
    showPrep: true,
    flightTime: null
  },
  'Extemporaneous Debate (EXD)': {
    type: 'debate',
    prepTime: 1800,
    teamA: 'Pro',
    teamB: 'Con',
    showPrep: true,
    flightTime: null
  },
  'Spar Debate': {
    type: 'debate',
    prepTime: 60,
    teamA: 'Pro',
    teamB: 'Con',
    showPrep: true,
    flightTime: null
  },
  'Mock Trial': {
    type: 'trial',
    prepTime: 0,
    teamA: 'Prosecution/Plaintiff',
    teamB: 'Defense',
    showPrep: false,
    flightTime: null
  },
  'United States Extemp (USX)': {
    type: 'speech',
    prepTime: 1800,
    teamA: 'Speaker',
    teamB: '',
    showPrep: true,
    flightTime: 420
  },
  'International Extemp (IX)': {
    type: 'speech',
    prepTime: 1800,
    teamA: 'Speaker',
    teamB: '',
    showPrep: true,
    flightTime: 420
  },
  'Impromptu Speaking': {
    type: 'speech',
    prepTime: 120,
    teamA: 'Speaker',
    teamB: '',
    showPrep: true,
    flightTime: 420
  },
  'default': {
    type: 'speech',
    prepTime: 0,
    teamA: 'Speaker',
    teamB: '',
    showPrep: false,
    flightTime: 600
  }
}

// Get format settings with defaults
export const getFormatSettings = (format) => {
  return formatSettings[format] || formatSettings.default
}

// Time limits for each event (max time in seconds)
export const eventTimeLimits = {
  // NSDA Main Events
  'Public Forum (PF)': { min: null, max: null }, // Per speech
  'Lincoln-Douglas (LD)': { min: null, max: null },
  'Policy Debate (CX)': { min: null, max: null },
  'Congressional Debate': { min: null, max: 180 },
  'Big Questions Debate (BQ)': { min: null, max: null },
  'World Schools Debate (WSD)': { min: null, max: null },
  'Original Oratory (OO)': { min: null, max: 600 },
  'Informative Speaking (INF)': { min: null, max: 600 },
  'United States Extemp (USX)': { min: null, max: 420 },
  'International Extemp (IX)': { min: null, max: 420 },
  'Impromptu Speaking': { min: null, max: 420 },
  'Dramatic Interpretation (DI)': { min: null, max: 600 },
  'Humorous Interpretation (HI)': { min: null, max: 600 },
  'Duo Interpretation': { min: null, max: 600 },
  'Program Oral Interpretation (POI)': { min: null, max: 600 },
  'Poetry Interpretation': { min: null, max: 420 },
  'Prose Interpretation': { min: null, max: 600 },
  // Supplemental
  'Expository Speaking': { min: null, max: 600 },
  'Storytelling': { min: 240, max: 360 },
  'Declamation': { min: null, max: 600 },
  'After Dinner Speaking (ADS)': { min: null, max: 600 },
  'default': { min: null, max: 600 }
}

// Rubrics for each format
export const rubrics = {
  // ==================== NSDA DEBATE RUBRICS ====================
  'Public Forum (PF)': `
### Public Forum Debate Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Evidence Quality** | 25% | Credibility, recency, and relevance of sources |
| **Argumentation** | 25% | Logic, warrants, and claim structure |
| **Clash & Refutation** | 20% | Direct engagement with opponent's arguments |
| **Impact Calculus** | 15% | Magnitude, probability, timeframe analysis |
| **Crossfire Performance** | 10% | Question quality and response effectiveness |
| **Delivery** | 5% | Clarity, persuasion, and professionalism |
  `,
  'Lincoln-Douglas (LD)': `
### Lincoln-Douglas Debate Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Value/Criterion Framework** | 25% | Clarity and application of philosophical framework |
| **Argumentation** | 25% | Logical structure and warrant quality |
| **Philosophical Depth** | 20% | Understanding and application of value concepts |
| **Clash & Refutation** | 15% | Direct engagement with opponent's framework and contentions |
| **Cross-Examination** | 10% | Strategic questioning and defense |
| **Delivery** | 5% | Persuasiveness and clarity |
  `,
  'Policy Debate (CX)': `
### Policy Debate Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Stock Issues** | 25% | Harms, Solvency, Inherency, Topicality, Significance |
| **Evidence Quality** | 25% | Source credibility, recency, and depth |
| **Flow/Organization** | 20% | Line-by-line refutation and organization |
| **Impact Analysis** | 15% | Terminal impact comparison and calculus |
| **Cross-Examination** | 10% | Strategic question use and defense |
| **Delivery** | 5% | Clarity (speed is acceptable if clear) |
  `,
  'Congressional Debate': `
### Congressional Debate Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Argumentation** | 30% | New analysis, evidence, and reasoning |
| **Refutation** | 25% | Direct engagement with previous speakers |
| **Rhetoric & Delivery** | 20% | Persuasion, style, and presence |
| **Parliamentary Procedure** | 15% | Knowledge and use of procedure |
| **Questioning** | 10% | Quality of questions asked |
  `,
  'Big Questions Debate (BQ)': `
### Big Questions Debate Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Philosophical Reasoning** | 30% | Depth of philosophical analysis |
| **Argumentation** | 25% | Logic, evidence, and warrant quality |
| **Refutation** | 20% | Direct engagement with opposing arguments |
| **Delivery** | 15% | Clarity and persuasiveness |
| **Q&A Performance** | 10% | Question quality and responses |
  `,
  'World Schools Debate (WSD)': `
### World Schools Debate Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Content** | 40% | Logic, relevance, and quality of arguments |
| **Style** | 40% | Rhetoric, delivery, tone, and persuasion |
| **Strategy** | 20% | Structure, timing, teamwork, and POI handling |
  `,
  
  // ==================== NSDA SPEECH RUBRICS ====================
  'Original Oratory (OO)': `
### Original Oratory Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Content & Originality** | 30% | Original thought, significance of topic |
| **Organization** | 20% | Clear structure, effective transitions |
| **Delivery** | 30% | Vocal variety, gestures, eye contact |
| **Persuasion** | 15% | Call to action effectiveness |
| **Memorability** | 5% | Lasting impact on audience |
  `,
  'Informative Speaking (INF)': `
### Informative Speaking Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Content & Research** | 35% | Educational value, accuracy, depth |
| **Organization** | 20% | Logical structure, clear transitions |
| **Visual Aids** | 15% | Effective use and integration |
| **Delivery** | 20% | Engagement, clarity, enthusiasm |
| **Originality** | 10% | Unique approach to topic |
  `,
  'United States Extemp (USX)': `
### United States Extemporaneous Speaking Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Analysis Depth** | 35% | Quality of reasoning and insight |
| **Evidence & Sources** | 25% | Citation quality, variety, recency |
| **Answering the Question** | 15% | Directly addresses the prompt |
| **Organization** | 15% | Clear structure with transitions |
| **Delivery** | 10% | Conversational, engaging, minimal notes |
  `,
  'International Extemp (IX)': `
### International Extemporaneous Speaking Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Analysis Depth** | 35% | Quality of reasoning and global insight |
| **Evidence & Sources** | 25% | International source variety and recency |
| **Answering the Question** | 15% | Directly addresses the prompt |
| **Organization** | 15% | Clear structure with transitions |
| **Delivery** | 10% | Conversational, engaging, minimal notes |
  `,
  'Impromptu Speaking': `
### Impromptu Speaking Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Quick Thinking** | 30% | Coherent thought formation under pressure |
| **Relevance** | 25% | Staying on topic, addressing the prompt |
| **Organization** | 20% | Clear structure despite limited prep |
| **Creativity** | 15% | Original examples, unique perspectives |
| **Delivery** | 10% | Confidence and fluidity |
  `,
  
  // ==================== NSDA INTERP RUBRICS ====================
  'Dramatic Interpretation (DI)': `
### Dramatic Interpretation Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Characterization** | 35% | Depth, believability, distinction |
| **Emotional Range** | 25% | Authenticity and appropriate intensity |
| **Material Selection** | 15% | Quality of cutting and thematic unity |
| **Technical Skill** | 15% | Blocking, pops, timing, focus |
| **Overall Impact** | 10% | Audience connection and memorability |
  `,
  'Humorous Interpretation (HI)': `
### Humorous Interpretation Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Characterization** | 30% | Distinct voices and physical comedy |
| **Comedic Timing** | 25% | Delivery of humor, pauses, reactions |
| **Material Selection** | 15% | Story arc, cutting, and humor quality |
| **Technical Skill** | 15% | Blocking, pops, character switches |
| **Overall Entertainment** | 15% | Audience engagement and laughter |
  `,
  'Duo Interpretation': `
### Duo Interpretation Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Chemistry/Interaction** | 30% | Timing, reactions, non-touching teamwork |
| **Characterization** | 25% | Distinct, believable characters |
| **Material Selection** | 15% | Cutting quality and thematic unity |
| **Blocking** | 20% | Creative use of space, movement |
| **Overall Impact** | 10% | Combined performance effect |
  `,
  'Program Oral Interpretation (POI)': `
### Program Oral Interpretation Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Program Unity** | 25% | Thematic coherence across selections |
| **Material Variety** | 20% | Balance of prose, poetry, and drama |
| **Characterization** | 20% | Character distinction within selections |
| **Binder Technique** | 15% | Professional use of the book |
| **Transitions** | 10% | Smooth connections between pieces |
| **Overall Impact** | 10% | Thematic message effectiveness |
  `,
  
  // ==================== SUPPLEMENTAL RUBRICS ====================
  'After Dinner Speaking (ADS)': `
### After Dinner Speaking Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Humor Quality** | 35% | Effectiveness and appropriateness of jokes |
| **Serious Message** | 25% | Underlying point and takeaway |
| **Organization** | 15% | Balance of humor and seriousness |
| **Delivery** | 20% | Timing, style, audience connection |
| **Memorability** | 5% | Lasting impression |
  `,
  'Parliamentary Debate (Parli)': `
### Parliamentary Debate Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Matter** | 40% | Content, logic, and argumentation |
| **Manner** | 40% | Style, delivery, and rhetoric |
| **Method** | 20% | Structure, organization, and strategy |
  `,
  'Mock Trial': `
### Mock Trial Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Legal Argument** | 30% | Understanding and application of law |
| **Examination Skill** | 25% | Direct and cross-examination technique |
| **Courtroom Presence** | 20% | Professionalism and demeanor |
| **Case Theory** | 15% | Coherent narrative and strategy |
| **Objections** | 10% | Appropriate use and response |
  `,
  
  'default': `
### General Evaluation Rubric
| Category | Weight | Description |
|----------|--------|-------------|
| **Content/Argumentation** | 35% | Logic, evidence, and structure |
| **Organization** | 20% | Clear structure and transitions |
| **Delivery** | 25% | Tone, pace, clarity, presence |
| **Engagement** | 15% | Audience connection |
| **Overall Impact** | 5% | Memorability and effectiveness |
  `
}

// Get rubric with default fallback
export const getRubric = (format) => {
  return rubrics[format] || rubrics.default
}
