import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CvContext } from './cvHooks';

export const CvProvider = ({ children }) => {
  const { user, getData, saveData } = useAuth();
  const [assemble, setAssemble] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
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
    setIsLoading(true);

    const fetchData = async () => {
      try {
        if (user?.uid) {
          // User is authenticated - fetch from Firebase
          const [
            personalData,
            additionalData,
            educationData,
            workData,
            skillsData,
            linksData
          ] = await Promise.all([
            getData('personalInfo'),
            getData('additionalInfo'),
            getData('education'),
            getData('workExperience'),
            getData('skills'),
            getData('links')
          ]);

          if (personalData) setPersonalInfo(personalData);
          if (additionalData) setAdditionalInfo(additionalData);
          if (educationData) setEducation(educationData);
          if (workData) setWorkExperience(workData);
          if (skillsData) setSkills(skillsData);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, getData]);

  const handleDelete = async (key, data, index) => {
    setIsSaving(true);
    try {
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
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const value = {
    assemble,
    setAssemble,
    isLoading,
    isSaving,
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