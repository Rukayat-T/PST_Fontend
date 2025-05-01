"use client";
import Tags from "@/components/Tags/Tags";

import { useOnboarding } from "@/context/OnboardingContext";
import { ProposalStatus } from "@/models/statuses.model";
import ProposalsService from "@/services/ProposalsServices/proposals.service";
import { formatDate } from "@/utils/helpers";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
function ProposalStudentDetails({
  student,
  proposalId,
  proposalStatus,
  update,
}: {
  student: any;
  proposalId: number;
  proposalStatus: any;
  update: any;
}) {
  const applicationDetails = student;
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  // console.log(student, "student+++++++")

  //
  //   REJECTED = 'REJECTED', // Proposal has been rejected by the tutor
  //   UNDER_REVIEW = 'UNDER_REVIEW', // Proposal is currently being reviewed
  // }

  const { user } = useOnboarding();
  const profileId = user?.user?.profileId;

  const prevModules = applicationDetails?.previousModules;

  const interests = applicationDetails?.interests;

  const approveProposal = async (proposalId: number) => {
    setAccepting(true);
    if (profileId) {
      try {
        const res = await ProposalsService.approveProposal(
          profileId,
          proposalId
        );
        if (res) {
          if (res.status === 400) {
            setAccepting(false);
            toast.warning(res?.message);
          } else {
            setAccepting(false);
            toast.success("Successfully approved proposal");
            update();
            // resetData();
            // reset()
          }
        }
      } catch (error) {
        console.log(error);
        setAccepting(false);
      }
    }
  };

  const rejectProposal = async (proposalId: number) => {
    setRejecting(true);
    if (profileId) {
      try {
        // console.log("reject+++++++++++")
        const res = await ProposalsService.rejectProposal(
          profileId,
          proposalId
        );
        if (res) {
          if (res.status === 400) {
            setRejecting(false);
            toast.warning(res?.message);
          } else {
            toast.success("Successfully rejected proposal");
            update();
            setRejecting(false);
            //  resetData();
            // reset()
          }
        }
      } catch (error) {
        console.log(error);
        setRejecting(false);
      }
    }
  };

  //  const getProposal = async (projectId: number) => {
  //   try {
  //     const res = await ProposalsService.getProposalById(projectId);
  //     if (res.status === 201) {
  //       setProposal(res.response);
  //       setActiveStudent(res.response?.created_by)
  //     } else {
  //       console.log(res.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //  useEffect(()=>{

  //  },[isUpdate])

  return (
    <>
      <div className="p-3 font-semibold border-b-[1px] border-black flex justify-between">
        <div>{applicationDetails?.user?.name + "'s Details"}</div>
        <div>Student ID: {applicationDetails?.id}</div>
      </div>
      <div className="p-3 flex flex-col gap-3 w-full mt-3 ml-5 ">
        <div className="">
          <span className="font-semibold mr-5">Email:</span>{" "}
          <span>{applicationDetails?.user?.email}</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Department:</span>{" "}
          <span>{applicationDetails?.department}</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Year of study:</span>{" "}
          <span>{applicationDetails?.yearOfStudy}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-5">Previous modules:</span>
          <span>
            <div className="flex flex-wrap gap-2">
              {prevModules &&
                prevModules.map((tag: any, index: number) => (
                  <Tags key={index} tag={tag?.name} />
                ))}
            </div>
          </span>
        </div>
        {/* <div className='flex'>
          <span className='font-semibold mr-5'>Previous modules:</span> 
          <span>
            <div className='flex flex-wrap gap-2'>{prevModules && prevModules.map((tag: any, index: number) => <Tags key={index} tag={tag?.name} />)}</div>
            </span>
        </div> */}
        <div className="">
          <span className="font-semibold mr-5">Current average:</span>{" "}
          <span>{applicationDetails?.currentAverage}%</span>
        </div>
        <div className="">
          {/* <span className='font-semibold mr-5'>Application date:</span> <span>{formatDate(applicationDetails?.createdAt)}</span> */}
        </div>
        <div className="flex">
          <span className="font-semibold mr-5">Interests:</span>
          <span>
            <div className="flex flex-wrap gap-2">
              {interests &&
                interests.map((tag: any, index: number) => (
                  <Tags key={index} tag={tag} />
                ))}
            </div>
          </span>
        </div>
        {/* <div className="">
          <span className="font-semibold">Statement of Interest:</span>{" "}
          <span>
            {applicationDetails?.statementOfInterest === null ||
            applicationDetails?.statementOfInterest === ""
              ? "No statement of interest"
              : applicationDetails?.statementOfInterest}
          </span>
        </div> */}
        {proposalStatus?.toLowerCase() === "pending" ||
          (proposalStatus?.toLowerCase() === "under_review" && (
            <div className="mt-3">
              <button
                className="mr-4 px-2 py-1 rounded-md bg-green-400 bg-opacity-75"
                onClick={() => {
                  approveProposal(proposalId);
                }}
              >
                {accepting ? (
                  <CircularProgress size={20} className="text-darkPurple" />
                ) : (
                  "Accept Proposal"
                )}
              </button>
              <button
                className="px-2 py-1 rounded-md bg-red-500 bg-opacity-100 text-white"
                onClick={() => {
                  rejectProposal(proposalId);
                }}
              >
                {rejecting ? (
                  <CircularProgress size={20} className="text-darkPurple" />
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
export default ProposalStudentDetails;
