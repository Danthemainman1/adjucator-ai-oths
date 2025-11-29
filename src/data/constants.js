export const speechTypes = [
    'Public Forum (PF)', 'Lincoln-Douglas (LD)', 'Policy Debate (CX)', 'Big Questions Debate',
    'World Schools Debate', 'Congressional Debate', 'Original Oratory (OO)', 'Informative Speaking (INFO)',
    'United States Extemp (USX)', 'International Extemp (IX)', 'Dramatic Interpretation (DI)',
    'Humorous Interpretation (HI)', 'Duo Interpretation', 'Program Oral Interpretation (POI)',
    'Impromptu', 'Extemporaneous Commentary', 'Expository', 'Storytelling', 'Prose/Poetry',
    'Parliamentary (British)', 'Parliamentary (Asian)', 'Model UN Speech', 'After Dinner Speaking', 'Toast/Ceremonial'
];

export const sides = [
    'Proposition/Affirmative', 'Opposition/Negative', 'Government', 'Opposition',
    'Pro', 'Con', 'Opening Member', 'Closing Member/Whip', 'Sponsor (Congress)',
    'Individual/Solo', 'Neutral/Evaluator'
];

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
    'default': `
        - **Argumentation (40%)**: Logic, evidence, structure.
        - **Delivery (30%)**: Tone, pace, clarity.
        - **Strategy (20%)**: Time management, focus.
        - **Responsiveness (10%)**: Engagement with the topic.
    `
};
