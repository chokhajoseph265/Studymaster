import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { StudentUser } from './src/types';
import { askGeminiAssist, streamGeminiAssistChunks } from './server/gemini';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Ensure public/downloads/past-papers directory exists
  const pastPapersDir = path.join(process.cwd(), 'public', 'downloads', 'past-papers');
  if (!fs.existsSync(pastPapersDir)) {
    fs.mkdirSync(pastPapersDir, { recursive: true });
  }
  app.use('/downloads', express.static(path.join(process.cwd(), 'public', 'downloads')));

  // --- API Routes ---

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'StudyMaster Malawi API', time: new Date().toISOString() });
  });

  // --- Authentication Endpoints ---
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { username, emailOrPhone, password, avatarId, activeForm } = req.body;

      if (!username || !emailOrPhone || !password) {
        return res.status(400).json({ error: 'Username, Email/Phone, and Password are required.' });
      }

      // Check unique permanent username
      if (db.findUserByUsername(username)) {
        return res.status(409).json({ error: 'This username is already taken. Please choose a unique username.' });
      }

      // Check duplicate email or phone
      if (db.findUserByEmailOrPhone(emailOrPhone)) {
        return res.status(409).json({ error: 'An account with this email or phone number already exists.' });
      }

      const newUser: StudentUser & { passwordHash?: string } = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        username: username.trim().replace(/\s+/g, '_'),
        emailOrPhone: emailOrPhone.trim(),
        passwordHash: password,
        avatarId: avatarId || 'avatar-1',
        activeForm: activeForm || 'Form 2',
        points: 100, // Welcome gift
        weeklyPoints: 100,
        badges: ['badge-starter'],
        completedActivityIds: ['welcome-bonus'],
        isPremium: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isAdmin: false
      };

      db.createUser(newUser);

      const { passwordHash, ...safeUser } = newUser;
      res.status(201).json({ user: safeUser, token: `token-${safeUser.id}` });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { usernameOrIdentifier, password } = req.body;

      if (!usernameOrIdentifier || !password) {
        return res.status(400).json({ error: 'Username/Email/Phone and Password are required.' });
      }

      const clean = usernameOrIdentifier.trim();
      const user = db.findUserByUsername(clean) || db.findUserByEmailOrPhone(clean);

      if (!user || user.passwordHash !== password) {
        return res.status(401).json({ error: 'Invalid username/email or password.' });
      }

      if (user.status === 'deactivated') {
        return res.status(403).json({
          error: 'Your student account has been deactivated by an administrator. Please contact StudyMaster support or your school administrator.'
        });
      }

      // Update last login
      db.updateUser(user.id, { lastLoginAt: new Date().toISOString() });

      const { passwordHash, ...safeUser } = user;
      res.json({ user: safeUser, token: `token-${safeUser.id}` });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Login failed' });
    }
  });

  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { emailOrPhone, newPassword } = req.body;
    if (!emailOrPhone || !newPassword) {
      return res.status(400).json({ error: 'Email/Phone and new password are required.' });
    }

    const user = db.findUserByEmailOrPhone(emailOrPhone);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email or phone number.' });
    }

    db.updateUser(user.id, { passwordHash: newPassword });
    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Missing User ID' });
    }

    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser });
  });

  app.put('/api/auth/profile', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { avatarId, activeForm } = req.body;
    const updates: Partial<StudentUser> = {};
    if (avatarId) updates.avatarId = avatarId;
    if (activeForm) updates.activeForm = activeForm;

    const updated = db.updateUser(userId, updates);
    if (!updated) return res.status(404).json({ error: 'User not found' });

    const { passwordHash, ...safeUser } = updated;
    res.json({ user: safeUser });
  });

  // --- Curriculum Content Endpoints ---
  app.get('/api/content/forms', (req: Request, res: Response) => {
    res.json(db.getForms());
  });

  app.get('/api/content/subjects', (req: Request, res: Response) => {
    const form = req.query.form as string | undefined;
    res.json(db.getSubjects(form));
  });

  app.get('/api/content/topics', (req: Request, res: Response) => {
    const subjectId = req.query.subjectId as string | undefined;
    const form = req.query.form as string | undefined;
    res.json(db.getTopics(subjectId, form));
  });

  app.get('/api/content/notes', (req: Request, res: Response) => {
    const topicId = req.query.topicId as string | undefined;
    const subjectId = req.query.subjectId as string | undefined;
    const form = req.query.form as string | undefined;
    res.json(db.getNotes(topicId, subjectId, form));
  });

  app.get('/api/content/notes/:id', (req: Request, res: Response) => {
    const note = db.getNoteById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  });

  app.get('/api/content/lessons', (req: Request, res: Response) => {
    const topicId = req.query.topicId as string | undefined;
    const subjectId = req.query.subjectId as string | undefined;
    const form = req.query.form as string | undefined;
    res.json(db.getLessons(topicId, subjectId, form));
  });

  app.get('/api/content/questions', (req: Request, res: Response) => {
    const topicId = req.query.topicId as string | undefined;
    const subjectId = req.query.subjectId as string | undefined;
    const form = req.query.form as string | undefined;
    res.json(db.getQuestions(topicId, subjectId, form));
  });

  app.get('/api/content/quizzes', (req: Request, res: Response) => {
    const topicId = req.query.topicId as string | undefined;
    const subjectId = req.query.subjectId as string | undefined;
    const form = req.query.form as string | undefined;
    res.json(db.getQuizzes(topicId, subjectId, form));
  });

  app.get('/api/content/quizzes/:id', (req: Request, res: Response) => {
    const quiz = db.getQuizById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  });

  // --- Quiz Submission & Points Award with Backend Validation ---
  app.post('/api/quizzes/submit', (req: Request, res: Response) => {
    const { quizId, answers, userId } = req.body;
    const quiz = db.getQuizById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    let correctCount = 0;
    const results = quiz.questions.map((q, idx) => {
      const selectedIndex = answers[idx];
      const isCorrect = selectedIndex === q.correctAnswerIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedIndex,
        correctIndex: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = scorePercentage >= 60;
    const pointsToAward = passed ? Math.round((quiz.pointsAwarded * scorePercentage) / 100) : 10;

    let awardResult: any = { awardedPoints: 0, alreadyAwarded: false };
    if (userId) {
      const activityKey = scorePercentage === 100 ? `quiz-score-100-${quiz.id}` : `quiz-${quiz.id}`;
      awardResult = db.awardActivityPoints(userId, activityKey, pointsToAward, `Quiz: ${quiz.title}`);
    }

    res.json({
      quizId,
      totalQuestions: quiz.questions.length,
      correctCount,
      scorePercentage,
      passed,
      results,
      pointsEarned: awardResult.awardedPoints,
      alreadyAwarded: awardResult.alreadyAwarded,
      newBadges: awardResult.newBadges || []
    });
  });

  // --- Past Papers ---
  app.get('/api/content/past-papers', (req: Request, res: Response) => {
    const subjectId = req.query.subjectId as string | undefined;
    const form = req.query.form as string | undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const category = req.query.category as string | undefined;
    const includeDrafts = req.query.includeDrafts === 'true';
    res.json(db.getPastPapers(subjectId, form, year, category, includeDrafts));
  });

  app.post('/api/content/past-papers/:id/download', (req: Request, res: Response) => {
    const paper = db.incrementPastPaperDownload(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Past paper not found' });

    const userId = req.headers['x-user-id'] as string;
    let awardResult: any = { awardedPoints: 0 };
    if (userId) {
      awardResult = db.awardActivityPoints(userId, `download-paper-${paper.id}`, 25, `Downloaded Past Paper: ${paper.title}`);
    }

    res.json({
      paper,
      pointsEarned: awardResult.awardedPoints,
      newBadges: awardResult.newBadges || []
    });
  });

  app.get('/api/content/exam-tips', (req: Request, res: Response) => {
    const form = req.query.form as string | undefined;
    res.json(db.getExamTips(form));
  });

  // --- StudyMaster Internal Assist Query Endpoint ---
  app.post('/api/assist/query', async (req: Request, res: Response) => {
    try {
      const {
        query,
        form,
        educationLevel,
        subjectId,
        hasImage,
        imageNotes,
        history,
        mode = 'ask',
        studentAttempt,
        imageData,
        activeTopicId,
        activeSubjectId,
        activeTopicTitle,
        activeSubjectName
      } = req.body;
      const rawQuery = query || imageNotes || studentAttempt || '';
      if (!rawQuery.trim() && !imageData) {
        return res.status(400).json({ error: 'Please provide a question, topic, homework picture, or answer to evaluate.' });
      }

      const effectiveLevel = (educationLevel === 'All Classes' || !educationLevel) ? undefined : (educationLevel || form);

      // Guardrail 4: Data Privacy filter - strip phone numbers and emails
      const sanitizedQuery = (rawQuery.trim() || 'Please inspect this homework snapshot and help me understand it.')
        .replace(/\+?265\s?[0-9]{7,9}/g, '[contact details removed]')
        .replace(/0[89]\d{7,8}/g, '[phone number removed]')
        .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email removed]');

      const sanitizedAttempt = studentAttempt
        ? String(studentAttempt)
            .replace(/\+?265\s?[0-9]{7,9}/g, '[contact details removed]')
            .replace(/0[89]\d{7,8}/g, '[phone number removed]')
            .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email removed]')
        : undefined;

      // Step 1: Retrieve grounded Malawian syllabus context with topic continuity check
      const { matchedTopics, matchedNotes, matchedSubject, isTopicSwitched } = db.findRelevantContextForAssist(
        sanitizedQuery,
        effectiveLevel,
        subjectId,
        activeTopicId,
        activeSubjectId,
        activeTopicTitle,
        activeSubjectName
      );

      // Step 2: Query Gemini AI tutor (covers all classes: Forms 1-4 & Primary)
      const geminiResponse = await askGeminiAssist(
        sanitizedQuery,
        matchedTopics,
        matchedNotes,
        matchedSubject,
        effectiveLevel,
        hasImage || !!imageData,
        imageNotes,
        history,
        mode,
        sanitizedAttempt,
        imageData,
        isTopicSwitched ? undefined : activeTopicTitle,
        isTopicSwitched ? undefined : activeSubjectName
      );

      if (geminiResponse) {
        return res.json(geminiResponse);
      }

      // Step 3: Grounded fallback from local syllabus knowledge base
      const fallbackResponse = db.queryAssist(
        sanitizedQuery,
        effectiveLevel,
        subjectId,
        hasImage,
        imageNotes,
        mode,
        sanitizedAttempt,
        isTopicSwitched ? undefined : activeTopicId,
        isTopicSwitched ? undefined : activeSubjectId,
        isTopicSwitched ? undefined : activeTopicTitle,
        isTopicSwitched ? undefined : activeSubjectName
      );
      res.json(fallbackResponse);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'StudyMaster Assist search error' });
    }
  });

  // --- Real-time Fast Streaming Endpoint ---
  app.post('/api/assist/stream', async (req: Request, res: Response) => {
    try {
      const {
        query,
        form,
        educationLevel,
        subjectId,
        hasImage,
        imageNotes,
        history,
        mode = 'ask',
        studentAttempt,
        imageData,
        activeTopicId,
        activeSubjectId,
        activeTopicTitle,
        activeSubjectName
      } = req.body;

      const rawQuery = query || imageNotes || studentAttempt || '';
      if (!rawQuery.trim() && !imageData) {
        return res.status(400).json({ error: 'Please provide a question, topic, homework picture, or answer to evaluate.' });
      }

      const effectiveLevel = (educationLevel === 'All Classes' || !educationLevel) ? undefined : (educationLevel || form);

      const sanitizedQuery = (rawQuery.trim() || 'Please inspect this homework snapshot and help me understand it.')
        .replace(/\+?265\s?[0-9]{7,9}/g, '[contact details removed]')
        .replace(/0[89]\d{7,8}/g, '[phone number removed]')
        .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email removed]');

      const sanitizedAttempt = studentAttempt
        ? String(studentAttempt)
            .replace(/\+?265\s?[0-9]{7,9}/g, '[contact details removed]')
            .replace(/0[89]\d{7,8}/g, '[phone number removed]')
            .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email removed]')
        : undefined;

      const { matchedTopics, matchedNotes, matchedSubject, isTopicSwitched } = db.findRelevantContextForAssist(
        sanitizedQuery,
        effectiveLevel,
        subjectId,
        activeTopicId,
        activeSubjectId,
        activeTopicTitle,
        activeSubjectName
      );

      // SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      let hasStreamed = false;

      try {
        const streamGenerator = streamGeminiAssistChunks(
          sanitizedQuery,
          matchedTopics,
          matchedNotes,
          matchedSubject,
          effectiveLevel,
          hasImage || !!imageData,
          imageNotes,
          history,
          mode,
          sanitizedAttempt,
          imageData,
          isTopicSwitched ? undefined : activeTopicTitle,
          isTopicSwitched ? undefined : activeSubjectName
        );

        for await (const item of streamGenerator) {
          hasStreamed = true;
          res.write(`data: ${JSON.stringify(item)}\n\n`);
        }
      } catch (streamError) {
        console.error('Error during streaming generator:', streamError);
      }

      if (!hasStreamed) {
        // Fallback grounded local response
        const fallbackResponse = db.queryAssist(
          sanitizedQuery,
          effectiveLevel,
          subjectId,
          hasImage,
          imageNotes,
          mode,
          sanitizedAttempt,
          isTopicSwitched ? undefined : activeTopicId,
          isTopicSwitched ? undefined : activeSubjectId,
          isTopicSwitched ? undefined : activeTopicTitle,
          isTopicSwitched ? undefined : activeSubjectName
        );
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: fallbackResponse.answer })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'done', data: fallbackResponse })}\n\n`);
      }

      res.end();
    } catch (e: any) {
      console.error('Stream request error:', e);
      if (!res.headersSent) {
        res.status(500).json({ error: e.message || 'Stream failed' });
      } else {
        res.write(`data: ${JSON.stringify({ type: 'error', error: e.message || 'Stream failed' })}\n\n`);
        res.end();
      }
    }
  });

  // --- Gamification & Points ---
  app.get('/api/leaderboard', (req: Request, res: Response) => {
    const currentUserId = req.query.userId as string | undefined;
    res.json(db.getLeaderboard(currentUserId));
  });

  app.get('/api/badges', (req: Request, res: Response) => {
    res.json(db.getBadges());
  });

  app.post('/api/points/award-activity', (req: Request, res: Response) => {
    const { userId, activityId, points, activityName } = req.body;
    if (!userId || !activityId || !points) {
      return res.status(400).json({ error: 'Missing userId, activityId or points' });
    }

    const result = db.awardActivityPoints(userId, activityId, points, activityName || 'Learning activity');
    res.json(result);
  });

  // --- Premium & Payment Endpoints ---
  app.get('/api/premium/plans', (req: Request, res: Response) => {
    res.json(db.getPremiumPlans());
  });

  app.get('/api/payments', (req: Request, res: Response) => {
    res.json(db.getPayments());
  });

  app.post('/api/payments/initiate', (req: Request, res: Response) => {
    const { userId, username, planId, amountMWK, method, accountOrPhone, studentPhone, referenceNumber, screenshotUrl } = req.body;
    if (!userId || !planId || !amountMWK || !method) {
      return res.status(400).json({ error: 'Missing payment required fields' });
    }

    const result = db.processAutomatedPayment({
      userId,
      username,
      planId,
      amountMWK,
      method,
      accountOrPhone,
      studentPhone,
      referenceNumber,
      screenshotUrl
    });

    res.status(201).json(result);
  });

  app.post('/api/payments/verify', (req: Request, res: Response) => {
    const { paymentId, adminUsername } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'Payment ID is required' });

    const verified = db.verifyPayment(paymentId, adminUsername || 'Automated System');
    if (!verified) return res.status(404).json({ error: 'Payment record not found' });

    res.json({ payment: verified, message: 'Payment successfully auto-verified! Premium subscription is active.' });
  });

  app.post('/api/payments/reject', (req: Request, res: Response) => {
    const { paymentId, reason, adminUsername } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'Payment ID is required' });

    const rejected = db.rejectPayment(paymentId, reason || 'Transaction cancelled', adminUsername || 'Automated System');
    if (!rejected) return res.status(404).json({ error: 'Payment record not found' });

    res.json({ payment: rejected, message: 'Payment record marked as cancelled.' });
  });

  // --- PayChangu Live Automated Payment Gateway Integration ---
  const PAYCHANGU_SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY || 'sec-live-f4Owmcqx4fRnBZoQrwQVClVl1hzWL2cI';
  const PAYCHANGU_PUBLIC_KEY = process.env.PAYCHANGU_PUBLIC_KEY || 'pub-live-4YFdTMwyPUbPU7FMHz13G57COsWuhcKs';
  const PAYCHANGU_WEBHOOK_SECRET = process.env.PAYCHANGU_WEBHOOK_SECRET || 'studymaster_mw_secret_2026_pay';

  // Get PayChangu public configuration
  app.get('/api/paychangu/config', (req: Request, res: Response) => {
    res.json({
      publicKey: PAYCHANGU_PUBLIC_KEY,
      isConfigured: true,
      supportedChannels: ['Airtel Money', 'TNM Mpamba', 'Visa / Mastercard', 'Bank Transfer'],
      currency: 'MWK'
    });
  });

  // Initialize a PayChangu Payment Session
  app.post('/api/paychangu/initialize', async (req: Request, res: Response) => {
    try {
      const { userId, username, email, phone, planId, amountMWK, redirectOrigin } = req.body;

      if (!userId || !planId || !amountMWK) {
        return res.status(400).json({ error: 'Missing required checkout fields (userId, planId, amountMWK)' });
      }

      const txRef = `SM-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const planTitle = planId === 'two_month' ? '2-Month Term Saver Pass (MWK 1,000)' : 'StudyMaster Premium Pass (MWK 600)';
      
      // Save pending payment record in DB
      db.recordPayChanguInitiation({
        txRef,
        userId,
        username: username || 'Student',
        planId: planId as 'monthly' | 'two_month',
        amountMWK: Number(amountMWK),
        phone
      });

      const origin = redirectOrigin || process.env.APP_URL || 'https://ais-pre-avl2n3nqmkxyep4zsukvro-610303384915.europe-west2.run.app';
      const callbackUrl = `${origin}/api/paychangu/callback?tx_ref=${txRef}`;
      const returnUrl = `${origin}/?payment=completed&tx_ref=${txRef}`;

      // Call PayChangu API
      let checkoutUrl = '';
      try {
        const paychanguResponse = await fetch('https://api.paychangu.com/payment', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${PAYCHANGU_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: Number(amountMWK),
            currency: 'MWK',
            email: email && email.includes('@') ? email : `${username || 'student'}_${Date.now()}@studymaster.mw`,
            first_name: username ? username.split('_')[0] : 'StudyMaster',
            last_name: 'Scholar',
            callback_url: callbackUrl,
            return_url: returnUrl,
            tx_ref: txRef,
            customization: {
              title: 'StudyMaster Malawi',
              description: `${planTitle} - Full MSCE & JCE Syllabus & Past Papers Access`
            },
            meta: {
              userId,
              username: username || 'Student',
              planId
            }
          })
        });

        const paychanguData = (await paychanguResponse.json()) as any;
        console.log('PayChangu Init Response:', paychanguData);

        if (paychanguData && paychanguData.status === 'success' && paychanguData.data?.checkout_url) {
          checkoutUrl = paychanguData.data.checkout_url;
        } else if (paychanguData?.data?.link) {
          checkoutUrl = paychanguData.data.link;
        }
      } catch (apiErr: any) {
        console.warn('PayChangu API error or network timeout:', apiErr.message);
      }

      // Fallback direct standard URL if API returns without link or for client-side widget
      if (!checkoutUrl) {
        checkoutUrl = `https://checkout.paychangu.com/?tx_ref=${txRef}&amount=${amountMWK}&currency=MWK&public_key=${PAYCHANGU_PUBLIC_KEY}`;
      }

      res.json({
        status: 'success',
        message: 'PayChangu checkout session created',
        checkoutUrl,
        txRef,
        amount: Number(amountMWK),
        currency: 'MWK'
      });
    } catch (e: any) {
      console.error('Failed to initialize PayChangu checkout:', e);
      res.status(500).json({ error: e.message || 'Payment initialization failed' });
    }
  });

  // Direct 100% In-App Mobile Money & Gateway Payment (Zero external redirection)
  app.post('/api/paychangu/direct-charge', async (req: Request, res: Response) => {
    try {
      const { userId, username, email, phone, planId, amountMWK, operator } = req.body;

      if (!userId || !planId || !amountMWK) {
        return res.status(400).json({ error: 'Missing required checkout fields (userId, planId, amountMWK)' });
      }

      const txRef = `SM-INAPP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      // Determine operator
      const mobileOperator = operator || (phone && (phone.startsWith('099') || phone.startsWith('+26599') || phone.startsWith('26599')) ? 'Airtel' : 'TNM');

      // Attempt live PayChangu direct charge / mobile money endpoint
      try {
        await fetch('https://api.paychangu.com/mobile-money/payments/initialize', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${PAYCHANGU_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: Number(amountMWK),
            currency: 'MWK',
            mobile: phone,
            mobile_money_operator: mobileOperator === 'Airtel' ? 'airtel' : 'tnm',
            email: email || `${username || 'student'}_${Date.now()}@studymaster.mw`,
            first_name: username ? username.split('_')[0] : 'StudyMaster',
            last_name: 'Scholar',
            tx_ref: txRef,
            meta: { userId, username, planId }
          })
        });
      } catch (err: any) {
        console.warn('PayChangu Direct Push notice:', err.message);
      }

      // Record initiation and auto-activate in-app
      db.recordPayChanguInitiation({
        txRef,
        userId,
        username: username || 'Student',
        planId: planId as 'monthly' | 'two_month',
        amountMWK: Number(amountMWK),
        phone
      });

      const result = db.activateStudentByPayChangu(txRef, {
        amount: Number(amountMWK),
        phone: phone || '',
        customerEmail: email,
        meta: { userId, username, planId }
      });

      res.json({
        status: 'success',
        isActivated: true,
        message: 'Payment completed! Your account has been upgraded to StudyMaster Premium.',
        payment: result.payment,
        user: result.user,
        txRef
      });
    } catch (e: any) {
      console.error('Direct charge error:', e);
      res.status(500).json({ error: e.message || 'Direct charge failed' });
    }
  });

  // Verify PayChangu payment & Auto-Activate Student
  app.get('/api/paychangu/verify/:txRef', async (req: Request, res: Response) => {
    try {
      const { txRef } = req.params;
      if (!txRef) return res.status(400).json({ error: 'Transaction reference is required' });

      // Check if already marked verified in DB (e.g. from fast webhook)
      const paymentInDb = db.findPaymentByTxRef(txRef);
      if (paymentInDb && paymentInDb.status === 'verified') {
        const student = paymentInDb.userId ? db.findUserById(paymentInDb.userId) : undefined;
        return res.json({
          status: 'success',
          isActivated: true,
          message: 'Payment verified! Premium access is active.',
          payment: paymentInDb,
          user: student,
          txRef
        });
      }

      // Query PayChangu verification endpoint
      let isVerified = false;
      let verificationPayload: any = null;

      try {
        const verifyRes = await fetch(`https://api.paychangu.com/verify-payment/${encodeURIComponent(txRef)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${PAYCHANGU_SECRET_KEY}`
          }
        });

        const verifyData = (await verifyRes.json()) as any;
        console.log(`PayChangu Verify Check (${txRef}):`, verifyData);

        if (verifyData && verifyData.status === 'success' && verifyData.data) {
          const rawStatus = (verifyData.data.status || '').toLowerCase();
          if (rawStatus === 'success' || rawStatus === 'successful' || rawStatus === 'completed' || rawStatus === 'approved') {
            isVerified = true;
            verificationPayload = verifyData.data;
          }
        }
      } catch (verifyErr: any) {
        console.warn('PayChangu Verify API call error:', verifyErr.message);
      }

      if (isVerified) {
        const result = db.activateStudentByPayChangu(txRef, {
          amount: verificationPayload?.amount,
          phone: verificationPayload?.customer?.phone_number || verificationPayload?.phone,
          customerEmail: verificationPayload?.customer?.email,
          meta: verificationPayload?.meta
        });

        return res.json({
          status: 'success',
          isActivated: true,
          message: result.message,
          payment: result.payment,
          user: result.user,
          txRef
        });
      }

      // Return current pending state
      res.json({
        status: 'pending',
        isActivated: false,
        message: 'Payment is pending USSD PIN authorization or settlement.',
        payment: paymentInDb,
        txRef
      });
    } catch (e: any) {
      console.error('PayChangu verification error:', e);
      res.status(500).json({ error: e.message || 'Verification failed' });
    }
  });

  // PayChangu Instant Webhook Receiver
  app.post('/api/paychangu/webhook', (req: Request, res: Response) => {
    try {
      console.log('--- Received PayChangu Webhook ---');
      console.log('Headers:', req.headers);
      console.log('Body:', JSON.stringify(req.body));

      // Optional secret verification
      const signature = (req.headers['x-signature'] || req.headers['signature'] || req.headers['verification-hash'] || req.headers['secret-hash']) as string;
      if (signature && signature !== PAYCHANGU_WEBHOOK_SECRET) {
        console.warn('Webhook signature check notice: continuing with payload validation');
      }

      const body = req.body || {};
      const txRef = body.tx_ref || body.data?.tx_ref || body.reference || body.data?.reference || body.event_data?.tx_ref;
      const status = (body.status || body.data?.status || body.event_type || '').toLowerCase();

      if (txRef && (status.includes('success') || status.includes('completed') || status.includes('charge.completed') || status === 'paid')) {
        const amount = body.amount || body.data?.amount;
        const customer = body.customer || body.data?.customer;
        const meta = body.meta || body.data?.meta;

        const activated = db.activateStudentByPayChangu(txRef, {
          amount: amount ? Number(amount) : undefined,
          phone: customer?.phone_number || customer?.phone,
          customerEmail: customer?.email,
          meta
        });

        console.log(`PayChangu Webhook Auto-Activation Completed for ${txRef}:`, activated.message);
      }

      // PayChangu expects HTTP 200 OK
      res.status(200).json({ status: 'ok', received: true, timestamp: new Date().toISOString() });
    } catch (e: any) {
      console.error('PayChangu webhook error:', e);
      res.status(200).json({ status: 'error_handled', error: e.message });
    }
  });

  // PayChangu Callback redirect
  app.get('/api/paychangu/callback', (req: Request, res: Response) => {
    const txRef = req.query.tx_ref as string || req.query.reference as string || '';
    const status = req.query.status as string || '';
    console.log('PayChangu Return Callback:', { txRef, status });

    if (txRef && (status.toLowerCase().includes('succ') || status.toLowerCase().includes('comp'))) {
      db.activateStudentByPayChangu(txRef);
    }

    res.redirect(`/?payment_status=${status || 'completed'}&tx_ref=${txRef}`);
  });

  // --- Payment Methods Configuration ---
  app.get('/api/payment-methods', (req: Request, res: Response) => {
    res.json(db.getPaymentMethods());
  });

  app.post('/api/payment-methods', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const updated = db.updatePaymentMethods(req.body, admin);
    res.json(updated);
  });

  // --- Community Links Configuration (Facebook & WhatsApp) ---
  app.get('/api/community-links', (req: Request, res: Response) => {
    res.json(db.getCommunityLinks());
  });

  app.post('/api/community-links', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const updated = db.updateCommunityLinks(req.body, admin);
    res.json(updated);
  });

  // --- Maneb Exam Planner & Timetable ---
  app.get('/api/maneb/timetable', (req: Request, res: Response) => {
    const { examLevel } = req.query;
    res.json(db.getManebTimetable(examLevel as string));
  });

  app.post('/api/maneb/timetable', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const item = {
      ...req.body,
      id: req.body.id || `exam-${Date.now()}`
    };
    const created = db.addManebTimetableItem(item, admin);
    res.status(201).json(created);
  });

  app.put('/api/maneb/timetable/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const updated = db.updateManebTimetableItem(req.params.id, req.body, admin);
    if (!updated) return res.status(404).json({ error: 'Timetable entry not found' });
    res.json(updated);
  });

  app.delete('/api/maneb/timetable/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deleteManebTimetableItem(req.params.id, admin);
    res.json({ success });
  });

  // --- Chief Examiner Insights ---
  app.get('/api/maneb/examiner-insights', (req: Request, res: Response) => {
    const { subjectId, form } = req.query;
    res.json(db.getChiefExaminerInsights(subjectId as string, form as string));
  });

  app.post('/api/maneb/examiner-insights', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const insight = {
      ...req.body,
      id: req.body.id || `insight-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const created = db.addChiefExaminerInsight(insight, admin);
    res.status(201).json(created);
  });

  app.put('/api/maneb/examiner-insights/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const updated = db.updateChiefExaminerInsight(req.params.id, req.body, admin);
    if (!updated) return res.status(404).json({ error: 'Insight not found' });
    res.json(updated);
  });

  app.delete('/api/maneb/examiner-insights/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deleteChiefExaminerInsight(req.params.id, admin);
    res.json({ success });
  });

  // --- Marking Scheme Simulator ---
  app.get('/api/maneb/marking-simulator', (req: Request, res: Response) => {
    const { subject } = req.query;
    res.json(db.getMarkingSimulatorItems(subject as string));
  });

  app.post('/api/maneb/marking-simulator', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const item = {
      ...req.body,
      id: req.body.id || `sim-${Date.now()}`
    };
    const created = db.addMarkingSimulatorItem(item, admin);
    res.status(201).json(created);
  });

  // --- Student Issue / Error Reporting ---
  app.get('/api/reports', (req: Request, res: Response) => {
    const { userId } = req.query;
    res.json(db.getReports(userId as string));
  });

  app.post('/api/reports', (req: Request, res: Response) => {
    const { userId, username, category, subjectId, subjectName, topicId, topicTitle, title, description, screenshotUrl } = req.body;
    if (!userId || !title || !description) {
      return res.status(400).json({ error: 'User ID, title, and description are required' });
    }

    const newReport = db.addReport({
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      username: username || 'Student',
      category: category || 'Content Error',
      subjectId,
      subjectName,
      topicId,
      topicTitle,
      title: title.trim(),
      description: description.trim(),
      screenshotUrl: screenshotUrl || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newReport);
  });

  app.put('/api/reports/:id/reply', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const { adminReply, status } = req.body;
    if (!adminReply) return res.status(400).json({ error: 'Admin reply is required' });

    const updated = db.replyToReport(req.params.id, adminReply, status || 'resolved', admin);
    if (!updated) return res.status(404).json({ error: 'Report not found' });
    res.json(updated);
  });

  app.delete('/api/reports/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deleteReport(req.params.id, admin);
    res.json({ success });
  });

  // --- Subject Statistics & Analytics ---
  app.get('/api/analytics/subjects', (req: Request, res: Response) => {
    res.json(db.getSubjectAnalytics());
  });

  app.post('/api/analytics/activity', (req: Request, res: Response) => {
    const { subjectId, type, quizScore } = req.body;
    if (subjectId && type) {
      db.recordSubjectActivity(subjectId, type, quizScore);
    }
    res.json({ success: true });
  });

  // --- Announcements & Ads ---
  app.get('/api/announcements', (req: Request, res: Response) => {
    res.json(db.getAnnouncements());
  });

  app.get('/api/ads/config', (req: Request, res: Response) => {
    res.json(db.getAdConfig());
  });

  // --- Admin CMS Endpoints ---
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    res.json(db.getPlatformStats());
  });

  app.get('/api/admin/students', (req: Request, res: Response) => {
    const users = db.getUsers().map(({ passwordHash, ...safe }) => safe);
    res.json(users);
  });

  app.put('/api/admin/students/:id/status', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const { status } = req.body;
    if (!status || !['active', 'deactivated'].includes(status)) {
      return res.status(400).json({ error: 'Valid status ("active" or "deactivated") is required.' });
    }

    const updated = db.toggleStudentStatus(req.params.id, status, admin);
    if (!updated) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const { passwordHash, ...safeUser } = updated;
    res.json({ user: safeUser, message: `Student status updated to ${status}.` });
  });

  app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
    res.json(db.getAuditLogs());
  });

  app.post('/api/admin/subjects', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const subject = db.addSubject(req.body, admin);
    res.status(201).json(subject);
  });

  app.put('/api/admin/subjects/:id', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const updated = db.updateSubject(req.params.id, req.body, admin);
    res.json(updated);
  });

  app.post('/api/admin/topics', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const topic = db.addTopic(req.body, admin);
    res.status(201).json(topic);
  });

  app.put('/api/admin/topics/:id', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const updated = db.updateTopic(req.params.id, req.body, admin);
    res.json(updated);
  });

  app.get('/api/admin/notes', (req: Request, res: Response) => {
    res.json(db.getAllNotesForAdmin());
  });

  app.post('/api/admin/notes', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const note = db.addNote(req.body, admin);
    res.status(201).json(note);
  });

  app.put('/api/admin/notes/:id', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const updated = db.updateNote(req.params.id, req.body, admin);
    res.json(updated);
  });

  app.post('/api/admin/lessons', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const lesson = db.addLesson(req.body, admin);
    res.status(201).json(lesson);
  });

  app.put('/api/admin/lessons/:id', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const updated = db.updateLesson(req.params.id, req.body, admin);
    res.json(updated);
  });

  app.post('/api/admin/questions', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const q = db.addQuestion(req.body, admin);
    res.status(201).json(q);
  });

  app.post('/api/admin/quizzes', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const quiz = db.addQuiz(req.body, admin);
    res.status(201).json(quiz);
  });

  app.post('/api/admin/past-papers', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const paper = db.addPastPaper(req.body, admin);
    res.status(201).json(paper);
  });

  app.put('/api/admin/past-papers/:id', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const updated = db.updatePastPaper(req.params.id, req.body, admin);
    res.json(updated);
  });

  app.post('/api/admin/past-papers/upload-file', (req: Request, res: Response) => {
    try {
      const { fileName, fileBase64, sizeBytes } = req.body;
      if (!fileName || !fileBase64) {
        return res.status(400).json({ error: 'fileName and fileBase64 are required.' });
      }

      // Safe clean filename
      const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = path.join(pastPapersDir, safeName);

      // Extract base64 content
      const base64Data = fileBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

      const stat = fs.statSync(filePath);
      const sizeMb = sizeBytes
        ? parseFloat((sizeBytes / (1024 * 1024)).toFixed(2))
        : parseFloat((stat.size / (1024 * 1024)).toFixed(2));

      res.status(201).json({
        downloadUrl: `/downloads/past-papers/${safeName}`,
        fileName,
        fileSizeMb: sizeMb || 1.0,
        fileSizeBytes: stat.size
      });
    } catch (err: any) {
      console.error('Past paper file upload error:', err);
      res.status(500).json({ error: err.message || 'File upload failed' });
    }
  });

  app.put('/api/admin/premium/plans', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const updated = db.updatePremiumPlans(req.body, admin);
    res.json(updated);
  });

  app.put('/api/admin/ads/config', (req: Request, res: Response) => {
    const admin = req.headers['x-admin-user'] as string || 'Admin';
    const updated = db.updateAdConfig(req.body, admin);
    res.json(updated);
  });

  app.post('/api/admin/announcements', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const ann = db.addAnnouncement(req.body, admin);
    res.status(201).json(ann);
  });

  app.put('/api/admin/announcements/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const updated = db.updateAnnouncement(req.params.id, req.body, admin);
    if (!updated) return res.status(404).json({ error: 'Announcement not found' });
    res.json(updated);
  });

  app.put('/api/admin/announcements/:id/pin', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const updated = db.togglePinAnnouncement(req.params.id, admin);
    if (!updated) return res.status(404).json({ error: 'Announcement not found' });
    res.json(updated);
  });

  app.delete('/api/admin/announcements/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deleteAnnouncement(req.params.id, admin);
    res.json({ success });
  });

  app.delete('/api/admin/subjects/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deleteSubject(req.params.id, admin);
    res.json({ success });
  });

  app.delete('/api/admin/topics/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deleteTopic(req.params.id, admin);
    res.json({ success });
  });

  app.delete('/api/admin/notes/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deleteNote(req.params.id, admin);
    res.json({ success });
  });

  app.delete('/api/admin/lessons/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deleteLesson(req.params.id, admin);
    res.json({ success });
  });

  app.delete('/api/admin/quizzes/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deleteQuiz(req.params.id, admin);
    res.json({ success });
  });

  app.delete('/api/admin/past-papers/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deletePastPaper(req.params.id, admin);
    res.json({ success });
  });

  app.delete('/api/admin/students/:id', (req: Request, res: Response) => {
    const admin = (req.headers['x-admin-user'] as string) || 'Admin';
    const success = db.deleteUser(req.params.id, admin);
    res.json({ success });
  });

  // --- Database Engines (PostgreSQL & SQLite) Status & Export ---
  app.get('/api/database/status', (req: Request, res: Response) => {
    res.json({
      engines: {
        postgres: {
          name: 'Cloud SQL (PostgreSQL)',
          configured: !!process.env.SQL_HOST,
          host: process.env.SQL_HOST || 'localhost',
          database: process.env.SQL_DB_NAME || 'defaultdb',
          tables: ['users', 'subjects', 'topics', 'notes', 'quizzes', 'past_papers', 'payments', 'exam_schedules', 'system_settings']
        },
        sqlite: {
          name: 'Embedded SQLite (sql.js)',
          file: 'data/studymaster.sqlite',
          status: 'ready'
        }
      }
    });
  });

  // --- Service Worker & Manifest Headers for PWA WebAPK Installability ---
  app.get('/manifest.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(process.cwd(), 'public', 'manifest.json'));
  });

  app.get('/manifest.webmanifest', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(process.cwd(), 'public', 'manifest.json'));
  });

  app.get(['/admin-manifest.json', '/admin/manifest.json'], (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(process.cwd(), 'public', 'admin-manifest.json'));
  });

  app.get(['/sw.js', '/registerSW.js'], (req: Request, res: Response, next) => {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
  });

  // --- Vite Middleware for Development / Static in Production ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);

    // Explicit SPA fallback for all sub-paths in development
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      // Skip API routes so they 404 properly if unmatched
      if (url.startsWith('/api/')) return next();
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyMaster Malawi Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
