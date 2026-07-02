const API_URL = 'http://localhost:5001/api/guidance';

// Helper to check if backend server is online and operational
export const checkBackendStatus = async () => {
  try {
    const res = await fetch(API_URL, { method: 'GET', signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch (e) {
    return false;
  }
};

// Fetch data from MongoDB (with localStorage fallback)
export const getGuidanceData = async () => {
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      // Synchronize localStorage with MongoDB data
      if (data.personalInfo) localStorage.setItem('guidance_user_profile', JSON.stringify(data.personalInfo));
      if (data.academics) {
        localStorage.setItem('guidance_user_academics', JSON.stringify(data.academics));
        localStorage.setItem('guidance_academic_marks', 'true');
      }
      if (data.programmingSkills) localStorage.setItem('guidance_user_programming_skills', JSON.stringify(data.programmingSkills));
      if (data.softSkills) localStorage.setItem('guidance_user_soft_skills', JSON.stringify(data.softSkills));
      if (data.certs) localStorage.setItem('guidance_user_certs', JSON.stringify(data.certs));
      if (data.prediction) localStorage.setItem('guidance_user_prediction', data.prediction);
      return data;
    }
  } catch (error) {
    console.warn('Backend server not connected. Falling back to local storage.');
  }

  // Fallback to local storage
  return {
    personalInfo: JSON.parse(localStorage.getItem('guidance_user_profile') || '{}'),
    academics: JSON.parse(localStorage.getItem('guidance_user_academics') || '{}'),
    programmingSkills: JSON.parse(localStorage.getItem('guidance_user_programming_skills') || '{}'),
    softSkills: JSON.parse(localStorage.getItem('guidance_user_soft_skills') || '{}'),
    certs: JSON.parse(localStorage.getItem('guidance_user_certs') || '[]'),
    prediction: localStorage.getItem('guidance_user_prediction') || 'None',
  };
};

// Save data to MongoDB and update localStorage
export const saveGuidanceData = async (updatedFields) => {
  // First, always update local storage for instant responsiveness
  if (updatedFields.personalInfo) {
    localStorage.setItem('guidance_user_profile', JSON.stringify(updatedFields.personalInfo));
  }
  if (updatedFields.academics) {
    localStorage.setItem('guidance_user_academics', JSON.stringify(updatedFields.academics));
    localStorage.setItem('guidance_academic_marks', 'true');
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
  if (updatedFields.prediction) {
    localStorage.setItem('guidance_user_prediction', updatedFields.prediction);
  }

  // Next, gather full state to send to backend
  const fullPayload = {
    personalInfo: JSON.parse(localStorage.getItem('guidance_user_profile') || '{}'),
    academics: JSON.parse(localStorage.getItem('guidance_user_academics') || '{}'),
    programmingSkills: JSON.parse(localStorage.getItem('guidance_user_programming_skills') || '{}'),
    softSkills: JSON.parse(localStorage.getItem('guidance_user_soft_skills') || '{}'),
    certs: JSON.parse(localStorage.getItem('guidance_user_certs') || '[]'),
    prediction: localStorage.getItem('guidance_user_prediction') || 'None',
    ...updatedFields
  };

  try {
    const res = await fetch(API_URL, {
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
