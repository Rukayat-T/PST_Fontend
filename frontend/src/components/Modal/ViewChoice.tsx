import React, { useCallback, useEffect } from "react";
import DOMPurify from "dompurify";
import Tags from "../Tags/Tags";
import { IBaseFetchProject } from "@/models/proposal.model";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import { toast } from "react-toastify";
import { useOnboarding } from "@/context/OnboardingContext";
import { ChoiceStatus } from "@/models/statuses.model";
import { isValidUrl } from "@/utils/helpers";
import { CircularProgress } from "@mui/material";

function ViewChoice({
  isOpen,
  closeModal,
  project,
  rank,
  choiceId,
  getChoice,
  status,
}: {
  isOpen: any;
  closeModal: any;
  project: any;
  rank: number;
  choiceId: number;
  getChoice: any;
  status: ChoiceStatus;
}) {
  const projectTags = project.tags;
  const resources = project.resources;
  const modules = project?.prerequisiteModules;
  const description = DOMPurify.sanitize(project?.description);
  const [isRemoving, setIsRemoving] = React.useState(false);
  const { user } = useOnboarding();

  const profileId = user?.user?.profileId as number;

  const Status = (status: string) => {
    if (status === ChoiceStatus.ALLOCATED) {
      return (
        <div className="bg-[#8AE979] py-1 px-2 rounded-md text-sm">
          {" "}
          Allocated{" "}
        </div>
      );
    }
    if (status === ChoiceStatus.APPLIED) {
      return (
        <div className="bg-[#FFC9A5] py-1 px-2 rounded-md text-sm">
          {" "}
          Applied{" "}
        </div>
      );
    }
    if (status === ChoiceStatus.NOT_SELECTED) {
      return (
        <div className="bg-[#ED2929] py-1 px-2 rounded-md text-sm">
          {" "}
          Not Selected{" "}
        </div>
      );
    }
    if (status === ChoiceStatus.SHORTLISTED) {
      return (
        <div className="bg-[#FFEA78] py-1 px-2 rounded-md text-sm">
          {" "}
          Shortlisted{" "}
        </div>
      );
    }
    if (status === ChoiceStatus.UNDER_REVIEW) {
      return (
        <div className="bg-[#AAD3FF] py-1 px-2 rounded-md text-sm">
          {" "}
          Under Review{" "}
        </div>
      );
    }
    if (status === ChoiceStatus.WITHDRAWN) {
      return (
        <div className="bg-[#BCBCBC] py-1 px-2 rounded-md text-sm">
          {" "}
          Withdrawn{" "}
        </div>
      );
    }
  };

  const removeChoice = async (studentId: number, choiceId: number) => {
    setIsRemoving(true);
    try {
      const res = await ProjectsService.removeProjectChoice(
        studentId,
        choiceId
      );
      //@ts-ignore
      if (res?.status === 201) {
        //@ts-ignore
        setIsRemoving(false);
        toast.success(res?.message);
        getChoice(profileId);
        closeModal();
      } else {
        //@ts-ignore
        setIsRemoving(false);
        toast.warning(res?.message);
      }
    } catch (error) {
      console.log(error);
      setIsRemoving(false);
    }
  };

  useEffect(() => {}, [profileId]);

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div
      className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-85 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-5 rounded-lg w-[50%]"
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
          <p className="text-lg font-medium">Project Title: </p>
          <p>{project?.title}</p>
        </div>
        <div className="tutor flex gap-x-2 items-center mb-3">
          <p className="text-lg font-medium">Tutor: </p>
          <p>{project?.tutor?.user?.name}</p>
        </div>

        <div className="description mb-4">
          <p className="text-lg font-medium">Description:</p>
          <div
            className="mt-2 text-sm"
            dangerouslySetInnerHTML={{
              __html:
                description || "No description available for this project.",
            }}
          />
        </div>
        {/* popularity */}
        {/* <div className='popularity flex gap-x-2 items-center mb-3'>
          <p className='text-lg font-medium'>Popularity: </p>
          <p className=' border border-darkPurple p-[3px] text-xs rounded-md bg-lightPurple-20'>Chosen by {project?.popularity > 1 || project?.popularity == 0 ? `${project?.popularity} students` : `${project?.popularity} student`} </p>
        </div> */}
        <div className="popularity flex gap-x-2 items-center mb-3">
          <p className="text-lg font-medium">Rank: </p>
          <p className=" border border-darkPurple p-[3px] px-3 text-xs rounded-md bg-lightPurple-20">
            {rank}{" "}
          </p>
        </div>

        <div className="popularity flex gap-x-2 items-center mb-3">
          <p className="text-lg font-medium">Status: </p>
          <p>{Status(status)}</p>
        </div>

        <div className="tags flex gap-x-2  mb-3">
          <p className="text-lg font-medium">Tags: </p>
          <div className="flex flex-wrap gap-2">
            {projectTags.length > 0 &&
              projectTags.map((tag: any, index: number) => (
                <Tags key={index} tag={tag} />
              ))}
          </div>
        </div>
        <div className="resources flex gap-x-2 mb-3">
          <p className="text-lg font-medium">Resources: </p>
          <div className="flex flex-wrap gap-2 items-center">
            {resources && resources.length > 0 ? (
              resources.map((resource: any, index: number) => {
                if (!isValidUrl(resource)) {
                  return null; // Skip invalid URLs
                }
                const url = new URL(resource);
                const resourceName = url.hostname.replace("www.", "");

                return (
                  <a
                    key={index}
                    className="border border-darkPurple p-1 rounded-md text-xs bg-lightPurple-20 whitespace-nowrap"
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

        <div className="deliverable mb-3">
          <p className="">
            <span className="text-lg font-medium">Expected Deliverable: </span>
            {project?.project_expectedDeliverable ? (
              project?.project_expectedDeliverable
            ) : (
              <p> No expected deliverable</p>
            )}
          </p>
        </div>

        <div className="modules flex gap-x-2  mb-3">
          <p className="text-lg font-medium">Prerequisite modules: </p>
          <div className="flex flex-wrap gap-2">
            {modules?.length > 0 ? (
              modules.map((module: any, index: number) => (
                <Tags key={index} tag={module.name} />
              ))
            ) : (
              <p>No prerequisite modules</p>
            )}
          </div>
        </div>

        {/* <div className="contact flex gap-x-2 mb-3">
          <p className="text-lg font-medium">Contact Tutor: </p>
          <a
            className="border border-darkPurple p-1 rounded-md text-xs bg-lightPurple-20 whitespace-nowrap"
            href={""}
            target="_blank"
            rel="noopener noreferrer"
          >
            contactLink
          </a>
        </div> */}

        <div className="flex justify-end">
          <button
            className=" bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md"
            onClick={() => {
              removeChoice(profileId, choiceId);
            }}
          >
            {isRemoving ? (
              <CircularProgress size={20} className="text-darkPurple" />
            ) : (
              "Remove Choice"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewChoice;
