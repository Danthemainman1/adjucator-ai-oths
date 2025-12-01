// ==================== NSDA OFFICIAL & SUPPLEMENTAL EVENTS ====================
// Comprehensive list of all supported events organized by category

export const speechTypes = [
    // NSDA Main Debate Events
    'Public Forum (PF)', 
    'Lincoln-Douglas (LD)', 
    'Policy Debate (CX)', 
    'Congressional Debate',
    
    // NSDA Supplemental Debate
    'Big Questions Debate (BQ)',
    'World Schools Debate (WSD)',
    
    // NSDA Platform Speaking
    'Original Oratory (OO)', 
    'Informative Speaking (INF)',
    
    // NSDA Extemporaneous
    'United States Extemp (USX)', 
    'International Extemp (IX)',
    'Extemporaneous Debate (EXD)',
    
    // NSDA Limited Prep
    'Impromptu Speaking',
    
    // NSDA Interpretation
    'Dramatic Interpretation (DI)',
    'Humorous Interpretation (HI)', 
    'Duo Interpretation', 
    'Program Oral Interpretation (POI)',
    
    // Supplemental Interp
    'Poetry Interpretation',
    'Prose Interpretation',
    'Children\'s Literature',
    'Contemporary Issues',
    
    // Supplemental Speech
    'Expository Speaking',
    'Storytelling',
    'Declamation',
    'Oratorical Declamation',
    'Rhetorical Criticism',
    'Communication Analysis',
    'After Dinner Speaking (ADS)',
    'Broadcasting',
    
    // Supplemental Debate
    'Parliamentary Debate (Parli)',
    'IPDA Debate',
    'NFA-LD',
    'Mock Trial',
    'Spar Debate',
    
    // Other Regional
    'Model UN Speech',
    'Student Congress'
];

// Organized by category for dropdown menus
export const speechTypesByCategory = {
    'NSDA Debate': [
        'Public Forum (PF)', 
        'Lincoln-Douglas (LD)', 
        'Policy Debate (CX)', 
        'Congressional Debate',
        'Big Questions Debate (BQ)',
        'World Schools Debate (WSD)'
    ],
    'NSDA Speech': [
        'Original Oratory (OO)', 
        'Informative Speaking (INF)',
        'United States Extemp (USX)', 
        'International Extemp (IX)',
        'Impromptu Speaking',
        'Extemporaneous Debate (EXD)'
    ],
    'NSDA Interpretation': [
        'Dramatic Interpretation (DI)',
        'Humorous Interpretation (HI)', 
        'Duo Interpretation', 
        'Program Oral Interpretation (POI)'
    ],
    'Supplemental Interp': [
        'Poetry Interpretation',
        'Prose Interpretation',
        'Children\'s Literature',
        'Contemporary Issues',
        'Storytelling'
    ],
    'Supplemental Speech': [
        'Expository Speaking',
        'Declamation',
        'Oratorical Declamation',
        'Rhetorical Criticism',
        'Communication Analysis',
        'After Dinner Speaking (ADS)',
        'Broadcasting'
    ],
    'Supplemental Debate': [
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
};

export const sides = [
    // Standard Debate
    'Pro/Affirmative', 
    'Con/Negative', 
    'Affirmative',
    'Negative',
    
    // Parliamentary
    'Prime Minister',
    'Leader of Opposition',
    'Member of Government', 
    'Member of Opposition',
    'Government Whip',
    'Opposition Whip',
    
    // World Schools
    '1st Proposition',
    '2nd Proposition',
    '3rd Proposition',
    '1st Opposition',
    '2nd Opposition',
    '3rd Opposition',
    'Reply Speaker',
    
    // Congressional Debate
    'Author/Sponsor',
    'First Pro',
    'First Con',
    'Subsequent Pro',
    'Subsequent Con',
    'Presiding Officer',
    'Questioner',
    
    // Mock Trial
    'Prosecution',
    'Defense',
    'Plaintiff',
    'Witness',
    
    // Individual Events
    'Individual/Solo', 
    'Neutral/Evaluator'
];

// Get sides relevant for a specific event
export const getSidesForEvent = (eventName) => {
    if (eventName.includes('Parliament') || eventName.includes('Parli')) {
        return ['Prime Minister', 'Leader of Opposition', 'Member of Government', 'Member of Opposition'];
    }
    if (eventName.includes('World Schools')) {
        return ['1st Proposition', '2nd Proposition', '3rd Proposition', '1st Opposition', '2nd Opposition', '3rd Opposition', 'Reply Speaker'];
    }
    if (eventName.includes('Congress') || eventName === 'Student Congress') {
        return ['Author/Sponsor', 'First Pro', 'First Con', 'Subsequent Pro', 'Subsequent Con', 'Presiding Officer'];
    }
    if (eventName === 'Mock Trial') {
        return ['Prosecution', 'Defense', 'Plaintiff', 'Witness'];
    }
    if (eventName.includes('Forum') || eventName.includes('LD') || eventName.includes('Policy') || eventName.includes('Debate')) {
        return ['Pro/Affirmative', 'Con/Negative'];
    }
    return ['Individual/Solo', 'Neutral/Evaluator'];
};

export const rubrics = {
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
};
