import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import SEOHead from '../components/SEOHead';

const Clocks = () => {
  const { t } = useTranslation();
  const [programData, setProgramData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [filterLanguages, setFilterLanguages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [weeklyTotals, setWeeklyTotals] = useState({});

  // Helper function to parse time string to minutes (defined early to avoid hoisting issues)
  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Load programming data
  useEffect(() => {
    const loadProgramData = async () => {
      try {
        const response = await fetch('/data/clocks.json');
        const data = await response.json();
        setProgramData(data);
        setFilterLanguages(data.languages.map(lang => lang.code));
      } catch (error) {
        console.error('Failed to load program data:', error);
      }
    };
    loadProgramData();
  }, []);

  // Update current time from server (every 30 seconds for live data, every minute for header clock)
  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/server-time`);
        const timeData = await response.json();
        setCurrentTime(new Date(timeData.monrovia_iso));
      } catch (error) {
        console.error('Failed to fetch server time, using client time:', error);
        // Fallback to client time with Liberia timezone
        const now = new Date();
        setCurrentTime(now);
      }
    };

    fetchServerTime();
    const interval = setInterval(fetchServerTime, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate weekly totals and target percentages
  const calculateWeeklyTotals = useMemo(() => {
    if (!programData) return {};

    const totals = {};
    const totalWeekMinutes = 168 * 60; // 168 hours * 60 minutes
    const targets = {
      kissi: 41.7,
      en: 25.0,
      fr: 16.7,
      ev: 16.7
    };

    programData.languages.forEach(lang => {
      totals[lang.code] = {
        minutes: 0,
        hours: 0,
        percentage: 0,
        target: targets[lang.code] || 0,
        drift: 0
      };
    });

    // Calculate for all 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach(day => {
      programData.weeklyBlocks.forEach(block => {
        if (block.day === '*' || block.day === day) {
          const startMinutes = parseTimeToMinutes(block.start);
          const endMinutes = parseTimeToMinutes(block.end);
          let duration = endMinutes - startMinutes;
          
          // Handle overnight programs (crossing midnight)
          if (duration < 0) {
            duration = (24 * 60) - startMinutes + endMinutes;
          }
          
          if (totals[block.lang]) {
            totals[block.lang].minutes += duration;
          }
        }
      });
    });

    // Convert to hours and calculate percentages
    Object.keys(totals).forEach(lang => {
      totals[lang].hours = Math.round(totals[lang].minutes / 60 * 10) / 10;
      totals[lang].percentage = Math.round((totals[lang].minutes / totalWeekMinutes) * 100 * 10) / 10;
      totals[lang].drift = Math.round((totals[lang].percentage - totals[lang].target) * 10) / 10;
    });

    return totals;
  }, [programData, parseTimeToMinutes]);

  // Get current live program
  const getCurrentLiveProgram = () => {
    if (!programData) return null;
    
    const now = currentTime;
    const currentDayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = dayNames[currentDayIndex];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Find matching program block
    for (const block of programData.weeklyBlocks) {
      if (block.day === '*' || block.day === currentDay) {
        const startMinutes = parseTimeToMinutes(block.start);
        const endMinutes = parseTimeToMinutes(block.end);
        
        let isCurrentlyLive = false;
        if (endMinutes > startMinutes) {
          // Same day program
          isCurrentlyLive = currentMinutes >= startMinutes && currentMinutes < endMinutes;
        } else {
          // Overnight program (crosses midnight)
          isCurrentlyLive = currentMinutes >= startMinutes || currentMinutes < endMinutes;
        }
        
        if (isCurrentlyLive) {
          return { ...block, day: currentDay };
        }
      }
    }
    return null;
  };

  // Get next program
  const getNextProgram = () => {
    if (!programData) return null;
    
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentDayIndex = now.getDay();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Look for next program today first
    const currentDay = dayNames[currentDayIndex];
    const todayBlocks = programData.weeklyBlocks
      .filter(block => block.day === '*' || block.day === currentDay)
      .map(block => ({ ...block, day: currentDay }))
      .sort((a, b) => parseTimeToMinutes(a.start) - parseTimeToMinutes(b.start));
    
    for (const block of todayBlocks) {
      const startMinutes = parseTimeToMinutes(block.start);
      if (startMinutes > currentMinutes) {
        return block;
      }
    }
    
    // If no program today, get first program tomorrow
    const nextDayIndex = (currentDayIndex + 1) % 7;
    const nextDay = dayNames[nextDayIndex];
    const nextDayBlocks = programData.weeklyBlocks
      .filter(block => block.day === '*' || block.day === nextDay)
      .map(block => ({ ...block, day: nextDay }))
      .sort((a, b) => parseTimeToMinutes(a.start) - parseTimeToMinutes(b.start));
    
    return nextDayBlocks[0] || null;
  };

  const currentLiveProgram = getCurrentLiveProgram();
  const nextProgram = getNextProgram();

  // Generate expanded schedule for the week
  const getWeeklySchedule = () => {
    if (!programData) return [];
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const schedule = [];
    
    days.forEach(day => {
      const daySchedule = programData.weeklyBlocks
        .filter(block => block.day === '*' || block.day === day)
        .map(block => ({
          ...block,
          day: day,
          actualDay: day
        }))
        .sort((a, b) => parseTimeToMinutes(a.start) - parseTimeToMinutes(b.start));
      
      schedule.push({
        day: day,
        blocks: daySchedule
      });
    });
    
    return schedule;
  };

  const weeklySchedule = getWeeklySchedule();

  // Language ring component
  const LanguageRing = () => {
    if (!programData) return null;
    
    const radius = 60;
    const strokeWidth = 15;
    const circumference = 2 * Math.PI * radius;
    
    let cumulativePercentage = 0;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="150" height="150" className="transform -rotate-90">
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />
            {programData.languages.map((lang, index) => {
              const percentage = calculateWeeklyTotals[lang.code]?.percentage || 0;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
              
              const segment = (
                <circle
                  key={lang.code}
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="none"
                  stroke={lang.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="cursor-pointer hover:stroke-opacity-80 transition-all"
                  onClick={() => handleLanguageFilter(lang.code)}
                  role="button"
                  aria-label={`${lang.name}: ${percentage}%`}
                />
              );
              
              cumulativePercentage += percentage;
              return segment;
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">{t('clocks.totalHours')}</div>
              <div className="text-lg font-bold">168{t('clocks.hoursAbbrev')}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {programData.languages.map(lang => {
            const total = calculateWeeklyTotals[lang.code];
            return (
              <div 
                key={lang.code}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => handleLanguageFilter(lang.code)}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: lang.color }}
                ></div>
                <span className="text-xs">
                  {lang.name}: {total?.percentage || 0}%
                  {Math.abs(total?.drift || 0) > 2 && (
                    <span className={`ml-1 ${total.drift > 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                      ({total.drift > 0 ? '+' : ''}{total.drift}%)
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleLanguageFilter = (langCode) => {
    if (selectedLanguage === langCode) {
      setSelectedLanguage(null);
      setFilterLanguages(programData.languages.map(lang => lang.code));
    } else {
      setSelectedLanguage(langCode);
      setFilterLanguages([langCode]);
    }
  };

  const openDetailsDrawer = (block) => {
    setSelectedBlock(block);
    setShowDetailsDrawer(true);
  };

  if (!programData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kioo-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('clocks.loadingSchedule')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title={`${t('clocks.title')} - Kioo Radio 98.1FM`}
        description="View Kioo Radio's weekly programming schedule with interactive clocks showing live broadcasts and upcoming shows."
        noIndex={false}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              🎵 Kioo Radio 98.1FM — {t('clocks.title')}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{t('clocks.subtitle')}</p>
            
            {/* Current Time Display */}
            <div className="inline-flex items-center bg-kioo-primary text-white px-4 py-2 rounded-full text-sm font-medium">
              <span className="mr-2">🕐</span>
              {t('clocks.currentTime')}: {currentTime.toLocaleTimeString('en-US', { 
                timeZone: 'Africa/Monrovia',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })} GMT
            </div>
          </div>
          
          {/* Language Share Ring */}
          <div className="mt-6 flex justify-center">
            <LanguageRing />
          </div>
        </div>
      </div>

      {/* Live Status and Next Up */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            {/* Live Now */}
            <div className="flex items-center">
              {currentLiveProgram ? (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                  <span className="font-bold text-lg">{t('clocks.liveNow')}:</span>
                  <span className="ml-2 text-lg">
                    {currentLiveProgram.title} ({currentLiveProgram.start} - {currentLiveProgram.end})
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  <span className="text-lg">{t('clocks.noLiveProgram')}</span>
                </>
              )}
            </div>
            
            {/* Next Up */}
            <div className="flex items-center">
              {nextProgram && (
                <>
                  <span className="font-medium">{t('clocks.nextUp')}:</span>
                  <span className="ml-2">
                    {nextProgram.title} at {nextProgram.start}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter by Language:</span>
              {programData.languages.map(lang => (
                <label key={lang.code} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterLanguages.includes(lang.code)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterLanguages([...filterLanguages, lang.code]);
                      } else {
                        setFilterLanguages(filterLanguages.filter(code => code !== lang.code));
                      }
                    }}
                    className="mr-2"
                  />
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: lang.color }}
                  ></div>
                  <span className="text-sm">{lang.name}</span>
                </label>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
              />
              <button
                onClick={() => {
                  setFilterLanguages(programData.languages.map(lang => lang.code));
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Week Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Weekly Programming Schedule</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x">
            {weeklySchedule.map((daySchedule, dayIndex) => (
              <div key={daySchedule.day} className="p-4">
                <h3 className="font-bold text-center text-gray-900 mb-4 sticky top-0 bg-white py-2">
                  {daySchedule.day}
                </h3>
                
                <div className="space-y-1">
                  {daySchedule.blocks
                    .filter(block => 
                      filterLanguages.includes(block.lang) &&
                      (searchTerm === '' || 
                       block.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((block, blockIndex) => {
                      const langInfo = programData.languages.find(l => l.code === block.lang);
                      const isLive = currentLiveProgram && 
                        currentLiveProgram.title === block.title && 
                        currentLiveProgram.start === block.start &&
                        currentLiveProgram.day === block.actualDay;
                      
                      return (
                        <div
                          key={`${block.day}-${block.start}-${blockIndex}`}
                          className={`p-2 rounded cursor-pointer transition-all hover:shadow-md ${
                            isLive ? 'ring-2 ring-red-500 bg-red-50 animate-pulse' : 'hover:bg-gray-50'
                          }`}
                          style={{ 
                            borderLeft: `4px solid ${langInfo?.color}`,
                            backgroundColor: isLive ? '#fef2f2' : 'white'
                          }}
                          onClick={() => openDetailsDrawer({ ...block, langInfo })}
                          role="button"
                          aria-label={`${block.title}, ${block.start} to ${block.end}, ${langInfo?.name}`}
                        >
                          <div className="text-xs font-medium text-gray-600 mb-1">
                            {block.start} - {block.end}
                            {isLive && <span className="ml-2 text-red-600 font-bold">LIVE</span>}
                          </div>
                          <div className="text-sm font-medium text-gray-900 leading-tight">
                            {block.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {langInfo?.name}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Totals Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Programming Totals</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {programData.languages.map(lang => {
              const total = calculateWeeklyTotals[lang.code];
              const isDrifting = Math.abs(total?.drift || 0) > 2;
              
              return (
                <div key={lang.code} className="text-center p-4 border rounded-lg">
                  <div 
                    className="w-6 h-6 rounded-full mx-auto mb-2" 
                    style={{ backgroundColor: lang.color }}
                  ></div>
                  <div className="font-medium text-gray-900">{lang.name}</div>
                  <div className="text-2xl font-bold text-gray-800">{total?.hours || 0}h</div>
                  <div className="text-sm text-gray-600">
                    {total?.percentage || 0}% of week
                  </div>
                  <div className="text-xs text-gray-500">
                    Target: {total?.target || 0}%
                  </div>
                  {isDrifting && (
                    <div className={`text-xs font-medium mt-1 ${
                      total.drift > 0 ? 'text-orange-600' : 'text-blue-600'
                    }`}>
                      {total.drift > 0 ? '+' : ''}{total.drift}% from target
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details Drawer */}
      {showDetailsDrawer && selectedBlock && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailsDrawer(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Program Details</h3>
                  <button
                    onClick={() => setShowDetailsDrawer(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="flex-1 px-6 py-4 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Title</label>
                    <p className="text-lg font-medium text-gray-900">{selectedBlock.title}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Language</label>
                    <div className="flex items-center mt-1">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: selectedBlock.langInfo?.color }}
                      ></div>
                      <p className="text-gray-900">{selectedBlock.langInfo?.name}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Day</label>
                    <p className="text-gray-900">{selectedBlock.actualDay}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Time</label>
                    <p className="text-gray-900">{selectedBlock.start} - {selectedBlock.end} GMT</p>
                  </div>
                  
                  {/* Hour Template if available */}
                  {programData.hourTemplates[selectedBlock.lang] && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Hourly Breakdown</label>
                      <div className="mt-2 space-y-2">
                        {programData.hourTemplates[selectedBlock.lang].map((segment, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">:{segment.start}-:{segment.end}</span>
                            <span className="text-gray-900">{segment.item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex space-x-3">
                  <button 
                    className="flex-1 bg-kioo-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-kioo-primary/90 transition-colors"
                    onClick={() => {
                      // Add to calendar functionality would go here
                      alert('Add to Calendar feature coming soon!');
                    }}
                  >
                    📅 Add to Calendar
                  </button>
                  <button 
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      const url = `${window.location.href}?day=${selectedBlock.actualDay}&start=${selectedBlock.start}`;
                      navigator.clipboard.writeText(url);
                      alert('Link copied to clipboard!');
                    }}
                  >
                    🔗 Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clocks;