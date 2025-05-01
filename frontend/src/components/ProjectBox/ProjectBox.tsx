"use client";
import React, { useState } from "react";
import Link from "next/link";
import Tags from "../Tags/Tags";
import ViewProject from "../Modal/ViewProject";
import DOMPurify from "dompurify";
import { IBaseFetchProject } from "@/models/proposal.model";
import ChooseProject from "../Modal/ChooseProject";
import { toast } from "react-toastify";

type ProjectBoxProps = {
  project: IBaseFetchProject;
  isChoice: boolean;
  rank?: number;
  choicesCount: number;
  refetch: () => void;
};
function ProjectBox({
  project,
  isChoice,
  rank,
  refetch,
  choicesCount,
}: ProjectBoxProps) {
  const projectTags = project?.project_tags;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const sanitizedDescription = DOMPurify.sanitize(project?.project_description); // Sanitize HTML
  const maxLength = 180;

  // Truncate the description if it's longer than maxLength
  const truncatedDescription =
    sanitizedDescription.length > maxLength
      ? sanitizedDescription.substring(0, maxLength) + "..."
      : sanitizedDescription;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openChoiceModal = () => {
    setIsChoiceModalOpen(true);
  };

  const closeChoiceModal = () => {
    setIsChoiceModalOpen(false);
  };
  return (
    <>
      <div className="box flex flex-col justify-between border w-full p-5 rounded-lg">
        <div className="title flex gap-x-2 items-center mb-3">
          <p className="text-lg font-medium">Project Title: </p>
          <p>{project?.project_title}</p>
        </div>
        <div className="tutor flex gap-x-2 items-center mb-2">
          <p className="text-lg font-medium">Tutor: </p>
          <p>{project?.tutorname}</p>
        </div>

        <div className="description gap-x-2 mb-3">
          <p className="text-lg font-medium">Description: </p>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: truncatedDescription,
            }}
          />
          <span
            onClick={openModal}
            className="text-lightPurple underline cursor-pointer"
          >
            See More
          </span>
        </div>

        <div className="popularity flex gap-x-2 items-center mb-3">
          <p className="text-lg font-medium">Popularity: </p>
          <p className=" border border-darkPurple p-[3px] text-xs rounded-md bg-lightPurple-20">
            Chosen by{" "}
            {project?.popularity > 1 || project?.popularity == 0
              ? `${project?.popularity} students`
              : `${project?.popularity} student`}{" "}
          </p>
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
        <div className="flex justify-end mt-5">
          {isChoice === true ? (
            <button className="p-1 bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg">
              Chosen
            </button>
          ) : (
            <button
              className="p-1 bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg"
              onClick={() => {
                if (choicesCount < 5) {
                  openChoiceModal();
                } else {
                  toast.error(
                    "You have reached your maximum number (5) of chosen projects"
                  );
                }
              }}
            >
              Choose
            </button>
          )}
          {/* <button className='p-1 bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg'>Choose</button> */}
        </div>
      </div>
      <ViewProject
        isOpen={isModalOpen}
        closeModal={closeModal}
        project={project}
        onChooseProject={()=>{closeModal(); setTimeout(() => {
          openChoiceModal()
        }, 0);}}
        isChosen={isChoice}
        rank={rank}
      />
      <ChooseProject
        isOpen={isChoiceModalOpen}
        closeModal={closeChoiceModal}
        refetch={refetch}
        project={project}
      />
    </>
  );
}

export default ProjectBox;
