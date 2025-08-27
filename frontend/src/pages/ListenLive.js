import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ListenLive = () => {
  const [radioStatus, setRadioStatus] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [upcomingPrograms, setUpcomingPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, programsRes] = await Promise.all([
          axios.get(`${API}/radio/status`),
          axios.get(`${API}/programs`)
        ]);
        
        setRadioStatus(statusRes.data);
        setUpcomingPrograms(programsRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching radio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="radio-waves mb-4">
            <div className="w-16 h-16 border-4 border-kioo-primary rounded-full"></div>
          </div>
          <p className="text-kioo-primary">Connecting to Kioo Radio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kioo-primary via-kioo-secondary to-kioo-dark">
      
      {/* Main Player Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Live Status Banner */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <span className="w-3 h-3 bg-red-400 rounded-full live-pulse"></span>
              <span className="text-white font-semibold">🔴 LIVE BROADCAST</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              Kioo Radio 98.1 FM
            </h1>
            <p className="text-xl text-green-100 mb-8">
              The Gift of Good News • Broadcasting Live 24/7
            </p>
          </div>

          {/* Audio Player */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white border-opacity-20">
            
            {/* Current Program Info */}
            {radioStatus && (
              <div className="text-center mb-8">
                <p className="text-green-200 text-sm mb-2">Currently Playing</p>
                <h2 className="text-2xl font-bold text-white mb-2">{radioStatus.current_program}</h2>
                <p className="text-green-100">Next: {radioStatus.next_program}</p>
                <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-green-200">
                  <span>👥 {radioStatus.listener_count} Listeners</span>
                  <span>•</span>
                  <span>📡 98.1 FM</span>
                  <span>•</span>
                  <span>🌍 3 Nations</span>
                </div>
              </div>
            )}

            {/* Player Controls */}
            <div className="flex flex-col items-center space-y-6">
              
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="w-20 h-20 bg-white text-kioo-primary rounded-full flex items-center justify-center text-2xl hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-4 w-full max-w-xs">
                <span className="text-white text-sm">🔈</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-white bg-opacity-20 rounded-lg appearance-none slider"
                />
                <span className="text-white text-sm">🔊</span>
                <span className="text-white text-sm w-8">{volume}%</span>
              </div>

              {/* Quality Toggle */}
              <div className="flex items-center space-x-3">
                <span className="text-green-200 text-sm">Audio Quality:</span>
                <button
                  onClick={() => setLowDataMode(!lowDataMode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    lowDataMode 
                      ? 'bg-yellow-500 text-yellow-900' 
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  {lowDataMode ? '📱 Low Data Mode' : '💎 High Quality'}
                </button>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-4 pt-4">
                <span className="text-green-200 text-sm">Share:</span>
                <button className="text-white hover:text-green-200 transition-colors">
                  📘 Facebook
                </button>
                <button className="text-white hover:text-green-200 transition-colors">
                  💬 WhatsApp
                </button>
                <button className="text-white hover:text-green-200 transition-colors">
                  🔗 Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Alternative Listening Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📻</div>
              <h3 className="text-white font-semibold mb-2">FM Radio</h3>
              <p className="text-green-100 text-sm">Tune in to 98.1 FM on your radio</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-white font-semibold mb-2">WhatsApp</h3>
              <p className="text-green-100 text-sm">Listen via WhatsApp broadcast</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="text-white font-semibold mb-2">Call In</h3>
              <p className="text-green-100 text-sm">+231 123 456 7890</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Programs */}
      {upcomingPrograms.length > 0 && (
        <section className="py-16 bg-white bg-opacity-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              📅 Coming Up Today
            </h2>
            
            <div className="space-y-4">
              {upcomingPrograms.map((program, index) => (
                <div
                  key={program.id}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between border border-white border-opacity-20"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{program.title}</h3>
                      <p className="text-green-100 text-sm">
                        {program.host} • {program.language} • {program.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{program.start_time}</p>
                    <p className="text-green-200 text-sm">{program.duration_minutes} min</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a
                href="/programs"
                className="inline-flex items-center space-x-2 text-white hover:text-green-200 transition-colors"
              >
                <span>View Full Schedule</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Technical Information */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              📡 Technical Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Broadcast Details</h3>
                <ul className="space-y-2 text-green-100">
                  <li>📻 Frequency: 98.1 FM</li>
                  <li>🔋 Power: Solar-powered transmission</li>
                  <li>📍 Location: Monrovia, Liberia</li>
                  <li>📡 Range: 150+ mile radius</li>
                  <li>🌍 Coverage: Liberia, Sierra Leone, Guinea</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Streaming Options</h3>
                <ul className="space-y-2 text-green-100">
                  <li>💻 Web Player: High quality AAC stream</li>
                  <li>📱 Mobile: Optimized for low-data usage</li>
                  <li>📶 Minimum Speed: 56kbps recommended</li>
                  <li>🔄 Backup: Multiple server locations</li>
                  <li>⚡ Uptime: 99.9% availability target</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-500 bg-opacity-20 rounded-lg border border-yellow-400 border-opacity-30">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-300">⚠️</span>
                <div>
                  <h4 className="text-yellow-200 font-semibold mb-1">Low Data Mode</h4>
                  <p className="text-yellow-100 text-sm">
                    Experiencing data limitations? Enable low data mode for reduced bandwidth consumption 
                    while maintaining clear audio quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListenLive;