import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const STREAM_URL = process.env.REACT_APP_STREAM_URL || "https://radio.galcom.org/?station=VOXRadio";

const ListenLive = () => {
  const [lowDataMode, setLowDataMode] = useState(false);
  const [upcomingPrograms, setUpcomingPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const programsRes = await axios.get(`${API}/programs`);
        setUpcomingPrograms(programsRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching radio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setStreamError(false);
        })
        .catch((error) => {
          console.error('Stream playback error:', error);
          setStreamError(true);
          setIsPlaying(false);
        });
    }
  };

  const handleAudioError = () => {
    setStreamError(true);
    setIsPlaying(false);
  };

  const handleAudioLoad = () => {
    setStreamError(false);
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
            
            {/* Live Radio Info */}
            <div className="text-center mb-8">
              <p className="text-green-200 text-sm mb-2">Now Broadcasting</p>
              <h2 className="text-2xl font-bold text-white mb-2">Kioo Radio 98.1 FM</h2>
              <p className="text-green-100">The Gift of Good News</p>
              <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-green-200">
                <span>📡 98.1 FM</span>
                <span>•</span>
                <span>🌍 Makona River Region</span>
              </div>
            </div>

            {/* Enhanced Audio Player */}
            <div className="flex flex-col items-center space-y-6">
              
              {/* Streaming Player with Controls */}
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 w-full max-w-md">
                
                {/* Hidden HTML5 Audio Element */}
                <audio 
                  ref={audioRef}
                  preload="none"
                  onError={handleAudioError}
                  onLoadStart={handleAudioLoad}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  crossOrigin="anonymous"
                >
                  <source src={STREAM_URL} type="audio/mpeg" />
                  <source src={STREAM_URL} type="audio/aac" />
                  Your browser does not support the audio element.
                </audio>

                {/* Custom Player Interface */}
                <div className="text-center">
                  <div className="mb-4">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                      isPlaying ? 'bg-red-500 animate-pulse' : 'bg-kioo-primary hover:bg-kioo-secondary'
                    }`}>
                      <button
                        onClick={handlePlayPause}
                        disabled={streamError}
                        className="text-white text-2xl focus:outline-none disabled:opacity-50"
                        title={isPlaying ? 'Pause Stream' : 'Play Stream'}
                      >
                        {isPlaying ? '⏸️' : '▶️'}
                      </button>
                    </div>
                  </div>

                  {streamError ? (
                    <div className="text-red-200 text-sm">
                      <p>⚠️ Stream temporarily unavailable</p>
                      <p className="text-xs mt-1">Please try again in a moment</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white font-semibold">🔴 Kioo Radio 98.1 FM</p>
                      <p className="text-green-200 text-sm">
                        {isPlaying ? 'Now Streaming Live' : 'Click to Listen Live'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Traditional HTML5 Controls (Fallback) */}
                <div className="mt-4">
                  <audio 
                    controls 
                    preload="none"
                    className="w-full h-10 opacity-75"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px'
                    }}
                  >
                    <source src={STREAM_URL} type="audio/mpeg" />
                    <p className="text-white text-xs">Your browser does not support the audio element. Please try using a different browser.</p>
                  </audio>
                </div>
              </div>

              {/* Alternative Access Methods */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <a
                  href={STREAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-opacity-20 transition-colors"
                >
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="text-white text-sm font-semibold">Web Player</div>
                  <div className="text-green-200 text-xs">Direct Link</div>
                </a>
                
                <button
                  onClick={() => setLowDataMode(!lowDataMode)}
                  className={`rounded-lg p-4 text-center transition-colors ${
                    lowDataMode 
                      ? 'bg-yellow-500 bg-opacity-20 border border-yellow-400' 
                      : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                >
                  <div className="text-2xl mb-2">{lowDataMode ? '📱' : '💎'}</div>
                  <div className="text-white text-sm font-semibold">
                    {lowDataMode ? 'Low Data' : 'High Quality'}
                  </div>
                  <div className="text-green-200 text-xs">
                    {lowDataMode ? 'Data Saver' : 'Best Audio'}
                  </div>
                </button>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-4 pt-4">
                <span className="text-green-200 text-sm">Share:</span>
                <button 
                  onClick={() => navigator.share && navigator.share({
                    title: 'Kioo Radio 98.1 FM',
                    text: 'Listen to Kioo Radio - The Gift of Good News',
                    url: window.location.href
                  })}
                  className="text-white hover:text-green-200 transition-colors"
                >
                  📱 Share
                </button>
                <a
                  href={`https://wa.me/?text=Listen%20to%20Kioo%20Radio%2098.1%20FM%20-%20The%20Gift%20of%20Good%20News%20${window.location.origin}/listen-live`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-200 transition-colors"
                >
                  💬 WhatsApp
                </a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="text-white hover:text-green-200 transition-colors"
                >
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
              <p className="text-green-100 text-sm">+231 77 838 3703</p>
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
                  <li>📍 Location: Betche Hill, Foya, Lofa County, Liberia</li>
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