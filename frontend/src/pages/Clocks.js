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

  // Create donut chart segments
  const createDonutSegments = () => {
    const filteredData = languageData.filter(lang => visibleLanguages.includes(lang.code));
    let cumulativePercentage = 0;
    const radius = 80;
    const strokeWidth = 40;
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
  const downloadPNG = () => {
    const svg = document.querySelector('#donut-chart');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 400;
    canvas.height = 400;
    
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = 'kioo-radio-broadcast-time.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const exportCSV = () => {
    const csvContent = [
      'Language,Percentage,Hours per Week',
      ...languageData.map(lang => `${lang.name},${lang.percentage}%,${lang.hours}`)
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kioo-radio-broadcast-languages.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const donutSegments = createDonutSegments();
  const totalVisiblePercentage = donutSegments.reduce((sum, segment) => sum + segment.percentage, 0);
  const totalVisibleHours = donutSegments.reduce((sum, segment) => sum + segment.hours, 0);

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
          // Single Week Donut
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
              
              {/* Large Donut Chart */}
              <div className="relative">
                <svg width="240" height="240" id="donut-chart" className="transform -rotate-90">
                  <circle
                    cx="120"
                    cy="120"
                    r="80"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="40"
                  />
                  {donutSegments.map((segment, index) => (
                    <circle
                      key={segment.code}
                      cx="120"
                      cy="120"
                      r="80"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="40"
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
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
                      <span className="font-medium">{totalVisiblePercentage.toFixed(1)}% • {totalVisibleHours}h</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Full Week:</span>
                      <span className="font-medium">100% • 168h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Seven Day Donuts
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Daily Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
                <div key={day} className="text-center">
                  <h4 className="font-medium text-gray-900 mb-3">{day}</h4>
                  <div className="relative mx-auto" style={{ width: '120px', height: '120px' }}>
                    <svg width="120" height="120" className="transform -rotate-90">
                      <circle
                        cx="60"
                        cy="60"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="20"
                      />
                      {donutSegments.map((segment, index) => (
                        <circle
                          key={`${day}-${segment.code}`}
                          cx="60"
                          cy="60"
                          r="40"
                          fill="none"
                          stroke={segment.color}
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
                        <div className="text-sm font-bold text-gray-900">24h</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Same language distribution</p>
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
                      style={{ backgroundColor: selectedSegment.color }}
                    ></div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedSegment.name}</h4>
                  </div>
                  
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
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Weekly Impact</h5>
                    <p className="text-sm text-gray-600">
                      {selectedSegment.name} programming reaches our community for {selectedSegment.hours} hours 
                      each week, representing {selectedSegment.percentage}% of our total broadcast time.
                    </p>
                  </div>
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