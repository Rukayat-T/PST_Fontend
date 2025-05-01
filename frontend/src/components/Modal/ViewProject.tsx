import React, { use, useState } from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import Tags from "../Tags/Tags";
import { IBaseFetchProject } from "@/models/proposal.model";
import { useRouter } from "next/navigation";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import { useOnboarding } from "@/context/OnboardingContext";
import { toast } from "react-toastify";
import { isValidUrl } from "@/utils/helpers";
import { CircularProgress } from "@mui/material";

function ViewProject({
  isOpen,
  closeModal,
  project,
  onChooseProject,
  isChosen,
  rank,
}: {
  isOpen: any;
  closeModal: any;
  project: IBaseFetchProject;
  onChooseProject: any;
  isChosen?: boolean;
  rank?: number;
}) {
  const projectTags = project.project_tags;
  const resources = project.project_resources;
  const modules = project?.module_names;
  const description = DOMPurify.sanitize(project?.project_description);
  const { user } = useOnboarding();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  function formatHtml(htmlString: string) {
    return htmlString.replace(/<p>(.*?)<\/p>/gi, "<span> $1</span>");
  }
  const removeChoice = async (studentId: number, choiceId: number) => {
    setLoading(true);
    try {
      const res = await ProjectsService.removeProjectChoice(
        studentId,
        choiceId
      );

      //@ts-ignore
      if (res?.status === 201) {
        //@ts-ignore
        setLoading(false);
        toast.success(res?.message);
        // getChoice(profileId);
        closeModal();
      } else {
        setLoading(false);
        //@ts-ignore
        toast.warning(res?.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  // console.log(description)
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div
      className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-85 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-5 rounded-lg w-[45%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            className=" bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
        <div className="title flex gap-x-2 items-center mb-3">
          <p className="text-[17px] font-medium">Project Title: </p>
          <p>{project?.project_title}</p>
        </div>
        <div className="tutor flex gap-x-2 items-center mb-3">
          <p className="text-[17px] font-medium">Tutor: </p>
          <p>{project?.tutorname}</p>
        </div>

        {/* <div className='description mb-4'>
          <p className='text-[17px] font-medium'>Description:</p>
          <span className='mt-2' dangerouslySetInnerHTML={{ __html: description || "No description available for this project." }} />
        </div> */}

        <div className="description-p mb-4">
          <p>
            <span className="text-[17px] font-medium">Description: </span>
            <span
              className="mt-2"
              dangerouslySetInnerHTML={{
                __html:
                  formatHtml(description) ||
                  "No description available for this project.",
              }}
            />
          </p>
        </div>

        <div className="deliverable mb-3">
          <p className="">
            <span className="text-[17px] font-medium">
              Expected Deliverable:{" "}
            </span>
            {project?.project_expectedDeliverable ? (
              project?.project_expectedDeliverable
            ) : (
              <p> No expected deliverable</p>
            )}
          </p>
        </div>
        {isChosen && rank && (
          <div className="popularity flex gap-x-2 items-center mb-3">
            <p className="text-[17px] font-medium">Rank: </p>
            <p className="border border-darkPurple px-[5px]  h-fit rounded-[4px] text-xs bg-lightPurple-20 whitespace-nowrap">
              {rank}
            </p>
          </div>
        )}
        <div className="popularity flex gap-x-2 items-center mb-3">
          <p className="text-[17px] font-medium">Popularity: </p>
          <p className=" border border-darkPurple px-[5px] text-xs rounded-[4px] h-fit bg-lightPurple-20">
            Chosen by{" "}
            {project?.popularity > 1 || project?.popularity == 0
              ? `${project?.popularity} students`
              : `${project?.popularity} student`}{" "}
          </p>
        </div>

        <div className="tags flex  items-center gap-x-2 mb-3">
          <p className="text-[17px] font-medium">Tags: </p>
          <div className="flex flex-wrap gap-x-5">
            {projectTags.length > 0 &&
              projectTags.map((tag: any, index: number) => (
                <Tags key={index} tag={tag} />
              ))}
          </div>
        </div>
        <div className="resources flex gap-x-2 mb-3">
          <p className="text-[17px] font-medium">Resources: </p>
          <div className="flex flex-wrap gap-x-5 items-center">
            {resources && resources.length > 0 ? (
              resources.map((resource: any, index: number) => {
                if (!isValidUrl(resource)) {
                  return null; // Skip invalid URLs
                }
                // Use the URL constructor to parse the resource URL
                const url = new URL(resource);
                const resourceName = url.hostname.replace("www.", ""); // Get the domain name (without 'www.' if it exists)

                return (
                  <a
                    key={index}
                    className="border border-darkPurple px-[5px]  h-fit rounded-[4px] text-xs bg-lightPurple-20 whitespace-nowrap"
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resourceName}
                  </a>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No resources available</p> // Show message when resources are empty or null
            )}
          </div>
        </div>

        <div className="modules flex gap-x-2 items-center mb-3">
          <p className="text-[17px] font-medium">Prerequisite modules: </p>
          <div className="flex flex-wrap gap-x-5">
            {modules.length > 0 ? (
              modules.map((module: any, index: number) => (
                <Tags key={index} tag={module} />
              ))
            ) : (
              <p>No prerequisite modules</p>
            )}
          </div>
        </div>

        <div className="contact flex gap-x-2 items-center mb-3">
          <p className="text-[17px] font-medium">Contact Tutor: </p>
          <button
            onClick={() => {
              router.push(
                `Student/${user?.user?.profileId}/Contact/Tutor/${project?.tutor_id}`
              );
            }}
            className="border border-darkPurple px-[5px] rounded-[4px] h-fit text-xs bg-lightPurple-20 whitespace-nowrap"
          >
            Contact Tutor
          </button>
        </div>

        {/* Choose Project Button */}
        <div className="flex justify-end">
          {isChosen === true ? (
            <button
              className=" bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md"
              onClick={() =>
                removeChoice(
                  user?.user?.profileId as number,
                  project?.project_id
                )
              }
            >
              {loading ? (
                <CircularProgress size={20} className="text-darkPurple" />
              ) : (
                "Remove Choice"
              )}
            </button>
          ) : (
            <button
              className=" bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md"
              onClick={onChooseProject}
            >
              Choose Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewProject;
