// Supabase Service - Handles all database operations
import { supabase, TABLES } from '../config/supabase';

export const supabaseService = {
  // Auth Operations
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // User Operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getUserById(userId) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Subject Operations
  async getSubjects() {
    const { data, error } = await supabase
      .from(TABLES.SUBJECTS)
      .select('*')
      .eq('enabled', true)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getSubjectById(subjectId) {
    const { data, error } = await supabase
      .from(TABLES.SUBJECTS)
      .select('*')
      .eq('id', subjectId)
      .single();
    if (error) throw error;
    return data;
  },

  async createSubject(subjectData) {
    const { data, error } = await supabase
      .from(TABLES.SUBJECTS)
      .insert([subjectData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateSubject(subjectId, updates) {
    const { data, error } = await supabase
      .from(TABLES.SUBJECTS)
      .update(updates)
      .eq('id', subjectId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteSubject(subjectId) {
    const { error } = await supabase
      .from(TABLES.SUBJECTS)
      .delete()
      .eq('id', subjectId);
    if (error) throw error;
  },

  // Video Operations
  async getVideosBySubject(subjectId) {
    const { data, error } = await supabase
      .from(TABLES.VIDEOS)
      .select('*')
      .eq('subject_id', subjectId)
      .order('order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getVideoById(videoId) {
    const { data, error } = await supabase
      .from(TABLES.VIDEOS)
      .select('*')
      .eq('id', videoId)
      .single();
    if (error) throw error;
    return data;
  },

  async createVideo(videoData) {
    const { data, error } = await supabase
      .from(TABLES.VIDEOS)
      .insert([videoData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateVideo(videoId, updates) {
    const { data, error } = await supabase
      .from(TABLES.VIDEOS)
      .update(updates)
      .eq('id', videoId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteVideo(videoId) {
    const { error } = await supabase
      .from(TABLES.VIDEOS)
      .delete()
      .eq('id', videoId);
    if (error) throw error;
  },

  // Quiz Operations
  async getQuizzesBySubject(subjectId) {
    const { data, error } = await supabase
      .from(TABLES.QUIZZES)
      .select('*, questions(*)')
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getQuizById(quizId) {
    const { data, error } = await supabase
      .from(TABLES.QUIZZES)
      .select('*, questions(*)')
      .eq('id', quizId)
      .single();
    if (error) throw error;
    return data;
  },

  async createQuiz(quizData) {
    const { questions, ...quizInfo } = quizData;
    
    // Create quiz first
    const { data: quiz, error: quizError } = await supabase
      .from(TABLES.QUIZZES)
      .insert([quizInfo])
      .select()
      .single();
    
    if (quizError) throw quizError;

    // Create questions if provided
    if (questions && questions.length > 0) {
      const questionsWithQuizId = questions.map(q => ({
        ...q,
        quiz_id: quiz.id
      }));
      
      const { error: questionsError } = await supabase
        .from(TABLES.QUESTIONS)
        .insert(questionsWithQuizId);
      
      if (questionsError) throw questionsError;
    }

    // Fetch complete quiz with questions
    const { data: completeQuiz, error } = await supabase
      .from(TABLES.QUIZZES)
      .select('*, questions(*)')
      .eq('id', quiz.id)
      .single();
    
    if (error) throw error;
    return completeQuiz;
  },

  async updateQuiz(quizId, quizData) {
    const { questions, ...quizInfo } = quizData;
    
    // Update quiz
    const { data: quiz, error: quizError } = await supabase
      .from(TABLES.QUIZZES)
      .update(quizInfo)
      .eq('id', quizId)
      .select()
      .single();
    
    if (quizError) throw quizError;

    // Update questions if provided
    if (questions) {
      // Delete existing questions
      await supabase
        .from(TABLES.QUESTIONS)
        .delete()
        .eq('quiz_id', quizId);

      // Insert new questions
      if (questions.length > 0) {
        const questionsWithQuizId = questions.map(q => ({
          ...q,
          quiz_id: quizId
        }));
        
        const { error: questionsError } = await supabase
          .from(TABLES.QUESTIONS)
          .insert(questionsWithQuizId);
        
        if (questionsError) throw questionsError;
      }
    }

    // Fetch complete quiz
    const { data: completeQuiz, error } = await supabase
      .from(TABLES.QUIZZES)
      .select('*, questions(*)')
      .eq('id', quizId)
      .single();
    
    if (error) throw error;
    return completeQuiz;
  },

  async deleteQuiz(quizId) {
    // Delete questions first
    await supabase
      .from(TABLES.QUESTIONS)
      .delete()
      .eq('quiz_id', quizId);

    // Delete quiz
    const { error } = await supabase
      .from(TABLES.QUIZZES)
      .delete()
      .eq('id', quizId);
    
    if (error) throw error;
  },

  // Subscription Operations
  async createSubscription(subscriptionData) {
    const { data, error } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .insert([subscriptionData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateSubscription(subscriptionId, updates) {
    const { data, error } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getUserSubscription(userId) {
    const { data, error } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  // Payment Operations
  async createPayment(paymentData) {
    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .insert([paymentData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updatePayment(paymentId, updates) {
    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Progress Operations
  async saveProgress(progressData) {
    const { data, error } = await supabase
      .from(TABLES.PROGRESS)
      .upsert(progressData, { onConflict: 'user_id,subject_id,video_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProgress(userId, subjectId) {
    const { data, error } = await supabase
      .from(TABLES.PROGRESS)
      .select('*')
      .eq('user_id', userId)
      .eq('subject_id', subjectId);
    if (error) throw error;
    return data;
  },

  // Quiz Results
  async saveQuizResult(resultData) {
    const { data, error } = await supabase
      .from(TABLES.QUIZ_RESULTS)
      .insert([resultData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getQuizResults(userId, quizId) {
    const { data, error } = await supabase
      .from(TABLES.QUIZ_RESULTS)
      .select('*')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

