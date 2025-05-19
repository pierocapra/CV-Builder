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
  const [selectedItems, setSelectedItems] = useState([]);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);

  // Clear all state data
  const clearAllData = () => {
    setPersonalInfo(null);
    setAdditionalInfo(null);
    setEducation([]);
    setWorkExperience([]);
    setSkills([]);
    setLinks([]);
    setSelectedItems([]);
    setSavedTemplates([]);
    setCurrentTemplate(null);
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
            linksData,
            selectedItemsData,
            savedTemplatesData
          ] = await Promise.all([
            getData('personalInfo'),
            getData('additionalInfo'),
            getData('education'),
            getData('workExperience'),
            getData('skills'),
            getData('links'),
            getData('selectedItems'),
            getData('savedTemplates')
          ]);

          if (personalData) setPersonalInfo(personalData);
          if (additionalData) setAdditionalInfo(additionalData);
          if (educationData) setEducation(educationData);
          if (workData) setWorkExperience(workData);
          if (skillsData) setSkills(skillsData);
          if (linksData) setLinks(linksData);
          if (selectedItemsData) setSelectedItems(selectedItemsData);
          if (savedTemplatesData) setSavedTemplates(savedTemplatesData);
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
          getLocalData('selectedItems', setSelectedItems);
          getLocalData('savedTemplates', setSavedTemplates);
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

  const saveSelectedItems = async (items) => {
    setIsSaving(true);
    try {
      if (user?.uid) {
        await saveData('selectedItems', items);
      } else {
        localStorage.setItem('selectedItems', JSON.stringify(items));
      }
      setSelectedItems(items);
    } catch (error) {
      console.error('Error saving selected items:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveTemplate = async (name, items, templateStyle, colorTheme) => {
    setIsSaving(true);
    try {
      const newTemplate = {
        id: Date.now().toString(),
        name,
        items,
        templateStyle,
        colorTheme,
        createdAt: new Date().toISOString()
      };

      const updatedTemplates = [...savedTemplates, newTemplate];
      
      if (user?.uid) {
        await saveData('savedTemplates', updatedTemplates);
      } else {
        localStorage.setItem('savedTemplates', JSON.stringify(updatedTemplates));
      }
      
      setSavedTemplates(updatedTemplates);
      setCurrentTemplate(newTemplate);
      return newTemplate;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const loadTemplate = async (templateId) => {
    const template = savedTemplates.find(t => t.id === templateId);
    if (template) {
      await saveSelectedItems(template.items);
      setCurrentTemplate(template);
      return template;
    }
    return null;
  };

  const deleteTemplate = async (templateId) => {
    setIsSaving(true);
    try {
      const updatedTemplates = savedTemplates.filter(t => t.id !== templateId);
      
      if (user?.uid) {
        await saveData('savedTemplates', updatedTemplates);
      } else {
        localStorage.setItem('savedTemplates', JSON.stringify(updatedTemplates));
      }
      
      setSavedTemplates(updatedTemplates);
      if (currentTemplate?.id === templateId) {
        setCurrentTemplate(null);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
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
    selectedItems,
    saveSelectedItems,
    savedTemplates,
    currentTemplate,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
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