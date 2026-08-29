import { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';



const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {


  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <div 
      className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-800/60 ring-1 ring-white/5 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(249,115,22,0.15)] hover:border-[var(--color-brand-orange)]/30 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        preload="none"
        onClick={togglePlayPause}
        className="w-full aspect-video bg-black cursor-pointer object-cover"
      />
      
      {/* Big Central Play Button Overlay (Shows before playing) */}
      {!isPlaying && currentTime === 0 && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[2px] transition-all duration-500 group-hover:bg-black/20"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--color-brand-orange)]/90 flex items-center justify-center text-[#110F0D] shadow-[0_0_30px_rgba(249,115,22,0.6)] transform transition-transform duration-300 hover:scale-110">
            <Play className="w-10 h-10 ml-1.5" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Video Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-4 px-5 transition-opacity duration-300 ${
          isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col gap-2">
          {/* Progress Bar Container */}
          <div className="w-full flex items-center group/slider cursor-pointer h-4" onClick={(e) => {
            if (!videoRef.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * duration;
          }}>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Number(e.target.value);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-orange)] outline-none transition-all group-hover/slider:h-2"
            />
          </div>

          {/* Bottom Controls Row */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-4">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                )}
              </button>
              
              {/* Time Display */}
              <div className="text-white/90 text-sm font-medium tabular-nums tracking-wide">
                {formatTime(currentTime)} <span className="text-white/40 mx-1">/</span> {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white/80">
              {/* Add Volume or Fullscreen icons here if desired in the future, for now just empty or a subtle watermark */}
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Editorial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Editorial;