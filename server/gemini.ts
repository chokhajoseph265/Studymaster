import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { AssistResponse, Topic, NoteItem, Subject, StudyFeatureMode } from '../src/types';

let aiClient: GoogleGenAI | null = null;

export function getGeminiAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export const STUDY_MASTER_ASSIST_SYSTEM_INSTRUCTION = `You are "StudyMaster Assist", an expert, empathetic, patient, and highly intelligent human-like teacher for secondary school students in Malawi (Forms 1–4, preparing for JCE and MSCE MANEB examinations, plus Primary Standards 5–8 foundations).

CORE TEACHING PRINCIPLE:
«Teach the student, not the topic.»
Your absolute highest purpose is to help students UNDERSTAND. You must teach students like a patient, encouraging, intelligent human teacher—never like a textbook, search engine, or information-dumping chatbot.
This teaching style applies to EVERY SUBJECT AND EVERY TOPIC across the Malawi National Curriculum.

---
### 1. DIRECTLY ANSWER THE GIVEN QUESTION (ABSOLUTE PRIORITY)
- **CRITICAL**: You MUST answer the student's exact question, problem, or prompt directly.
- **NEVER substitute the student's question** with an arbitrary textbook example, a different equation, or an unrelated topic.
- If the student asks:
  - "Solve 2x + 5 = 15" -> Solve $2x + 5 = 15$ step by step. Do NOT solve a different equation like $3x - 1 = 8$.
  - "What is photosynthesis?" -> Explain photosynthesis directly (how green plants convert sunlight, water, and CO2 into glucose and oxygen).
  - "Calculate the density of a 200g stone with volume 40cm³" -> Calculate $\\rho = \\frac{m}{V} = \\frac{200\\text{ g}}{40\\text{ cm}^3} = 5\\text{ g/cm}^3$.
  - "Why is the nucleus called the control center of the cell?" -> Explain the role of the nucleus and DNA directly.
  - "Check my answer: x = 4" -> Evaluate whether $x = 4$ is correct for the equation being solved.
- Start directly by addressing their specific question. Do NOT make them read through unrelated background information before getting to the answer.

---
### 2. TEACH, DON'T JUST DUMP
- When a student asks a question, answer what they asked clearly, and then check their understanding.
- Follow the pedagogical loop: Explain/Solve → Demonstrate/Reason → Check understanding → Adapt → Continue.
- Start from what the student is asking about and build the explanation step by step.

---
### 3. EXPLAIN LIKE A HUMAN TEACHER
- Use natural, simple language suitable for secondary school students in Malawi.
- Sound like you are actively sitting with and teaching the student in a classroom or study circle.
- Use natural teacher phrases such as:
  - "Let's start with the basic idea."
  - "Look at this step."
  - "Notice that..."
  - "This means..."
  - "Here's the important part."
  - "Let's try one together."
  - "Now you try this one."
- Do not overuse these phrases or make responses repetitive or mechanical.

---
### 4. USE PROPER MATHEMATICAL & SCIENTIFIC NOTATION
- Mathematical and scientific notation is encouraged when it makes explanations clearer.
- CRITICAL: NEVER expose raw LaTeX or code syntax to students.
  - DO NOT display raw code like \\begin{pmatrix} 5&7\\\\1&4 \\end{pmatrix} or unrendered LaTeX slash-commands without delimiters.
  - Display math using clean KaTeX Markdown blocks enclosed in $$ or $:
    $$
    A = \\begin{bmatrix} 5 & 7 & 2 \\\\ 1 & 4 & 6 \\end{bmatrix}
    $$
- Format properly for:
  - Matrices and vectors
  - Fractions ($\\frac{a}{b}$)
  - Powers and indices ($x^2, 10^5$)
  - Roots and radicals ($\\sqrt{b^2 - 4ac}$)
  - Equations and inequalities ($2x + 5 = 15$)
  - Chemical formulas and ionic equations ($\\text{H}_2\\text{SO}_4$, $\\text{CaCO}_3$)
  - Scientific notation ($3.0 \\times 10^8 \\text{ m/s}$)
  - Proper SI units ($\\text{kg}, \\text{m/s}^2, \\Omega, \\text{J}$)
- Ensure proper spacing and readable formatting. The goal is beautiful, legible mathematics, not plain text code.

---
### 5. BUILD FROM SIMPLE TO DIFFICULT (PROGRESSIVE LEVELS)
Teach progressively:
- Level 1 — Basic idea: Explain the concept or question in clear, simple language.
- Level 2 — Direct solution: Show the step-by-step working solving the student's problem.
- Level 3 — Explain the reasoning: Break down why each step is taken.
- Level 4 — Student practice: Give a similar short question for the student to try independently.

---
### 6. CHECK UNDERSTANDING
- Do not assume the student understands without checking.
- Always conclude with a clean "### Quick Check" section with 1 short practice question directly linked to what was taught.

---
### 7. HANDLE WRONG ANSWERS LIKE A GOOD TEACHER
- Never simply say "Wrong" or "Incorrect."
- Respond with patience and encouragement:
  "Almost! You handled the first part correctly, but let's check the signs when moving terms across the equals sign..."
- The student must feel safe making mistakes. Mistakes are essential stepping stones to learning.

---
### 8. ADAPT TO THE STUDENT CONVERSATIONALLY
- Pay close attention to conversational signals:
  - If the student says "I don't understand", do NOT repeat the exact same text. Use a different analogy, real-world Malawian example, or simpler visual breakdown.
  - If the student says "I understand", move forward to the next level or a practice question.
  - If the student asks "Why?", explain the underlying principle or logic, not just the procedural rule.
  - If the student requests harder questions, increase the challenge step by step.
  - If the student asks for a complete lesson, structure it into manageable, digestible learning parts.

---
### 9. USE VISUAL & SPATIAL EXPLANATIONS
- Provide clear visual structures for tables, diagrams, and matrices.
- In science, describe experimental setups, biological cycles, and physical directions clearly.
- In graphs, explain the axes, gradients, and intercepts.

---
### 10. CLEAN MOBILE-FRIENDLY SPACING & STRUCTURE
- Use clear subheadings, short paragraphs, bullet points, and numbered steps for procedures.
- Avoid intimidating walls of unbroken text. Ensure reading is effortless on mobile devices.

---
### 11. EXPLAIN "WHY", NOT JUST "HOW"
- Never present rules as arbitrary magic tricks. Explain the logic behind the procedure.
- Show what operations actually represent in the physical world or algebraic system.

---
### 12. APPLIED TO ALL SECONDARY SCHOOL SUBJECTS
Apply this exact teaching philosophy to every subject in the Malawi curriculum:
- Mathematics: Step-by-step working, properly rendered KaTeX equations, reasoning for each algebraic step.
- Chemistry: Simple language, balanced chemical equations, atomic models, real-world examples (feteleza, soap making, acid-base neutralisation).
- Physics: Formulas, variables defined with SI units, step-by-step substitution, physical meaning of results (solar energy, mechanics, electricity).
- Biology: Step-by-step physiological processes, clear structural descriptions, structure-to-function links (photosynthesis, digestion, malaria prevention).
- English: Clear grammar explanations, sentence examples, writing technique.
- History: Chronological order, causes, events, consequences, historical significance (Maravi kingdom, colonial period, independence).
- Geography: Physical and human interactions, climate, soils, Lake Malawi geography.
- Agriculture & Social Studies: Practical Malawian farming, crop husbandry, livestock, economics, civic institutions.

---
### 13. MALAWI SECONDARY SCHOOL CONTEXT & MANEB STANDARDS
- Ground all topics in the official Malawi National Curriculum (Forms 1–4, JCE and MSCE).
- Relate concepts to everyday Malawian life (farming maize, *feteleza*, solar power, biodiversity, local health).
- Use natural Chichewa translations where helpful for clarity (*mankhwala*, *kusandulika*, *ulimi*, *chimanga*).
- Prepare students for MANEB examination styles (method marks M1, accuracy marks A1, reason marks R1, command words: *state, describe, explain, calculate, deduce*).

---
### 14. HONESTY WITH UNCLEAR IMAGES
- If a student uploads a homework picture that is blurry or cropped, do not guess.
- State clearly: "I can see part of this question, but the line with the numbers/formula is blurry. Please take a clearer, well-lit photo so we can solve it accurately."

---
### 15. AVOID UNNECESSARY COMPLEXITY & DATA PRIVACY
- Prefer: **simple + accurate + clear** over **complicated + impressive**.
- Never repeat or store personal details (names, phone numbers, locations).

---
### 16. CLEAN FORMATTING FOR ANSWERS
- Format the response in clean, beautiful Markdown addressing the question directly:
  # [Direct Descriptive Title Answering The Question, e.g. "Solving $2x + 5 = 15$" or "Understanding Photosynthesis"]
  [Warm 1-2 sentence teacher opening directly acknowledging the student's question]
  
  ## 1.0 Direct Answer / Core Solution
  [Clear, direct answer or calculation solving the exact question asked, with KaTeX for any formulas and step-by-step working]
  
  ## 2.0 Step-by-Step Breakdown & Reasoning
  [Detailed working, explanation of why each step happens, Malawian context/analogy where helpful, and clear SI units or definitions]
  
  ### Quick Check
  1. [One short practice question directly related to what was just explained, so the student can verify their understanding]
  > Answer: [The correct answer for self-check]
  
  ### Key Takeaway
  > [One concise summary rule or exam tip to remember]`;

// --- Ultra-Fast In-Memory Cache for Common Questions ---
interface CachedAssist {
  response: AssistResponse;
  expiresAt: number;
}
const assistCache = new Map<string, CachedAssist>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getCacheKey(query: string, mode: string, studentForm?: string, activeTopicTitle?: string): string {
  return `${mode.toLowerCase()}:${(studentForm || 'all').toLowerCase()}:${(activeTopicTitle || 'none').toLowerCase()}:${query.trim().toLowerCase()}`;
}

export function getCachedAssist(query: string, mode: string, studentForm?: string, activeTopicTitle?: string): AssistResponse | null {
  const key = getCacheKey(query, mode, studentForm, activeTopicTitle);
  const item = assistCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    assistCache.delete(key);
    return null;
  }
  return item.response;
}

export function setCachedAssist(query: string, mode: string, studentForm: string | undefined, response: AssistResponse, activeTopicTitle?: string) {
  const key = getCacheKey(query, mode, studentForm, activeTopicTitle);
  // Cap cache size to avoid unbounded memory growth
  if (assistCache.size > 300) {
    const firstKey = assistCache.keys().next().value;
    if (firstKey) assistCache.delete(firstKey);
  }
  assistCache.set(key, {
    response,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

function buildLeanContextBlock(
  matchedTopics: Topic[],
  matchedNotes: NoteItem[],
  matchedSubject?: Subject
): string {
  if (matchedTopics.length === 0 && matchedNotes.length === 0) {
    return 'Malawi National Curriculum (Standards 5-8 PSLCE, Forms 1-4 JCE/MSCE).';
  }

  let block = '';
  // Top 2 topics only for maximum speed
  matchedTopics.slice(0, 2).forEach((t, i) => {
    block += `[Topic ${i + 1}: ${t.title} (${t.form} - ${matchedSubject?.name || 'General'})]\n`;
    block += `Summary: ${t.summary}\n`;
    if (t.keyConcepts?.length) block += `Key Concepts: ${t.keyConcepts.slice(0, 4).join(', ')}\n`;
    if (t.formulasOrFacts?.length) block += `Formulas: ${t.formulasOrFacts.slice(0, 3).join('; ')}\n`;
    if (t.manebExamFocus) block += `MANEB Focus: ${t.manebExamFocus}\n`;
  });

  // Top 1-2 notes only, compact content
  matchedNotes.slice(0, 1).forEach((n, i) => {
    block += `[Note ${i + 1}: ${n.title}]\n`;
    if (n.summary) block += `Summary: ${n.summary}\n`;
    if (n.keyPoints?.length) block += `Points: ${n.keyPoints.slice(0, 3).join('; ')}\n`;
    if (n.content) block += `Lesson: ${n.content.slice(0, 800)}\n`;
  });

  return block;
}

function buildAssistPrompt(
  query: string,
  contextBlock: string,
  mode: StudyFeatureMode,
  studentForm?: string,
  hasImage?: boolean,
  imageNotes?: string,
  studentAttempt?: string,
  activeTopicTitle?: string,
  activeSubjectName?: string
) {
  const lowerQuery = query.toLowerCase().trim();
  const isClarification = /i don't understand|i do not understand|confused|explain simpler|simpler terms|in chichewa|chichewa analogy|give an example|why\?|why is that|can you explain again/i.test(lowerQuery);
  const isPracticeReq = /give me (a )?(practice|question|problem|quiz|test|maneb)/i.test(lowerQuery);
  const isAnswerCheck = !!studentAttempt || /check my answer|is this correct|is (it|my answer) right|did i get this right/i.test(lowerQuery);

  let pedagogicalGuidance = '';
  if (isAnswerCheck) {
    pedagogicalGuidance = `
[TEACHER DIRECTIVE - EVALUATING STUDENT ATTEMPT]
- State warmly whether the student's attempt is Correct, Partially Correct, or Needs Revision.
- Praise what was done right, pinpoint error, walk through model solution with KaTeX.`;
  } else if (isClarification) {
    pedagogicalGuidance = `
[TEACHER DIRECTIVE - ADAPTING TO STUDENT CONFUSION]
- Explain in simpler terms using a relatable Malawian analogy (farming, solar, cooking, Lake Malawi) or Chichewa bridge.`;
  } else if (isPracticeReq) {
    pedagogicalGuidance = `
[TEACHER DIRECTIVE - EXAM & PRACTICE QUESTION]
- Provide a realistic MANEB examination problem with mark breakdown (M1, A1).`;
  }

  let topicContinuityNotice = '';
  if (activeTopicTitle) {
    topicContinuityNotice = `
[TOPIC CONTEXT]
Ongoing Topic: "${activeTopicTitle}"${activeSubjectName ? ` (${activeSubjectName})` : ''}
Note: If the student's question is a follow-up or related to this topic, maintain context. If the student has asked a new question or about a different concept, answer the new question directly.`;
  }

  return `=== STUDENT'S GIVEN QUESTION / INQUIRY ===
"${query}"
==========================================

CRITICAL MANDATE:
1. You MUST answer the student's EXACT question above directly, accurately, and thoroughly.
2. Do NOT solve or discuss a different question. Do NOT substitute different numbers, equations, or variables.
3. Address the student's question right from the opening and Section 1.0.
${studentAttempt ? `Student's Submitted Attempt to evaluate: "${studentAttempt}"` : ''}
${hasImage ? `Attached homework snapshot details: ${imageNotes || 'Homework picture attached'}` : ''}
${topicContinuityNotice}
${pedagogicalGuidance}

Curriculum Context: Malawi Secondary School Curriculum (PSLCE Standards 5-8, JCE Forms 1-2, MSCE Forms 3-4).
${studentForm ? `Target Class Level: ${studentForm}` : ''}

=== BACKGROUND CURRICULUM REFERENCE (FOR TERMINOLOGY & SYLLABUS ALIGNMENT ONLY — DO NOT SUBSTITUTE THE QUESTION) ===
${contextBlock}
=== END BACKGROUND CURRICULUM REFERENCE ===`;
}

function prepareConversation(
  history: Array<{ role: 'user' | 'model'; text: string }> | undefined,
  userPrompt: string,
  imageData?: string
) {
  const conversationContents: any[] = [];
  if (history && Array.isArray(history) && history.length > 0) {
    // Keep conversation memory up to 12 turns, preserving the original anchor question if longer
    let relevantHistory = history;
    if (history.length > 12) {
      relevantHistory = [history[0], ...history.slice(-11)];
    }

    let lastRole: string | null = null;
    for (const msg of relevantHistory) {
      if (msg.text && msg.text.trim()) {
        const role = msg.role === 'model' ? 'model' : 'user';
        if (role !== lastRole) {
          conversationContents.push({
            role,
            parts: [{ text: msg.text }]
          });
          lastRole = role;
        }
      }
    }
    if (conversationContents.length > 0 && conversationContents[conversationContents.length - 1].role === 'user') {
      conversationContents.pop();
    }
  }

  const userParts: any[] = [];
  if (imageData) {
    let mimeType = 'image/jpeg';
    let base64Data = imageData;
    const dataUrlMatch = imageData.match(/^data:([^;]+);base64,(.+)$/);
    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1];
      base64Data = dataUrlMatch[2];
    }
    userParts.push({
      inlineData: {
        mimeType,
        data: base64Data,
      },
    });
  }
  userParts.push({ text: userPrompt });

  conversationContents.push({
    role: 'user',
    parts: userParts
  });

  return { conversationContents, userParts };
}

function createAssistMetadata(
  query: string,
  textAnswer: string,
  matchedTopics: Topic[],
  matchedNotes: NoteItem[],
  matchedSubject?: Subject,
  studentForm?: string,
  mode: StudyFeatureMode = 'ask',
  activeTopicTitle?: string,
  activeSubjectName?: string
): AssistResponse {
  const isBroadSubject = 
    /^(what|define|explain|tell me about|overview of|introduction to|meaning of)\s+(is\s+)?(chemistry|physics|biology|mathematics|maths|agriculture|geography|history|english|chichewa|ict)/i.test(query.trim().toLowerCase()) ||
    ['chemistry', 'physics', 'biology', 'mathematics', 'maths', 'agriculture', 'geography', 'history', 'english', 'chichewa', 'ict'].includes(query.trim().toLowerCase());

  const citations: AssistResponse['sourceCitations'] = matchedTopics.map((t) => ({
    type: 'Note' as const,
    title: t.title,
    topicId: t.id,
    subjectId: t.subjectId,
  }));

  if (!isBroadSubject && matchedNotes[0]?.workedExamples?.[0]) {
    citations.push({
      type: 'Worked Example' as const,
      title: matchedNotes[0].workedExamples[0].title,
      topicId: matchedTopics[0]?.id,
      subjectId: matchedTopics[0]?.subjectId,
    });
  }

  const primaryTopic = matchedTopics[0];
  const displayTopic = isBroadSubject && matchedSubject
    ? `Introduction to ${matchedSubject.name}`
    : (primaryTopic?.title || activeTopicTitle || (matchedSubject ? `${matchedSubject.name} Syllabus` : 'Malawi National Curriculum'));

  return {
    query,
    matchedTopic: displayTopic,
    matchedSubject: matchedSubject?.name || activeSubjectName,
    matchedForm: studentForm || primaryTopic?.form,
    answer: textAnswer,
    confidence: 'High',
    sourceCitations: citations.slice(0, 3),
    workedExample: isBroadSubject ? undefined : matchedNotes[0]?.workedExamples?.[0],
    mode,
    educationLevel: studentForm
  };
}

export async function askGeminiAssist(
  query: string,
  matchedTopics: Topic[],
  matchedNotes: NoteItem[],
  matchedSubject?: Subject,
  studentForm?: string,
  hasImage?: boolean,
  imageNotes?: string,
  history?: Array<{ role: 'user' | 'model'; text: string }>,
  mode: StudyFeatureMode = 'ask',
  studentAttempt?: string,
  imageData?: string,
  activeTopicTitle?: string,
  activeSubjectName?: string
): Promise<AssistResponse | null> {
  const ai = getGeminiAI();
  if (!ai) return null;

  // Cache check only for initial standalone queries (never for multi-turn conversations)
  const isConversational = (history && history.length > 0) || !!studentAttempt || query.length < 25;
  if (!hasImage && !imageData && !isConversational) {
    const cached = getCachedAssist(query, mode, studentForm, activeTopicTitle);
    if (cached) {
      return cached;
    }
  }

  try {
    const contextBlock = buildLeanContextBlock(matchedTopics, matchedNotes, matchedSubject);
    const userPrompt = buildAssistPrompt(
      query,
      contextBlock,
      mode,
      studentForm,
      hasImage,
      imageNotes,
      studentAttempt,
      activeTopicTitle,
      activeSubjectName
    );
    const { conversationContents } = prepareConversation(history, userPrompt, imageData);

    let textAnswer = '';
    // Optimized for speed: flash-lite has minimal thinking latency and instant TTFT
    const candidateModels = [
      { name: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL },
      { name: 'gemini-flash-latest', thinkingLevel: ThinkingLevel.LOW },
      { name: 'gemini-3.8-flash', thinkingLevel: ThinkingLevel.LOW },
    ];

    for (const modelConfig of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelConfig.name,
          contents: (!imageData && conversationContents.length === 1) ? userPrompt : conversationContents,
          config: {
            systemInstruction: STUDY_MASTER_ASSIST_SYSTEM_INSTRUCTION,
            temperature: 0.2,
            thinkingConfig: {
              thinkingLevel: modelConfig.thinkingLevel,
            },
          },
        });
        const candidateText = response.text?.trim() || '';
        if (candidateText) {
          textAnswer = candidateText;
          break;
        }
      } catch (modelErr: any) {
        // Fallback directly to next fast candidate
        continue;
      }
    }

    if (!textAnswer) return null;

    const result = createAssistMetadata(
      query,
      textAnswer,
      matchedTopics,
      matchedNotes,
      matchedSubject,
      studentForm,
      mode,
      activeTopicTitle,
      activeSubjectName
    );

    // Cache successful answer for instant retrieval on standalone inquiries
    if (!hasImage && !imageData && !isConversational) {
      setCachedAssist(query, mode, studentForm, result, activeTopicTitle);
    }

    return result;
  } catch (err: any) {
    console.error('Gemini Assist API error, falling back to local grounded syllabus engine:', err);
    return null;
  }
}

/**
 * Streaming generator for instant real-time tokens to client
 */
export async function* streamGeminiAssistChunks(
  query: string,
  matchedTopics: Topic[],
  matchedNotes: NoteItem[],
  matchedSubject?: Subject,
  studentForm?: string,
  hasImage?: boolean,
  imageNotes?: string,
  history?: Array<{ role: 'user' | 'model'; text: string }>,
  mode: StudyFeatureMode = 'ask',
  studentAttempt?: string,
  imageData?: string,
  activeTopicTitle?: string,
  activeSubjectName?: string
): AsyncGenerator<
  { type: 'chunk'; text: string } | { type: 'done'; data: AssistResponse },
  void,
  unknown
> {
  const ai = getGeminiAI();

  // Instant response from cache if standalone inquiry
  const isConversational = (history && history.length > 0) || !!studentAttempt || query.length < 25;
  if (!hasImage && !imageData && !isConversational) {
    const cached = getCachedAssist(query, mode, studentForm, activeTopicTitle);
    if (cached) {
      yield { type: 'chunk', text: cached.answer };
      yield { type: 'done', data: cached };
      return;
    }
  }

  if (!ai) {
    return;
  }

  const contextBlock = buildLeanContextBlock(matchedTopics, matchedNotes, matchedSubject);
  const userPrompt = buildAssistPrompt(
    query,
    contextBlock,
    mode,
    studentForm,
    hasImage,
    imageNotes,
    studentAttempt,
    activeTopicTitle,
    activeSubjectName
  );
  const { conversationContents } = prepareConversation(history, userPrompt, imageData);

  const candidateModels = [
    { name: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL },
    { name: 'gemini-flash-latest', thinkingLevel: ThinkingLevel.LOW },
    { name: 'gemini-3.8-flash', thinkingLevel: ThinkingLevel.LOW },
  ];

  let accumulatedText = '';

  for (const modelConfig of candidateModels) {
    try {
      const stream = await ai.models.generateContentStream({
        model: modelConfig.name,
        contents: (!imageData && conversationContents.length === 1) ? userPrompt : conversationContents,
        config: {
          systemInstruction: STUDY_MASTER_ASSIST_SYSTEM_INSTRUCTION,
          temperature: 0.2,
          thinkingConfig: {
            thinkingLevel: modelConfig.thinkingLevel,
          },
        },
      });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          accumulatedText += chunkText;
          yield { type: 'chunk', text: chunkText };
        }
      }

      if (accumulatedText.trim()) {
        const finalResponse = createAssistMetadata(
          query,
          accumulatedText.trim(),
          matchedTopics,
          matchedNotes,
          matchedSubject,
          studentForm,
          mode,
          activeTopicTitle,
          activeSubjectName
        );

        if (!hasImage && !imageData && !isConversational) {
          setCachedAssist(query, mode, studentForm, finalResponse, activeTopicTitle);
        }

        yield { type: 'done', data: finalResponse };
        return;
      }
    } catch (streamErr) {
      // Try next fast model if stream failed early
      if (accumulatedText.trim()) {
        break; // Partial text already streamed, don't restart
      }
      continue;
    }
  }
}


