"use client";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useOnboarding } from "@/context/OnboardingContext";
import React, { useEffect, useState } from "react";
import {
  BreadCrumbItems,
  BreadCrumbs,
} from "@/components/Breadcrumbs/BreadCrumbs";
import { useRouter, useParams } from "next/navigation";
import { IBaseFetchProjectTutor } from "@/models/proposal.model";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import ProposalStudentDetails from "@/components/Tutor-dashboard/Modals/ProposalStudentDetails";
import ProposalsService from "@/services/ProposalsServices/proposals.service";
import ProposalDetails from "@/components/Tutor-dashboard/Modals/ProposalDetails";

function ViewProposal() {
  const { user } = useOnboarding();
  const profileId = user?.user?.profileId;
  const [studentApps, setStudentApps] = useState<any[]>([]);
  const [activeStudent, setActiveStudent] = useState<any>();
  const router = useRouter();
  const [proposal, setProposal] = useState<any>({});
  const [isUpdate, setIsUpdate] = useState(false);
  const breadCrumbs: BreadCrumbItems[] = [
    {
      breadCrumbText: "Proposals",
      breadCrumbPath: "/Admin/proposals",
    },
  ];

  const update = () => {
    setIsUpdate(true);
  };

  const params = useParams();
  // console.log(proposal, "[[[[[[[[[[")
  const proposalId = Number(params?.id);

  const getProposal = async (projectId: number) => {
    try {
      const res = await ProposalsService.getProposalById(projectId);
      if (res.status === 201) {
        setProposal(res.response);
        setActiveStudent(res.response?.created_by);
        setIsUpdate(false);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { created_by, ...newProposal } = proposal;

  useEffect(() => {
    getProposal(Number(params?.id));
  }, [params, isUpdate]);

  return (
    <>
      <div className="p-5 w-full flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 bg-transparent"
            onClick={() => router.push("/Admin/proposals")}
          >
            <ChevronLeftIcon />
            <p className="text-sm border-r-2 border-r-black-300 pr-2">Back</p>
          </button>
          <BreadCrumbs
            breadCrumbItems={breadCrumbs}
            breadCrumbActiveItem={proposal?.title}
          />
        </div>

        <input
          type="text"
          className="w-[30%] p-2 rounded-lg border border-black"
          placeholder={proposal?.title}
          disabled
        />
        <div className="flex gap-5">
          <div className="flex flex-col w-[55%] rounded-lg border border-black">
            <ProposalDetails proposalData={newProposal} />
          </div>
          <div className="flex flex-col w-[45%] rounded-lg border h-fit border-black max-h-[80vh]">
            <ProposalStudentDetails
              student={activeStudent}
              proposalId={proposalId}
              proposalStatus={proposal?.status}
              update={update}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewProposal;
