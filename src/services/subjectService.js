// Subject service with Supabase integration
import { supabaseService } from './supabaseService';

// Fallback localStorage for development
const STORAGE_KEYS = {
  SUBJECTS: 'subjects',
  VIDEOS: 'videos',
  QUIZZES: 'quizzes',
  PROGRESS: 'progress'
};

// Initialize default data if not exists (fallback)
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    const defaultSubjects = [
      {
        id: 'math',
        name: 'Mathematics',
        description: 'Comprehensive mathematics course covering Algebra, Calculus, Geometry, and Statistics',
        color: '#4CAF50',
        icon: '🧮',
        enabled: true
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        description: 'Complete chemistry course including Organic, Inorganic, and Physical Chemistry',
        color: '#2196F3',
        icon: '🧪',
        enabled: true
      },
      {
        id: 'physics',
        name: 'Physics',
        description: 'Physics course covering Mechanics, Thermodynamics, and Electromagnetism',
        color: '#FF9800',
        icon: '⚛️',
        enabled: true
      }
    ];
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(defaultSubjects));
  }

  if (!localStorage.getItem(STORAGE_KEYS.VIDEOS)) {
    const sampleVideos = [
      {
        id: 'math_1',
        subject_id: 'math',
        title: 'Introduction to Algebra',
        description: 'Learn the basics of algebra',
        youtube_url: 'https://www.youtube.com/watch?v=NybHckSEQBI',
        order: 1,
        duration: '10:30'
      },
      {
        id: 'math_2',
        subject_id: 'math',
        title: 'Calculus Fundamentals',
        description: 'Understanding derivatives and integrals',
        youtube_url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
        order: 2,
        duration: '15:45'
      },
      {
        id: 'chemistry_1',
        subject_id: 'chemistry',
        title: 'Organic Chemistry Basics',
        description: 'Introduction to organic compounds',
        youtube_url: 'https://www.youtube.com/watch?v=7-dQKxST9pw',
        order: 1,
        duration: '12:20'
      },
      {
        id: 'chemistry_2',
        subject_id: 'chemistry',
        title: 'Chemical Reactions',
        description: 'Types of chemical reactions',
        youtube_url: 'https://www.youtube.com/watch?v=8mY9RMym6KA',
        order: 2,
        duration: '14:10'
      },
      {
        id: 'physics_1',
        subject_id: 'physics',
        title: 'Newton\'s Laws of Motion',
        description: 'Fundamental principles of mechanics',
        youtube_url: 'https://www.youtube.com/watch?v=6H1f7K9o7jE',
        order: 1,
        duration: '11:55'
      },
      {
        id: 'physics_2',
        subject_id: 'physics',
        title: 'Thermodynamics',
        description: 'Laws of thermodynamics',
        youtube_url: 'https://www.youtube.com/watch?v=4KW8xJZJl9I',
        order: 2,
        duration: '13:40'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(sampleVideos));
  }

  if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
    const sampleQuizzes = [
      {
        id: 'math_quiz_1',
        subject_id: 'math',
        title: 'Algebra Basics Quiz',
        description: 'Test your knowledge of basic algebra',
        questions: [
          {
            id: 'q1',
            question: 'What is 2 + 2?',
            options: ['3', '4', '5', '6'],
            correct_answer: '4'
          },
          {
            id: 'q2',
            question: 'Solve for x: 2x = 10',
            options: ['3', '4', '5', '6'],
            correct_answer: '5'
          }
        ]
      },
      {
        id: 'chemistry_quiz_1',
        subject_id: 'chemistry',
        title: 'Organic Chemistry Quiz',
        description: 'Test your understanding of organic compounds',
        questions: [
          {
            id: 'q1',
            question: 'What is the chemical formula for water?',
            options: ['H2O', 'CO2', 'O2', 'N2'],
            correct_answer: 'H2O'
          },
          {
            id: 'q2',
            question: 'What is the pH of pure water?',
            options: ['0', '7', '14', '10'],
            correct_answer: '7'
          }
        ]
      },
      {
        id: 'physics_quiz_1',
        subject_id: 'physics',
        title: 'Mechanics Quiz',
        description: 'Test your knowledge of Newton\'s laws',
        questions: [
          {
            id: 'q1',
            question: 'What is the SI unit of force?',
            options: ['Newton', 'Joule', 'Watt', 'Pascal'],
            correct_answer: 'Newton'
          },
          {
            id: 'q2',
            question: 'An object at rest stays at rest according to which law?',
            options: ['First law', 'Second law', 'Third law', 'Gravity law'],
            correct_answer: 'First law'
          }
        ]
      }
    ];
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(sampleQuizzes));
  }
};

initializeData();

export const subjectService = {
  // Subjects
  async getSubjects() {
    try {
      const subjects = await supabaseService.getSubjects();
      return subjects;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      const subjects = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]');
      return subjects.filter(s => s.enabled);
    }
  },

  async getSubjectById(subjectId) {
    try {
      const subject = await supabaseService.getSubjectById(subjectId);
      return subject;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const subjects = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]');
          const subject = subjects.find(s => s.id === subjectId);
          if (subject) {
            resolve(subject);
          } else {
            reject(new Error('Subject not found'));
          }
        }, 500);
      });
    }
  },

  async createSubject(subjectData) {
    try {
      const newSubject = await supabaseService.createSubject(subjectData);
      return newSubject;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      const subjects = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]');
      const subject = {
        id: subjectData.id || `subject_${Date.now()}`,
        ...subjectData,
        enabled: subjectData.enabled !== false,
        created_at: new Date().toISOString()
      };
      subjects.push(subject);
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      return subject;
    }
  },

  async updateSubject(subjectId, subjectData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const subjects = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]');
          const index = subjects.findIndex(s => s.id === subjectId);
          if (index !== -1) {
            subjects[index] = { ...subjects[index], ...subjectData };
            localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
            resolve(subjects[index]);
          } else {
            reject(new Error('Subject not found'));
          }
        } catch (error) {
          reject(new Error('Failed to update subject'));
        }
      }, 500);
    });
  },

  async deleteSubject(subjectId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const subjects = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]');
          const filtered = subjects.filter(s => s.id !== subjectId);
          localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(filtered));
          
          // Also delete related videos and quizzes
          const videos = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIDEOS) || '[]');
          const filteredVideos = videos.filter(v => v.subjectId !== subjectId);
          localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(filteredVideos));
          
          const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES) || '[]');
          const filteredQuizzes = quizzes.filter(q => q.subjectId !== subjectId);
          localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(filteredQuizzes));
          
          resolve(true);
        } catch (error) {
          reject(new Error('Failed to delete subject'));
        }
      }, 500);
    });
  },

  // Videos
  async getVideosBySubject(subjectId) {
    try {
      const videos = await supabaseService.getVideosBySubject(subjectId);
      return videos;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      const videos = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIDEOS) || '[]');
      return videos.filter(v => v.subject_id === subjectId || v.subjectId === subjectId).sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  },

  async getVideoById(videoId) {
    try {
      const video = await supabaseService.getVideoById(videoId);
      return video;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const videos = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIDEOS) || '[]');
          const video = videos.find(v => v.id === videoId);
          if (video) {
            resolve(video);
          } else {
            reject(new Error('Video not found'));
          }
        }, 500);
      });
    }
  },

  async createVideo(videoData) {
    try {
      // Normalize video data for Supabase
      const normalizedData = {
        subject_id: videoData.subjectId,
        title: videoData.title,
        description: videoData.description || '',
        url: videoData.url,
        topic: videoData.topic || 'General',
        order: videoData.order || 1,
        duration: videoData.duration || ''
      };
      const video = await supabaseService.createVideo(normalizedData);
      return video;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const videos = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIDEOS) || '[]');
            const newVideo = {
              id: `video_${Date.now()}`,
              ...videoData,
              createdAt: new Date().toISOString()
            };
            videos.push(newVideo);
            localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
            resolve(newVideo);
          } catch (err) {
            reject(new Error('Failed to create video'));
          }
        }, 500);
      });
    }
  },

  async updateVideo(videoId, videoData) {
    try {
      const normalizedData = {
        title: videoData.title,
        description: videoData.description,
        url: videoData.url,
        topic: videoData.topic,
        order: videoData.order,
        duration: videoData.duration
      };
      const video = await supabaseService.updateVideo(videoId, normalizedData);
      return video;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const videos = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIDEOS) || '[]');
            const index = videos.findIndex(v => v.id === videoId);
            if (index !== -1) {
              videos[index] = { ...videos[index], ...videoData };
              localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
              resolve(videos[index]);
            } else {
              reject(new Error('Video not found'));
            }
          } catch (err) {
            reject(new Error('Failed to update video'));
          }
        }, 500);
      });
    }
  },

  async deleteVideo(videoId) {
    try {
      await supabaseService.deleteVideo(videoId);
      return true;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const videos = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIDEOS) || '[]');
            const filtered = videos.filter(v => v.id !== videoId);
            localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(filtered));
            resolve(true);
          } catch (err) {
            reject(new Error('Failed to delete video'));
          }
        }, 500);
      });
    }
  },

  // Quizzes
  async getQuizzesBySubject(subjectId) {
    try {
      const quizzes = await supabaseService.getQuizzesBySubject(subjectId);
      return quizzes;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES) || '[]');
      return quizzes.filter(q => q.subject_id === subjectId || q.subjectId === subjectId);
    }
  },

  async getQuizById(quizId) {
    try {
      const quiz = await supabaseService.getQuizById(quizId);
      return quiz;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES) || '[]');
          const quiz = quizzes.find(q => q.id === quizId);
          if (quiz) {
            resolve(quiz);
          } else {
            reject(new Error('Quiz not found'));
          }
        }, 500);
      });
    }
  },

  async createQuiz(quizData) {
    try {
      // Normalize quiz data for Supabase
      const normalizedData = {
        subject_id: quizData.subjectId,
        title: quizData.title,
        description: quizData.description || '',
        type: quizData.type || 'practice',
        time_limit: quizData.timeLimit || 600,
        passing_score: quizData.passingScore || 70,
        questions: quizData.questions.map(q => ({
          question: q.question,
          options: q.options,
          correct_answer: q.correctAnswer,
          points: q.points || 1
        }))
      };
      const quiz = await supabaseService.createQuiz(normalizedData);
      return quiz;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES) || '[]');
            const newQuiz = {
              id: `quiz_${Date.now()}`,
              ...quizData,
              createdAt: new Date().toISOString()
            };
            quizzes.push(newQuiz);
            localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
            resolve(newQuiz);
          } catch (err) {
            reject(new Error('Failed to create quiz'));
          }
        }, 500);
      });
    }
  },

  async updateQuiz(quizId, quizData) {
    try {
      const normalizedData = {
        title: quizData.title,
        description: quizData.description,
        type: quizData.type,
        time_limit: quizData.timeLimit,
        passing_score: quizData.passingScore,
        questions: quizData.questions ? quizData.questions.map(q => ({
          question: q.question,
          options: q.options,
          correct_answer: q.correctAnswer,
          points: q.points || 1
        })) : undefined
      };
      const quiz = await supabaseService.updateQuiz(quizId, normalizedData);
      return quiz;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES) || '[]');
            const index = quizzes.findIndex(q => q.id === quizId);
            if (index !== -1) {
              quizzes[index] = { ...quizzes[index], ...quizData };
              localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
              resolve(quizzes[index]);
            } else {
              reject(new Error('Quiz not found'));
            }
          } catch (err) {
            reject(new Error('Failed to update quiz'));
          }
        }, 500);
      });
    }
  },

  async deleteQuiz(quizId) {
    try {
      await supabaseService.deleteQuiz(quizId);
      return true;
    } catch (error) {
      console.warn('Supabase not available, using localStorage fallback:', error.message);
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES) || '[]');
            const filtered = quizzes.filter(q => q.id !== quizId);
            localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(filtered));
            resolve(true);
          } catch (err) {
            reject(new Error('Failed to delete quiz'));
          }
        }, 500);
      });
    }
  },

  // Progress tracking
  async saveProgress(userId, subjectId, videoId, watched = false) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const progress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '[]');
        const existing = progress.find(
          p => p.userId === userId && p.subjectId === subjectId && p.videoId === videoId
        );
        
        if (existing) {
          existing.watched = watched;
          existing.updatedAt = new Date().toISOString();
        } else {
          progress.push({
            userId,
            subjectId,
            videoId,
            watched,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
        resolve(true);
      }, 300);
    });
  },

  async getProgress(userId, subjectId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const progress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '[]');
        resolve(progress.filter(p => p.userId === userId && p.subjectId === subjectId));
      }, 300);
    });
  }
};

