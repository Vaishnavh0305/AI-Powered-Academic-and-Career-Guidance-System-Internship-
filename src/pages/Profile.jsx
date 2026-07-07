import React, { useState, useEffect } from 'react';
import { getGuidanceData, saveGuidanceData } from '../services/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  Slider,
  Chip,
  MenuItem,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Avatar,
  CardActions,
  InputAdornment} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Star as StarIcon,
  WorkspacePremium as CertIcon,
  Add as AddIcon} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);

  const [dobFocused, setDobFocused] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState(() => {
    const saved = localStorage.getItem('guidance_user_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      address: '',
      profilePhoto: ''};
  });

  const [academicDetails, setAcademicDetails] = useState(() => {
    const saved = localStorage.getItem('guidance_user_academics');
    return saved ? JSON.parse(saved) : {
      school: '',
      college: '',
      currentEducation: '',
      cgpa: '',
      marks10: '',
      marks12: '',
      branch: '',
      semester: ''};
  });

  const defaultProgrammingSkills = { Python: 0, Java: 0, 'C++': 0, JavaScript: 0, SQL: 0 };
  const defaultSoftSkills = { Communication: 0, Leadership: 0, 'Problem Solving': 0, 'Critical Thinking': 0, 'Team Work': 0 };

  const [programmingSkills, setProgrammingSkills] = useState(() => {
    const saved = localStorage.getItem('guidance_user_programming_skills');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultProgrammingSkills, ...parsed };
    }
    return { ...defaultProgrammingSkills };
  });

  const [softSkills, setSoftSkills] = useState(() => {
    const saved = localStorage.getItem('guidance_user_soft_skills');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSoftSkills, ...parsed };
    }
    return { ...defaultSoftSkills };
  });

  // Projects, Internships, Hackathons, Certifications tags states
  const [projectInput, setProjectInput] = useState('');
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('guidance_user_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [internshipInput, setInternshipInput] = useState('');
  const [internships, setInternships] = useState(() => {
    const saved = localStorage.getItem('guidance_user_internships');
    return saved ? JSON.parse(saved) : [];
  });

  const [hackathonInput, setHackathonInput] = useState('');
  const [hackathons, setHackathons] = useState(() => {
    const saved = localStorage.getItem('guidance_user_hackathons');
    return saved ? JSON.parse(saved) : [];
  });

  const [certInput, setCertInput] = useState('');
  const [certs, setCerts] = useState(() => {
    const saved = localStorage.getItem('guidance_user_certs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await getGuidanceData();
      if (data.personalInfo && Object.keys(data.personalInfo).length > 0) setPersonalInfo(data.personalInfo);
      if (data.academics && Object.keys(data.academics).length > 0) setAcademicDetails(data.academics);
      if (data.programmingSkills && Object.keys(data.programmingSkills).length > 0) {
        setProgrammingSkills(prev => ({ ...prev, ...data.programmingSkills }));
      }
      if (data.softSkills && Object.keys(data.softSkills).length > 0) {
        setSoftSkills(prev => ({ ...prev, ...data.softSkills }));
      }
      if (data.certs && data.certs.length > 0) setCerts(data.certs);
      if (data.projects && data.projects.length > 0) setProjects(data.projects);
      if (data.internships && data.internships.length > 0) setInternships(data.internships);
      if (data.hackathons && data.hackathons.length > 0) setHackathons(data.hackathons);
    };
    loadData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSave = async () => {
    await saveGuidanceData({
      personalInfo,
      academics: academicDetails,
      programmingSkills,
      softSkills,
      certs,
      projects,
      internships,
      hackathons,
    });
    setToastOpen(true);
  };

  const handleAddTag = (list, setList, val, setVal) => {
    if (val.trim() && !list.includes(val.trim())) {
      setList([...list, val.trim()]);
      setVal('');
    }
  };

  const handleRemoveTag = (list, setList, itemToRemove) => {
    setList(list.filter((item) => item !== itemToRemove));
  };

  return (
    <RouteTransition>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif' }}>
            Student Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your personal data, credentials, and verify AI-calibrated skills.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" onClick={handleSave} sx={{ fontWeight: 700 }}>
          Save Changes
        </Button>
      </Box>

      {/* Modern Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          mb: 4,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          '& .MuiTab-root': { fontWeight: 700, fontSize: '0.95rem' }}}
      >
        <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Info" />
        <Tab icon={<SchoolIcon />} iconPosition="start" label="Academics" />
        <Tab icon={<CodeIcon />} iconPosition="start" label="Skills Matrix" />
        <Tab icon={<CertIcon />} iconPosition="start" label="Experience & Achievements" />
      </Tabs>

      {/* Tab Panels */}
      {activeTab === 0 && (
        <GlassCard>
          <Box sx={{ p: 3, mb: 3 }} borderBottom="1px solid rgba(255,255,255,0.05)">
            <Typography variant="h6" fontWeight={700}>Personal Details</Typography>
            <Typography variant="caption" color="text.secondary">Your profile basics and correspondence address</Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            {/* Direct Profile Photo Upload Section */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3, mb: 4, pb: 4, borderBottom: '1px dashed rgba(255, 255, 255, 0.08)' }}>
              <Avatar
                src={personalInfo.profilePhoto}
                alt={personalInfo.name}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main', 
                  fontSize: '2rem', 
                  fontWeight: 700,
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {personalInfo.name ? personalInfo.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  color="primary"
                  sx={{ mb: 1, mr: 1 }}
                >
                  Upload Profile Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPersonalInfo({ ...personalInfo, profilePhoto: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </Button>
                {personalInfo.profilePhoto && (
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    sx={{ mb: 1 }}
                    onClick={() => setPersonalInfo({ ...personalInfo, profilePhoto: '' })}
                  >
                    Remove Photo
                  </Button>
                )}
                <Typography variant="caption" display="block" color="text.secondary">
                  Supported formats: JPG, PNG, GIF. Directly converted and stored locally.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type={dobFocused || personalInfo.dob ? "date" : "text"}
                  onFocus={() => setDobFocused(true)}
                  onBlur={() => setDobFocused(false)}
                  placeholder={dobFocused ? "dd-mm-yyyy" : ""}
                  InputLabelProps={{ shrink: dobFocused || !!personalInfo.dob }}
                  value={personalInfo.dob || ''}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={personalInfo.gender}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: 0 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Correspondence Address"
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                />
              </Box>

            </Box>
          </Box>
        </GlassCard>
      )}

      {activeTab === 1 && (
        <GlassCard>
          <Box sx={{ p: 3, mb: 3 }} borderBottom="1px solid rgba(255,255,255,0.05)">
            <Typography variant="h6" fontWeight={700}>Academic Information</Typography>
            <Typography variant="caption" color="text.secondary">Current education milestones and past scores</Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Secondary School"
                  value={academicDetails.school}
                  onChange={(e) => setAcademicDetails({ ...academicDetails, school: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Junior/Senior College"
                  value={academicDetails.college}
                  onChange={(e) => setAcademicDetails({ ...academicDetails, college: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  select
                  label="Current Education Level"
                  value={academicDetails.currentEducation}
                  onChange={(e) => setAcademicDetails({ ...academicDetails, currentEducation: e.target.value })}
                >
                  <MenuItem value="Class 10">Class 10 Student</MenuItem>
                  <MenuItem value="Class 12">Class 12 Student</MenuItem>
                  <MenuItem value="Undergraduate">College Student (Undergraduate Sci/Tech)</MenuItem>
                  <MenuItem value="Undergraduate (Commerce)">College Student (Undergraduate Commerce)</MenuItem>
                  <MenuItem value="Graduate">Graduate Student</MenuItem>
                </TextField>
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Current CGPA / Percentage"
                  value={academicDetails.cgpa}
                  onChange={(e) => setAcademicDetails({ ...academicDetails, cgpa: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="10th Marks (%)"
                  value={academicDetails.marks10}
                  onChange={(e) => setAcademicDetails({ ...academicDetails, marks10: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="12th Marks (%)"
                  value={academicDetails.marks12}
                  onChange={(e) => setAcademicDetails({ ...academicDetails, marks12: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Branch / Stream"
                  value={academicDetails.branch}
                  onChange={(e) => setAcademicDetails({ ...academicDetails, branch: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <TextField
                  fullWidth
                  label="Current Semester / Year"
                  value={academicDetails.semester}
                  onChange={(e) => setAcademicDetails({ ...academicDetails, semester: e.target.value })}
                />
              </Box>
            </Box>
          </Box>
        </GlassCard>
      )}

      {activeTab === 2 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Programming Skills */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
            <GlassCard sx={{ height: '100%' }}>
              <Box sx={{ p: 3, mb: 3 }} borderBottom="1px solid rgba(255,255,255,0.05)">
                <Typography variant="h6" fontWeight={700}>Programming Skills</Typography>
                <Typography variant="caption" color="text.secondary">Self-rating assessment (1 - 100)</Typography>
              </Box>
              <Box sx={{ p: 3 }} display="flex" flexDirection="column" gap={3}>
                {Object.keys(programmingSkills).map((skill) => (
                  <Box key={skill}>
                    <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between">
                      <Typography variant="body2" fontWeight={600}>{skill}</Typography>
                      <Typography variant="body2" color="secondary" fontWeight={700}>
                        {programmingSkills[skill]}%
                      </Typography>
                    </Box>
                    <Slider
                      value={programmingSkills[skill]}
                      onChange={(e, val) => setProgrammingSkills({ ...programmingSkills, [skill]: val })}
                      color="secondary"
                      valueLabelDisplay="auto"
                    />
                  </Box>
                ))}
              </Box>
            </GlassCard>
          </Box>

          {/* Soft Skills */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
            <GlassCard sx={{ height: '100%' }}>
              <Box sx={{ p: 3, mb: 3 }} borderBottom="1px solid rgba(255,255,255,0.05)">
                <Typography variant="h6" fontWeight={700}>Soft Skills Capabilities</Typography>
                <Typography variant="caption" color="text.secondary">Qualitative assessment rating (1 - 100)</Typography>
              </Box>
              <Box sx={{ p: 3 }} display="flex" flexDirection="column" gap={3}>
                {Object.keys(softSkills).map((skill) => (
                  <Box key={skill}>
                    <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between">
                      <Typography variant="body2" fontWeight={600}>{skill}</Typography>
                      <Typography variant="body2" color="primary.light" fontWeight={700}>
                        {softSkills[skill]}%
                      </Typography>
                    </Box>
                    <Slider
                      value={softSkills[skill]}
                      onChange={(e, val) => setSoftSkills({ ...softSkills, [skill]: val })}
                      color="primary"
                      valueLabelDisplay="auto"
                    />
                  </Box>
                ))}
              </Box>
            </GlassCard>
          </Box>
        </Box>
      )}

      {activeTab === 3 && (
        <GlassCard>
          <Box sx={{ p: 3, mb: 3 }} borderBottom="1px solid rgba(255,255,255,0.05)">
            <Typography variant="h6" fontWeight={700}>Experiences & Achievements</Typography>
            <Typography variant="caption" color="text.secondary">List certifications, projects, internships and hackathons.</Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              
              {/* Projects Input */}
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Academic & Self Projects
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add Project name"
                    value={projectInput}
                    onChange={(e) => setProjectInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(projects, setProjects, projectInput, setProjectInput)}
                  />
                  <Button variant="outlined" onClick={() => handleAddTag(projects, setProjects, projectInput, setProjectInput)}>
                    <AddIcon />
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {projects.map((proj) => (
                    <Chip key={proj} label={proj} onDelete={() => handleRemoveTag(projects, setProjects, proj)} color="primary" variant="outlined" />
                  ))}
                </Box>
              </Box>

              {/* Internships Input */}
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Internships
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add Internship"
                    value={internshipInput}
                    onChange={(e) => setInternshipInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(internships, setInternships, internshipInput, setInternshipInput)}
                  />
                  <Button variant="outlined" onClick={() => handleAddTag(internships, setInternships, internshipInput, setInternshipInput)}>
                    <AddIcon />
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {internships.map((intern) => (
                    <Chip key={intern} label={intern} onDelete={() => handleRemoveTag(internships, setInternships, intern)} color="secondary" variant="outlined" />
                  ))}
                </Box>
              </Box>

              {/* Hackathons Input */}
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Hackathons Competed
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add Hackathon"
                    value={hackathonInput}
                    onChange={(e) => setHackathonInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(hackathons, setHackathons, hackathonInput, setHackathonInput)}
                  />
                  <Button variant="outlined" onClick={() => handleAddTag(hackathons, setHackathons, hackathonInput, setHackathonInput)}>
                    <AddIcon />
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {hackathons.map((hack) => (
                    <Chip key={hack} label={hack} onDelete={() => handleRemoveTag(hackathons, setHackathons, hack)} color="info" variant="outlined" />
                  ))}
                </Box>
              </Box>

              {/* Certifications Input */}
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Certifications Completed
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add Certification"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(certs, setCerts, certInput, setCertInput)}
                  />
                  <Button variant="outlined" onClick={() => handleAddTag(certs, setCerts, certInput, setCertInput)}>
                    <AddIcon />
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {certs.map((cert) => (
                    <Chip key={cert} label={cert} onDelete={() => handleRemoveTag(certs, setCerts, cert)} color="warning" variant="outlined" />
                  ))}
                </Box>
              </Box>

            </Box>
          </Box>
        </GlassCard>
      )}

      {/* Snackbar toast */}
      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Student profile successfully saved and AI predictions updated!
        </Alert>
      </Snackbar>
    </RouteTransition>
  );

  function setTextInternship(e) {
    setInternshipInput(e.target.value);
  }
};

export default Profile;
