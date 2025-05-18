import React, { useState } from 'react';
import Modal from '../Components/Modal';
import PersonalInfoManager from '../Components/PersonalInfoManager';
import AdditionalInfoManager from '../Components/AdditionalinfoManager';
import EducationManager from '../Components/EducationManager';
import WorkExperienceManager from "../Components/WorkExperienceManager";
import SkillsManager from '../Components/SkillsManager';
import LinksManager from '../Components/LinksManager';
import CvAssemble from "./CvAssemble";
import { useCv } from '../Utils/cvHooks';
import Spinner from '../Components/Spinner';

function AddEdit() {
  const { 
    assemble,
    isLoading,
    isSaving,
    personalInfo,
    additionalInfo,
    education,
    workExperience,
    skills,
    setSkills,
    links,
    handleDelete,
    cvData
  } = useCv();

  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  const handleDeleteWithFeedback = async (...args) => {
    if (isSaving) return;
    await handleDelete(...args);
  };

  return (
    <>
      {assemble ? (
        <CvAssemble cvData={cvData} />
      ) : (
        <>
          {/* Personal Info Section */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            {personalInfo ? (
              <div className="bg-white shadow-md rounded p-6">
                <p><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</p>
                <p><strong>Email:</strong> {personalInfo.email}</p>
                <p><strong>Phone:</strong> {personalInfo.phone}</p>
                <p><strong>Address:</strong> {personalInfo.address}</p>
                <p><strong>City:</strong> {personalInfo.city}</p>
                <p><strong>Country:</strong> {personalInfo.country}</p>
                <button
                  onClick={() => setIsPersonalInfoOpen(true)}
                  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Edit Personal Info
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">No personal info found. Start building your CV!</p>
                <button
                  onClick={() => setIsPersonalInfoOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Add Personal Info
                </button>
              </div>
            )}
          </section>

          {/* Additional Info Section */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
            {additionalInfo ? (
              <div className="bg-white shadow-md rounded p-6">
                <p><strong>Date of Birth:</strong> {additionalInfo.dateOfBirth}</p>
                <p><strong>Eligible To Work In The Uk:</strong> {additionalInfo.eligibleToWorkInUk ? 'Yes' : 'No'}</p>
                <p><strong>Driving License:</strong> {additionalInfo.hasDrivingLicense ? 'Yes' : 'No'}</p>
                <p className="mt-4"><strong>Summary:</strong> {additionalInfo.summary}</p>
                <button
                  onClick={() => setIsAdditionalInfoOpen(true)}
                  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Edit Additional Info
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">No additional info found. Add them here!</p>
                <button
                  onClick={() => setIsAdditionalInfoOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Add Additional Information
                </button>
              </div>
            )}
          </section>

          {/* Education Section */}
          <section className="mt-8">
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
                          className="text-blue-600 hover:underline flex items-center gap-2"
                          disabled={isSaving}
                        >
                          {isSaving ? <Spinner size="sm" /> : null}
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWithFeedback('education', education, index)}
                          className="text-red-600 hover:underline flex items-center gap-2"
                          disabled={isSaving}
                        >
                          {isSaving ? <Spinner size="sm" color="red" /> : null}
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setIsEducationModalOpen(true)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Add More Education
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-2">No education history added yet.</p>
                <button
                  onClick={() => setIsEducationModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Add Education
                </button>
              </div>
            )}
          </section>

          {/* Work Experience Section */}
          <section className="mt-8">
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
                          className="text-blue-600 hover:underline flex items-center gap-2"
                          disabled={isSaving}
                        >
                          {isSaving ? <Spinner size="sm" /> : null}
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWithFeedback('workExperience', workExperience, index)}
                          className="text-red-600 hover:underline flex items-center gap-2"
                          disabled={isSaving}
                        >
                          {isSaving ? <Spinner size="sm" color="red" /> : null}
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setIsWorkModalOpen(true)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Add More Experience
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-2">No work experience added yet.</p>
                <button
                  onClick={() => setIsWorkModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Add Experience
                </button>
              </div>
            )}
          </section>

          {/* Skills Section */}
          <section className="mt-8">
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
                          className="text-blue-600 hover:underline flex items-center gap-2"
                          disabled={isSaving}
                        >
                          {isSaving ? <Spinner size="sm" /> : null}
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWithFeedback('skills', skills, index)}
                          className="text-red-600 hover:underline flex items-center gap-2"
                          disabled={isSaving}
                        >
                          {isSaving ? <Spinner size="sm" color="red" /> : null}
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setIsSkillsModalOpen(true)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Add More Skills
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-2">No skills added yet.</p>
                <button
                  onClick={() => setIsSkillsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Add Skill
                </button>
              </div>
            )}
          </section>

          {/* Links Section */}
          <section className="mt-8">
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
                          className="text-blue-600 hover:underline flex items-center gap-2"
                          disabled={isSaving}
                        >
                          {isSaving ? <Spinner size="sm" /> : null}
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWithFeedback('links', links, index)}
                          className="text-red-600 hover:underline flex items-center gap-2"
                          disabled={isSaving}
                        >
                          {isSaving ? <Spinner size="sm" color="red" /> : null}
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setIsLinksModalOpen(true)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Add More Links
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-2">No links added yet.</p>
                <button
                  onClick={() => setIsLinksModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  Add Links
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {/* Modals */}
      <Modal isOpen={isPersonalInfoOpen} onClose={() => setIsPersonalInfoOpen(false)}>
        <PersonalInfoManager onClose={() => setIsPersonalInfoOpen(false)} />
      </Modal>

      <Modal isOpen={isAdditionalInfoOpen} onClose={() => setIsAdditionalInfoOpen(false)}>
        <AdditionalInfoManager onClose={() => setIsAdditionalInfoOpen(false)} />
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
    </>
  );
}

export default AddEdit;
