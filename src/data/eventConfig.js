// Event-specific configuration for speech/debate analysis
// This defines how different event types should be evaluated
// NSDA Official Events + Supplemental Events

export const EVENT_CATEGORIES = {
  DEBATE: 'debate',
  INDIVIDUAL_SPEAKING: 'individual',
  INTERP: 'interp',
  EXTEMP: 'extemp',
  LIMITED_PREP: 'limited_prep',
  CONGRESS: 'congress',
  SUPPLEMENTAL: 'supplemental'
};

// Subcategories for UI organization
export const EVENT_SUBCATEGORIES = {
  // NSDA Debate
  'NSDA Main Debate': ['Public Forum (PF)', 'Lincoln-Douglas (LD)', 'Policy Debate (CX)', 'Congressional Debate'],
  'NSDA Supplemental Debate': ['Big Questions Debate (BQ)', 'World Schools Debate (WSD)'],
  
  // NSDA Speech
  'NSDA Platform': ['Original Oratory (OO)', 'Informative Speaking (INF)'],
  'NSDA Extemporaneous': ['United States Extemp (USX)', 'International Extemp (IX)'],
  'NSDA Limited Prep': ['Impromptu Speaking', 'Extemporaneous Debate (EXD)'],
  
  // NSDA Interp
  'NSDA Interp': ['Dramatic Interpretation (DI)', 'Humorous Interpretation (HI)', 'Duo Interpretation', 'Program Oral Interpretation (POI)'],
  'Supplemental Interp': ['Poetry Interpretation', 'Prose Interpretation', 'Children\'s Literature', 'Contemporary Issues'],
  
  // Supplemental/Regional
  'Supplemental Speech': ['Expository Speaking', 'Storytelling', 'Declamation', 'Oratorical Declamation', 'Rhetorical Criticism', 'Communication Analysis', 'After Dinner Speaking (ADS)', 'Broadcasting'],
  'Supplemental Debate': ['Parliamentary Debate (Parli)', 'IPDA Debate', 'NFA-LD', 'Mock Trial', 'Spar Debate'],
  'Other Events': ['Model UN Speech', 'Student Congress']
};

// Map speech types to their categories
export const eventCategoryMap = {
  // ==================== NSDA MAIN DEBATE EVENTS ====================
  'Public Forum (PF)': EVENT_CATEGORIES.DEBATE,
  'Lincoln-Douglas (LD)': EVENT_CATEGORIES.DEBATE,
  'Policy Debate (CX)': EVENT_CATEGORIES.DEBATE,
  'Congressional Debate': EVENT_CATEGORIES.CONGRESS,
  
  // ==================== NSDA SUPPLEMENTAL DEBATE ====================
  'Big Questions Debate (BQ)': EVENT_CATEGORIES.DEBATE,
  'World Schools Debate (WSD)': EVENT_CATEGORIES.DEBATE,
  
  // ==================== NSDA PLATFORM SPEAKING ====================
  'Original Oratory (OO)': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Informative Speaking (INF)': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  
  // ==================== NSDA EXTEMPORANEOUS ====================
  'United States Extemp (USX)': EVENT_CATEGORIES.EXTEMP,
  'International Extemp (IX)': EVENT_CATEGORIES.EXTEMP,
  'Extemporaneous Debate (EXD)': EVENT_CATEGORIES.DEBATE,
  
  // ==================== NSDA LIMITED PREP ====================
  'Impromptu Speaking': EVENT_CATEGORIES.LIMITED_PREP,
  
  // ==================== NSDA INTERPRETATION EVENTS ====================
  'Dramatic Interpretation (DI)': EVENT_CATEGORIES.INTERP,
  'Humorous Interpretation (HI)': EVENT_CATEGORIES.INTERP,
  'Duo Interpretation': EVENT_CATEGORIES.INTERP,
  'Program Oral Interpretation (POI)': EVENT_CATEGORIES.INTERP,
  
  // ==================== SUPPLEMENTAL INTERP ====================
  'Poetry Interpretation': EVENT_CATEGORIES.INTERP,
  'Prose Interpretation': EVENT_CATEGORIES.INTERP,
  'Children\'s Literature': EVENT_CATEGORIES.INTERP,
  'Contemporary Issues': EVENT_CATEGORIES.INTERP,
  
  // ==================== SUPPLEMENTAL SPEECH EVENTS ====================
  'Expository Speaking': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Storytelling': EVENT_CATEGORIES.INTERP,
  'Declamation': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Oratorical Declamation': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Rhetorical Criticism': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Communication Analysis': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'After Dinner Speaking (ADS)': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Broadcasting': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  
  // ==================== SUPPLEMENTAL DEBATE EVENTS ====================
  'Parliamentary Debate (Parli)': EVENT_CATEGORIES.DEBATE,
  'IPDA Debate': EVENT_CATEGORIES.DEBATE,
  'NFA-LD': EVENT_CATEGORIES.DEBATE,
  'Mock Trial': EVENT_CATEGORIES.DEBATE,
  'Spar Debate': EVENT_CATEGORIES.DEBATE,
  
  // ==================== OTHER REGIONAL EVENTS ====================
  'Model UN Speech': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Student Congress': EVENT_CATEGORIES.CONGRESS
};

// Event-specific rubrics
export const eventRubrics = {
  [EVENT_CATEGORIES.DEBATE]: {
    name: 'Debate',
    description: 'Competitive debate formats with opposing sides',
    showOpposingArguments: true,
    showClash: true,
    showRebuttals: true,
    showCrossEx: true,
    rubric: `
## Debate Evaluation Criteria

| Category | Weight | Description |
|----------|--------|-------------|
| **Argumentation & Evidence** | 30% | Quality of arguments, evidence strength, logical warrants |
| **Clash & Engagement** | 25% | Direct responses to opponent, refutation quality |
| **Impact Analysis** | 20% | Magnitude, probability, timeframe of impacts |
| **Strategy & Organization** | 15% | Speech structure, time allocation, flow |
| **Delivery** | 10% | Clarity, persuasion, pace (speed okay if clear) |
    `,
    focusAreas: [
      'Arguments for your position',
      'Responses to opposing arguments',
      'Evidence quality and sources',
      'Impact calculus',
      'Clash and refutation',
      'Cross-examination presence'
    ]
  },
  
  [EVENT_CATEGORIES.CONGRESS]: {
    name: 'Congressional Debate',
    description: 'Legislative debate simulation with parliamentary procedure',
    showOpposingArguments: true,
    showClash: true,
    showRebuttals: true,
    showCrossEx: false,
    rubric: `
## Congressional Debate Evaluation Criteria

| Category | Weight | Description |
|----------|--------|-------------|
| **Argumentation** | 30% | New analysis, original evidence, strong reasoning |
| **Refutation** | 25% | Direct engagement with previous speakers, weighing |
| **Rhetoric & Delivery** | 20% | Persuasion, style, gravitas, presence |
| **Parliamentary Procedure** | 15% | Knowledge and proper use of procedure |
| **Questioning** | 10% | Quality of questions posed to other speakers |
    `,
    focusAreas: [
      'New analysis and arguments',
      'Refutation of previous speakers',
      'Evidence quality and citations',
      'Parliamentary procedure usage',
      'Question quality',
      'Chamber engagement'
    ]
  },
  
  [EVENT_CATEGORIES.INDIVIDUAL_SPEAKING]: {
    name: 'Individual Speaking',
    description: 'Platform speaking events focused on original content',
    showOpposingArguments: false,
    showClash: false,
    showRebuttals: false,
    showCrossEx: false,
    rubric: `
## Individual Speaking Evaluation Criteria

| Category | Weight | Description |
|----------|--------|-------------|
| **Content & Research** | 30% | Depth of information, accuracy, relevance |
| **Organization** | 25% | Structure, transitions, logical flow |
| **Delivery** | 25% | Vocal variety, eye contact, gestures, presence |
| **Analysis & Insight** | 15% | Original thought, depth of understanding |
| **Impact & Memorability** | 5% | Audience engagement, lasting impression |
    `,
    focusAreas: [
      'Content clarity and accuracy',
      'Speech organization and structure',
      'Vocal delivery and variety',
      'Physical presence and gestures',
      'Audience engagement',
      'Use of evidence and examples'
    ]
  },
  
  [EVENT_CATEGORIES.INTERP]: {
    name: 'Interpretation',
    description: 'Performance events with scripted or literary material',
    showOpposingArguments: false,
    showClash: false,
    showRebuttals: false,
    showCrossEx: false,
    rubric: `
## Interpretation Evaluation Criteria

| Category | Weight | Description |
|----------|--------|-------------|
| **Characterization** | 30% | Distinct, consistent, believable characters |
| **Emotional Range** | 25% | Depth of emotion, appropriate intensity |
| **Technical Skill** | 20% | Blocking, pops, timing, focus |
| **Material Selection** | 15% | Quality of cutting, thematic unity |
| **Overall Impact** | 10% | Audience connection, memorability |
    `,
    focusAreas: [
      'Character development and distinction',
      'Emotional authenticity',
      'Physical performance (blocking, gestures)',
      'Vocal variety and character voices',
      'Timing and pacing',
      'Thematic development'
    ]
  },
  
  [EVENT_CATEGORIES.EXTEMP]: {
    name: 'Extemporaneous Speaking',
    description: 'Current events analysis with limited prep time',
    showOpposingArguments: false,
    showClash: false,
    showRebuttals: false,
    showCrossEx: false,
    rubric: `
## Extemporaneous Speaking Evaluation Criteria

| Category | Weight | Description |
|----------|--------|-------------|
| **Analysis Depth** | 30% | Quality of reasoning, insight into topic |
| **Evidence & Sources** | 25% | Citation quality, recency, variety |
| **Organization** | 20% | Clear structure, strong transitions |
| **Answering the Question** | 15% | Directly addresses the prompt |
| **Delivery** | 10% | Conversational, engaging, minimal notes |
    `,
    focusAreas: [
      'Direct answer to the question',
      'Analysis depth and insight',
      'Evidence and source citations',
      'Current events knowledge',
      'Logical organization',
      'Conversational delivery'
    ]
  },
  
  [EVENT_CATEGORIES.LIMITED_PREP]: {
    name: 'Limited Preparation',
    description: 'Impromptu speaking with minimal prep time',
    showOpposingArguments: false,
    showClash: false,
    showRebuttals: false,
    showCrossEx: false,
    rubric: `
## Impromptu Speaking Evaluation Criteria

| Category | Weight | Description |
|----------|--------|-------------|
| **Quick Thinking** | 30% | Ability to form coherent thoughts rapidly |
| **Relevance** | 25% | Staying on topic, addressing the prompt |
| **Organization** | 20% | Clear structure despite limited prep |
| **Creativity** | 15% | Original examples, unique perspectives |
| **Delivery** | 10% | Confident, fluid despite improvisation |
    `,
    focusAreas: [
      'Response relevance to prompt',
      'Quick organization of thoughts',
      'Creative examples and analogies',
      'Confident delivery',
      'Time management',
      'Coherent structure'
    ]
  },
  
  [EVENT_CATEGORIES.SUPPLEMENTAL]: {
    name: 'Supplemental Events',
    description: 'Regional and supplemental competitive events',
    showOpposingArguments: false,
    showClash: false,
    showRebuttals: false,
    showCrossEx: false,
    rubric: `
## Supplemental Event Evaluation Criteria

| Category | Weight | Description |
|----------|--------|-------------|
| **Event-Specific Skills** | 35% | Mastery of event-specific requirements |
| **Content Quality** | 25% | Accuracy, depth, and relevance |
| **Delivery** | 25% | Presentation skills appropriate to event |
| **Organization** | 15% | Structure and logical flow |
    `,
    focusAreas: [
      'Event-specific requirements',
      'Content quality and accuracy',
      'Appropriate delivery style',
      'Structural organization',
      'Audience engagement'
    ]
  }
};

// Get event configuration for a specific speech type
export const getEventConfig = (speechType) => {
  const category = eventCategoryMap[speechType] || EVENT_CATEGORIES.INDIVIDUAL_SPEAKING;
  return eventRubrics[category];
};

// Get sides/positions applicable for each event category
export const getApplicableSides = (speechType) => {
  const category = eventCategoryMap[speechType];
  
  if (category === EVENT_CATEGORIES.DEBATE) {
    // Standard debate sides
    if (speechType.includes('Parliament') || speechType.includes('Parli')) {
      return [
        'Prime Minister',
        'Leader of Opposition', 
        'Member of Government',
        'Member of Opposition',
        'Government Whip',
        'Opposition Whip'
      ];
    }
    if (speechType.includes('Policy') || speechType === 'NFA-LD') {
      return [
        'Affirmative',
        'Negative'
      ];
    }
    if (speechType.includes('World Schools')) {
      return [
        '1st Proposition',
        '2nd Proposition', 
        '3rd Proposition',
        '1st Opposition',
        '2nd Opposition',
        '3rd Opposition',
        'Reply Speaker'
      ];
    }
    if (speechType === 'Mock Trial') {
      return [
        'Prosecution',
        'Defense',
        'Plaintiff',
        'Witness'
      ];
    }
    // Default debate (PF, LD, BQ, etc.)
    return [
      'Pro/Affirmative',
      'Con/Negative'
    ];
  }
  
  if (category === EVENT_CATEGORIES.CONGRESS) {
    return [
      'Author/Sponsor',
      'First Pro',
      'First Con',
      'Subsequent Pro',
      'Subsequent Con',
      'Presiding Officer',
      'Questioner'
    ];
  }
  
  // Non-debate events
  return [
    'Individual/Solo',
    'Neutral/Evaluator'
  ];
};

// Get all events for a subcategory
export const getEventsForSubcategory = (subcategory) => {
  return EVENT_SUBCATEGORIES[subcategory] || [];
};

// Get all subcategory names
export const getAllSubcategories = () => Object.keys(EVENT_SUBCATEGORIES);

// Find which subcategory an event belongs to
export const getSubcategoryForEvent = (eventName) => {
  for (const [subcategory, events] of Object.entries(EVENT_SUBCATEGORIES)) {
    if (events.includes(eventName)) {
      return subcategory;
    }
  }
  return 'Other Events';
};

// Get main category (NSDA vs Supplemental) for an event
export const getMainCategoryForEvent = (eventName) => {
  const subcategory = getSubcategoryForEvent(eventName);
  if (subcategory.startsWith('NSDA')) return 'NSDA Events';
  if (subcategory.startsWith('Supplemental')) return 'Supplemental Events';
  return 'Other';
};

// Generate event-specific prompt
export const generateEventPrompt = (speechType, topic, side, transcript) => {
  const config = getEventConfig(speechType);
  const category = eventCategoryMap[speechType];
  
  let basePrompt = `You are an expert ${speechType} coach and judge with years of experience evaluating this specific event type.`;
  
  if (topic) {
    basePrompt += `\nTopic/Prompt: ${topic}`;
  }
  
  if (config.showOpposingArguments && side) {
    basePrompt += `\nSide/Position: ${side}`;
  }
  
  basePrompt += `\n\nEvaluate the following speech based on this event-specific rubric:\n${config.rubric}`;
  
  // Add event-specific instructions
  if (category === EVENT_CATEGORIES.DEBATE) {
    basePrompt += `\n\n### DEBATE-SPECIFIC ANALYSIS:
- Analyze the strength and clarity of each argument presented
- Identify potential opposing arguments and how well they were preempted or addressed
- Evaluate evidence quality and proper citation
- Assess impact calculus (magnitude, probability, timeframe)
- Note clash quality and direct engagement with opposing points
- Consider cross-examination strategy if applicable`;
  } else if (category === EVENT_CATEGORIES.CONGRESS) {
    basePrompt += `\n\n### CONGRESSIONAL DEBATE-SPECIFIC ANALYSIS:
- Evaluate whether the speech presents NEW analysis or merely rehashes previous points
- Assess direct refutation of previous speakers in the chamber
- Analyze quality of evidence and source citations
- Evaluate use of parliamentary procedure and decorum
- Consider rhetorical effectiveness and gravitas
- Note quality of questions asked during Q&A period
- Assess chamber engagement and awareness of debate flow`;
  } else if (category === EVENT_CATEGORIES.INDIVIDUAL_SPEAKING) {
    basePrompt += `\n\n### INDIVIDUAL SPEAKING-SPECIFIC ANALYSIS:
- Focus on content clarity and information accuracy
- Do NOT analyze opposing arguments (this is not a debate event)
- Evaluate speech organization and flow
- Assess delivery techniques (vocal variety, gestures, eye contact)
- Consider audience engagement and persuasive techniques
- NOTE: Do not penalize for missing visual aids or props (text-only evaluation)`;
  } else if (category === EVENT_CATEGORIES.INTERP) {
    basePrompt += `\n\n### INTERPRETATION-SPECIFIC ANALYSIS:
- Evaluate character development and distinction between characters
- Assess emotional authenticity and range
- Analyze physical performance elements described
- Consider pacing and timing
- Note thematic development and material selection quality
- Do NOT analyze arguments or debate elements (this is a performance event)`;
  } else if (category === EVENT_CATEGORIES.EXTEMP) {
    basePrompt += `\n\n### EXTEMP-SPECIFIC ANALYSIS:
- Evaluate how directly the question/prompt is answered
- Assess depth of analysis on current events
- Check quality and recency of evidence cited
- Consider organization and structure
- Note delivery style (should be conversational, not memorized)
- Do NOT analyze debate clash (this is not a debate event)`;
  } else if (category === EVENT_CATEGORIES.LIMITED_PREP) {
    basePrompt += `\n\n### IMPROMPTU-SPECIFIC ANALYSIS:
- Evaluate quick thinking and coherent thought formation
- Assess relevance to the prompt given
- Consider organization despite limited preparation time
- Note creative examples and unique perspectives
- Evaluate confidence and delivery fluidity
- Be understanding of minor hesitations given the time constraints`;
  }
  
  basePrompt += `\n\nPlease provide the output in the following Markdown format:

## Executive Summary
(Brief 2-3 sentence overview of overall performance)

## Scorecard
| Category | Score (0-10) | Notes |
| --- | --- | --- |
(Fill based on the rubric above)
| **Total** | **(Average/Sum)** | |

## Key ${category === EVENT_CATEGORIES.DEBATE || category === EVENT_CATEGORIES.CONGRESS ? 'Argument' : 'Content'} Analysis
(Detailed breakdown of main points made)
${config.showOpposingArguments ? '\n## Opposing Arguments & Clash\n(Analysis of responses to opponent arguments and missed clash opportunities)' : ''}

## Constructive Feedback
- **Strengths**: ...
- **Areas for Improvement**: ...

## Recommended Drills
(3-5 specific exercises to improve weak areas, tailored to this event type)

## Quick Tips for Next Round
(2-3 actionable items for immediate improvement)

SPEECH TEXT:
${transcript}`;

  return basePrompt;
};

// UI labels for event categories
export const EVENT_CATEGORY_LABELS = {
  [EVENT_CATEGORIES.DEBATE]: {
    label: 'Debate Events',
    icon: '⚔️',
    color: 'text-red-400'
  },
  [EVENT_CATEGORIES.CONGRESS]: {
    label: 'Congressional Debate',
    icon: '🏛️',
    color: 'text-amber-400'
  },
  [EVENT_CATEGORIES.INDIVIDUAL_SPEAKING]: {
    label: 'Individual Speaking',
    icon: '🎤',
    color: 'text-blue-400'
  },
  [EVENT_CATEGORIES.INTERP]: {
    label: 'Interpretation',
    icon: '🎭',
    color: 'text-purple-400'
  },
  [EVENT_CATEGORIES.EXTEMP]: {
    label: 'Extemporaneous',
    icon: '📰',
    color: 'text-green-400'
  },
  [EVENT_CATEGORIES.LIMITED_PREP]: {
    label: 'Limited Prep',
    icon: '⚡',
    color: 'text-yellow-400'
  },
  [EVENT_CATEGORIES.SUPPLEMENTAL]: {
    label: 'Supplemental Events',
    icon: '📋',
    color: 'text-gray-400'
  }
};

// Group speech types by category for UI display
export const getSpeechTypesByCategory = () => {
  const grouped = {};
  
  Object.entries(eventCategoryMap).forEach(([speechType, category]) => {
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(speechType);
  });
  
  return grouped;
};

// Get speech types organized by subcategory (for hierarchical UI)
export const getSpeechTypesBySubcategory = () => {
  return EVENT_SUBCATEGORIES;
};

// Get all available speech types as flat array
export const getAllSpeechTypes = () => {
  return Object.keys(eventCategoryMap);
};

// Check if an event is an NSDA main event
export const isNSDAMainEvent = (eventName) => {
  const mainNSDA = [
    'Public Forum (PF)', 'Lincoln-Douglas (LD)', 'Policy Debate (CX)', 'Congressional Debate',
    'Original Oratory (OO)', 'Informative Speaking (INF)',
    'United States Extemp (USX)', 'International Extemp (IX)', 'Impromptu Speaking',
    'Dramatic Interpretation (DI)', 'Humorous Interpretation (HI)', 'Duo Interpretation', 'Program Oral Interpretation (POI)'
  ];
  return mainNSDA.includes(eventName);
};

// Get event description
export const getEventDescription = (eventName) => {
  const descriptions = {
    // NSDA Debate
    'Public Forum (PF)': 'Two-person team debate on current events topics. Accessible format with crossfire Q&A.',
    'Lincoln-Douglas (LD)': 'One-on-one values-based debate exploring philosophical frameworks.',
    'Policy Debate (CX)': 'Two-person team policy debate with extensive evidence and complex arguments.',
    'Congressional Debate': 'Legislative debate simulation with parliamentary procedure.',
    'Big Questions Debate (BQ)': 'Philosophical debate format exploring fundamental questions.',
    'World Schools Debate (WSD)': 'Three-person team debate following international style.',
    
    // NSDA Speech
    'Original Oratory (OO)': 'Original persuasive speech written and memorized by the student.',
    'Informative Speaking (INF)': 'Original educational speech with visual aids.',
    'United States Extemp (USX)': 'Limited-prep speech on US domestic political topics.',
    'International Extemp (IX)': 'Limited-prep speech on international affairs.',
    'Impromptu Speaking': 'Minimal-prep speech on abstract prompts (quotes, words, etc.).',
    'Extemporaneous Debate (EXD)': 'Limited-prep debate format with 30 min prep time.',
    
    // NSDA Interp
    'Dramatic Interpretation (DI)': 'Solo dramatic performance from published literature.',
    'Humorous Interpretation (HI)': 'Solo comedic performance from published literature.',
    'Duo Interpretation': 'Two-person performance without touching or looking at partner.',
    'Program Oral Interpretation (POI)': 'Thematic program combining poetry, prose, and drama.',
    
    // Supplemental
    'Poetry Interpretation': 'Performance of published poetry.',
    'Prose Interpretation': 'Performance of published prose literature.',
    'Declamation': 'Memorized delivery of a previously published speech.',
    'After Dinner Speaking (ADS)': 'Humorous speech with a serious underlying message.',
    'Parliamentary Debate (Parli)': 'Team debate format with minimal prep time.',
    'Mock Trial': 'Courtroom simulation with witness examinations and arguments.',
    'Storytelling': 'Narrative performance of a children\'s story.'
  };
  return descriptions[eventName] || 'Competitive speech or debate event.';
};
