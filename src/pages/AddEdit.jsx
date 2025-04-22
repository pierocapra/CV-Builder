import React, { useState, useEffect } from 'react';
import Modal from '../Components/Modal';
import DataManager from '../Components/DataManager';
import EducationManager from '../Components/EducationManager';
import WorkExperienceManager from "../Components/WorkExperienceManager";
import SkillsManager from '../Components/SkillsManager';
import LinksManager from '../Components/LinksManager';

function AddEdit() {
  const [cvData, setCvData] = useState(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

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
    const savedCV = localStorage.getItem('cvData');
    const savedEducation = localStorage.getItem('education');
    const savedWork = localStorage.getItem('workExperience');
    const savedSkills = localStorage.getItem('skills');
    const savedLinks = localStorage.getItem('links');

    if (savedCV) setCvData(JSON.parse(savedCV));
    if (savedEducation) setEducation(JSON.parse(savedEducation));
    if (savedWork) setWorkExperience(JSON.parse(savedWork));
    if (savedSkills) setSkills(JSON.parse(savedSkills));
    if (savedLinks) setLinks(JSON.parse(savedLinks));
  }, [isDataModalOpen, isEducationModalOpen, isWorkModalOpen, isSkillsModalOpen, isLinksModalOpen]); // Refresh when modal closes

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-4xl mx-auto space-y-12">
        
        {/* Personal Info Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          {cvData ? (
            <div className="bg-white shadow-md rounded p-6">
              <p><strong>Name:</strong> {cvData.firstName} {cvData.lastName}</p>
              <p><strong>Email:</strong> {cvData.email}</p>
              <p><strong>Phone:</strong> {cvData.phone}</p>
              <p><strong>Address:</strong> {cvData.address}</p>
              <p><strong>Location:</strong> {cvData.location}</p>
              <p><strong>Date of Birth:</strong> {cvData.dateOfBirth}</p>
              <p><strong>Eligible To Work In The Uk:</strong> {cvData.eligibleToWorkInUk ? 'Yes' : 'No'}</p>
              <p><strong>Driving License:</strong> {cvData.hasDrivingLicense ? 'Yes' : 'No'}</p>
              <p className="mt-4"><strong>Summary:</strong> {cvData.summary}</p>
              <button
                onClick={() => setIsDataModalOpen(true)}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Info
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">No personal info found. Start building your CV!</p>
              <button
                onClick={() => setIsDataModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
              >
                Add Personal Info
              </button>
            </div>
          )}
        </section>

        {/* Education Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Education</h2>
          {education.length > 0 ? (
            <>
              <ul className="space-y-4">
                {education.map((edu, index) => (
                  <li key={index} className="bg-white shadow p-4 rounded relative">
                    <h3 className="text-lg font-semibold">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-700">{edu.school}, {edu.location}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startDate} – {edu.endDate}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          setEditingEducation({ entry: edu, index });
                          setIsEducationModalOpen(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...education];
                          updated.splice(index, 1);
                          localStorage.setItem('education', JSON.stringify(updated));
                          setEducation(updated);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsEducationModalOpen(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add More Education
              </button>
            </>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">No education history added yet.</p>
              <button
                onClick={() => setIsEducationModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Education
              </button>
            </div>
          )}
        </section>


        {/* Work Experience Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
          {workExperience.length > 0 ? (
            <>
              <ul className="space-y-4">
                {workExperience.map((job, index) => (
                  <li key={index} className="bg-white shadow p-4 rounded relative">
                    <h3 className="text-lg font-semibold">{job.title} at {job.company}</h3>
                    <p className="text-gray-700">{job.location}</p>
                    <p className="text-sm text-gray-500">{job.startDate} – {job.endDate}</p>
                    {job.description && <p className="mt-2">{job.description}</p>}
                    
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          setEditingWork({ entry: job, index });
                          setIsWorkModalOpen(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...workExperience];
                          updated.splice(index, 1);
                          localStorage.setItem('workExperience', JSON.stringify(updated));
                          setWorkExperience(updated);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsWorkModalOpen(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add More Experience
              </button>
            </>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">No work experience added yet.</p>
              <button
                onClick={() => setIsWorkModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Experience
              </button>
            </div>
          )}
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          {skills.length > 0 ? (
            <>
              <ul className="space-y-2">
                {skills.map((skill, index) => (
                  <li key={index} className="bg-white shadow p-3 rounded flex justify-between items-center">
                    <span className="text-lg">{skill.name} <span className="text-sm text-gray-600"> - {skill.level}</span></span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingSkill({ entry: skill, index });
                          setIsSkillsModalOpen(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...skills];
                          updated.splice(index, 1);
                          localStorage.setItem('skills', JSON.stringify(updated));
                          setSkills(updated);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsSkillsModalOpen(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add More Skills
              </button>
            </>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">No skills added yet.</p>
              <button
                onClick={() => setIsSkillsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Skill
              </button>
            </div>
          )}
        </section>

        {/* Links Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Links</h2>
          {links.length > 0 ? (
            <>
              <ul className="space-y-4">
                {links.map((link, index) => (
                  <li key={index} className="bg-white shadow p-4 rounded flex justify-between items-center">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {link.label || link.url}
                    </a>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingLink({ entry: link, index });
                          setIsLinksModalOpen(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...links];
                          updated.splice(index, 1);
                          localStorage.setItem('links', JSON.stringify(updated));
                          setLinks(updated);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsLinksModalOpen(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add More Links
              </button>
            </>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">No links added yet.</p>
              <button
                onClick={() => setIsLinksModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Links
              </button>
            </div>
          )}
        </section>



      </main>

      {/* Modals */}
      <Modal isOpen={isDataModalOpen} onClose={() => setIsDataModalOpen(false)}>
        <DataManager onClose={() => setIsDataModalOpen(false)} />
      </Modal>

      <Modal isOpen={isEducationModalOpen} onClose={() => {
        setIsEducationModalOpen(false);
        setEditingEducation(null);
      }}>
        <EducationManager
          onClose={() => {
            setIsEducationModalOpen(false);
            setEditingEducation(null);
          }}
          existingEntry={editingEducation?.entry}
          index={editingEducation?.index}
        />
      </Modal>


      <Modal isOpen={isWorkModalOpen} onClose={() => {
        setIsWorkModalOpen(false);
        setEditingWork(null);
      }}>
        <WorkExperienceManager
          onClose={() => {
            setIsWorkModalOpen(false);
            setEditingWork(null);
          }}
          existingEntry={editingWork?.entry}
          index={editingWork?.index}
        />
      </Modal>

      <Modal isOpen={isSkillsModalOpen} onClose={() => {
        setIsSkillsModalOpen(false);
        setEditingSkill(null);
      }}>
        <SkillsManager
          onClose={() => {
            setIsSkillsModalOpen(false);
            setEditingSkill(null);
          }}
          existingEntry={editingSkill?.entry}
          index={editingSkill?.index}
          setSkills={setSkills}
          skills={skills}
        />
      </Modal>

      <Modal isOpen={isLinksModalOpen} onClose={() => {
        setIsLinksModalOpen(false);
        setEditingLink(null);
      }}>
        <LinksManager
          onClose={() => {
            setIsLinksModalOpen(false);
            setEditingLink(null);
          }}
          existingEntry={editingLink?.entry}
          index={editingLink?.index}
        />
      </Modal>

    </div>
  );
}

export default AddEdit;
