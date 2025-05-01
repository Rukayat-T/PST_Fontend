"use client";
import React, { useState } from "react";
import Link from "next/link";
import Tags from "../Tags/Tags";
import ViewProject from "../Modal/ViewProject";
import DOMPurify from "dompurify";
import ViewProposal from "./ViewProposal";
import { ProposalStatus } from "@/models/statuses.model";

function ProposalBox({ proposal, update }: { proposal: any; update: any }) {
  const projectTags = proposal?.tags;
  console.log(proposal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sanitizedDescription = DOMPurify.sanitize(proposal?.description); // Sanitize HTML
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
  const Status = (status: string) => {
    if (status === ProposalStatus.APPROVED) {
      return (
        <div className="bg-[#8AE979] py-1 px-2 rounded-md text-sm">
          {" "}
          Approved
        </div>
      );
    }
    if (status === ProposalStatus.PENDING) {
      return (
        <div className="bg-[#FFC9A5] py-1 px-2 rounded-md text-sm">
          {" "}
          Pending
        </div>
      );
    }
    if (status === ProposalStatus.REJECTED) {
      return (
        <div className="bg-[#ED2929] py-1 px-2 rounded-md text-sm">
          {" "}
          Rejected
        </div>
      );
    }
    if (status === ProposalStatus.UNDER_REVIEW) {
      return (
        <div className="bg-[#FFEA78] py-1 px-2 rounded-md text-sm">
          {" "}
          Under Review
        </div>
      );
    }

    if (status === ProposalStatus.WITHDRAWN) {
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
      <div className="box border w-full p-5 rounded-lg">
        <div className="title flex gap-x-2 items-center mb-3">
          <p className="text-lg font-medium">Project Title: </p>
          <p>{proposal?.title}</p>
        </div>
        <div className="tutor flex gap-x-2 items-center mb-2">
          <p className="text-lg font-medium">Tutor: </p>
          <p>{proposal?.tutor?.user?.name}</p>
        </div>

        <div className="description gap-x-2 mb-3">
          <p className="text-lg font-medium">Description: </p>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: truncatedDescription,
            }}
          />
        </div>

        <div className="status flex gap-x-2 items-center mb-3">
          <p className="text-lg font-medium">Status: </p>
          {Status(proposal?.status)}
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
          <button
            className="p-1 bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg"
            onClick={openModal}
          >
            View
          </button>
        </div>
      </div>
      <ViewProposal
        isOpen={isModalOpen}
        closeModal={closeModal}
        proposal={proposal}
        update={update}
      />
    </>
  );
}

export default ProposalBox;
