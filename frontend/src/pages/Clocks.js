import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import SEOHead from '../components/SEOHead';

const ClocksNew = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
  const [visibleLanguages, setVisibleLanguages] = useState(['kissi', 'en', 'fr', 'ev']);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  // Language data with exact broadcast percentages (totaling 100%)
  const languageData = [
    { code: 'kissi', name: 'Kissi', percentage: 41.7, color: '#148026', hours: 70 },
    { code: 'en', name: 'English', percentage: 25.0, color: '#1b5f9e', hours: 42 },
    { code: 'fr', name: 'French', percentage: 16.6, color: '#c47a00', hours: 28 },
    { code: 'ev', name: 'Evangelistic Focus (Fula/Mandingo/Gbandi)', percentage: 16.7, color: '#7b3fb2', hours: 28 }
  ];

  // 24-hour programming schedule with time slots
  const dailySchedule = [
    { start: 0, end: 2, lang: 'fr', program: 'Overnight French Programming', hours: 2 },
    { start: 2, end: 4, lang: 'en', program: 'Overnight English Programming', hours: 2 },
    { start: 4, end: 6, lang: 'kissi', program: 'Pre-Dawn Worship (Kissi)', hours: 2 },
    { start: 6, end: 10, lang: 'kissi', program: 'Morning Devotion & Community', hours: 4 },
    { start: 10, end: 12, lang: 'en', program: 'Magazine & News (EN)', hours: 2 },
    { start: 12, end: 14, lang: 'fr', program: 'Magazine & News (FR)', hours: 2 },
    { start: 14, end: 16, lang: 'ev', program: 'Evangelistic Programs', hours: 2 },
    { start: 16, end: 18, lang: 'en', program: 'Drive Time (EN)', hours: 2 },
    { start: 18, end: 22, lang: 'kissi', program: 'Evening Block (Kissi)', hours: 4 },
    { start: 22, end: 24, lang: 'ev', program: 'Evening Outreach (EV)', hours: 2 }
  ];

  // Create 24-hour clock segments based on actual programming
  const create24HourSegments = () => {
    const radius = 80;
    const strokeWidth = 40;
    const totalMinutes = 24 * 60; // 1440 minutes in a day
    const circumference = 2 * Math.PI * radius;
    
    let segments = [];
    let cumulativeMinutes = 0;

    dailySchedule.forEach((timeSlot, index) => {
      if (visibleLanguages.includes(timeSlot.lang)) {
        const langInfo = languageData.find(l => l.code === timeSlot.lang);
        const slotMinutes = timeSlot.hours * 60;
        const percentageOfDay = slotMinutes / totalMinutes;
        
        const strokeDasharray = `${percentageOfDay * circumference} ${circumference}`;
        const strokeDashoffset = -((cumulativeMinutes / totalMinutes) * circumference);
        
        segments.push({
          ...timeSlot,
          langInfo,
          strokeDasharray,
          strokeDashoffset,
          percentageOfDay: Math.round(percentageOfDay * 100 * 10) / 10,
          startTime: `${String(timeSlot.start).padStart(2, '0')}:00`,
          endTime: `${String(timeSlot.end).padStart(2, '0')}:00`,
          index
        });
      }
      cumulativeMinutes += timeSlot.hours * 60;
    });

    return segments;
  };

  // Create summary donut for language percentages
  const createLanguageSummary = () => {
    const filteredData = languageData.filter(lang => visibleLanguages.includes(lang.code));
    let cumulativePercentage = 0;
    const radius = 60;
    const strokeWidth = 30;
    const circumference = 2 * Math.PI * radius;

    return filteredData.map((lang, index) => {
      const strokeDasharray = `${(lang.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
      
      cumulativePercentage += lang.percentage;
      
      return {
        ...lang,
        strokeDasharray,
        strokeDashoffset,
        index
      };
    });
  };

  // Handle segment click
  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);
    setShowPanel(true);
  };

  // Handle language visibility toggle
  const toggleLanguageVisibility = (langCode) => {
    if (visibleLanguages.includes(langCode)) {
      if (visibleLanguages.length > 1) { // Keep at least one visible
        setVisibleLanguages(visibleLanguages.filter(code => code !== langCode));
      }
    } else {
      setVisibleLanguages([...visibleLanguages, langCode]);
    }
  };

  // Export functions
  const downloadPNG = async () => {
    try {
      const svg = document.querySelector('#main-clock-chart');
      if (!svg) {
        alert('Chart not found. Please try again.');
        return;
      }

      // Create a temporary canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgRect = svg.getBoundingClientRect();
      
      canvas.width = 600;
      canvas.height = 600;
      
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add title
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Kioo Radio 98.1FM - Broadcast Time Distribution', canvas.width / 2, 40);
      
      // Serialize SVG
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = () => {
        // Draw SVG to canvas
        ctx.drawImage(img, 50, 80, 500, 500);
        
        // Create download link
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          link.download = 'kioo-radio-broadcast-distribution.png';
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
      };
      
      img.onerror = () => {
        alert('Failed to generate PNG. Please try again.');
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    } catch (error) {
      console.error('PNG export error:', error);
      alert('Failed to export PNG. Please try again.');
    }
  };

  const exportCSV = () => {
    try {
      // Create comprehensive CSV data
      const csvData = [
        ['Kioo Radio 98.1FM - Broadcast Time Distribution'],
        ['Generated on:', new Date().toLocaleString()],
        [''],
        ['Language Summary'],
        ['Language', 'Percentage', 'Hours per Week', 'Color Code'],
        ...languageData.map(lang => [
          lang.name,
          `${lang.percentage}%`,
          `${lang.hours}h`,
          lang.color
        ]),
        [''],
        ['Daily Time Slots (24-hour format)'],
        ['Start Time', 'End Time', 'Language', 'Program', 'Duration (hours)'],
        ...dailySchedule.map(slot => {
          const langInfo = languageData.find(l => l.code === slot.lang);
          return [
            `${String(slot.start).padStart(2, '0')}:00`,
            `${String(slot.end).padStart(2, '0')}:00`,
            langInfo?.name || slot.lang,
            slot.program,
            `${slot.hours}h`
          ];
        })
      ];

      const csvContent = csvData.map(row => 
        Array.isArray(row) ? row.map(cell => `"${cell}"`).join(',') : `"${row}"`
      ).join('\\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'kioo-radio-broadcast-schedule.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export error:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  const clockSegments = create24HourSegments();
  const languageSummary = createLanguageSummary();
  const totalVisiblePercentage = languageSummary.reduce((sum, segment) => sum + segment.percentage, 0);
  const totalVisibleHours = languageSummary.reduce((sum, segment) => sum + segment.hours, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Broadcast Time — Interactive Clocks (Kioo Radio 98.1FM)"
        description="Interactive broadcast time visualization showing weekly programming distribution by language for Kioo Radio 98.1FM"
        noIndex={false}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              🎵 Broadcast Time — Interactive Clocks
            </h1>
            <p className="text-lg text-gray-600 mb-2">Kioo Radio 98.1FM</p>
            <p className="text-sm text-gray-500">
              Based on weekly broadcast total: 168 hours (GMT / Liberia)
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 flex">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week' 
                  ? 'bg-kioo-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'day' 
                  ? 'bg-kioo-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Day View
            </button>
          </div>
        </div>

        {/* Charts Section */}
        {viewMode === 'week' ? (
          <div className="space-y-8">
            {/* 24-Hour Programming Clock */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                24-Hour Programming Distribution
              </h3>
              <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
                
                {/* Large 24-Hour Clock */}
                <div className="relative">
                  <svg width="320" height="320" id="main-clock-chart" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="160"
                      cy="160"
                      r="120"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="60"
                    />
                    
                    {/* Hour markers */}
                    {Array.from({ length: 24 }, (_, i) => {
                      const angle = (i * 15) - 90; // 360/24 = 15 degrees per hour
                      const radians = (angle * Math.PI) / 180;
                      const x1 = 160 + Math.cos(radians) * 85;
                      const y1 = 160 + Math.sin(radians) * 85;
                      const x2 = 160 + Math.cos(radians) * 95;
                      const y2 = 160 + Math.sin(radians) * 95;
                      
                      return (
                        <g key={i} className="transform rotate-90" style={{ transformOrigin: '160px 160px' }}>
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#666"
                            strokeWidth="2"
                          />
                          <text
                            x={160 + Math.cos(radians) * 75}
                            y={160 + Math.sin(radians) * 75}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="12"
                            fill="#666"
                            className="font-medium"
                          >
                            {i === 0 ? '12' : i}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Programming segments */}
                    {clockSegments.map((segment, index) => (
                      <circle
                        key={`segment-${index}`}
                        cx="160"
                        cy="160"
                        r="120"
                        fill="none"
                        stroke={segment.langInfo?.color || '#666'}
                        strokeWidth="60"
                        strokeDasharray={segment.strokeDasharray}
                        strokeDashoffset={segment.strokeDashoffset}
                        className="cursor-pointer hover:stroke-opacity-80 transition-all"
                        onClick={() => handleSegmentClick(segment)}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                        title={`${segment.startTime}-${segment.endTime}: ${segment.program}`}
                      />
                    ))}
                  </svg>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">24 Hours</div>
                      <div className="text-sm text-gray-600">Daily Schedule</div>
                    </div>
                  </div>
                </div>

                {/* Time Slots Legend */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Programming Time Slots</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {clockSegments.map((segment, index) => (
                        <div 
                          key={`slot-${index}`}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSegmentClick(segment)}
                        >
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: segment.langInfo?.color }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {segment.startTime} - {segment.endTime}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {segment.program}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {segment.hours}h
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Summary Donut */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Weekly Language Distribution
              </h3>
              <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
                
                {/* Language Summary Donut */}
                <div className="relative">
                  <svg width="240" height="240" id="language-summary-chart" className="transform -rotate-90">
                    <circle
                      cx="120"
                      cy="120"
                      r="60"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="30"
                    />
                    {languageSummary.map((segment, index) => (
                      <circle
                        key={segment.code}
                        cx="120"
                        cy="120"
                        r="60"
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="30"
                        strokeDasharray={segment.strokeDasharray}
                        strokeDashoffset={segment.strokeDashoffset}
                        className="cursor-pointer hover:stroke-opacity-80 transition-all"
                        onClick={() => handleSegmentClick(segment)}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                      />
                    ))}
                  </svg>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{totalVisiblePercentage.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">{totalVisibleHours}h/week</div>
                    </div>
                  </div>
                </div>

                {/* Legend & Controls */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Languages</h4>
                    <div className="space-y-3">
                      {languageData.map(lang => (
                        <div key={lang.code} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`lang-${lang.code}`}
                            checked={visibleLanguages.includes(lang.code)}
                            onChange={() => toggleLanguageVisibility(lang.code)}
                            className="h-4 w-4 text-kioo-primary focus:ring-kioo-primary border-gray-300 rounded"
                          />
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: lang.color }}
                          ></div>
                          <label 
                            htmlFor={`lang-${lang.code}`}
                            className="text-sm text-gray-700 cursor-pointer flex-1"
                          >
                            {lang.name}
                          </label>
                          <span className="text-sm font-medium text-gray-900">
                            {lang.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total Visible:</span>
                        <span className="font-medium">100.0% • {totalVisibleHours}h</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Full Week:</span>
                        <span className="font-medium">100.0% • 168h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Seven Day View - Mini 24-hour clocks
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              Daily 24-Hour Programming (7 Days)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
                <div key={day} className="text-center">
                  <h4 className="font-medium text-gray-900 mb-3">{day}</h4>
                  <div className="relative mx-auto" style={{ width: '120px', height: '120px' }}>
                    <svg width="120" height="120" className="transform -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="20"
                      />
                      
                      {/* Hour markers for mini clocks */}
                      {Array.from({ length: 12 }, (_, i) => {
                        const angle = i * 30 - 90; // 30 degrees per hour for 12-hour markers
                        const radians = (angle * Math.PI) / 180;
                        const x1 = 60 + Math.cos(radians) * 35;
                        const y1 = 60 + Math.sin(radians) * 35;
                        const x2 = 60 + Math.cos(radians) * 40;
                        const y2 = 60 + Math.sin(radians) * 40;
                        
                        return (
                          <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#ccc"
                            strokeWidth="1"
                          />
                        );
                      })}
                      
                      {/* Programming segments */}
                      {clockSegments.map((segment, index) => (
                        <circle
                          key={`${day}-${segment.start}-${index}`}
                          cx="60"
                          cy="60"
                          r="40"
                          fill="none"
                          stroke={segment.langInfo?.color}
                          strokeWidth="20"
                          strokeDasharray={segment.strokeDasharray}
                          strokeDashoffset={segment.strokeDashoffset}
                          className="cursor-pointer hover:stroke-opacity-80 transition-all"
                          onClick={() => handleSegmentClick(segment)}
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-900">24h</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Same daily schedule</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={downloadPNG}
              className="flex items-center justify-center px-4 py-2 bg-kioo-primary text-white rounded-md hover:bg-kioo-primary/90 transition-colors"
            >
              📸 Download PNG
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              📊 Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Segment Details Panel */}
      {showPanel && selectedSegment && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowPanel(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Language Details</h3>
                  <button
                    onClick={() => setShowPanel(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="flex-1 px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: selectedSegment.langInfo?.color || selectedSegment.color }}
                    ></div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {selectedSegment.program || selectedSegment.name}
                    </h4>
                  </div>
                  
                  {/* Time slot details */}
                  {selectedSegment.startTime && (
                    <div className="bg-kioo-primary/10 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Time Slot</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-kioo-primary">{selectedSegment.startTime}</div>
                          <div className="text-sm text-gray-600">Start Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-kioo-primary">{selectedSegment.endTime}</div>
                          <div className="text-sm text-gray-600">End Time</div>
                        </div>
                      </div>
                      <div className="text-center mt-3">
                        <div className="text-2xl font-bold text-gray-900">{selectedSegment.hours}h</div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Language summary for language segments */}
                  {selectedSegment.percentage && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-kioo-primary">{selectedSegment.percentage}%</div>
                        <div className="text-sm text-gray-600">Weekly Share</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-kioo-primary">{selectedSegment.hours}h</div>
                        <div className="text-sm text-gray-600">Hours/Week</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Program Details</h5>
                    <p className="text-sm text-gray-600">
                      {selectedSegment.program ? (
                        <>
                          <strong>{selectedSegment.program}</strong> airs daily from {selectedSegment.startTime} to {selectedSegment.endTime} 
                          in {selectedSegment.langInfo?.name} language, providing {selectedSegment.hours} hours of daily programming.
                        </>
                      ) : (
                        <>
                          {selectedSegment.name} programming reaches our community for {selectedSegment.hours} hours 
                          each week, representing {selectedSegment.percentage}% of our total broadcast time.
                        </>
                      )}
                    </p>
                  </div>

                  {/* Show related time slots for language selections */}
                  {selectedSegment.code && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Daily Time Slots</h5>
                      <div className="space-y-2">
                        {dailySchedule
                          .filter(slot => slot.lang === selectedSegment.code)
                          .map((slot, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="font-medium">
                                {String(slot.start).padStart(2, '0')}:00 - {String(slot.end).padStart(2, '0')}:00
                              </span>
                              <span className="text-gray-600">{slot.program}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClocksNew;