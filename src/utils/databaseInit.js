import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';

/**
 * Initialize the database with sample data for testing
 * This should only be run once in development
 */
export async function initializeDatabase(currentUser) {
  if (!currentUser) {
    console.error('User must be logged in to initialize database');
    return;
  }

  try {
    // Check if we already have lessons
    const lessonsQuery = query(collection(db, 'lessons'));
    const lessonsSnapshot = await getDocs(lessonsQuery);
    
    if (!lessonsSnapshot.empty) {
      console.log('Database already contains lessons. Skipping initialization.');
      return;
    }

    // Create sample skills
    const skills = [
      {
        id: 'skill1',
        name: 'JavaScript Programming',
        category: 'Technology',
        description: 'Learn modern JavaScript programming from basics to advanced concepts.',
        createdAt: serverTimestamp()
      },
      {
        id: 'skill2',
        name: 'Spanish Language',
        category: 'Languages',
        description: 'Conversational Spanish for beginners and intermediate learners.',
        createdAt: serverTimestamp()
      },
      {
        id: 'skill3',
        name: 'Yoga Basics',
        category: 'Fitness',
        description: 'Introduction to yoga poses and breathing techniques for beginners.',
        createdAt: serverTimestamp()
      }
    ];

    // Add skills to database
    for (const skill of skills) {
      await setDoc(doc(db, 'skills', skill.id), skill);
    }

    // Create sample users (if they don't exist)
    const users = [
      {
        uid: 'user1',
        name: 'Carlos Rodriguez',
        email: 'carlos@example.com',
        skills: [{ id: 'skill2', name: 'Spanish Language' }],
        bio: 'Native Spanish speaker with 5 years of teaching experience.',
        timeCredits: 10,
        createdAt: serverTimestamp()
      },
      {
        uid: 'user2',
        name: 'Emily Chen',
        email: 'emily@example.com',
        skills: [{ id: 'skill1', name: 'JavaScript Programming' }],
        bio: 'Full-stack developer with expertise in JavaScript and React.',
        timeCredits: 5,
        createdAt: serverTimestamp()
      },
      {
        uid: 'user3',
        name: 'Anika Patel',
        email: 'anika@example.com',
        skills: [{ id: 'skill3', name: 'Yoga Basics' }],
        bio: 'Certified yoga instructor with 200+ hours of training.',
        timeCredits: 8,
        createdAt: serverTimestamp()
      }
    ];

    // Add users to database (skip if they already exist)
    for (const user of users) {
      const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        await setDoc(doc(db, 'users', user.uid), user);
      }
    }

    // Create sample lessons
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const lessons = [
      {
        id: 'lesson1',
        skillId: 'skill2',
        skillName: 'Spanish Language',
        studentId: currentUser.uid,
        studentName: currentUser.displayName || 'Current User',
        teacherId: 'user1',
        teacherName: 'Carlos Rodriguez',
        status: 'scheduled',
        scheduledDate: tomorrow,
        createdAt: serverTimestamp(),
        isRealTime: true
      },
      {
        id: 'lesson2',
        skillId: 'skill1',
        skillName: 'JavaScript Programming',
        studentId: 'user2',
        studentName: 'Emily Chen',
        teacherId: currentUser.uid,
        teacherName: currentUser.displayName || 'Current User',
        status: 'scheduled',
        scheduledDate: nextWeek,
        createdAt: serverTimestamp(),
        isRealTime: true
      }
    ];

    // Add lessons to database
    for (const lesson of lessons) {
      await setDoc(doc(db, 'lessons', lesson.id), lesson);
    }

    console.log('Database initialized successfully with sample data');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

/**
 * Check if the current user has any lessons
 * If not, prompt them to initialize the database
 */
export async function checkUserLessons(currentUser) {
  if (!currentUser) return false;

  try {
    // Check if user has any lessons as student or teacher
    const lessonsQuery = query(
      collection(db, 'lessons'),
      where('studentId', '==', currentUser.uid)
    );
    
    const lessonsSnapshot = await getDocs(lessonsQuery);
    
    return !lessonsSnapshot.empty;
  } catch (error) {
    console.error('Error checking user lessons:', error);
    return false;
  }
}
