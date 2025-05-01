import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Tags from "../Tags/Tags";
import { ChooseProjectDTO, IBaseFetchProject } from "@/models/proposal.model";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import { useOnboarding } from "@/context/OnboardingContext";
import { toast } from "react-toastify";
import { Checkbox, CircularProgress } from "@mui/material";

function ChooseProject({
  isOpen,
  closeModal,
  project,
  refetch,
}: {
  isOpen: any;
  closeModal: any;
  project: IBaseFetchProject;
  refetch: () => void;
}) {
  const [rank, setRank] = useState<number>(0);
  const [statement, setstatement] = useState<string>("");
  const [isChoosing, setIsChoosing] = useState<boolean>(false);
  const { user } = useOnboarding();
  const [spoken, setSpoken] = useState<boolean>(false);
  if (!isOpen) return null; // Don't render the modal if it's not open
  const chooseProject = async (
    studentId: number,
    rank: number,
    projectId: number
  ) => {
    if (rank < 1 || rank > 5) {
      toast.error("Kindly insert a valid rank between 1 and 5");
      return;
    }
    setIsChoosing(true);
    const data: ChooseProjectDTO = {
      projectId,
      rank,
      statementOfInterest: statement,
      hasCommunicated: spoken ? 1 : 0,
    };
    try {
      const res = await ProjectsService.chooseProject(studentId, data);
      if (res.status === 201) {
        setIsChoosing(false);
        toast.success(res.message);
        closeModal();
        refetch();
      } else {
        setIsChoosing(false);

        toast.error(res.message);
      }
    } catch (error) {
      setIsChoosing(false);

      console.log(error);
    }
  };

  const remove = () => {
    setRank(0);
    setstatement("");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85 z-50"
      onClick={() => {
        closeModal;
        remove;
      }}
    >
      <div
        className="bg-white p-5 rounded-lg w-[40%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            className=" bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md"
            onClick={() => {
              closeModal();
              remove();
            }}
          >
            Close
          </button>
        </div>
        <div className="title flex gap-x-2 items-center mb-3">
          <p className="font-medium">Project Title: </p>
          <p>{project?.project_title}</p>
        </div>
        <div className="title flex gap-x-2 items-center mb-3">
          <p className="font-medium">Rank: </p>
          <input
            type="number"
            className="border rounded-lg py-1 px-2 "
            value={rank}
            max={5}
            min={0}
            onChange={(e) => setRank(parseInt(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-x-2 mb-3">
          <p className="font-medium">Statement of interest: </p>
          <textarea
            // type=
            className="border rounded-lg p-2 h-[20vh] w-full"
            value={statement}
            onChange={(e) => setstatement(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-x-2 mb-3">
          <p className="font-medium">Communicated with supervisor: </p>
          <Checkbox
            onChange={() => {
              setSpoken(!spoken);
            }}
          />
        </div>

        {/* Choose Project Button */}
        <div className="flex gap-3 justify-end">
          {/* <button
            className=" bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md"
            onClick={closeModal}
          >
            Cancel
          </button> */}
          <button
            className=" bg-lightPurple-20 text-center border border-darkPurple px-3 py-1 rounded-md"
            onClick={() => {
              if (user) {
                chooseProject(user.user.profileId, rank, project.project_id);
              }
            }}
          >
            {isChoosing ? (
              <CircularProgress size={20} className="text-darkPurple" />
            ) : (
              "Choose Project"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChooseProject;
