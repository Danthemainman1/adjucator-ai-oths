// AI API utilities

const GEMINI_MODELS = ['gemini-2.0-flash-exp', 'gemini-1.5-flash']

export async function callGeminiAPI(apiKey, prompt, images = []) {
  for (const model of GEMINI_MODELS) {
    try {
      const parts = [{ text: prompt }]
      
      // Add images if provided
      if (images.length > 0) {
        images.forEach(img => {
          if (img.base64) {
            parts.push({
              inline_data: {
                mime_type: img.mimeType || 'image/jpeg',
                data: img.base64
              }
            })
          }
        })
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts }] })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (model === GEMINI_MODELS[GEMINI_MODELS.length - 1]) {
          throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`)
        }
        continue
      }

      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    } catch (e) {
      if (model === GEMINI_MODELS[GEMINI_MODELS.length - 1]) throw e
    }
  }
}

export async function callGeminiWithAudio(apiKey, prompt, audioBase64) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'audio/webm',
                data: audioBase64
              }
            }
          ]
        }]
      })
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export async function callOpenAI(apiKey, prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000
    })
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(`OpenAI API Error: ${errData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function verifyApiKey(provider, key) {
  try {
    if (provider === 'gemini') {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
      )
      return response.ok
    } else {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${key}` }
      })
      return response.ok
    }
  } catch {
    return false
  }
}

// Prompt templates
export function buildAnalysisPrompt(type, format, side, topic, rubric) {
  const basePrompt = `You are an expert Debate Adjudicator for ${format}. 
Topic: ${topic}. Side: ${side}.

Evaluate the following ${type === 'speech' ? 'speech' : type === 'board' ? 'debate flow/board' : 'audio recording'} based on this rubric:
${rubric}

IMPORTANT: Do NOT penalize for missing visual aids, boards, or props, as this is a text-only evaluation.

Please provide the output in the following Markdown format:

## Executive Summary
(Brief overview of performance - 2-3 sentences)

## Scorecard
| Category | Score (0-10) | Notes |
| --- | --- | --- |
(Fill based on rubric categories)
| **Total** | **(Sum/Max)** | |

## Radar Data
\`\`\`json
{"Argumentation": 8, "Delivery": 7, "Evidence": 8, "Strategy": 7, "Clash": 8}
\`\`\`
(Provide a JSON object with scores for each main category)

## Key Argument Analysis
- Point 1 analysis...
- Point 2 analysis...
(Bullet points on specific arguments made)

## Strengths
- Strength 1...
- Strength 2...

## Areas for Improvement
- Area 1 with specific suggestion...
- Area 2 with specific suggestion...

## Recommended Drills
1. Specific exercise 1...
2. Specific exercise 2...
(2-3 exercises to improve weak areas)

## Transcript Highlights
(If applicable, quote 2-3 specific phrases from the speech that were particularly effective or need work, using > blockquote format)
`
  return basePrompt
}

export function buildStrategyPrompt(format, side, topic) {
  return `Act as an expert Debate Coach. For the topic "${topic}" and side "${side}" in ${format} format, generate a comprehensive debate strategy.

Please provide:

## Strategic Overview
Brief overview of the best approach for this position.

## Main Arguments (3-4)
For each argument:
### Argument 1: [Title]
- **Claim**: The main assertion
- **Warrant**: The logical reasoning
- **Impact**: Why this matters (magnitude, timeframe, probability)
- **Key Evidence**: Type of evidence needed

## Anticipated Opponent Arguments
- Expected argument 1 and brief response strategy
- Expected argument 2 and brief response strategy

## Cross-Examination Strategy
Key questions to ask and prepare for.

## Flow Layout Visualization
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    FLOW BOARD LAYOUT                        │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ CONSTRUCTIVE │   REBUTTAL   │   SUMMARY    │  FINAL FOCUS  │
├──────────────┼──────────────┼──────────────┼───────────────┤
│ Arg 1:       │ Response:    │ Extend:      │ Voter 1:      │
│ [Title]      │              │              │               │
│              │              │              │               │
├──────────────┼──────────────┼──────────────┼───────────────┤
│ Arg 2:       │ Response:    │ Extend:      │ Voter 2:      │
│ [Title]      │              │              │               │
└──────────────┴──────────────┴──────────────┴───────────────┘
\`\`\`

## Key "Win Conditions"
What must be achieved to win this round.

## Time Allocation Guide
How to allocate time across different speeches.
`
}

export function buildBoardEvalPrompt(format, side, topic, description) {
  return `As an expert Debate Coach specializing in flowing technique, evaluate this debate board/flow image(s).

Context:
- Format: ${format}
- Side: ${side}
- Topic: ${topic}
- User Notes: ${description}

Please evaluate:

## Overall Assessment
Brief overview of the flow quality.

## Organization Score: X/10
- Column structure analysis
- Argument grouping
- Visual hierarchy

## Legibility Score: X/10
- Handwriting/text clarity
- Color usage effectiveness
- Spacing and layout

## Strategic Completeness: X/10
- Are all key arguments captured?
- Response tracking
- Impact extensions

## Specific Feedback
### What's Working Well
- Point 1...
- Point 2...

### Areas to Improve
- Specific issue 1 with solution...
- Specific issue 2 with solution...

## Recommended Flow Technique
Tips for better flowing in this format.
`
}

export function buildSparringPrompt(format, topic, side, userArgument, difficulty) {
  const opponentSide = side.includes('Affirmative') || side.includes('Pro') 
    ? 'Opposition/Negative' 
    : 'Proposition/Affirmative'
  
  return `You are a competitive debater practicing as the ${opponentSide} side in a ${format} debate on "${topic}".

Difficulty Level: ${difficulty}

The opponent (${side}) just made this argument:
"${userArgument}"

Respond as their opponent would in a real debate round:
1. Directly address their argument (don't ignore it)
2. Provide a counter-argument or rebuttal
3. Keep response to 60-90 seconds of speaking (about 150-200 words)
4. ${difficulty === 'Hard' ? 'Use advanced techniques like turns, kritiks, or theory if applicable' : 'Use clear, accessible argumentation'}

Format your response as if speaking in a round:
`
}

export function buildDrillPrompt(skillArea, format, difficulty) {
  return `Generate a practice drill for ${skillArea} skills in ${format} debate.

Difficulty: ${difficulty}

Provide:
## Drill: [Creative Name]

### Objective
What skill this develops.

### Setup
What the student needs to do to prepare.

### Exercise
Step-by-step instructions.

### Time Limit
How long each part should take.

### Self-Evaluation Criteria
How to know if they did well.

### Example Response
A sample of what good performance looks like.

### Variations
2-3 ways to make this harder or adapt it.
`
}

// Parse radar data from AI response
export function parseRadarData(content) {
  try {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                     content.match(/Radar Data[:\s]*(\{[^}]+\})/i)
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1].trim()
      const data = JSON.parse(jsonStr)
      return Object.entries(data).map(([key, value]) => ({
        subject: key,
        A: typeof value === 'number' ? value : parseInt(value) || 5,
        fullMark: 10
      }))
    }
  } catch (e) {
    console.error('Error parsing radar data:', e)
  }
  return null
}

// Alias for callOpenAI
export const callOpenAIAPI = callOpenAI
