import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProgramsLineup = () => {
  const [activeTab, setActiveTab] = useState('weekday');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [liveBroadcastSchedule, setLiveBroadcastSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Complete schedule data from the Excel file
  const weekdaySchedule = [
    { "Start Time": "00:00", "End Time": "00:30", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "00:30", "End Time": "01:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "01:00", "End Time": "01:30", "Program": "Community Announcements", "Language": "English", "Type": "Community" },
    { "Start Time": "01:30", "End Time": "02:00", "Program": "Phone-in Program", "Language": "English", "Type": "Interactive" },
    { "Start Time": "02:00", "End Time": "02:30", "Program": "Thru the Bible (TTB)", "Language": "Kissi", "Type": "Bible Teaching" },
    { "Start Time": "02:30", "End Time": "03:00", "Program": "Music & Reflection", "Language": "Kissi", "Type": "Music" },
    { "Start Time": "03:00", "End Time": "03:30", "Program": "Community Announcements", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "03:30", "End Time": "04:00", "Program": "Phone-in Program", "Language": "Kissi", "Type": "Interactive" },
    { "Start Time": "04:00", "End Time": "04:30", "Program": "Thru the Bible (TTB)", "Language": "French", "Type": "Bible Teaching" },
    { "Start Time": "04:30", "End Time": "05:00", "Program": "Music & Reflection", "Language": "French", "Type": "Music" },
    { "Start Time": "05:00", "End Time": "05:15", "Program": "Morning Devotional", "Language": "English", "Type": "Devotional" },
    { "Start Time": "05:15", "End Time": "05:45", "Program": "Morning Prayer & Worship", "Language": "English", "Type": "Worship" },
    { "Start Time": "05:45", "End Time": "06:00", "Program": "Community Announcements", "Language": "English", "Type": "Community" },
    { "Start Time": "06:00", "End Time": "06:30", "Program": "Local Pastors' Preaching", "Language": "English (rotating)", "Type": "Sermon" },
    { "Start Time": "06:30", "End Time": "07:00", "Program": "Phone-in Program", "Language": "English", "Type": "Interactive" },
    { "Start Time": "07:00", "End Time": "07:30", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "07:30", "End Time": "08:00", "Program": "Community Programming", "Language": "English", "Type": "Community" },
    { "Start Time": "08:00", "End Time": "08:30", "Program": "Thru the Bible (TTB)", "Language": "Kissi", "Type": "Bible Teaching" },
    { "Start Time": "08:30", "End Time": "09:00", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "09:00", "End Time": "10:00", "Program": "VNA French Satellite Feed", "Language": "French", "Type": "Satellite" },
    { "Start Time": "10:00", "End Time": "10:30", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
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
    { "Start Time": "16:00", "End Time": "16:30", "Program": "Thru the Bible (TTB)", "Language": "Mandingo", "Type": "Bible Teaching" },
    { "Start Time": "16:30", "End Time": "17:00", "Program": "Community Programming", "Language": "Mandingo", "Type": "Community" },
    { "Start Time": "17:00", "End Time": "17:30", "Program": "Thru the Bible (TTB)", "Language": "Fula", "Type": "Bible Teaching" },
    { "Start Time": "17:30", "End Time": "18:00", "Program": "Community Programming", "Language": "Fula", "Type": "Community" },
    { "Start Time": "18:00", "End Time": "18:30", "Program": "Evening News & Roundup", "Language": "Mixed", "Type": "Community" },
    { "Start Time": "18:30", "End Time": "19:00", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "19:00", "End Time": "19:30", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "19:30", "End Time": "20:00", "Program": "Community Announcements", "Language": "English", "Type": "Community" },
    { "Start Time": "20:00", "End Time": "20:30", "Program": "Thru the Bible (TTB)", "Language": "Kissi", "Type": "Bible Teaching" },
    { "Start Time": "20:30", "End Time": "21:00", "Program": "Phone-in Program", "Language": "Kissi", "Type": "Interactive" },
    { "Start Time": "21:00", "End Time": "21:30", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "21:30", "End Time": "22:00", "Program": "Evening Worship & Reflection", "Language": "English", "Type": "Devotional" },
    { "Start Time": "22:00", "End Time": "22:30", "Program": "Thru the Bible (TTB)", "Language": "French", "Type": "Bible Teaching" },
    { "Start Time": "22:30", "End Time": "23:00", "Program": "Community Announcements", "Language": "Mixed", "Type": "Community" },
    { "Start Time": "23:00", "End Time": "23:30", "Program": "Music & Reflection", "Language": "Mixed", "Type": "Music" },
    { "Start Time": "23:30", "End Time": "00:00", "Program": "Hope & Care Outreach", "Language": "Mixed", "Type": "Community" }
  ];

  const saturdaySchedule = [
    { "Start Time": "00:00", "End Time": "00:30", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "00:30", "End Time": "01:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "01:00", "End Time": "02:00", "Program": "Community Programming", "Language": "English", "Type": "Community" },
    { "Start Time": "02:00", "End Time": "03:00", "Program": "Thru the Bible (TTB)", "Language": "Kissi", "Type": "Bible Teaching" },
    { "Start Time": "03:00", "End Time": "04:00", "Program": "Thru the Bible (TTB)", "Language": "French", "Type": "Bible Teaching" },
    { "Start Time": "04:00", "End Time": "05:00", "Program": "Music & Reflection", "Language": "French", "Type": "Music" },
    { "Start Time": "05:00", "End Time": "06:00", "Program": "Morning Devotional & Prayer", "Language": "English", "Type": "Devotional" },
    { "Start Time": "06:00", "End Time": "07:00", "Program": "Community Programming", "Language": "English", "Type": "Community" },
    { "Start Time": "07:00", "End Time": "08:00", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "08:00", "End Time": "09:00", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "09:00", "End Time": "11:00", "Program": "NLASN 'Island Praise'", "Language": "English", "Type": "Satellite", "highlight": true },
    { "Start Time": "11:00", "End Time": "12:00", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "12:00", "End Time": "13:00", "Program": "Community Programming", "Language": "French", "Type": "Community" },
    { "Start Time": "13:00", "End Time": "14:00", "Program": "Thru the Bible (TTB)", "Language": "French", "Type": "Bible Teaching" },
    { "Start Time": "14:00", "End Time": "15:00", "Program": "Community Programming", "Language": "Mandingo", "Type": "Community" },
    { "Start Time": "15:00", "End Time": "16:00", "Program": "Thru the Bible (TTB)", "Language": "Mandingo", "Type": "Bible Teaching" },
    { "Start Time": "16:00", "End Time": "17:00", "Program": "Community Programming", "Language": "Fula", "Type": "Community" },
    { "Start Time": "17:00", "End Time": "18:00", "Program": "Thru the Bible (TTB)", "Language": "Fula", "Type": "Bible Teaching" },
    { "Start Time": "18:00", "End Time": "19:00", "Program": "Evening Programming", "Language": "Mixed", "Type": "Community" },
    { "Start Time": "19:00", "End Time": "20:00", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "20:00", "End Time": "21:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "21:00", "End Time": "22:00", "Program": "Thru the Bible (TTB)", "Language": "Kissi", "Type": "Bible Teaching" },
    { "Start Time": "22:00", "End Time": "23:00", "Program": "Community Programming", "Language": "Mixed", "Type": "Community" },
    { "Start Time": "23:00", "End Time": "00:00", "Program": "Music & Reflection", "Language": "Mixed", "Type": "Music" }
  ];

  const sundaySchedule = [
    { "Start Time": "00:00", "End Time": "01:00", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "01:00", "End Time": "02:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "02:00", "End Time": "03:00", "Program": "Thru the Bible (TTB)", "Language": "Kissi", "Type": "Bible Teaching" },
    { "Start Time": "03:00", "End Time": "04:00", "Program": "Thru the Bible (TTB)", "Language": "French", "Type": "Bible Teaching" },
    { "Start Time": "04:00", "End Time": "05:00", "Program": "Music & Reflection", "Language": "French", "Type": "Music" },
    { "Start Time": "05:00", "End Time": "06:00", "Program": "Morning Devotional & Prayer", "Language": "English", "Type": "Devotional" },
    { "Start Time": "06:00", "End Time": "07:00", "Program": "Pre-Service Programming", "Language": "English", "Type": "Community" },
    { "Start Time": "07:00", "End Time": "08:00", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "08:00", "End Time": "09:00", "Program": "Community Programming", "Language": "Kissi", "Type": "Community" },
    { "Start Time": "09:00", "End Time": "10:00", "Program": "Pre-Service Worship", "Language": "Mixed", "Type": "Worship" },
    { "Start Time": "10:00", "End Time": "12:00", "Program": "Live Partner Church Service", "Language": "English/French/Mixed", "Type": "Live Service", "highlight": true },
    { "Start Time": "12:00", "End Time": "13:00", "Program": "Post-Service Reflection", "Language": "Mixed", "Type": "Devotional" },
    { "Start Time": "13:00", "End Time": "14:00", "Program": "Thru the Bible (TTB)", "Language": "French", "Type": "Bible Teaching" },
    { "Start Time": "14:00", "End Time": "15:00", "Program": "Community Programming", "Language": "French", "Type": "Community" },
    { "Start Time": "15:00", "End Time": "16:00", "Program": "Thru the Bible (TTB)", "Language": "Mandingo", "Type": "Bible Teaching" },
    { "Start Time": "16:00", "End Time": "17:00", "Program": "Community Programming", "Language": "Mandingo", "Type": "Community" },
    { "Start Time": "17:00", "End Time": "18:00", "Program": "Thru the Bible (TTB)", "Language": "Fula", "Type": "Bible Teaching" },
    { "Start Time": "18:00", "End Time": "19:00", "Program": "Community Programming", "Language": "Fula", "Type": "Community" },
    { "Start Time": "19:00", "End Time": "20:00", "Program": "Sunday Evening Worship", "Language": "Mixed", "Type": "Worship" },
    { "Start Time": "20:00", "End Time": "21:00", "Program": "Thru the Bible (TTB)", "Language": "English", "Type": "Bible Teaching" },
    { "Start Time": "21:00", "End Time": "22:00", "Program": "Music & Reflection", "Language": "English", "Type": "Music" },
    { "Start Time": "22:00", "End Time": "23:00", "Program": "Community Programming", "Language": "Mixed", "Type": "Community" },
    { "Start Time": "23:00", "End Time": "00:00", "Program": "Evening Devotional", "Language": "Mixed", "Type": "Devotional" }
  ];

  // Special weekly programs
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

  // Language options
  const languages = ['all', 'English', 'French', 'Kissi', 'Fula', 'Mandingo', 'Gbandi', 'Mixed'];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-kioo-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              📻 Programs Lineup
            </h1>
            <div className="max-w-4xl mx-auto text-left">
              <p className="text-lg lg:text-xl text-green-100 leading-relaxed">
                Kioo Radio 98.1FM exists to serve the Makona River Region across Liberia, Sierra Leone, and Guinea with Christ-centered teaching, uplifting music, and community-focused programming. Our broadcast lineup reflects our commitment to daily Bible teaching in multiple languages (English, French, Kissi, Fula, Mandingo), along with weekly cultural programming (Gbandi), interactive phone-in shows, and live Sunday church services. This schedule will continue to evolve as we grow, ensuring that every community and language group in our coverage area is represented.
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
    </div>
  );
};

export default ProgramsLineup;