import { useAuth } from '../Utils/AuthContext';

function CvBuilder () {
    const {currentUser}  = useAuth()
      
      const [personalInfo, setPersonalInfo] = useState(null);
      const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
    
      const [additionalInfo, setAdditionalInfo] = useState(null);
      const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(false);
    
      const [education, setEducation] = useState([]);
      const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
      const [editingEducation, setEditingEducation] = useState(null);
    
      const [workExperience, setWorkExperience] = useState([]);
      const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
      const [editingWork, setEditingWork] = useState(null);
    
      const [skills, setSkills] = useState([]);
      const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
      const [editingSkill, setEditingSkill] = useState(null);
    
      const [links, setLinks] = useState([]);
      const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
      const [editingLink, setEditingLink] = useState(null);
      
      useEffect(() => {
        const fetchData = async () => {
          const getData = async (key, setter) => {
            if (currentUser?.uid) {
              try {
                const response = await fetch(
                  `https://cv-builder-9a845-default-rtdb.europe-west1.firebasedatabase.app/${key}/${currentUser.uid}.json`
                );
                if (response.ok) {
                  const data = await response.json();
                  if (data !== null) {
                    setter(data);
                  }
                }
              } catch (err) {
                console.error(`Error fetching ${key}:`, err);
              }
            }
          };
    
          const getLocalData = (key, setter) => {
            const local = localStorage.getItem(key);
            if (local) {
              setter(JSON.parse(local));
            }
          };
    
          if (currentUser?.uid) {
            await Promise.all([
              getData('personal-info', setPersonalInfo),
              getData('additional-info', setAdditionalInfo),
              getData('education', setEducation),
              getData('work-experience', setWorkExperience),
              getData('skills', setSkills),
              getData('links', setLinks),
            ]);
          } else {
            getLocalData('personalInfo', setPersonalInfo);
            getLocalData('additionalInfo', setAdditionalInfo);
            getLocalData('education', setEducation);
            getLocalData('workExperience', setWorkExperience);
            getLocalData('skills', setSkills);
            getLocalData('links', setLinks);
          }
        };
    
        fetchData();
      }, [
        currentUser,
        isPersonalInfoOpen,
        isAdditionalInfoOpen,
        isEducationModalOpen,
        isWorkModalOpen,
        isSkillsModalOpen,
        isLinksModalOpen,
      ]);
}

export default CvBuilder