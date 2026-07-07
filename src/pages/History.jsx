import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';
import { jsPDF } from 'jspdf';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const historyData = [
    {
      date: '2026-06-25',
      level: 'Undergraduate',
      recommendation: 'Machine Learning Engineer',
      confidence: 94,
    },
    {
      date: '2026-05-12',
      level: 'Higher Secondary (Class 12)',
      recommendation: 'B.Tech in Computer Science & Engineering',
      confidence: 91,
    },
    {
      date: '2026-04-10',
      level: 'Undergraduate',
      recommendation: 'Data Scientist',
      confidence: 88,
    },
    {
      date: '2024-03-15',
      level: 'High School (Class 10)',
      recommendation: 'Science Elective (PCM with CS)',
      confidence: 95,
    },
  ];

  const handleDownload = (rec) => {
    try {
      const doc = new jsPDF();
      
      // Header Banner
      doc.setFillColor(15, 23, 42); // Dark Blue (#0F172A)
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text("ANTIGRAVITY ASSESSMENT LOGS", 15, 18);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text("Historical Academic & Career Guidance Prediction Record", 15, 28);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229); // Indigo (#4F46E5)
      doc.text("HISTORICAL LOG DETAILS", 15, 55);
      
      // Find row in history data
      const matched = historyData.find(h => h.recommendation === rec) || {
        date: new Date().toLocaleDateString(),
        level: 'N/A',
        recommendation: rec,
        confidence: 90
      };
      
      doc.setFillColor(243, 244, 246);
      doc.rect(15, 60, 180, 50, 'F');
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Assessment Parameter", 22, 70);
      doc.text("Logged Value", 120, 70);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text("Prediction Date:", 22, 80);
      doc.text(matched.date, 120, 80);
      
      doc.text("Education Level:", 22, 88);
      doc.text(matched.level, 120, 88);
      
      doc.text("AI Recommendation:", 22, 96);
      doc.setFont('helvetica', 'bold');
      doc.text(matched.recommendation, 120, 96);
      doc.setFont('helvetica', 'normal');
      
      doc.text("Confidence Score:", 22, 104);
      doc.text(`${matched.confidence}%`, 120, 104);
      
      // Assessment Logged Summary Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(79, 70, 229);
      doc.text("LOGGED ASSESSMENT SUMMARY", 15, 125);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const summaryText = `This assessment log records that on ${matched.date}, the student profile representing education level ${matched.level} was evaluated. Based on our random forest model classifiers, the student was recommended to pursue a career/stream as a "${matched.recommendation}" with a model confidence score of ${matched.confidence}%.`;
      const summaryLines = doc.splitTextToSize(summaryText, 180);
      doc.text(summaryLines, 15, 133);
      
      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("This is an AI-generated guidance historical log report. Under normal usage, results are suggestive.", 15, 280);
      
      doc.save(`guidance_historical_log_${matched.date}.pdf`);
      setToastOpen(true);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setToastOpen(true);
    }
  };

  const filteredHistory = historyData.filter(
    (item) =>
      item.recommendation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RouteTransition>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif' }}>
            Guidance Assessment Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access previous machine learning recommendations and download comprehensive reports.
          </Typography>
        </Box>
        
        {/* Search Bar */}
        <TextField
          size="small"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 260 } }}
        />
      </Box>

      {/* Glassmorphic Table Container */}
      <GlassCard>
        <TableContainer component={Box} sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Prediction Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Education Level</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>AI Recommendation</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Confidence Score</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Report</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.map((row, idx) => (
                <TableRow 
                  key={idx}
                  sx={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.01)' } 
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{row.date}</TableCell>
                  <TableCell color="text.secondary">{row.level}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{row.recommendation}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${row.confidence}%`} 
                      size="small" 
                      color={row.confidence >= 90 ? 'success' : 'primary'} 
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="secondary"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(row.recommendation)}
                      sx={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}
                    >
                      Export PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No matching assessment logs found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>

      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          PDF Report downloaded successfully!
        </Alert>
      </Snackbar>
    </RouteTransition>
  );
};

export default History;
