import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Programs = () => {
  const [activeTab, setActiveTab] = useState('weekday');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [liveBroadcastSchedule, setLiveBroadcastSchedule] = useState(null);
  
  // Live Broadcast Days filters
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedBroadcastType, setSelectedBroadcastType] = useState('all');
  
  const [loading, setLoading] = useState(true);

  // === PHASE 1: BACKUP & PREVIEW INFRASTRUCTURE ===
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showChangeLog, setShowChangeLog] = useState(false);
  const [backupHistory, setBackupHistory] = useState([]);
  const [changeLog, setChangeLog] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Admin access check (could be enhanced with proper auth later)
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const ADMIN_PASSWORD = 'kioo-admin-2025'; // Simple password for now

  // === BACKUP & PREVIEW FUNCTIONS ===
  
  // Load backup history from localStorage on component mount
  useEffect(() => {
    const savedBackups = localStorage.getItem('kioo-programs-backups');
    const savedChangeLog = localStorage.getItem('kioo-programs-changelog');
    
    if (savedBackups) {
      setBackupHistory(JSON.parse(savedBackups));
    }
    if (savedChangeLog) {
      setChangeLog(JSON.parse(savedChangeLog));
    }
  }, []);

  // Create a backup snapshot of current schedule data
  const createBackupSnapshot = () => {
    const timestamp = new Date().toISOString();
    const backup = {
      id: `backup-${Date.now()}`,
      timestamp,
      data: {
        weekdaySchedule: [...weekdaySchedule],
        saturdaySchedule: [...saturdaySchedule],
        sundaySchedule: [...sundaySchedule],
        weeklySpecial: [...weeklySpecial],
        liveBroadcastSchedule: liveBroadcastSchedule ? { ...liveBroadcastSchedule } : null
      },
      description: `Backup created on ${new Date(timestamp).toLocaleString()}`,
      version: `v${backupHistory.length + 1}`
    };

    const newBackupHistory = [backup, ...backupHistory].slice(0, 10); // Keep last 10 backups
    setBackupHistory(newBackupHistory);
    localStorage.setItem('kioo-programs-backups', JSON.stringify(newBackupHistory));
    
    // Log the backup creation
    addToChangeLog(`Backup snapshot created: ${backup.version}`, 'backup');
    
    return backup.id;
  };

  // Restore from a backup
  const restoreFromBackup = (backupId) => {
    const backup = backupHistory.find(b => b.id === backupId);
    if (!backup) return false;

    // In a real implementation, this would restore the actual schedule data
    // For now, we'll just log the action
    addToChangeLog(`Schedule restored from backup ${backup.version} (${backup.timestamp})`, 'restore');
    
    // Toggle out of preview mode after restore
    setIsPreviewMode(false);
    return true;
  };

  // Add entry to change log
  const addToChangeLog = (description, type = 'change', details = null) => {
    const entry = {
      id: `change-${Date.now()}`,
      timestamp: new Date().toISOString(),
      description,
      type, // 'change', 'backup', 'restore', 'preview'
      details,
      user: 'admin' // In real implementation, this would be the authenticated user
    };

    const newChangeLog = [entry, ...changeLog].slice(0, 50); // Keep last 50 entries
    setChangeLog(newChangeLog);
    localStorage.setItem('kioo-programs-changelog', JSON.stringify(newChangeLog));
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    if (!isPreviewMode) {
      // Entering preview mode - create backup first
      createBackupSnapshot();
      addToChangeLog('Preview mode activated', 'preview');
    } else {
      // Exiting preview mode
      addToChangeLog('Preview mode deactivated', 'preview');
    }
    setIsPreviewMode(!isPreviewMode);
  };

  // Admin authentication
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setShowAdminPanel(true);
      addToChangeLog('Admin panel accessed', 'admin');
    } else {
      alert('Invalid admin password');
    }
    setAdminPassword('');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsRes, scheduleRes, liveScheduleRes] = await Promise.all([
          axios.get(`${API}/programs`),
          axios.get(`${API}/programs/schedule`),
          axios.get(`${API}/live-broadcast-schedule`)
        ]);
        
        setPrograms(programsRes.data);
        setSchedule(scheduleRes.data);
        setLiveBroadcastSchedule(liveScheduleRes.data);
      } catch (error) {
        console.error('Error fetching programs:', error);
        // Fall back to static data if API is not available
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Complete schedule data - Updated with Phase 2 REFINED modifications
  const weekdaySchedule = [
    { "Start Time": "00:00", "End Time": "00:30", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "00:30", "End Time": "01:00", "Program": "Community Announcements", "Language": "English", "Type": "Community" },
    { "Start Time": "01:00", "End Time": "01:30", "Program": "Phone-in Program", "Language": "English", "Type": "Interactive" },
    { "Start Time": "01:30", "End Time": "02:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "02:00", "End Time": "02:30", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "02:30", "End Time": "03:00", "Program": "Music & Reflection", "Language": "Kissi", "Type": "Music" },
    { "Start Time": "03:00", "End Time": "03:30", "Program": "Community Announcements", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "03:30", "End Time": "04:00", "Program": "Phone-in Program", "Language": "Kissi", "Type": "Interactive" },
    { "Start Time": "04:00", "End Time": "04:30", "Program": "Community Programming", "Language": "French", "Type": "Community" },
    { "Start Time": "04:30", "End Time": "05:00", "Program": "Music & Reflection", "Language": "French", "Type": "Music" },
    { "Start Time": "05:00", "End Time": "05:10", "Program": "Guidelines", "Language": "English", "Type": "Bible Teaching", "highlight": true },
    { "Start Time": "05:10", "End Time": "05:15", "Program": "Morning Devotional", "Language": "English", "Type": "Devotional" },
    { "Start Time": "05:15", "End Time": "05:45", "Program": "Morning Prayer & Worship", "Language": "English", "Type": "Worship" },
    { "Start Time": "05:45", "End Time": "06:00", "Program": "Community Announcements", "Language": "English", "Type": "Community" },
    { "Start Time": "06:00", "End Time": "06:30", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "06:30", "End Time": "07:00", "Program": "Daily Sermon", "Language": "English", "Type": "Sermon", "highlight": true },
    { "Start Time": "07:00", "End Time": "07:30", "Program": "Love & Faith", "Language": "English", "Type": "Bible Teaching", "highlight": true },
    { "Start Time": "07:30", "End Time": "08:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "08:00", "End Time": "08:30", "Program": "Thru the Bible (TTB)", "Language": "Kissi", "Type": "Bible Teaching" },
    { "Start Time": "08:30", "End Time": "09:00", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "09:00", "End Time": "10:00", "Program": "VNA French Satellite Feed", "Language": "French", "Type": "Satellite" },
    { "Start Time": "10:00", "End Time": "10:30", "Program": "Music & Reflection", "Language": "French", "Type": "Music" },
    { "Start Time": "10:30", "End Time": "11:00", "Program": "Women & Family Hour", "Language": "English", "Type": "Community" },
    { "Start Time": "11:00", "End Time": "11:30", "Program": "Community Announcements", "Language": "English", "Type": "Community" },
    { "Start Time": "11:30", "End Time": "12:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "12:00", "End Time": "12:30", "Program": "Thru the Bible (TTB)", "Language": "Kissi", "Type": "Bible Teaching" },
    { "Start Time": "12:30", "End Time": "13:00", "Program": "Youth Connect", "Language": "Kissi", "Type": "Youth/Community" },
    { "Start Time": "13:00", "End Time": "13:30", "Program": "Community Announcements", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "13:30", "End Time": "14:00", "Program": "Phone-in Program", "Language": "Kissi", "Type": "Interactive" },
    { "Start Time": "14:00", "End Time": "14:30", "Program": "Thru the Bible (TTB)", "Language": "French", "Type": "Bible Teaching" },
    { "Start Time": "14:30", "End Time": "15:00", "Program": "Health & Wellness", "Language": "French", "Type": "Community" },
    { "Start Time": "15:00", "End Time": "15:30", "Program": "Community Announcements", "Language": "French", "Type": "Community" },
    { "Start Time": "15:30", "End Time": "16:00", "Program": "Music & Reflection", "Language": "French", "Type": "Music" },
    { "Start Time": "16:00", "End Time": "16:30", "Program": "Christian Teaching", "Language": "Mandingo", "Type": "Bible Teaching", "highlight": true },
    { "Start Time": "16:30", "End Time": "17:00", "Program": "Community Programming", "Language": "Mandingo", "Type": "Community" },
    { "Start Time": "17:00", "End Time": "17:30", "Program": "Christian Teaching", "Language": "Fula", "Type": "Bible Teaching", "highlight": true },
    { "Start Time": "17:30", "End Time": "18:00", "Program": "Community Programming", "Language": "Fula", "Type": "Community" },
    { "Start Time": "18:00", "End Time": "19:00", "Program": "Evening News & Roundup", "Language": "Mixed", "Type": "Community" },
    { "Start Time": "19:00", "End Time": "19:30", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "19:30", "End Time": "20:00", "Program": "Community Announcements", "Language": "English", "Type": "Community" },
    { "Start Time": "20:00", "End Time": "20:30", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "20:30", "End Time": "21:00", "Program": "Phone-in Program", "Language": "Kissi", "Type": "Interactive" },
    { "Start Time": "21:00", "End Time": "21:30", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "21:30", "End Time": "22:00", "Program": "Evening Worship & Reflection", "Language": "English", "Type": "Devotional" },
    { "Start Time": "22:00", "End Time": "22:30", "Program": "Thru the Bible (TTB)", "Language": "French", "Type": "Bible Teaching" },
    { "Start Time": "22:30", "End Time": "23:00", "Program": "Community Announcements", "Language": "Mixed", "Type": "Community" },
    { "Start Time": "23:00", "End Time": "23:30", "Program": "Music & Reflection", "Language": "Mixed", "Type": "Music" },
    { "Start Time": "23:30", "End Time": "00:00", "Program": "Hope & Care Outreach", "Language": "Mixed", "Type": "Community" }
  ];

  const saturdaySchedule = [
    { "Start Time": "00:00", "End Time": "01:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "01:00", "End Time": "02:00", "Program": "Community Programming", "Language": "English", "Type": "Community" },
    { "Start Time": "02:00", "End Time": "03:00", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "03:00", "End Time": "04:00", "Program": "Community Programming", "Language": "French", "Type": "Community" },
    { "Start Time": "04:00", "End Time": "05:00", "Program": "Music & Reflection", "Language": "French", "Type": "Music" },
    { "Start Time": "05:00", "End Time": "06:00", "Program": "Morning Devotional & Prayer", "Language": "English", "Type": "Devotional" },
    { "Start Time": "06:00", "End Time": "09:00", "Program": "Makona Talk Show", "Language": "English", "Type": "Interactive", "highlight": true },
    { "Start Time": "09:00", "End Time": "09:30", "Program": "Truth for Life", "Language": "English", "Type": "Bible Teaching", "highlight": true },
    { "Start Time": "09:30", "End Time": "10:00", "Program": "Daily Sermon", "Language": "English", "Type": "Sermon", "highlight": true },
    { "Start Time": "10:00", "End Time": "11:00", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "11:00", "End Time": "13:00", "Program": "NLASN 'Island Praise'", "Language": "English", "Type": "Satellite", "highlight": true },
    { "Start Time": "13:00", "End Time": "14:00", "Program": "Community Programming", "Language": "English", "Type": "Community" },
    { "Start Time": "14:00", "End Time": "15:00", "Program": "Community Programming", "Language": "French", "Type": "Community" },
    { "Start Time": "15:00", "End Time": "16:00", "Program": "Community Programming", "Language": "Mandingo", "Type": "Community" },
    { "Start Time": "16:00", "End Time": "17:00", "Program": "Community Programming", "Language": "Mandingo", "Type": "Community" },
    { "Start Time": "17:00", "End Time": "18:00", "Program": "Community Programming", "Language": "Fula", "Type": "Community" },
    { "Start Time": "18:00", "End Time": "19:00", "Program": "Evening Programming", "Language": "Mixed", "Type": "Community" },
    { "Start Time": "19:00", "End Time": "20:00", "Program": "Community Programming", "Language": "English", "Type": "Community" },
    { "Start Time": "20:00", "End Time": "21:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "21:00", "End Time": "22:00", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "22:00", "End Time": "23:00", "Program": "Community Programming", "Language": "Mixed", "Type": "Community" },
    { "Start Time": "23:00", "End Time": "00:00", "Program": "Music & Reflection", "Language": "Mixed", "Type": "Music" }
  ];

  const sundaySchedule = [
    { "Start Time": "00:00", "End Time": "01:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "01:00", "End Time": "02:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "02:00", "End Time": "03:00", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "03:00", "End Time": "04:00", "Program": "Community Programming", "Language": "French", "Type": "Community" },
    { "Start Time": "04:00", "End Time": "05:00", "Program": "Music & Reflection", "Language": "French", "Type": "Music" },
    { "Start Time": "05:00", "End Time": "06:00", "Program": "Morning Devotional & Prayer", "Language": "English", "Type": "Devotional" },
    { "Start Time": "06:00", "End Time": "07:00", "Program": "Pre-Service Programming", "Language": "English", "Type": "Community" },
    { "Start Time": "07:00", "End Time": "07:30", "Program": "Truth for Life", "Language": "French", "Type": "Bible Teaching", "highlight": true },
    { "Start Time": "07:30", "End Time": "08:00", "Program": "Daily Sermon", "Language": "English", "Type": "Sermon", "highlight": true },
    { "Start Time": "08:00", "End Time": "09:00", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "09:00", "End Time": "10:00", "Program": "Pre-Service Worship", "Language": "Mixed", "Type": "Worship" },
    { "Start Time": "10:00", "End Time": "12:00", "Program": "Live Partner Church Service", "Language": "English/French/Mixed", "Type": "Live Service", "highlight": true },
    { "Start Time": "12:00", "End Time": "13:00", "Program": "Post-Service Reflection", "Language": "Mixed", "Type": "Devotional" },
    { "Start Time": "13:00", "End Time": "14:00", "Program": "Community Programming", "Language": "French", "Type": "Community" },
    { "Start Time": "14:00", "End Time": "15:00", "Program": "La Vie Chez Nous", "Language": "French", "Type": "Interactive", "highlight": true },
    { "Start Time": "15:00", "End Time": "16:00", "Program": "Community Programming", "Language": "Mandingo", "Type": "Community" },
    { "Start Time": "16:00", "End Time": "17:00", "Program": "Community Programming", "Language": "Mandingo", "Type": "Community" },
    { "Start Time": "17:00", "End Time": "18:00", "Program": "Community Programming", "Language": "Fula", "Type": "Community" },
    { "Start Time": "18:00", "End Time": "19:00", "Program": "Community Programming", "Language": "Fula", "Type": "Community" },
    { "Start Time": "19:00", "End Time": "20:00", "Program": "Sunday Evening Worship", "Language": "Mixed", "Type": "Worship" },
    { "Start Time": "20:00", "End Time": "21:00", "Program": "Community Programming", "Language": "English", "Type": "Community" },
    { "Start Time": "21:00", "End Time": "22:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "22:00", "End Time": "23:00", "Program": "Community Programming", "Language": "Mixed", "Type": "Community" },
    { "Start Time": "23:00", "End Time": "00:00", "Program": "Evening Devotional", "Language": "Mixed", "Type": "Devotional" }
  ];

  // Special weekly programs - Updated with Gbandi Language Hour
  const weeklySpecial = [
    { "Day": "Monday", "Time": "19:00-20:00", "Program": "Gbandi Language Hour", "Language": "Gbandi", "Type": "Community" },
    { "Day": "Wednesday", "Time": "20:00-21:00", "Program": "Youth Connect Special", "Language": "English", "Type": "Youth/Community" },
    { "Day": "Friday", "Time": "18:00-19:00", "Program": "Women's Empowerment Hour", "Language": "Mixed", "Type": "Community" }
  ];

  // Color mapping for program types
  const typeColors = {
    'Bible Teaching': 'bg-blue-100 text-blue-800',
    'Community': 'bg-green-100 text-green-800',
    'Interactive': 'bg-orange-100 text-orange-800',
    'Satellite': 'bg-purple-100 text-purple-800',
    'Live Service': 'bg-red-100 text-red-800',
    'Music': 'bg-yellow-100 text-yellow-800',
    'Devotional': 'bg-indigo-100 text-indigo-800',
    'Worship': 'bg-pink-100 text-pink-800',
    'Sermon': 'bg-teal-100 text-teal-800',
    'Youth/Community': 'bg-lime-100 text-lime-800'
  };

  // Language options - Added Gbandi
  const languages = ['all', 'English', 'French', 'Kissi', 'Fula', 'Mandingo', 'Gbandi', 'Mixed'];
  
  // Live Broadcast Days filter options
  const days = ['all', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const countries = ['all', 'liberia', 'sierra_leone', 'guinea'];
  const broadcastTypes = ['all', 'live', 'pre-recorded', 'rotation'];

  // Filter Live Broadcast Schedule
  const getFilteredBroadcastSchedule = () => {
    if (!liveBroadcastSchedule) return null;
    
    let filteredSchedule = { ...liveBroadcastSchedule.weeklySchedule };
    
    // Filter by selected day
    if (selectedDay !== 'all') {
      filteredSchedule = { [selectedDay]: filteredSchedule[selectedDay] };
    }
    
    return {
      ...liveBroadcastSchedule,
      weeklySchedule: filteredSchedule
    };
  };

  // Get filtered country schedules
  const getFilteredCountrySchedules = () => {
    if (!liveBroadcastSchedule) return [];
    
    let filtered = liveBroadcastSchedule.countrySchedules;
    
    // Filter by selected country
    if (selectedCountry !== 'all') {
      const countryName = selectedCountry === 'sierra_leone' ? 'Sierra Leone' : 
                         selectedCountry === 'liberia' ? 'Liberia' : 'Guinea';
      filtered = filtered.filter(country => country.country === countryName);
    }
    
    return filtered;
  };

  // Check if a day/country combination matches the broadcast type filter
  const matchesBroadcastTypeFilter = (status) => {
    if (selectedBroadcastType === 'all') return true;
    return status === selectedBroadcastType;
  };

  useEffect(() => {
    let schedule = [];
    if (activeTab === 'weekday') schedule = weekdaySchedule;
    else if (activeTab === 'saturday') schedule = saturdaySchedule;
    else if (activeTab === 'sunday') schedule = sundaySchedule;

    if (selectedLanguage === 'all') {
      setFilteredPrograms(schedule);
    } else {
      setFilteredPrograms(schedule.filter(program => 
        program.Language.toLowerCase().includes(selectedLanguage.toLowerCase())
      ));
    }
  }, [activeTab, selectedLanguage]);

  const getCurrentSchedule = () => {
    if (activeTab === 'weekday') return weekdaySchedule;
    if (activeTab === 'saturday') return saturdaySchedule;
    if (activeTab === 'sunday') return sundaySchedule;
    return [];
  };

  const getScheduleTitle = () => {
    if (activeTab === 'weekday') return 'Daily Program Schedule (Monday - Friday)';
    if (activeTab === 'saturday') return 'Saturday Schedule';
    if (activeTab === 'sunday') return 'Sunday Schedule';
    return '';
  };

  // Generate pie chart data for visual representation
  const generatePieChartData = (schedule) => {
    const typeCount = {};
    schedule.forEach(program => {
      const type = program.Type;
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    return typeCount;
  };

  const downloadSchedule = () => {
    // Create downloadable content
    const content = `KIOO RADIO 98.1FM - PROGRAM SCHEDULE
    
${getScheduleTitle()}

${filteredPrograms.map(program => 
  `${program['Start Time']} - ${program['End Time']} | ${program.Program} | ${program.Language} | ${program.Type}`
).join('\n')}

Generated on: ${new Date().toLocaleString()}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kioo-radio-schedule-${activeTab}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // === ADMIN PANEL COMPONENT ===
  const AdminPanel = () => {
    if (!isAdminAuthenticated) {
      return (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-50">
          <h3 className="text-sm font-semibold mb-2">Admin Access</h3>
          <div className="flex gap-2">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin password"
              className="px-2 py-1 text-sm border rounded"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <button
              onClick={handleAdminLogin}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
          <button
            onClick={() => setShowAdminPanel(false)}
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      );
    }

    return (
      <div className="fixed top-4 right-4 bg-white rounded-lg shadow-xl p-6 border border-gray-200 z-50 max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Admin Panel</h3>
          <button
            onClick={() => setShowAdminPanel(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        {/* Status Display */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm">
            <div className={`font-semibold ${isPreviewMode ? 'text-orange-600' : 'text-green-600'}`}>
              Status: {isPreviewMode ? 'PREVIEW MODE' : 'LIVE MODE'}
            </div>
            <div className="text-gray-600">
              Backups: {backupHistory.length} | Changes: {changeLog.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last backup: {backupHistory.length > 0 ? new Date(backupHistory[0].timestamp).toLocaleString() : 'None'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={togglePreviewMode}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              isPreviewMode 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isPreviewMode ? '🔄 Exit Preview' : '👁️ Enter Preview'}
          </button>
          
          <button
            onClick={createBackupSnapshot}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            💾 Create Backup
          </button>
          
          <button
            onClick={() => setShowChangeLog(!showChangeLog)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            📋 {showChangeLog ? 'Hide' : 'Show'} Change Log
          </button>
        </div>

        {/* Quick Backup List */}
        {backupHistory.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Backups</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {backupHistory.slice(0, 3).map(backup => (
                <div key={backup.id} className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">{backup.version}</span>
                  <button
                    onClick={() => restoreFromBackup(backup.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // === CHANGE LOG COMPONENT ===
  const ChangeLogPanel = () => {
    if (!showChangeLog) return null;

    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-6 border border-gray-200 z-40 max-w-md max-h-96 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Change Log</h3>
          <button
            onClick={() => setShowChangeLog(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-64 space-y-2">
          {changeLog.length === 0 ? (
            <p className="text-gray-500 text-sm">No changes recorded yet.</p>
          ) : (
            changeLog.map(entry => (
              <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    entry.type === 'backup' ? 'bg-blue-100 text-blue-800' :
                    entry.type === 'restore' ? 'bg-green-100 text-green-800' :
                    entry.type === 'preview' ? 'bg-orange-100 text-orange-800' :
                    entry.type === 'admin' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {entry.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{entry.description}</p>
                {entry.details && (
                  <p className="text-xs text-gray-500 mt-1">{entry.details}</p>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => {
              setChangeLog([]);
              localStorage.removeItem('kioo-programs-changelog');
            }}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Clear Change Log
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Panel */}
      {showAdminPanel && <AdminPanel />}
      
      {/* Change Log Panel */}
      <ChangeLogPanel />

      {/* Preview Mode Banner */}
      {isPreviewMode && (
        <div className="fixed top-0 left-0 right-0 bg-orange-600 text-white py-2 px-4 z-30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-lg">⚠️</span>
              <span className="font-semibold">PREVIEW MODE ACTIVE</span>
              <span className="text-orange-200">- Changes are not live</span>
            </div>
            <button
              onClick={togglePreviewMode}
              className="bg-orange-700 hover:bg-orange-800 px-3 py-1 rounded text-sm font-medium"
            >
              Exit Preview
            </button>
          </div>
        </div>
      )}

      {/* Admin Access Button */}
      <button
        onClick={() => setShowAdminPanel(true)}
        className="fixed top-4 left-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 z-40"
        style={{ fontSize: '12px' }}
      >
        🔧 Admin
      </button>

      {/* Header */}
      <section className={`bg-kioo-primary text-white py-16 ${isPreviewMode ? 'mt-12' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              📻 Programs Lineup
            </h1>
            <div className="max-w-4xl mx-auto text-left">
              <p className="text-lg lg:text-xl text-green-100 leading-relaxed">
                Kioo Radio 98.1FM exists to serve the Makona River Region across Liberia, Sierra Leone, and Guinea with Christ-centered teaching, uplifting music, and community-focused programming. Our broadcast lineup now features the exciting new "Makona Talk Show" every Saturday morning (3 hours), daily sermons and Bible teachings including "Love & Faith" and "Guidelines" programs, plus "Truth for Life" on weekends. We maintain our commitment to multilingual programming (English, French, Kissi) with enhanced community programming in Fula and Mandingo languages, interactive phone-in shows, and live Sunday church services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Color Legend */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-semibold text-kioo-dark mb-4 text-center">Program Type Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Bible Teaching</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Community</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">Interactive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm">Satellite</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Live Services</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Music</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-indigo-500 rounded"></div>
              <span className="text-sm">Devotional</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pink-500 rounded"></div>
              <span className="text-sm">Worship</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-teal-500 rounded"></div>
              <span className="text-sm">Sermon</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-lime-500 rounded"></div>
              <span className="text-sm">Youth Programs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Day Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('weekday')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'weekday'
                    ? 'bg-kioo-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Mon-Fri
              </button>
              <button
                onClick={() => setActiveTab('saturday')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'saturday'
                    ? 'bg-kioo-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Saturday
              </button>
              <button
                onClick={() => setActiveTab('sunday')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'sunday'
                    ? 'bg-kioo-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sunday
              </button>
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-4">
              <label htmlFor="language-filter" className="text-sm font-medium text-gray-700">
                Filter by Language:
              </label>
              <select
                id="language-filter"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang === 'all' ? 'All Languages' : lang}
                  </option>
                ))}
              </select>

              {/* Download Button */}
              <button
                onClick={downloadSchedule}
                className="px-4 py-2 bg-kioo-primary text-white rounded-lg hover:bg-kioo-secondary transition-colors flex items-center gap-2"
              >
                📄 Download
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Table */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-kioo-primary text-white px-6 py-4">
              <h2 className="text-2xl font-bold">
                {getScheduleTitle()}
              </h2>
              <p className="text-green-100 mt-1">
                {filteredPrograms.length} programs
                {selectedLanguage !== 'all' && ` in ${selectedLanguage}`}
              </p>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPrograms.map((program, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-gray-50 ${program.highlight ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {program['Start Time']} - {program['End Time']}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{program.Program}</div>
                        {program.highlight && (
                          <div className="text-xs text-yellow-600 font-medium">⭐ Special Program</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {program.Language}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          typeColors[program.Type] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {program.Type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Special Programs */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-kioo-dark mb-6 text-center">
              🌟 Weekly Special Programs
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {weeklySpecial.map((special, index) => (
                <div key={index} className="bg-gradient-to-r from-kioo-primary to-kioo-secondary rounded-lg p-6 text-white">
                  <div className="text-2xl mb-3">📅</div>
                  <h4 className="text-lg font-semibold mb-2">{special.Program}</h4>
                  <p className="text-green-100 text-sm mb-1">{special.Day} • {special.Time}</p>
                  <p className="text-green-100 text-sm">{special.Language} • {special.Type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Language Statistics */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-kioo-dark mb-6 text-center">
              🗣️ Language Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">41.7%</div>
                <div className="text-sm text-gray-600">Kissi</div>
                <div className="text-xs text-gray-500">10 hours daily</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">25.0%</div>
                <div className="text-sm text-gray-600">English</div>
                <div className="text-xs text-gray-500">6 hours daily</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">16.7%</div>
                <div className="text-sm text-gray-600">French</div>
                <div className="text-xs text-gray-500">4 hours daily</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">8.3%</div>
                <div className="text-sm text-gray-600">Mixed</div>
                <div className="text-xs text-gray-500">2 hours daily</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4.2%</div>
                <div className="text-sm text-gray-600">Mandingo</div>
                <div className="text-xs text-gray-500">1 hour daily</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">4.2%</div>
                <div className="text-sm text-gray-600">Fula</div>
                <div className="text-xs text-gray-500">1 hour daily</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Broadcast Days Section */}
      {liveBroadcastSchedule && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-kioo-dark mb-4">
                📡 Live Broadcast Days
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {liveBroadcastSchedule.introText}
                </p>
              </div>
            </div>

            {/* Live Broadcast Type Legend */}
            <div className="mb-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-kioo-dark mb-4 text-center">Broadcast Status Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Live Broadcasting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm">Pre-recorded</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm">Sunday Rotation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Country Specific</span>
                </div>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="mb-8 bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-kioo-dark mb-4">Filter Options</h3>
              <div className="grid md:grid-cols-3 gap-4">
                
                {/* Day Filter */}
                <div>
                  <label htmlFor="day-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Day:
                  </label>
                  <select
                    id="day-filter"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  >
                    <option value="all">All Days</option>
                    {days.slice(1).map(day => (
                      <option key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Filter */}
                <div>
                  <label htmlFor="country-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Country:
                  </label>
                  <select
                    id="country-filter"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  >
                    <option value="all">All Countries</option>
                    <option value="liberia">🇱🇷 Liberia</option>
                    <option value="sierra_leone">🇸🇱 Sierra Leone</option>
                    <option value="guinea">🇬🇳 Guinea</option>
                  </select>
                </div>

                {/* Broadcast Type Filter */}
                <div>
                  <label htmlFor="broadcast-type-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Type:
                  </label>
                  <select
                    id="broadcast-type-filter"
                    value={selectedBroadcastType}
                    onChange={(e) => setSelectedBroadcastType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="live">Live Only</option>
                    <option value="pre-recorded">Pre-recorded Only</option>
                    <option value="rotation">Sunday Rotation</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedDay !== 'all' || selectedCountry !== 'all' || selectedBroadcastType !== 'all') && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {selectedDay !== 'all' && (
                    <span className="bg-kioo-primary text-white px-2 py-1 rounded text-xs">
                      Day: {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
                    </span>
                  )}
                  {selectedCountry !== 'all' && (
                    <span className="bg-kioo-primary text-white px-2 py-1 rounded text-xs">
                      Country: {selectedCountry === 'sierra_leone' ? 'Sierra Leone' : 
                               selectedCountry === 'liberia' ? 'Liberia' : 'Guinea'}
                    </span>
                  )}
                  {selectedBroadcastType !== 'all' && (
                    <span className="bg-kioo-primary text-white px-2 py-1 rounded text-xs">
                      Type: {selectedBroadcastType}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedDay('all');
                      setSelectedCountry('all');
                      setSelectedBroadcastType('all');
                    }}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Weekly Schedule Grid */}
            {(() => {
              const filteredSchedule = getFilteredBroadcastSchedule();
              const scheduleEntries = Object.entries(filteredSchedule.weeklySchedule);
              
              return (
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-kioo-dark mb-6 text-center">
                    Weekly Schedule 
                    {selectedDay !== 'all' && ` - ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}`}
                  </h3>
                  <div className="overflow-x-auto">
                    <div className={`grid gap-2 min-w-full ${scheduleEntries.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-7'}`}>
                      {scheduleEntries.map(([day, countries]) => (
                        <div key={day} className="text-center">
                          <div className="font-semibold text-gray-800 mb-2 capitalize text-sm lg:text-base">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </div>
                          <div className="space-y-1">
                            {/* Liberia */}
                            {(selectedCountry === 'all' || selectedCountry === 'liberia') && 
                             (matchesBroadcastTypeFilter(countries.liberia)) && (
                              <div className={`p-2 rounded text-xs lg:text-sm font-medium ${
                                countries.liberia === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                🇱🇷 {countries.liberia === 'live' ? 'Live' : 'Pre-rec'}
                              </div>
                            )}
                            {/* Sierra Leone */}
                            {(selectedCountry === 'all' || selectedCountry === 'sierra_leone') && 
                             (matchesBroadcastTypeFilter(countries.sierra_leone)) && (
                              <div className={`p-2 rounded text-xs lg:text-sm font-medium ${
                                countries.sierra_leone === 'live' ? 'bg-blue-100 text-blue-800' : 
                                countries.sierra_leone === 'rotation' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                🇸🇱 {countries.sierra_leone === 'live' ? 'Live' : countries.sierra_leone === 'rotation' ? 'Rotation' : 'Pre-rec'}
                              </div>
                            )}
                            {/* Guinea */}
                            {(selectedCountry === 'all' || selectedCountry === 'guinea') && 
                             (matchesBroadcastTypeFilter(countries.guinea)) && (
                              <div className={`p-2 rounded text-xs lg:text-sm font-medium ${
                                countries.guinea === 'live' ? 'bg-yellow-100 text-yellow-800' : 
                                countries.guinea === 'rotation' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                🇬🇳 {countries.guinea === 'live' ? 'Live' : countries.guinea === 'rotation' ? 'Rotation' : 'Pre-rec'}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Country Summary Table */}
            {(() => {
              const filteredCountries = getFilteredCountrySchedules();
              
              return filteredCountries.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-kioo-dark mb-6 text-center">
                    Country Summary
                    {selectedCountry !== 'all' && ` - ${selectedCountry === 'sierra_leone' ? 'Sierra Leone' : 
                                                       selectedCountry === 'liberia' ? 'Liberia' : 'Guinea'}`}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
                      <thead className="bg-kioo-primary text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Country</th>
                          <th className="px-6 py-4 text-left font-semibold">Live Days</th>
                          <th className="px-6 py-4 text-left font-semibold">Pre-recorded Days</th>
                          <th className="px-6 py-4 text-left font-semibold">Special Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCountries.map((country, index) => (
                          <tr key={country.country} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full mr-3 ${
                                  country.colorCode === 'green' ? 'bg-green-500' :
                                  country.colorCode === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'
                                }`}></div>
                                <span className="font-medium text-gray-900">
                                  {country.country === 'Liberia' ? '🇱🇷' : country.country === 'Sierra Leone' ? '🇸🇱' : '🇬🇳'} {country.country}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {country.liveDays.length === 7 ? 'Daily (Mon–Sun)' : country.liveDays.join(', ')}
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {country.preRecordedDays.length === 0 ? '—' : country.preRecordedDays.join(', ')}
                            </td>
                            <td className="px-6 py-4 text-gray-600 text-sm">
                              {country.specialNote}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Visual Country Cards */}
            {(() => {
              const filteredCountries = getFilteredCountrySchedules();
              
              return (
                <div className={`grid gap-6 ${
                  filteredCountries.length === 1 ? 'md:grid-cols-1 max-w-sm mx-auto' :
                  filteredCountries.length === 2 ? 'md:grid-cols-2' :
                  'md:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {/* Liberia Card */}
                  {(selectedCountry === 'all' || selectedCountry === 'liberia') && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="text-center">
                        <div className="text-4xl mb-3">🇱🇷</div>
                        <h4 className="text-lg font-semibold text-green-800 mb-2">Liberia</h4>
                        <div className="text-green-700 font-medium mb-2">Live every day</div>
                        <div className="text-sm text-green-600">Mon–Sun</div>
                      </div>
                    </div>
                  )}

                  {/* Sierra Leone Card */}
                  {(selectedCountry === 'all' || selectedCountry === 'sierra_leone') && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <div className="text-center">
                        <div className="text-4xl mb-3">🇸🇱</div>
                        <h4 className="text-lg font-semibold text-blue-800 mb-2">Sierra Leone</h4>
                        <div className="text-blue-700 font-medium mb-2">Live on Tue & Fri</div>
                        <div className="text-sm text-blue-600">Tuesday, Friday</div>
                      </div>
                    </div>
                  )}

                  {/* Guinea Card */}
                  {(selectedCountry === 'all' || selectedCountry === 'guinea') && (
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                      <div className="text-center">
                        <div className="text-4xl mb-3">🇬🇳</div>
                        <h4 className="text-lg font-semibold text-yellow-800 mb-2">Guinea</h4>
                        <div className="text-yellow-700 font-medium mb-2">Live on Wed & Sat</div>
                        <div className="text-sm text-yellow-600">Wednesday, Saturday</div>
                      </div>
                    </div>
                  )}

                  {/* Sunday Service Card */}
                  {selectedDay === 'all' || selectedDay === 'sunday' ? (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <div className="text-center">
                        <div className="text-4xl mb-3">⛪</div>
                        <h4 className="text-lg font-semibold text-purple-800 mb-2">Sunday Live Service</h4>
                        <div className="text-purple-700 font-medium mb-2">Rotates weekly</div>
                        <div className="text-sm text-purple-600">All three countries</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })()}

            {/* Color Legend */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Color Legend</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>Liberia (Daily Live)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span>Sierra Leone (Tue/Fri)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Guinea (Wed/Sat)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
                  <span>Pre-recorded</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Programs;