import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CvContext = createContext(null);

export const CvProvider = ({ children }) => {
  const { user, getData, saveData } = useAuth();
  const [assemble, setAssemble] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [links, setLinks] = useState([]);

  // Clear all state data
  const clearAllData = () => {
    setPersonalInfo(null);
    setAdditionalInfo(null);
    setEducation([]);
    setWorkExperience([]);
    setSkills([]);
    setLinks([]);
    setAssemble(false);
  };

  useEffect(() => {
    // Clear existing data when auth state changes
    clearAllData();

    const fetchData = async () => {
      try {
        if (user?.uid) {
          // User is authenticated - fetch from Firebase
          const personalData = await getData('personalInfo');
          if (personalData) setPersonalInfo(personalData);
          
          const additionalData = await getData('additionalInfo');
          if (additionalData) setAdditionalInfo(additionalData);
          
          const educationData = await getData('education');
          if (educationData) setEducation(educationData);
          
          const workData = await getData('workExperience');
          if (workData) setWorkExperience(workData);
          
          const skillsData = await getData('skills');
          if (skillsData) setSkills(skillsData);
          
          const linksData = await getData('links');
          if (linksData) setLinks(linksData);
        } else {
          // User is not authenticated - fetch from localStorage
          const getLocalData = (key, setter) => {
            const local = localStorage.getItem(key);
            if (local) {
              setter(JSON.parse(local));
            }
          };

          getLocalData('personalInfo', setPersonalInfo);
          getLocalData('additionalInfo', setAdditionalInfo);
          getLocalData('education', setEducation);
          getLocalData('workExperience', setWorkExperience);
          getLocalData('skills', setSkills);
          getLocalData('links', setLinks);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [user, getData]); // Only re-run when user or getData changes

  const handleDelete = async (key, data, index) => {
    const updated = [...data];
    updated.splice(index, 1);
    
    if (user?.uid) {
      await saveData(key, updated);
    } else {
      localStorage.setItem(key, JSON.stringify(updated));
    }

    switch (key) {
      case 'education':
        setEducation(updated);
        break;
      case 'workExperience':
        setWorkExperience(updated);
        break;
      case 'skills':
        setSkills(updated);
        break;
      case 'links':
        setLinks(updated);
        break;
      default:
        break;
    }
  };

  const value = {
    assemble,
    setAssemble,
    personalInfo,
    setPersonalInfo,
    additionalInfo,
    setAdditionalInfo,
    education,
    setEducation,
    workExperience,
    setWorkExperience,
    skills,
    setSkills,
    links,
    setLinks,
    handleDelete,
    cvData: {
      personal: personalInfo,
      additional: additionalInfo,
      education,
      work: workExperience,
      skills,
      links
    }
  };

  return (
    <CvContext.Provider value={value}>
      {children}
    </CvContext.Provider>
  );
};

export const useCv = () => {
  const context = useContext(CvContext);
  if (!context) {
    throw new Error('useCv must be used within a CvProvider');
  }
  return context;
}; 