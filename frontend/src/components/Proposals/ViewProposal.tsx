import React from "react";
import DOMPurify from "dompurify";
import Tags from "../Tags/Tags";
import ProposalsService from "@/services/ProposalsServices/proposals.service";
import { useOnboarding } from "@/context/OnboardingContext";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

function ViewProposal({
  isOpen,
  closeModal,
  proposal,
  update,
}: {
  isOpen: any;
  closeModal: any;
  proposal: any;
  update: any;
}) {
  const { user } = useOnboarding();
  const profileId = user?.user?.profileId;

  // console.log(proposal)

  const projectTags = proposal?.tags;
  const resources = proposal?.resources;
  const modules = proposal?.modules;
  const description = DOMPurify.sanitize(proposal?.description);
  const [loading, setLoading] = React.useState(false);
  function formatHtml(htmlString: string) {
    return htmlString.replace(/<p>(.*?)<\/p>/gi, "<span> $1</span>");
  }

  const withdrawProposal = async () => {
    // console.log("hello")
    setLoading(true);
    try {
      const res = await ProposalsService.withdrawProposal(
        profileId as number,
        proposal?.id as number
      );
      if (res.status === 201) {
        setLoading(false);
        toast.success("Proposal Withdrawn");
        update();
        closeModal();
      } else {
        setLoading(false);

        console.log(res.message);
      }
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

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
          <p className="text-[17px] font-medium">Project Title: </p>
          <p>{proposal?.title}</p>
        </div>
        <div className="tutor flex gap-x-2 items-center mb-3">
          <p className="text-[17px] font-medium">Tutor: </p>
          <p>{proposal?.tutor?.user?.name}</p>
        </div>

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
            {proposal?.expectedDeliverable ? (
              proposal?.expectedDeliverable
            ) : (
              <p> No expected deliverable</p>
            )}
          </p>
        </div>

        <div className="popularity flex gap-x-2 items-center mb-3">
          <p className="text-[17px] font-medium">Status: </p>
          <p className=" border border-darkPurple px-[5px] text-xs rounded-[4px] h-fit bg-lightPurple-20">
            {proposal?.status}{" "}
          </p>
        </div>

        <div className="tags flex gap-x-2 items-center mb-3">
          <p className="text-[17px] font-medium">Tags: </p>
          <div className="flex flex-wrap gap-2">
            {projectTags.length > 0 &&
              projectTags.map((tag: any, index: number) => (
                <Tags key={index} tag={tag} />
              ))}
          </div>
        </div>
        {/* <div className='resources flex gap-x-2 mb-3'>
          <p className='text-[17px] font-medium'>Resources: </p>
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
         </div> */}

        <div className="modules flex gap-x-2 items-center mb-3">
          <p className="text-[17px] font-medium">Prerequisite modules: </p>
          <div className="flex flex-wrap gap-2">
            {modules.length > 0 ? (
              modules.map((module: any, index: number) => (
                <Tags key={index} tag={module?.name} />
              ))
            ) : (
              <p>No prerequisite modules</p>
            )}
          </div>
        </div>

        <div className="contact flex gap-x-2 items-center mb-3">
          <p className="text-[17px] font-medium">Contact Tutor: </p>
          <a
            className="border border-darkPurple px-[5px] rounded-[4px] h-fit text-xs bg-lightPurple-20 whitespace-nowrap"
            href={""}
            target="_blank"
            rel="noopener noreferrer"
          >
            contactLink
          </a>
        </div>

        {/* Choose Project Button */}
        {proposal?.status === "WITHDRAWN" ? (
          ""
        ) : (
          <div className="flex justify-end">
            <button
              className=" bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md"
              onClick={() => {
                withdrawProposal();
              }}
            >
              {loading ? (
                <CircularProgress size={20} className="text-darkPurple" />
              ) : (
                " Withdraw Proposal"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewProposal;
