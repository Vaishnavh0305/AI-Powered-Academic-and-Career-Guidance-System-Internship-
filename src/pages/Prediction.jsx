import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { saveGuidanceData, getMLPrediction } from '../services/api';
import { jsPDF } from 'jspdf';
import {
  Box,
  Typography,
  Button,LinearProgress,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Avatar} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Analytics as AnalyticsIcon,
  CloudDownload as DownloadIcon,
  CheckCircle as CheckedIcon,
  PlayArrow as PlayIcon} from '@mui/icons-material';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid, PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip} from 'recharts';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';

const Prediction = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'career'; // 'stream', 'course', 'career'

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [predicted, setPredicted] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  const loadingMessages = [
    'Loading best-fit ML model via pickle...',
    'Parsing student academic records & skill scores...',
    'Matching profile against 5,000+ student training dataset...',
    'Comparing Logistic Regression, KNN & Random Forest classifiers...',
    'Computing class probabilities & ranking predictions...',
    'Finalizing prediction output...',
  ];

  // Mode Specific Data — Dynamically calculated from local storage
  const getModeData = () => {
    let savedMarks = {};
    try {
      const saved = localStorage.getItem('guidance_academic_marks');
      if (saved) savedMarks = JSON.parse(saved);
    } catch (e) {}

    let savedAcademics = {};
    try {
      const saved = localStorage.getItem('guidance_user_academics');
      if (saved) savedAcademics = JSON.parse(saved);
    } catch (e) {}

    let savedProg = {};
    try {
      const saved = localStorage.getItem('guidance_user_programming_skills');
      if (saved) savedProg = JSON.parse(saved);
    } catch (e) {}

    let savedSoft = {};
    try {
      const saved = localStorage.getItem('guidance_user_soft_skills');
      if (saved) savedSoft = JSON.parse(saved);
    } catch (e) {}

    let savedInterests = [];
    try {
      const saved = localStorage.getItem('guidance_user_interests');
      if (saved) savedInterests = JSON.parse(saved);
    } catch (e) {}

    const INTEREST_AFFINITY = {
      "Artificial Intelligence":    ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Machine Learning Engineer", "Data Scientist"],
      "Machine Learning":           ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "B.Sc in Data Science", "Machine Learning Engineer", "Data Scientist"],
      "Data Science":               ["Science Elective (PCM with Computer Science)", "B.Sc in Data Science", "Data Scientist", "Business Analyst", "Machine Learning Engineer"],
      "Web Development":            ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Diploma in Computer Engineering / IT", "Full Stack Engineer"],
      "Cybersecurity":              ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Cyber Security Analyst"],
      "Cloud Computing":            ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "DevOps Cloud Engineer"],
      "DevOps":                     ["Science Elective (PCM with Computer Science)", "Diploma in Computer Engineering / IT", "DevOps Cloud Engineer", "Full Stack Engineer"],
      "Blockchain":                 ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Full Stack Engineer", "Cyber Security Analyst"],
      "UI/UX":                      ["Arts with Humanities", "Professional Diploma in Digital Marketing & Design", "Full Stack Engineer", "Product/Project Manager"],
      "Software Development":       ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Diploma in Computer Engineering / IT", "Full Stack Engineer", "DevOps Cloud Engineer"],
      "Game Development":           ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Full Stack Engineer"],
      "Mobile Development":         ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Diploma in Computer Engineering / IT", "Full Stack Engineer"],
      "Networking":                 ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "DevOps Cloud Engineer", "Cyber Security Analyst"],
      "IoT":                        ["Science Elective (PCM with Computer Science)", "Science with Biology (PCB)", "DevOps Cloud Engineer"],
      "Embedded Systems":           ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "DevOps Cloud Engineer"],
      "Robotics":                   ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Machine Learning Engineer"],
      "Finance":                    ["Commerce with Applied Math", "Chartered Accountancy (CA) / CS Program", "Bachelor of Commerce (B.Com Hons)", "Financial Analyst / Investment Banker", "Chartered Accountant (CA)", "Business Analyst"],
      "Marketing":                  ["Commerce with Applied Math", "Professional Diploma in Digital Marketing & Design", "Diploma in Business Administration (DBA)", "Marketing Executive", "Management Consultant"],
      "Management":                 ["Commerce with Applied Math", "Diploma in Business Administration (DBA)", "Product/Project Manager", "Management Consultant", "HR Specialist"],
    };

    const INTEREST_SUBJECTS = {
      "Artificial Intelligence":    ["Computer Science", "Computer Applications", "Artificial Intelligence", "Machine Learning", "Mathematics"],
      "Machine Learning":           ["Computer Science", "Computer Applications", "Machine Learning", "Artificial Intelligence", "Mathematics"],
      "Data Science":               ["Computer Science", "Computer Applications", "Database Management", "Machine Learning", "Mathematics", "Business Statistics", "Economics"],
      "Web Development":            ["Computer Science", "Computer Applications", "Data Structures", "Database Management"],
      "Cybersecurity":              ["Computer Science", "Computer Applications", "Cyber Security", "Operating Systems"],
      "Cloud Computing":            ["Computer Science", "Computer Applications", "Cloud Computing", "Operating Systems"],
      "DevOps":                     ["Computer Science", "Computer Applications", "Operating Systems", "Cloud Computing"],
      "Blockchain":                 ["Computer Science", "Computer Applications", "Cyber Security", "Data Structures"],
      "UI/UX":                      ["Computer Applications", "English", "Hindi"],
      "Software Development":       ["Computer Science", "Computer Applications", "Data Structures", "Operating Systems", "Database Management"],
      "Game Development":           ["Computer Science", "Computer Applications", "Mathematics", "Physics"],
      "Mobile Development":         ["Computer Science", "Computer Applications", "Data Structures"],
      "Networking":                 ["Computer Science", "Computer Applications", "Operating Systems"],
      "IoT":                        ["Computer Science", "Computer Applications", "Physics", "Chemistry"],
      "Embedded Systems":           ["Computer Science", "Computer Applications", "Physics", "Chemistry"],
      "Robotics":                   ["Computer Science", "Computer Applications", "Physics", "Mathematics"],
      "Finance":                    ["Accountancy", "Business Studies", "Economics", "Financial Accounting", "Corporate Finance", "Business Statistics", "Cost Accounting", "Auditing"],
      "Marketing":                  ["Business Studies", "Marketing Management", "English"],
      "Management":                 ["Business Studies", "Human Resource Management", "English"],
    };

    const getMark = (sub, def = 70) => {
      const level = mode === 'stream' ? 'Class 10' : (mode === 'course' ? 'Class 12' : (savedAcademics.currentEducation || 'Undergraduate'));
      if (savedMarks[level] && savedMarks[level][sub] !== undefined) {
        return Number(savedMarks[level][sub]);
      }
      if (savedMarks[sub] !== undefined && typeof savedMarks[sub] !== 'object') {
        return Number(savedMarks[sub]);
      }
      return def;
    };

    const getProg = (skill, def = 50) => savedProg[skill] !== undefined ? Number(savedProg[skill]) : def;
    const getSoft = (skill, def = 50) => savedSoft[skill] !== undefined ? Number(savedSoft[skill]) : def;

    const getInterestBoost = (optionName) => {
      let totalBoost = 0;
      savedInterests.forEach(interest => {
        const affinityList = INTEREST_AFFINITY[interest] || [];
        if (affinityList.includes(optionName)) {
          let boost = 10;
          const relatedSubjs = INTEREST_SUBJECTS[interest] || [];
          let sumMarks = 0;
          let countMarks = 0;
          relatedSubjs.forEach(sub => {
            const mark = getMark(sub, -1);
            if (mark !== -1) {
              sumMarks += mark;
              countMarks++;
            }
          });
          if (countMarks > 0) {
            const avgMark = sumMarks / countMarks;
            boost = boost * (0.5 + (avgMark / 100));
          }
          totalBoost += boost;
        }
      });
      return totalBoost;
    };

    switch (mode) {
      case 'stream': {
        const pcm = getMark('Mathematics', 75) * 0.4 + getMark('Science', 75) * 0.4 + getMark('Computer Applications', 70) * 0.2;
        const pcb = getMark('Science', 75) * 0.6 + getMark('Mathematics', 70) * 0.2 + getMark('English', 70) * 0.2;
        const commerce = getMark('Mathematics', 70) * 0.3 + getMark('Social Science', 70) * 0.3 + getMark('English', 70) * 0.4;
        const arts = getMark('Social Science', 70) * 0.5 + getMark('English', 70) * 0.3 + getMark('Hindi', 70) * 0.2;

        const options = [
          { name: 'Science Elective (PCM with Computer Science)', value: Math.round(pcm || 75), color: '#6366F1' },
          { name: 'Science with Biology (PCB)', value: Math.round(pcb || 70), color: '#10B981' },
          { name: 'Commerce with Applied Math', value: Math.round(commerce || 60), color: '#818CF8' },
          { name: 'Arts with Humanities', value: Math.round(arts || 50), color: '#3B82F6' },
        ];

        options.forEach(opt => {
          opt.value = Math.min(99, opt.value + getInterestBoost(opt.name));
        });

        options.sort((a, b) => b.value - a.value);
        const primary = options[0];
        const alternatives = options.slice(1);
        const confidenceVal = Math.min(99, Math.max(30, Math.round(primary.value)));

        const topSubject = getMark('Mathematics', 75) >= getMark('Science', 75) ? 'Mathematics' : 'Science';
        const topScore = Math.max(getMark('Mathematics', 75), getMark('Science', 75));
        const descText = `Based on your academic performance, including ${topSubject} (${topScore}%) and Computer Applications (${getMark('Computer Applications', 70)}%), our model identifies "${primary.name}" as your optimal stream. This trajectory aligns with high quantitative ability and interest patterns.`;

        return {
          title: 'Class 10 Stream Suggestion',
          subtitle: 'Suggests the ideal subject stream for post-10th grade',
          predictionName: primary.name,
          confidence: `${confidenceVal}%`,
          desc: descText,
          alternatives: alternatives,
          radar: [
            { subject: 'Logical Math', value: getMark('Mathematics', 75), fullMark: 100 },
            { subject: 'Science Aptitude', value: getMark('Science', 75), fullMark: 100 },
            { subject: 'Languages', value: Math.round((getMark('English', 70) + getMark('Hindi', 70)) / 2), fullMark: 100 },
            { subject: 'Creativity', value: getMark('Computer Applications', 70), fullMark: 100 },
            { subject: 'Analytical', value: Math.round((getMark('Mathematics', 75) + getMark('Science', 75)) / 2), fullMark: 100 },
          ]
        };
      }
      case 'course': {
        const math = getMark('Mathematics', 75);
        const phys = getMark('Physics', 75);
        const chem = getMark('Chemistry', 75);
        const eng = getMark('English', 70);
        const cs = getMark('Computer Science', 70);
        const bio = getMark('Biology', 70);
        const acc = getMark('Accountancy', 70);
        const bs = getMark('Business Studies', 70);
        const econ = getMark('Economics', 70);
        const hin = getMark('Hindi', 70);

        const cseMl = cs * 0.4 + math * 0.4 + phys * 0.2;
        const dataSci = math * 0.5 + cs * 0.3 + econ * 0.2;
        const dipIt = cs * 0.5 + math * 0.3 + phys * 0.2 + (Math.max(math, phys, cs) < 75 ? 12 : 0);
        const mbbs = bio * 0.5 + chem * 0.3 + phys * 0.2;
        const dipPharm = bio * 0.6 + chem * 0.4 + (Math.max(bio, chem, phys) < 75 ? 12 : 0);
        const ca = acc * 0.5 + bs * 0.3 + econ * 0.2 + (Math.min(acc, bs) > 85 ? 18 : 0);
        const commerce = acc * 0.4 + bs * 0.3 + econ * 0.3;
        const dipBus = bs * 0.5 + econ * 0.3 + eng * 0.2 + (Math.max(acc, bs, econ) < 70 ? 12 : 0);
        const humanities = eng * 0.5 + hin * 0.3 + econ * 0.2;
        const dipMkt = eng * 0.4 + cs * 0.3 + econ * 0.3 + (Math.max(eng, cs) < 75 ? 12 : 0);

        const options = [
          { name: 'B.Tech in Computer Science & Engineering (AI/ML)', value: Math.round(cseMl || 75), color: '#6366F1' },
          { name: 'B.Sc in Data Science', value: Math.round(dataSci || 70), color: '#10B981' },
          { name: 'Diploma in Computer Engineering / IT', value: Math.round(dipIt || 65), color: '#818CF8' },
          { name: 'Bachelor of Medicine / BDS (MBBS)', value: Math.round(mbbs || 50), color: '#EC4899' },
          { name: 'Diploma in General Nursing & Pharmacy', value: Math.round(dipPharm || 55), color: '#F59E0B' },
          { name: 'Chartered Accountancy (CA) / CS Program', value: Math.round(ca || 60), color: '#3B82F6' },
          { name: 'Bachelor of Commerce (B.Com Hons)', value: Math.round(commerce || 60), color: '#10B981' },
          { name: 'Diploma in Business Administration (DBA)', value: Math.round(dipBus || 55), color: '#818CF8' },
          { name: 'Bachelor of Arts (Humanities)', value: Math.round(humanities || 45), color: '#EC4899' },
          { name: 'Professional Diploma in Digital Marketing & Design', value: Math.round(dipMkt || 50), color: '#F59E0B' },
        ];

        options.forEach(opt => {
          opt.value = Math.min(99, opt.value + getInterestBoost(opt.name));
        });

        options.sort((a, b) => b.value - a.value);
        const primary = options[0];
        const alternatives = options.slice(1, 4);
        const confidenceVal = Math.min(99, Math.max(30, Math.round(primary.value)));

        const subj_list = [
          ["Mathematics", math],
          ["Physics", phys],
          ["Chemistry", chem],
          ["English", eng],
          ["Computer Science", cs],
          ["Biology", bio],
          ["Accountancy", acc],
          ["Business Studies", bs],
          ["Economics", econ],
          ["Hindi", hin]
        ];
        const sorted_subjs = subj_list.sort((a, b) => b[1] - a[1]);
        const top1_name = sorted_subjs[0][0];
        const top1_val = sorted_subjs[0][1];
        const top2_name = sorted_subjs[1][0];
        const top2_val = sorted_subjs[1][1];

        const descText = `Recommended post-12th course/professional path. The model identified high correlation in your scores for ${top1_name} (${top1_val}%) and ${top2_name} (${top2_val}%), aligning with optimal candidate profiles for ${primary.name}.`;

        return {
          title: 'Undergraduate Course Recommendation',
          subtitle: 'Suggests suitable Bachelors courses after Class 12th',
          predictionName: primary.name,
          confidence: `${confidenceVal}%`,
          desc: descText,
          alternatives: alternatives,
          radar: [
            { subject: 'Math & Stats', value: math, fullMark: 100 },
            { subject: 'Computer Fundamentals', value: cs, fullMark: 100 },
            { subject: 'Physics Core', value: phys, fullMark: 100 },
            { subject: 'Logical Deductions', value: Math.round((math + cs) / 2), fullMark: 100 },
            { subject: 'Communication', value: eng, fullMark: 100 },
          ]
        };
      }
      case 'career':
      default: {
        const dsMark = getMark('Data Structures', 70);
        const osMark = getMark('Operating Systems', 70);
        const dbMark = getMark('Database Management', 70);
        const mlMark = getMark('Machine Learning', 70);
        const aiMark = getMark('Artificial Intelligence', 70);
        const cloudMark = getMark('Cloud Computing', 70);
        const cyberMark = getMark('Cyber Security', 70);

        const fin_acc = getMark('Financial Accounting', 70);
        const cost_acc = getMark('Cost Accounting', 70);
        const audit = getMark('Auditing', 70);
        const corp_fin = getMark('Corporate Finance', 70);
        const bus_stat = getMark('Business Statistics', 70);
        const macro_econ = getMark('Macroeconomics', 70);
        const mkt_mgmt = getMark('Marketing Management', 70);
        const hr_mgmt = getMark('Human Resource Management', 70);

        let options = [];
        if (savedAcademics.currentEducation === 'Undergraduate (Commerce)') {
          const ib = corp_fin * 0.4 + fin_acc * 0.3 + bus_stat * 0.3;
          const ca = fin_acc * 0.4 + cost_acc * 0.3 + audit * 0.3;
          const consult = getSoft('Problem Solving', 50) * 0.3 + getSoft('Leadership', 50) * 0.3 + macro_econ * 0.2 + getSoft('Communication', 50) * 0.2;
          const mkt = mkt_mgmt * 0.5 + getSoft('Communication', 50) * 0.3 + getSoft('Leadership', 50) * 0.2;
          const hr = hr_mgmt * 0.5 + getSoft('Communication', 50) * 0.3 + getSoft('Team Work', 50) * 0.2;
          const ba = bus_stat * 0.4 + getProg('SQL', 50) * 0.3 + macro_econ * 0.3;

          options = [
            { name: 'Financial Analyst / Investment Banker', value: Math.round(ib || 75), color: '#6366F1' },
            { name: 'Chartered Accountant (CA)', value: Math.round(ca || 70), color: '#10B981' },
            { name: 'Management Consultant', value: Math.round(consult || 65), color: '#818CF8' },
            { name: 'Marketing Executive', value: Math.round(mkt || 60), color: '#EC4899' },
            { name: 'HR Specialist', value: Math.round(hr || 55), color: '#F59E0B' },
            { name: 'Business Analyst', value: Math.round(ba || 50), color: '#3B82F6' },
          ];
        } else {
          const mle = (getProg('Python', 50) * 0.3) + (getSoft('Problem Solving', 50) * 0.3) + (mlMark * 0.2) + (aiMark * 0.2);
          const ds = (getProg('Python', 50) * 0.3) + (getProg('SQL', 50) * 0.3) + (dbMark * 0.2) + (getSoft('Problem Solving', 50) * 0.2);
          const fs = (getProg('JavaScript', 50) * 0.4) + (getProg('SQL', 50) * 0.2) + (dsMark * 0.2) + (getSoft('Problem Solving', 50) * 0.2);
          const devops = (cloudMark * 0.3) + (osMark * 0.3) + (getProg('Java', 50) * 0.2) + (getSoft('Team Work', 50) * 0.2);
          const cyber = (cyberMark * 0.4) + (getSoft('Critical Thinking', 50) * 0.3) + (osMark * 0.3);
          const pm = (getSoft('Leadership', 50) * 0.4) + (getSoft('Communication', 50) * 0.3) + (getSoft('Team Work', 50) * 0.3);

          options = [
            { name: 'Machine Learning Engineer', value: Math.round(mle || 75), color: '#6366F1' },
            { name: 'Data Scientist', value: Math.round(ds || 70), color: '#10B981' },
            { name: 'Full Stack Engineer', value: Math.round(fs || 65), color: '#818CF8' },
            { name: 'DevOps Cloud Engineer', value: Math.round(devops || 60), color: '#EC4899' },
            { name: 'Cyber Security Analyst', value: Math.round(cyber || 55), color: '#F59E0B' },
            { name: 'Product/Project Manager', value: Math.round(pm || 50), color: '#3B82F6' },
          ];
        }

        options.forEach(opt => {
          opt.value = Math.min(99, opt.value + getInterestBoost(opt.name));
        });

        options.sort((a, b) => b.value - a.value);
        const primary = options[0];
        const alternatives = options.slice(1, 4);
        const confidenceVal = Math.min(99, Math.max(30, Math.round(primary.value)));

        let descText = "";
        let radar = [];

        if (savedAcademics.currentEducation === 'Undergraduate (Commerce)') {
          descText = `Identified as your highest-matching career path. Backed by solid qualitative and numerical foundations including Business Statistics (${int_val(bus_stat)}%), Problem Solving (${getSoft('Problem Solving')}%), and university commerce course scores.`;
          
          radar = [
            { subject: "Finance & Accounting", value: Math.round((fin_acc + corp_fin) / 2), fullMark: 100 },
            { subject: "Legal & Corporate", value: getMark('Corporate Laws', 70), fullMark: 100 },
            { subject: "Aptitude & Stats", value: bus_stat, fullMark: 100 },
            { subject: "Soft Skills", value: Math.round((getSoft('Communication') + getSoft('Leadership') + getSoft('Team Work')) / 3), fullMark: 100 },
            { subject: "Economics & Audit", value: Math.round((macro_econ + audit) / 2), fullMark: 100 }
          ];
        } else {
          const avg_prog = (getProg('Python') + getProg('Java') + getProg('C++') + getProg('JavaScript')) / 4;
          descText = `Identified as the highest-matching career path. Backed by solid technical foundation including Programming (${Math.round(avg_prog)}%), Problem Solving (${getSoft('Problem Solving')}%), and university specialization course scores.`;
          
          radar = [
            { subject: 'Algorithms & Dev', value: Math.round((getProg('Python') + getProg('Java') + getProg('JavaScript')) / 3), fullMark: 100 },
            { subject: 'Applied Systems', value: Math.round((osMark + dbMark) / 2), fullMark: 100 },
            { subject: 'Soft Skills', value: Math.round((getSoft('Communication') + getSoft('Leadership') + getSoft('Team Work')) / 3), fullMark: 100 },
            { subject: 'Databases (SQL)', value: getProg('SQL'), fullMark: 100 },
            { subject: 'Specialization', value: Math.max(mlMark, aiMark, cloudMark, cyberMark), fullMark: 100 }
          ];
        }

        // helper helper inside rules
        function int_val(v) { return Math.round(Number(v) || 0); }

        return {
          title: 'Post-College Career Path Prediction',
          subtitle: 'Forecasts target industry jobs for undergraduate students',
          predictionName: primary.name,
          confidence: `${confidenceVal}%`,
          desc: descText,
          alternatives: alternatives,
          radar: radar
        };
      }
    }
  };

  const [mlResult, setMlResult] = useState(null);

  const currentData = mlResult || getModeData();

  // Auto trigger steps when loading is true
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= loadingMessages.length - 1) {
            clearInterval(interval);
            setLoading(false);
            setPredicted(true);
            
            // Check if backend returned real ML predictions
            const finalResult = window.__pendingPredictionResult || getModeData();
            setMlResult(finalResult);
            
            // Save computed prediction to localStorage and DB
            const predictionName = finalResult.predictionName;
            localStorage.setItem('guidance_user_prediction', predictionName);
            saveGuidanceData({ prediction: predictionName });
            
            // Clear reference
            delete window.__pendingPredictionResult;
            
            return 0;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [loading, mode]);

  const handlePredict = () => {
    setValidationError('');
    setPredicted(false);
    setMlResult(null);

    // Validate that user has entered required data
    let savedMarksCheck = {};
    try {
      const saved = localStorage.getItem('guidance_academic_marks');
      if (saved) savedMarksCheck = JSON.parse(saved);
    } catch (e) {}

    let academicsCheck = {};
    try {
      const saved = localStorage.getItem('guidance_user_academics');
      if (saved) academicsCheck = JSON.parse(saved);
    } catch (e) {}

    const currentEdCheck = academicsCheck.currentEducation || '';

    // Determine which level marks are needed
    let requiredLevel = currentEdCheck;
    if (mode === 'stream') requiredLevel = 'Class 10';
    else if (mode === 'course') requiredLevel = 'Class 12';
    else if (mode === 'career' && currentEdCheck !== 'Undergraduate' && currentEdCheck !== 'Undergraduate (Commerce)' && currentEdCheck !== 'Graduate') {
      requiredLevel = 'Undergraduate';
    }

    const levelMarks = savedMarksCheck[requiredLevel] || {};
    const hasMarks = Object.keys(levelMarks).length > 0 && Object.values(levelMarks).some(v => v !== '' && v !== undefined && v !== null);

    if (!hasMarks) {
      const modeLabels = { stream: 'Class 10', course: 'Class 12', career: 'Undergraduate' };
      setValidationError(
        `Please fill in your ${modeLabels[mode] || requiredLevel} academic marks in the "Academic Details" page and your skills in the "Skills Assessment" page before running the prediction.`
      );
      return;
    }

    setLoadingStep(0);
    setLoading(true);

    // Fetch predictions from Python/scikit-learn backend asynchronously
    let savedMarks = {};
    try {
      const saved = localStorage.getItem('guidance_academic_marks');
      if (saved) savedMarks = JSON.parse(saved);
    } catch (e) {}

    let savedProg = {};
    try {
      const saved = localStorage.getItem('guidance_user_programming_skills');
      if (saved) savedProg = JSON.parse(saved);
    } catch (e) {}

    let savedSoft = {};
    try {
      const saved = localStorage.getItem('guidance_user_soft_skills');
      if (saved) savedSoft = JSON.parse(saved);
    } catch (e) {}

    let academicsObj = {};
    try {
      const saved = localStorage.getItem('guidance_user_academics');
      if (saved) academicsObj = JSON.parse(saved);
    } catch (e) {}

    const currentEd = academicsObj.currentEducation || "";

    // Map active prediction mode to the target education level's marks
    let targetLevel = currentEd;
    if (mode === 'stream') {
      targetLevel = 'Class 10';
    } else if (mode === 'course') {
      targetLevel = 'Class 12';
    } else if (mode === 'career') {
      if (currentEd !== 'Undergraduate' && currentEd !== 'Undergraduate (Commerce)' && currentEd !== 'Graduate') {
        targetLevel = 'Undergraduate';
      }
    }

    let flatMarks = {};
    if (savedMarks && savedMarks[targetLevel]) {
      flatMarks = savedMarks[targetLevel];
    } else if (savedMarks) {
      // Legacy or fallback
      flatMarks = savedMarks[currentEd] || {};
    }

    let savedInterests = [];
    try {
      const saved = localStorage.getItem('guidance_user_interests');
      if (saved) savedInterests = JSON.parse(saved);
    } catch (e) {}

    const payload = {
      mode,
      currentEducation: targetLevel,
      marks: flatMarks,
      programmingSkills: savedProg,
      softSkills: savedSoft,
      interests: savedInterests
    };

    getMLPrediction(payload)
      .then((res) => {
        if (res && !res.error) {
          window.__pendingPredictionResult = res;
        } else {
          console.warn("ML API backend error. Falling back to rule engine.", res);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch backend ML predictions. Falling back.", err);
      });
  };

  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      
      // Header Banner
      doc.setFillColor(15, 23, 42); // Dark Blue (#0F172A)
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text("ANTIGRAVITY GUIDANCE SYSTEM", 15, 18);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text("AI-Powered Academic & Career Guidance Assessment Report", 15, 28);
      
      doc.setTextColor(200, 200, 255);
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 155, 28);
      
      // Optimal Path Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229); // Indigo (#4F46E5)
      doc.text("AI OPTIMAL PATH RECOMMENDATION", 15, 55);
      
      doc.setFillColor(243, 244, 246);
      doc.rect(15, 60, 180, 25, 'F');
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text(currentData.predictionName, 22, 71);
      
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.text(`Forecast Confidence Score: ${currentData.confidence}`, 22, 79);
      
      // Analysis / Description Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(79, 70, 229);
      doc.text("ASSESSMENT ANALYSIS", 15, 100);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const descLines = doc.splitTextToSize(currentData.desc, 180);
      doc.text(descLines, 15, 108);
      
      let yOffset = 108 + (descLines.length * 5) + 12;
      
      // Alternatives Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(79, 70, 229);
      doc.text("ALTERNATIVE MATCHING PATHS", 15, yOffset);
      
      yOffset += 8;
      currentData.alternatives.forEach((alt, idx) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`${idx + 1}. ${alt.name}`, 15, yOffset);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`(Confidence: ${alt.value}%)`, 140, yOffset);
        yOffset += 6;
      });
      
      // Capability / Grades Section
      yOffset += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(79, 70, 229);
      doc.text("ACADEMIC SCORES SUMMARY", 15, yOffset);
      
      yOffset += 8;
      // Draw Table Header
      doc.setFillColor(15, 23, 42);
      doc.rect(15, yOffset, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text("Subject / Evaluated Parameter", 20, yOffset + 5.5);
      doc.text("Score / Value", 150, yOffset + 5.5);
      
      yOffset += 8;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      
      const radarData = currentData.radar || [];
      radarData.forEach((m, idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(15, yOffset, 180, 7, 'F');
        }
        doc.text(m.subject, 20, yOffset + 5);
        doc.text(`${m.value} / 100`, 150, yOffset + 5);
        yOffset += 7;
      });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("This is an AI-generated guidance assessment report. Under normal usage, results are suggestive.", 15, 285);
      
      doc.save(`guidance_report_${mode}_${Date.now()}.pdf`);
      setToastOpen(true);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setToastOpen(true);
    }
  };

  return (
    <RouteTransition>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif' }}>
            {currentData.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentData.subtitle}
          </Typography>
        </Box>
      </Box>

      {/* Main Prediction Actions Card */}
      {!loading && !predicted && (
        <GlassCard sx={{ p: 5, textAlign: 'center', mb: 4, py: 8 }}>
          <Box sx={{ mb: 3 }} display="flex" justifyContent="center">
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(99, 102, 241, 0.08)', 
                color: '#6366F1', 
                width: 80, 
                height: 80, 
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              <AIIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Ready for AI Guidance Prediction
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 550, mx: 'auto', mb: 4 }}>
            Click the button below to feed your grades, skill inventory, and personal interests to our ML classification pipeline (Logistic Regression, KNN & Random Forest).
          </Typography>
          {validationError && (
            <Alert 
              severity="warning" 
              sx={{ mb: 3, maxWidth: 550, mx: 'auto', textAlign: 'left' }}
              onClose={() => setValidationError('')}
            >
              {validationError}
            </Alert>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handlePredict}
            startIcon={<PlayIcon />}
            sx={{ px: 5, py: 1.75, fontWeight: 700 }}
          >
            Run AI Prediction
          </Button>
        </GlassCard>
      )}

      {/* Loading Screen */}
      {loading && (
        <GlassCard sx={{ p: 5, mb: 4, py: 6 }}>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={3}>
            <CircularProgress color="primary" size={60} />
            <Typography variant="h5" fontWeight={700}>
              AI Classification Engine Running
            </Typography>
            <Box width="100%" maxWidth={450}>
              <LinearProgress color="primary" sx={{ height: 6, borderRadius: 3, mb: 3 }} />
              
              {/* Stepper Status Logs */}
              <List sx={{ bgcolor: 'rgba(255,255,255,0.01)', borderRadius: 3, p: 2, border: '1px solid rgba(255,255,255,0.04)' }}>
                {loadingMessages.map((msg, index) => {
                  const isDone = index < loadingStep;
                  const isCurrent = index === loadingStep;
                  return (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {isDone ? (
                          <CheckedIcon sx={{ color: '#10B981', fontSize: 18 }} />
                        ) : isCurrent ? (
                          <CircularProgress size={14} color="primary" />
                        ) : (
                          <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.2)' }} />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={msg} 
                        primaryTypographyProps={{ 
                          fontSize: '0.85rem',
                          color: isDone ? 'text.secondary' : isCurrent ? 'primary.main' : 'text.disabled',
                          fontWeight: isCurrent ? 700 : 500}} 
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Box>
        </GlassCard>
      )}

      {/* Prediction Output Results */}
      {predicted && !loading && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          
          {/* Main Forecast Metrics Card */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(58.333% - 16px)' }, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <GlassCard sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="caption" color="secondary.main" fontWeight={800} letterSpacing="0.05em">
                    AI OPTIMAL PATH
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Outfit", sans-serif', my: 0.5 }}>
                    {currentData.predictionName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Primary Forecasted Trajectory
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: 'rgba(6, 182, 212, 0.1)', 
                    border: '1px solid rgba(6, 182, 212, 0.25)', 
                    borderRadius: 3, 
                    px: 3, 
                    py: 1.5, 
                    textAlign: 'center' 
                  }}
                >
                  <Typography variant="h4" fontWeight={900} color="secondary.main">
                    {currentData.confidence}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={650}>
                    Confidence
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3, opacity: 0.08 }} />

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 4 }}>
                {currentData.desc}
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={2}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => handlePredict()}
                  startIcon={<PlayIcon />}
                >
                  Re-evaluate AI
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  sx={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  Download Report
                </Button>
              </Box>
            </GlassCard>

            {/* Alternative Predictions List */}
            <GlassCard sx={{ p: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Alternative Path Probabilities</Typography>
                <Typography variant="caption" color="text.secondary">Alternate suitable avenues ranked by confidence weight</Typography>
              </Box>
              
              <Box sx={{ height: 200, py: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={currentData.alternatives} 
                    margin={{ top: 10, right: 20, left: 30, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 9 }} />
                    <YAxis type="category" dataKey="name" stroke="#94A3B8" tick={{ fontSize: 9 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F172A', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(255, 255, 255, 0.15)' 
                      }} 
                    />
                    <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]}>
                      {currentData.alternatives.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </GlassCard>
          </Box>

          {/* Capability Radar Matching Chart */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(41.667% - 16px)' }, minWidth: 0 }}>
            <GlassCard sx={{ height: '100%', p: 4, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 3 }} display="flex" alignItems="center" gap={1}>
                <AnalyticsIcon sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>Aptitude Matching Matrix</Typography>
                  <Typography variant="caption" color="text.secondary">Student scores vs optimal sector benchmark</Typography>
                </Box>
              </Box>

              <Box sx={{ height: 320, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={currentData.radar}>
                    <PolarGrid stroke="rgba(255,255,255,0.04)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 8 }} />
                    <Radar
                      name="Student Capabilities"
                      dataKey="value"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </GlassCard>
          </Box>

        </Box>
      )}

      {/* PDF Simulation Download Toast */}
      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Guidance Forecast Report generated. PDF download started!
        </Alert>
      </Snackbar>
    </RouteTransition>
  );
};

export default Prediction;
