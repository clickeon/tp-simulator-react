import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const CourseCard = styled.div`
  padding: 20px;
  margin: 10px 0;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  h4 {
    margin: 0 0 10px 0;
    color: #2c3e50;
  }

  p {
    color: #666;
    margin: 0 0 10px 0;
  }

  small {
    color: #888;
  }
`;

const LessonCard = styled.div`
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.active ? '#f0f7ff' : 'white'};

  &:hover {
    background: #f8f9fa;
    transform: translateX(4px);
  }

  h5 {
    margin: 0 0 8px 0;
    color: #2c3e50;
  }

  small {
    color: #888;
  }
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin: 20px 0 15px 0;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

const LessonContent = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  line-height: 1.6;
  color: #2c3e50;

  p {
    margin-bottom: 15px;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #666;
  padding: 20px;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #dc3545;
  padding: 20px;
  background: #fff5f5;
  border-radius: 4px;
  border: 1px solid #ffebee;
`;

function LearningPath() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatRichText = (content) => {
    if (!content || !Array.isArray(content)) return '';
    return content.map(block => {
      if (block.type === 'paragraph') {
        return block.children
          .map(child => child.text)
          .join('');
      }
      return '';
    }).join('\n');
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('Fetching all courses...');
      const response = await axios.get('http://localhost:1337/api/courses');
      console.log('Initial courses data:', response.data);
      
      if (response.data?.data) {
        setCourses(response.data.data);
        setError(null);
      } else {
        setError('No courses found');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = async (course) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Course being clicked:', course);
      
      // Set the selected course immediately for better UX
      setSelectedCourse(course);
      
      // Fetch lessons for this course
      const lessonsResponse = await axios.get(`http://localhost:1337/api/lessons?filters[course][id]=${course.id}`);
      console.log('Lessons response:', lessonsResponse.data);
      
      if (lessonsResponse.data?.data) {
        setSelectedCourse(prev => ({
          ...prev,
          lessons: lessonsResponse.data.data
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course details:', error.response || error);
      setError('Failed to load course details. Please try again later.');
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson) => {
    console.log('Clicking lesson:', lesson);
    setSelectedLesson(lesson);
  };

  return (
    <Container>
      <Title>Learning Path</Title>
      
      {loading && <LoadingMessage>Loading...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!loading && !error && !selectedCourse && (
        <div>
          <SectionTitle>Available Courses</SectionTitle>
          {courses.length === 0 ? (
            <p>No courses available yet.</p>
          ) : (
            courses.map(course => (
              <CourseCard key={course.id} onClick={() => handleCourseClick(course)}>
                <h4>{course.title || 'Untitled Course'}</h4>
                <p>{course.description?.[0]?.children?.[0]?.text || 'No description available'}</p>
                <small>Duration: {course.duration || 'N/A'} minutes</small>
              </CourseCard>
            ))
          )}
        </div>
      )}

      {!loading && selectedCourse && (
        <div>
          <Button onClick={() => {
            setSelectedCourse(null);
            setSelectedLesson(null);
          }}>← Back to Courses</Button>
          <SectionTitle>{selectedCourse.title}</SectionTitle>
          <p>{selectedCourse.description?.[0]?.children?.[0]?.text}</p>
          
          {!selectedLesson ? (
            <div>
              <SectionTitle>Lessons</SectionTitle>
              {!selectedCourse.lessons || selectedCourse.lessons.length === 0 ? (
                <p>No lessons available for this course yet.</p>
              ) : (
                selectedCourse.lessons.map(lesson => (
                  <LessonCard 
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    active={selectedLesson?.id === lesson.id}
                  >
                    <h5>{lesson.title || 'Untitled Lesson'}</h5>
                    <small>Duration: {lesson.duration || 'N/A'} minutes</small>
                  </LessonCard>
                ))
              )}
            </div>
          ) : (
            <div>
              <Button onClick={() => setSelectedLesson(null)}>← Back to Lessons</Button>
              <SectionTitle>{selectedLesson.title}</SectionTitle>
              <LessonContent>
                {selectedLesson.content?.[0]?.children?.[0]?.text || 'No content available'}
              </LessonContent>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

export default LearningPath;
