const BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-powered-academic-and-career-guidance-yu9s.onrender.com';
const API_URL = `${BASE_URL}/api/guidance`;

// Helper to check if backend server is online and operational
export const checkBackendStatus = async () => {
  try {
    const res = await fetch(API_URL, { method: 'GET', signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch (e) {
    return false;
  }
};

// Helper to construct complete academics payload containing both profile and marks states
const getAcademicsState = () => {
  const base = JSON.parse(localStorage.getItem('guidance_user_academics') || '{}');
  
  try {
    const marks = localStorage.getItem('guidance_academic_marks');
    if (marks && marks !== 'true') base.marks = JSON.parse(marks);
  } catch(e){}
  
  const att = localStorage.getItem('guidance_academic_attendance');
  if (att) base.attendance = att;
  
  const hrs = localStorage.getItem('guidance_academic_study_hours');
  if (hrs) base.studyHours = hrs;
  
  const fav = localStorage.getItem('guidance_academic_fav_subject');
  if (fav) base.favSubject = fav;
  
  try {
    const achievements = localStorage.getItem('guidance_academic_achievements');
    if (achievements) base.achievements = JSON.parse(achievements);
  } catch(e){}
  
  return base;
};

// Fetch data from MongoDB (with localStorage fallback)
const getUserEmail = () => {
  try {
    const profile = JSON.parse(localStorage.getItem('guidance_user_profile') || '{}');
    return profile.email || 'default_student';
  } catch (e) {
    return 'default_student';
  }
};

// Register new user with backend MongoDB database
export const registerUser = async (user) => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return await res.json();
  } catch (error) {
    return { error: 'Failed to connect to backend auth server' };
  }
};

// Authenticate user with backend MongoDB database
export const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  } catch (error) {
    return { error: 'Failed to connect to backend auth server' };
  }
};

// Fetch data from MongoDB (with localStorage fallback)
export const getGuidanceData = async () => {
  const email = getUserEmail();
  try {
    const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      // Synchronize localStorage with MongoDB data
      if (data.personalInfo) {
        const localProfile = JSON.parse(localStorage.getItem('guidance_user_profile') || '{}');
        const mergedProfile = {
          ...localProfile,
          ...data.personalInfo,
          email: data.personalInfo.email || localProfile.email || '',
          name: data.personalInfo.name || localProfile.name || ''
        };
        localStorage.setItem('guidance_user_profile', JSON.stringify(mergedProfile));
      }
      if (data.academics) {
        localStorage.setItem('guidance_user_academics', JSON.stringify(data.academics));
        
        // Extract and populate individual keys for AcademicDetails page
        if (data.academics.marks) localStorage.setItem('guidance_academic_marks', JSON.stringify(data.academics.marks));
        if (data.academics.attendance !== undefined) localStorage.setItem('guidance_academic_attendance', data.academics.attendance.toString());
        if (data.academics.studyHours !== undefined) localStorage.setItem('guidance_academic_study_hours', data.academics.studyHours.toString());
        if (data.academics.favSubject !== undefined) localStorage.setItem('guidance_academic_fav_subject', data.academics.favSubject);
        if (data.academics.achievements) localStorage.setItem('guidance_academic_achievements', JSON.stringify(data.academics.achievements));
      }
      if (data.programmingSkills && Object.keys(data.programmingSkills).length > 0) localStorage.setItem('guidance_user_programming_skills', JSON.stringify(data.programmingSkills));
      if (data.softSkills && Object.keys(data.softSkills).length > 0) localStorage.setItem('guidance_user_soft_skills', JSON.stringify(data.softSkills));
      if (data.interests) localStorage.setItem('guidance_user_interests', JSON.stringify(data.interests));
      if (data.certs) localStorage.setItem('guidance_user_certs', JSON.stringify(data.certs));
      if (data.projects) localStorage.setItem('guidance_user_projects', JSON.stringify(data.projects));
      if (data.internships) localStorage.setItem('guidance_user_internships', JSON.stringify(data.internships));
      if (data.hackathons) localStorage.setItem('guidance_user_hackathons', JSON.stringify(data.hackathons));
      if (data.prediction) localStorage.setItem('guidance_user_prediction', data.prediction);
      return data;
    }
  } catch (error) {
    console.warn('Backend server not connected. Falling back to local storage.');
  }

  // Fallback to local storage
  return {
    personalInfo: JSON.parse(localStorage.getItem('guidance_user_profile') || '{}'),
    academics: getAcademicsState(),
    programmingSkills: JSON.parse(localStorage.getItem('guidance_user_programming_skills') || '{}'),
    softSkills: JSON.parse(localStorage.getItem('guidance_user_soft_skills') || '{}'),
    interests: JSON.parse(localStorage.getItem('guidance_user_interests') || '[]'),
    certs: JSON.parse(localStorage.getItem('guidance_user_certs') || '[]'),
    projects: JSON.parse(localStorage.getItem('guidance_user_projects') || '[]'),
    internships: JSON.parse(localStorage.getItem('guidance_user_internships') || '[]'),
    hackathons: JSON.parse(localStorage.getItem('guidance_user_hackathons') || '[]'),
    prediction: localStorage.getItem('guidance_user_prediction') || 'None',
  };
};

// Save data to MongoDB and update localStorage
export const saveGuidanceData = async (updatedFields) => {
  // First, always update local storage for instant responsiveness
  if (updatedFields.personalInfo) {
    const localProfile = JSON.parse(localStorage.getItem('guidance_user_profile') || '{}');
    const mergedProfile = {
      ...localProfile,
      ...updatedFields.personalInfo,
      email: updatedFields.personalInfo.email || localProfile.email || '',
      name: updatedFields.personalInfo.name || localProfile.name || ''
    };
    localStorage.setItem('guidance_user_profile', JSON.stringify(mergedProfile));
  }
  if (updatedFields.academics) {
    // Write full academics details to guidance_user_academics
    const currentFullAcademics = {
      ...getAcademicsState(),
      ...updatedFields.academics
    };
    localStorage.setItem('guidance_user_academics', JSON.stringify(currentFullAcademics));
    
    // Also update individual keys in localStorage
    if (updatedFields.academics.marks) localStorage.setItem('guidance_academic_marks', JSON.stringify(updatedFields.academics.marks));
    if (updatedFields.academics.attendance !== undefined) localStorage.setItem('guidance_academic_attendance', updatedFields.academics.attendance.toString());
    if (updatedFields.academics.studyHours !== undefined) localStorage.setItem('guidance_academic_study_hours', updatedFields.academics.studyHours.toString());
    if (updatedFields.academics.favSubject !== undefined) localStorage.setItem('guidance_academic_fav_subject', updatedFields.academics.favSubject);
    if (updatedFields.academics.achievements) localStorage.setItem('guidance_academic_achievements', JSON.stringify(updatedFields.academics.achievements));
  }
  if (updatedFields.programmingSkills) {
    localStorage.setItem('guidance_user_programming_skills', JSON.stringify(updatedFields.programmingSkills));
  }
  if (updatedFields.softSkills) {
    localStorage.setItem('guidance_user_soft_skills', JSON.stringify(updatedFields.softSkills));
  }
  if (updatedFields.certs) {
    localStorage.setItem('guidance_user_certs', JSON.stringify(updatedFields.certs));
  }
  if (updatedFields.projects) {
    localStorage.setItem('guidance_user_projects', JSON.stringify(updatedFields.projects));
  }
  if (updatedFields.internships) {
    localStorage.setItem('guidance_user_internships', JSON.stringify(updatedFields.internships));
  }
  if (updatedFields.hackathons) {
    localStorage.setItem('guidance_user_hackathons', JSON.stringify(updatedFields.hackathons));
  }
  if (updatedFields.interests) {
    localStorage.setItem('guidance_user_interests', JSON.stringify(updatedFields.interests));
  }
  if (updatedFields.prediction) {
    localStorage.setItem('guidance_user_prediction', updatedFields.prediction);
  }

  const email = getUserEmail();
  // Next, gather full state to send to backend
  const fullPayload = {
    userId: email,
    personalInfo: JSON.parse(localStorage.getItem('guidance_user_profile') || '{}'),
    academics: getAcademicsState(),
    programmingSkills: JSON.parse(localStorage.getItem('guidance_user_programming_skills') || '{}'),
    softSkills: JSON.parse(localStorage.getItem('guidance_user_soft_skills') || '{}'),
    interests: JSON.parse(localStorage.getItem('guidance_user_interests') || '[]'),
    certs: JSON.parse(localStorage.getItem('guidance_user_certs') || '[]'),
    projects: JSON.parse(localStorage.getItem('guidance_user_projects') || '[]'),
    internships: JSON.parse(localStorage.getItem('guidance_user_internships') || '[]'),
    hackathons: JSON.parse(localStorage.getItem('guidance_user_hackathons') || '[]'),
    prediction: localStorage.getItem('guidance_user_prediction') || 'None',
    ...updatedFields,
    // Ensure nested academics object is fully populated
    academics: {
      ...getAcademicsState(),
      ...(updatedFields.academics || {})
    }
  };

  try {
    const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullPayload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('Backend server not connected. Changes saved to local storage.');
  }

  return fullPayload;
};

// Fetch dynamic prediction from scikit-learn ML backend
export const getMLPrediction = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to connect to backend ML prediction API', error);
  }
  return null;
};
