import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { 
  FaPlay, 
  FaPause, 
  FaForward, 
  FaBackward,
  FaVolumeUp,
  FaExpand,
  FaCheckCircle,
  FaLock
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import LockedContent from '../Common/LockedContent';

const VideoPlayerContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: #000;
  border-radius: 10px;
  overflow: hidden;
`;

const Player = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
`;

const VideoInfo = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const VideoTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: #333;
`;

const VideoDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0 0 10px 10px;
`;

const ControlButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    color: #667eea;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
`;

const Progress = styled.div`
  height: 100%;
  background: #667eea;
  border-radius: 2px;
  width: ${({ progress }) => progress}%;
`;

const TimeDisplay = styled.span`
  color: white;
  font-size: 0.9rem;
  min-width: 100px;
`;

const ChapterList = styled.div`
  margin-top: 2rem;
`;

const ChapterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ active }) => active ? '#f0f7ff' : 'white'};
  border: 1px solid ${({ active }) => active ? '#667eea' : '#eee'};
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const ChapterIcon = styled.div`
  color: ${({ completed }) => completed ? '#4CAF50' : '#666'};
`;

const ChapterTitle = styled.div`
  flex: 1;
`;

const ChapterDuration = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

function VideoPlayer({ videoId, videos, subjectId }) {
  const { hasActiveSubscription } = useAuth();
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);

  useEffect(() => {
    if (videoId && videos && videos.length > 0) {
      const video = videos.find(v => v.id === videoId) || videos[0];
      if (video) {
        // Normalize video URL (handle both 'url' and 'youtube_url' fields)
        const normalizedVideo = {
          ...video,
          url: video.url || video.youtube_url || ''
        };
        setCurrentVideo(normalizedVideo);
      }
    }
  }, [videoId, videos]);

  useEffect(() => {
    // Load completed videos from localStorage
    const completed = JSON.parse(localStorage.getItem(`completed_${subjectId}`) || '[]');
    setCompletedVideos(completed);
  }, [subjectId]);

  if (!hasActiveSubscription()) {
    return (
      <VideoPlayerContainer>
        <LockedContent message="Subscribe to access video lectures" />
      </VideoPlayerContainer>
    );
  }

  if (!currentVideo) {
    return <div>Loading video...</div>;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
    
    // Mark as completed if watched 95% of the video
    if (state.played > 0.95 && !completedVideos.includes(currentVideo.id)) {
      const updated = [...completedVideos, currentVideo.id];
      setCompletedVideos(updated);
      localStorage.setItem(`completed_${subjectId}`, JSON.stringify(updated));
    }
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setPlayed(percent);
    // You would need to use a ref to seek in the player
  };

  const handleChapterClick = (video) => {
    setCurrentVideo(video);
    setPlayed(0);
    setPlaying(true);
  };

  return (
    <VideoPlayerContainer>
      <VideoWrapper>
        <Player
          url={currentVideo.url}
          playing={playing}
          volume={volume}
          onProgress={handleProgress}
          onDuration={setDuration}
          width="100%"
          height="100%"
          controls={false}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
                showinfo: 0
              }
            }
          }}
        />
        
        <Controls>
          <ControlButton onClick={() => setPlaying(!playing)}>
            {playing ? <FaPause /> : <FaPlay />}
          </ControlButton>
          
          <ControlButton onClick={() => setPlayed(Math.max(0, played - 0.1))}>
            <FaBackward />
          </ControlButton>
          
          <ProgressBar onClick={handleSeek}>
            <Progress progress={played * 100} />
          </ProgressBar>
          
          <ControlButton onClick={() => setPlayed(Math.min(1, played + 0.1))}>
            <FaForward />
          </ControlButton>
          
          <TimeDisplay>
            {formatTime(played * duration)} / {formatTime(duration)}
          </TimeDisplay>
          
          <ControlButton>
            <FaVolumeUp />
          </ControlButton>
          
          <ControlButton>
            <FaExpand />
          </ControlButton>
        </Controls>
      </VideoWrapper>

      <VideoInfo>
        <VideoTitle>{currentVideo.title}</VideoTitle>
        <VideoDescription>{currentVideo.description || 'No description available'}</VideoDescription>
      </VideoInfo>

      {videos && videos.length > 0 && (
        <ChapterList>
          <h3>All Videos</h3>
          {videos.map(video => {
            const videoUrl = video.url || video.youtube_url || '';
            return (
              <ChapterItem
                key={video.id}
                active={video.id === currentVideo.id}
                onClick={() => handleChapterClick({ ...video, url: videoUrl })}
              >
                <ChapterIcon completed={completedVideos.includes(video.id)}>
                  {completedVideos.includes(video.id) ? <FaCheckCircle /> : <FaPlay />}
                </ChapterIcon>
                <ChapterTitle>
                  <strong>{video.title}</strong>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {video.description || 'No description'}
                  </div>
                </ChapterTitle>
                <ChapterDuration>{video.duration || '10:00'}</ChapterDuration>
              </ChapterItem>
            );
          })}
        </ChapterList>
      )}
    </VideoPlayerContainer>
  );
}

export default VideoPlayer;