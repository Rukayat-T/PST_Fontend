import React, { useCallback, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Tags from "../Tags/Tags";
import { IBaseFetchProject } from "@/models/proposal.model";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import { toast } from "react-toastify";
import { useOnboarding } from "@/context/OnboardingContext";
import { ChoiceStatus } from "@/models/statuses.model";
import { isValidUrl } from "@/utils/helpers";
import { CircularProgress } from "@mui/material";

function Rerank({
  isOpen,
  closeModal,
  projects,
  reload,
}: {
  isOpen: any;
  closeModal: any;
  projects: any;
  reload: () => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [rankData, setRankData] = useState<any>([]);
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
  useEffect(() => {
    if (projects) {
      const rankD = projects.map((item: any) => {
        return {
          title: item.project.title,
          rank: item.rank,
          choiceId: item.id,
        };
      });
      setRankData(rankD);
    }
  }, [projects]);

  const rerank = async (studentId: number) => {
    const allRanked = rankData.every(
      (proj: any) => proj.rank !== undefined && proj.rank !== null
    );
    if (!allRanked) {
      setIsRemoving(false);
      toast.warning("Please make sure all projects have a rank assigned.");
      return;
    }
    const ranks = rankData.map((proj: any) => proj.rank);
    const hasDuplicateRanks = new Set(ranks).size !== ranks.length;

    if (hasDuplicateRanks) {
      setIsRemoving(false);
      toast.warning("Please make sure no two projects have the same rank.");
      return;
    }
    const invalidRanks = rankData.some(
      (proj: any) => proj.rank < 0 || proj.rank > 5
    );

    if (invalidRanks) {
      setIsRemoving(false);
      toast.warning("Please make sure all ranks are between 0 and 5.");
      return;
    }
    setIsRemoving(true);
    try {
      const data = {
        choices: rankData.map((item: any) => {
          return { rank: item.rank, choiceId: item.choiceId };
        }),
      };
      const res = await ProjectsService.rerankChoices(studentId, data);
      //@ts-ignore
      if (res?.status === 200) {
        //@ts-ignore
        setIsRemoving(false);
        toast.success(res?.message);
        reload();
        //   getChoice(profileId);
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
        <div className="flex flex-col gap-2">
          {rankData?.map((proj: any, index: number) => (
            <div className="flex items-center gap-2" key={index}>
              <p className="w-[40%] text-xs font-semibold">{proj?.title}</p>

              <input
                type="number"
                className="w-[30%] p-2 rounded-lg border border-black"
                value={proj.rank}
                onChange={(e) => {
                  const updatedRank = parseInt(e.target.value);
                  setRankData((prevData: any) =>
                    prevData.map((proj: any, idx: number) =>
                      idx === index ? { ...proj, rank: updatedRank } : proj
                    )
                  );
                }}
                //   placeholder={conflict?.conflict?.project?.title || ""}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            className=" bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md"
            onClick={() => {
              rerank(profileId);
            }}
          >
            {isRemoving ? (
              <CircularProgress size={20} className="text-darkPurple" />
            ) : (
              "Re Rank"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Rerank;
