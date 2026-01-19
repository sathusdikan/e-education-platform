import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { subjectService } from '../../services/subjectService';

const VideoManagerContainer = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
`;

const AddButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #45a049;
  }
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const VideoCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #dee2e6;
`;

const VideoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const VideoTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 1rem;
  
  &:hover {
    color: #333;
  }
`;

const VideoInfo = styled.div`
  color: #666;
  
  p {
    margin: 0.5rem 0;
  }
`;

const VideoUrl = styled.a`
  color: #667eea;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Form = styled.form`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #dee2e6;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #45a049;
  }
`;

const CancelButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #d32f2f;
  }
`;

function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    subjectId: '',
    topic: '',
    order: 1,
    duration: ''
  });

  useEffect(() => {
    loadVideos();
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const subjectsData = await subjectService.getSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadVideos = async () => {
    try {
      const allVideos = [];
      const subjectsData = await subjectService.getSubjects();
      
      for (const subject of subjectsData) {
        const subjectVideos = await subjectService.getVideosBySubject(subject.id);
        allVideos.push(...subjectVideos);
      }
      
      setVideos(allVideos);
    } catch (error) {
      console.error('Failed to load videos:', error);
      // Fallback to localStorage
      const storedVideos = JSON.parse(localStorage.getItem('videos') || '[]');
      setVideos(storedVideos);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.url || !formData.url.includes('youtube.com') && !formData.url.includes('youtu.be')) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    try {
      if (editingVideo) {
        // Update existing video
        await subjectService.updateVideo(editingVideo.id, formData);
        toast.success('Video updated successfully!');
      } else {
        // Add new video
        await subjectService.createVideo(formData);
        toast.success('Video added successfully!');
      }
      
      loadVideos();
      resetForm();
    } catch (error) {
      toast.error('Failed to save video: ' + error.message);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || '',
      description: video.description || '',
      url: video.url || video.youtube_url || '',
      subjectId: video.subject_id || video.subjectId || '',
      topic: video.topic || '',
      order: video.order || 1,
      duration: video.duration || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await subjectService.deleteVideo(videoId);
        toast.success('Video deleted successfully!');
        loadVideos();
      } catch (error) {
        toast.error('Failed to delete video: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      subjectId: '',
      topic: '',
      order: 1,
      duration: ''
    });
    setEditingVideo(null);
    setShowForm(false);
  };

  return (
    <VideoManagerContainer>
      <Header>
        <Title>Manage Videos</Title>
        <AddButton onClick={() => setShowForm(true)}>
          <FaPlus /> Add Video
        </AddButton>
      </Header>

      {showForm && (
        <Form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1.5rem' }}>
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h3>
          
          <FormGroup>
            <FormLabel>Subject *</FormLabel>
            <FormSelect
              name="subjectId"
              value={formData.subjectId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Video Title *</FormLabel>
            <FormInput
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Introduction to Algebra"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>YouTube URL *</FormLabel>
            <FormInput
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              required
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
              Paste the full YouTube video URL here
            </small>
          </FormGroup>

          <FormGroup>
            <FormLabel>Description</FormLabel>
            <FormTextarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the video content"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Topic/Chapter</FormLabel>
            <FormInput
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="e.g., Algebra, Calculus, Chapter 1"
            />
          </FormGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <FormLabel>Order</FormLabel>
              <FormInput
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                min="1"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Duration (optional)</FormLabel>
              <FormInput
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 15:30"
              />
            </FormGroup>
          </div>

          <FormActions>
            <CancelButton type="button" onClick={resetForm}>
              <FaTimes /> Cancel
            </CancelButton>
            <SubmitButton type="submit">
              <FaSave /> {editingVideo ? 'Update Video' : 'Add Video'}
            </SubmitButton>
          </FormActions>
        </Form>
      )}

      <VideosGrid style={{ marginTop: showForm ? '2rem' : '0' }}>
        {videos.map(video => {
          const subject = subjects.find(s => s.id === video.subjectId);
          return (
            <VideoCard key={video.id}>
              <VideoHeader>
                <VideoTitle>{video.title}</VideoTitle>
                <Actions>
                  {video.url && (
                    <ActionButton
                      onClick={() => window.open(video.url, '_blank')}
                      title="Open in YouTube"
                    >
                      <FaExternalLinkAlt />
                    </ActionButton>
                  )}
                  <ActionButton onClick={() => handleEdit(video)} title="Edit">
                    <FaEdit />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(video.id)} title="Delete">
                    <FaTrash />
                  </ActionButton>
                </Actions>
              </VideoHeader>

              <VideoInfo>
                <p>{video.description || 'No description'}</p>
                <p><strong>Subject:</strong> {subject?.name || video.subject_id || video.subjectId || 'N/A'}</p>
                {video.topic && <p><strong>Topic:</strong> {video.topic}</p>}
                {video.duration && <p><strong>Duration:</strong> {video.duration}</p>}
                {(video.url || video.youtube_url) && (
                  <p>
                    <VideoUrl href={video.url || video.youtube_url} target="_blank" rel="noopener noreferrer">
                      Watch on YouTube <FaExternalLinkAlt />
                    </VideoUrl>
                  </p>
                )}
              </VideoInfo>
            </VideoCard>
          );
        })}
      </VideosGrid>

      {!showForm && videos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No videos found. Click "Add Video" to create your first video.
        </p>
      )}
    </VideoManagerContainer>
  );
}

export default VideoManager;
