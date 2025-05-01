"use client";
import Tags from "@/components/Tags/Tags";
import { ChoiceStatus } from "@/models/statuses.model";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import { formatDate } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { Range } from "react-range";
import { toast } from "react-toastify";
import RequestAdminInput from "./requestAdminInput";
import { useOnboarding } from "@/context/OnboardingContext";
import { IAdmin } from "@/models/auth.model";
import { IStudent, IStudentChoice } from "@/models/proposal.model";
function StudentChoiceDetails({
  choice,
  student,
}: {
  choice: IStudentChoice;
  student: IStudent;
}) {
  const [statementScore, setStatementScore] = useState([0]);
  const [requestPopUp, setRequestPopUp] = useState(false);
  const [choiceStatus, setChoiceStatus] = useState("");
  const { user } = useOnboarding();
  const closeReqPop = () => {
    setRequestPopUp(false);
  };

  const openReqPop = () => {
    setRequestPopUp(true);
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
      <div className="p-3 font-semibold border-b-[1px] border-black flex justify-between">
        <div>{choice.project.title} Details</div>
        <div>Project ID: {choice.project.id}</div>
      </div>
      <div className="p-5 h-fit flex flex-col gap-3 m-3 ">
        <div className="flex ">
          <span className="font-semibold mr-5">Status:</span>{" "}
          <span> {Status(choice.status)} </span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Email:</span>{" "}
          <span>{student?.user?.email}</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Department:</span>{" "}
          <span>{student?.department}</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Year of study:</span>{" "}
          <span>{student?.yearOfStudy}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-5">Previous modules:</span>
          <span>
            <div className="flex flex-wrap gap-2">
              {choice.project.prerequisiteModules &&
                choice.project.prerequisiteModules.map(
                  (tag: any, index: number) => (
                    <Tags key={index} tag={tag?.name} />
                  )
                )}
            </div>
          </span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Current average:</span>{" "}
          <span>{student?.currentAverage}%</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Rank:</span>{" "}
          <span>#{choice.rank} in applications</span>
        </div>

        <div className="">
          <span className="font-semibold mr-5">Project preference:</span>{" "}
          <span>#{choice.rank} in student&apos;s choices</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Created date:</span>{" "}
          <span>{formatDate(student?.created_at)}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-5">Interests:</span>
          <span>
            <div className="flex flex-wrap gap-2">
              {choice.project.tags &&
                choice.project.tags.map((tag: any, index: number) => (
                  <Tags key={index} tag={tag} />
                ))}
            </div>
          </span>
        </div>

        <div className="">
          <span className="font-semibold">Statement of Interest:</span>{" "}
          <span>
            {choice.statementOfInterest === null ||
            choice.statementOfInterest === ""
              ? "No statement of interest"
              : choice.statementOfInterest}
          </span>
        </div>
      </div>
    </>
  );
}
export default StudentChoiceDetails;
