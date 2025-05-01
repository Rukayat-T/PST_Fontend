"use client";
import React from "react";
import DOMPurify from "dompurify";
import Tags from "@/components/Tags/Tags";
import { ProposalStatus } from "@/models/statuses.model";

function ProposalDetails({ proposalData }: { proposalData: any }) {
  console.log(proposalData, "------pop sata");
  let description = "";
  if (proposalData?.description) {
    description = DOMPurify.sanitize(proposalData?.description as string);
  }
  const tags = proposalData?.tags;
  const resources = proposalData?.resources;
  const modules = proposalData?.modules;

   const Status = (status: string) => {
        if (status === ProposalStatus.APPROVED) {
          return (
            <div className="bg-[#8AE979] py-1 px-2 rounded-md text-sm">
              {" "}
              Approved{" "}
            </div>
          );
        }
        if (status === ProposalStatus.PENDING) {
          return (
            <div className="bg-[#FFC9A5] py-1 px-2 rounded-md text-sm">
              {" "}
              Pending{" "}
            </div>
          );
        }
        if (status === ProposalStatus.REJECTED) {
          return (
            <div className="bg-[#ED2929] py-1 px-2 rounded-md text-sm text-white">
              {" "}
              Rejected{" "}
            </div>
          );
        }
        if (status === ProposalStatus.UNDER_REVIEW) {
          return (
            <div className="bg-[#AAD3FF] py-1 px-2 rounded-md text-sm">
              {" "}
              Under Review{" "}
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
    <div>
      <div className="p-3 font-semibold border-b-[1px] border-black">
        Proposal Details
      </div>
      <div className="p-3 flex flex-col gap-3 w-full">
        <div className="p-3 flex flex-col gap-3 w-full mt-2 ml-3 ">
          <div className="">
            <span className="font-semibold mr-3">Title:</span>{" "}
            <span>{proposalData.title}</span>
          </div>
          <div className="flex ">
          <span className="font-semibold mr-5">Status:</span>{" "}
          <span> {Status(proposalData?.status)} </span>
        </div>
          <div className="">
            <span className="font-semibold mr-3">Description:</span>
            <span
              className="mt-2 text-sm"
              dangerouslySetInnerHTML={{
                __html:
                  description || "No description available for this proposal.",
              }}
            />
          </div>
          <div className="flex">
            <span className="font-semibold mr-5">Tags:</span>
            <span>
              <div className="flex flex-wrap gap-2">
                {tags &&
                  tags.map((tag: any, index: number) => (
                    <Tags key={index} tag={tag} />
                  ))}
              </div>
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold mr-5">Resources:</span>
            {/* <span>
            <div className='flex flex-wrap gap-2'>{resources && resources.map((tag: any, index: number) => <Tags key={index} tag={tag} />)}</div>
            </span> */}
            <span>
              <div className="flex flex-wrap gap-2">
                {resources &&
                  resources.map((tag: any, index: number) => (
                    <span className="underline cursor-pointer" key={index}>
                      {tag}
                    </span>
                  ))}
              </div>
            </span>
          </div>

          <div className="">
            <span className="font-semibold mr-3">Expected Deliverable:</span>{" "}
            <span>{proposalData?.expectedDeliverable}</span>
          </div>
          <div className="flex">
            <span className="font-semibold mr-5">Prerequisite Modules:</span>
            <span>
              <div className="flex flex-wrap gap-2">
                {modules &&
                  modules.map((tag: any, index: number) => (
                    <Tags key={index} tag={tag?.name} />
                  ))}
              </div>
            </span>
          </div>
          <div className="">
          <span className="font-semibold">Statement of Interest:</span>{" "}
          <span>
            {proposalData?.statementOfInterest === null ||
            proposalData?.statementOfInterest === ""
              ? "No statement of interest"
              : proposalData?.statementOfInterest}
          </span>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ProposalDetails;
