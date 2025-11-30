// Event-specific configuration for speech/debate analysis
// This defines how different event types should be evaluated

export const EVENT_CATEGORIES = {
  DEBATE: 'debate',
  INDIVIDUAL_SPEAKING: 'individual',
  INTERP: 'interp',
  EXTEMP: 'extemp',
  LIMITED_PREP: 'limited_prep'
};

// Map speech types to their categories
export const eventCategoryMap = {
  // Debate Events (include opposing arguments, clash, rebuttals)
  'Public Forum (PF)': EVENT_CATEGORIES.DEBATE,
  'Lincoln-Douglas (LD)': EVENT_CATEGORIES.DEBATE,
  'Policy Debate (CX)': EVENT_CATEGORIES.DEBATE,
  'Big Questions Debate': EVENT_CATEGORIES.DEBATE,
  'World Schools Debate': EVENT_CATEGORIES.DEBATE,
  'Congressional Debate': EVENT_CATEGORIES.DEBATE,
  'Parliamentary (British)': EVENT_CATEGORIES.DEBATE,
  'Parliamentary (Asian)': EVENT_CATEGORIES.DEBATE,
  
  // Individual Speaking Events (focus on delivery, content, organization)
  'Original Oratory (OO)': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Informative Speaking (INFO)': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Expository': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'After Dinner Speaking': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Toast/Ceremonial': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  'Model UN Speech': EVENT_CATEGORIES.INDIVIDUAL_SPEAKING,
  
  // Interpretation Events (focus on performance, character, emotion)
  'Dramatic Interpretation (DI)': EVENT_CATEGORIES.INTERP,
  'Humorous Interpretation (HI)': EVENT_CATEGORIES.INTERP,
  'Duo Interpretation': EVENT_CATEGORIES.INTERP,
  'Program Oral Interpretation (POI)': EVENT_CATEGORIES.INTERP,
  'Prose/Poetry': EVENT_CATEGORIES.INTERP,
  'Storytelling': EVENT_CATEGORIES.INTERP,
  
  // Extemporaneous Speaking (focus on research, current events, analysis)
  'United States Extemp (USX)': EVENT_CATEGORIES.EXTEMP,
  'International Extemp (IX)': EVENT_CATEGORIES.EXTEMP,
  'Extemporaneous Commentary': EVENT_CATEGORIES.EXTEMP,
  
  // Limited Prep Events (focus on quick thinking, organization)
  'Impromptu': EVENT_CATEGORIES.LIMITED_PREP
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
    // Filter to only debate-relevant sides
    return [
      'Proposition/Affirmative',
      'Opposition/Negative',
      'Government',
      'Opposition',
      'Pro',
      'Con',
      'Opening Member',
      'Closing Member/Whip',
      'Sponsor (Congress)'
    ];
  }
  
  // Non-debate events
  return [
    'Individual/Solo',
    'Neutral/Evaluator'
  ];
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

## Key ${category === EVENT_CATEGORIES.DEBATE ? 'Argument' : 'Content'} Analysis
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
