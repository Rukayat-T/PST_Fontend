"use client";
import React, { useState } from "react";
import Link from "next/link";
import Tags from "../Tags/Tags";
import ViewProject from "../Modal/ViewProject";
import DOMPurify from "dompurify";
import { IBaseFetchProject } from "@/models/proposal.model";
import ViewChoice from "../Modal/ViewChoice";
import { ChoiceStatus } from "@/models/statuses.model";

function ChoiceBox({ choice, getChoice }: { choice: any; getChoice: any }) {
  const project = choice?.project;
  const projectTags = project?.tags;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sanitizedDescription = DOMPurify.sanitize(project?.description); // Sanitize HTML
  const maxLength = 180;

  //   Truncate the description if it's longer than maxLength
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

  return (
    <>
      <div className="box flex flex-col justify-between border w-full p-5 rounded-lg">
        <div className="title flex gap-x-2 items-center mb-3">
          <p className="text-lg font-medium">Project Title: </p>
          <p>{project?.title}</p>
        </div>
        <div className="tutor flex gap-x-2 items-center mb-2">
          <p className="text-lg font-medium">Tutor: </p>
          <p>{project?.tutor?.user?.name}</p>
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
          <p className="text-lg font-medium">Rank: </p>
          <p className=" border border-darkPurple p-[3px] px-2 text-xs rounded-md bg-lightPurple-20">
            {choice?.rank}{" "}
          </p>
        </div>

        <div className="popularity flex gap-x-2 items-center mb-3">
          <p className="text-lg font-medium">Status: </p>
          <p>{Status(choice?.status)}</p>
        </div>

        <div className="tags flex gap-x-2 items-center mb-3">
          <p className="text-lg font-medium">Tags: </p>
          <div className="flex flex-wrap gap-2">
            {projectTags.length > 0 &&
              projectTags.map((tag: any, index: number) => (
                <Tags key={index} tag={tag} />
              ))}
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button className="p-1 bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg">
            Chosen
          </button>
        </div>
      </div>
      <ViewChoice
        isOpen={isModalOpen}
        closeModal={closeModal}
        project={project}
        rank={choice?.rank}
        choiceId={choice?.id}
        getChoice={getChoice}
        status={choice?.status}
      />
    </>
  );
}

export default ChoiceBox;
