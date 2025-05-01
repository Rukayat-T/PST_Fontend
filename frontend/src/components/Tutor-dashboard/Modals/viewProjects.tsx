import React from "react";
import DOMPurify from "dompurify";
import Tags from "../../Tags/Tags";
import { IBaseFetchProject, IBaseFetchProjectTutor } from "@/models/proposal.model";

function TutorViewProject({ isOpen, closeModal, project, onChooseProject }: { isOpen: any; closeModal: any; project: IBaseFetchProjectTutor | undefined; onChooseProject: any }) {
  const projectTags = project?.project_tags;
  const resources = project?.project_resources;
  const modules = project?.module_names;
  let description = "";
  if (project?.project_description) {
    description = DOMPurify.sanitize(project?.project_description as string);
  }

  if (!isOpen) return null; // Don't render the modal if it's not open

  console.log(project, "project");
  return (
    <div className='fixed inset-0  flex items-center justify-center bg-black bg-opacity-85 z-50' onClick={closeModal}>
      <div className='bg-white p-5 rounded-lg w-[50%]' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-end'>
          <button className=' bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md' onClick={closeModal}>
            Close
          </button>
        </div>
        <div className='title flex gap-x-2 items-center mb-3'>
          <p className='text-lg font-medium'>Project Title: </p>
          <p>{project?.project_title}</p>
        </div>
        <div className='tutor flex gap-x-2 items-center mb-3'>
          <p className='text-lg font-medium'>Tutor: </p>
          <p>{project?.tutorname}</p>
        </div>

        <div className='description mb-4'>
          <p className='text-lg font-medium'>Description:</p>
          <div className='mt-2 text-sm' dangerouslySetInnerHTML={{ __html: description || "No description available for this project." }} />
        </div>

        {/* <div className='popularity flex gap-x-2 items-center mb-3'>
          <p className='text-lg font-medium'>Popularity: </p>
          <p className=' border border-darkPurple p-[3px] text-xs rounded-md bg-lightPurple-20'>Chosen by {project?.popularity > 1 || project?.popularity == 0 ? `${project?.popularity} students` : `${project?.popularity} student`} </p>
        </div> */}

        <div className='tags flex gap-x-2  mb-3'>
          <p className='text-lg font-medium'>Tags: </p>
          <div className='flex flex-wrap gap-2'>{projectTags && projectTags.map((tag: any, index: number) => <Tags key={index} tag={tag} />)}</div>
        </div>
        <div className='resources flex gap-x-2 mb-3'>
          <p className='text-lg font-medium'>Resources: </p>
          <div className='flex flex-wrap gap-2 items-center'>
            {resources && resources.length > 0 ? (
              resources.map((resource: any, index: number) => {
                // Use the URL constructor to parse the resource URL
                const url = new URL(resource);
                const resourceName = url.hostname.replace("www.", ""); // Get the domain name (without 'www.' if it exists)

                return (
                  <a key={index} className='border border-darkPurple p-1 rounded-md text-xs bg-lightPurple-20 whitespace-nowrap' href={resource} target='_blank' rel='noopener noreferrer'>
                    {resourceName}
                  </a>
                );
              })
            ) : (
              <p className='text-sm text-gray-500'>No resources available</p> // Show message when resources are empty or null
            )}
          </div>
        </div>

        <div className='deliverable mb-3'>
          <p className=''>
            <span className='text-lg font-medium'>Expected Deliverable: </span>
            {project?.project_expectedDeliverable ? project?.project_expectedDeliverable : <p> No expected deliverable</p>}
          </p>
        </div>

        <div className='modules flex gap-x-2  mb-3'>
          <p className='text-lg font-medium'>Prerequisite modules: </p>
          <div className='flex flex-wrap gap-2'>{modules ? modules.map((module: any, index: number) => <Tags key={index} tag={module} />) : <p>No prerequisite modules</p>}</div>
        </div>

      </div>
    </div>
  );
}

export default TutorViewProject;
