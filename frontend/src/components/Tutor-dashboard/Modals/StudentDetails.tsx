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
import { CircularProgress } from "@mui/material";
function StudentDetails({
  student,
  activeIndex,
  update,
  projectId,
  admins,
  projectStatus,
}: {
  student: any;
  activeIndex: number;
  update: any;
  projectId: number;
  projectStatus: any;
  admins?: IAdmin[];
}) {
  // console.log(projectStatus);
  const applicationDetails = student;
  const [statementScore, setStatementScore] = useState([0]);
  const [assigning, setAssigning] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [requestPopUp, setRequestPopUp] = useState(false);
  const [choiceStatus, setChoiceStatus] = useState("");
  const { user } = useOnboarding();
  const closeReqPop = () => {
    setRequestPopUp(false);
  };

  const openReqPop = () => {
    setRequestPopUp(true);
  };

  const prevModules = applicationDetails?.student?.previousModules;

  const interests = applicationDetails?.student?.interests;

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
        <div className="bg-[#ED2929] py-1 px-2 rounded-md text-sm text-white">
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

  const rateStatement = async (id: number, score: number) => {
    const data = {
      score,
    };
    try {
      const res = await ProjectsService.rateStatement(data, id);
      if (res) {
        if (res.status === 400 || res.status === 404) {
          toast.warning(res?.message);
        } else {
          toast.success("Successfully updated score");
          update();
        }
      }
    } catch (error) {}
  };

  // console.log(applicationDetails)
  const assignProjectToStudent = async (
    studentId: number,
    projectId: number
  ) => {
    setAssigning(true);
    try {
      const res = await ProjectsService.assignProjectToStudent(
        studentId,
        projectId
      );
      if (res) {
        if (res.status === 400 || res.status === 404) {
          setAssigning(false);
          toast.warning(res?.message);
        } else {
          setAssigning(false);
          toast.success("Successfully assigned project");
          setChoiceStatus("ALLOCATED");
          update();
        }
      }
    } catch (error) {
      setAssigning(false);
    }
  };

  const updateStudentChoiceStatus = async (id: number, status: string) => {
    const data = {
      status,
    };
    setUpdating(true);
    try {
      const res = await ProjectsService.updateStudentChoiceStatus(data, id);
      if (res) {
        if (res.status === 400 || res.status === 404) {
          setUpdating(false);
          toast.warning(res?.message);
        } else {
          setUpdating(false);
          toast.success("Successfully updated");
          update();
          setChoiceStatus(status);
        }
      }
    } catch (error) {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (applicationDetails?.statementOfInterestScore != undefined) {
      setStatementScore([applicationDetails.statementOfInterestScore]);
    }

    if (applicationDetails?.status != undefined) {
      setChoiceStatus(applicationDetails?.status);
    }
  }, [student]);

  return (
    <>
      <div className="p-3 font-semibold border-b-[1px] border-black flex justify-between">
        <div>
          {activeIndex >= 0
            ? applicationDetails?.student?.user?.name + "'s"
            : "Student's"}{" "}
          Details
        </div>
        <div>Student ID: {applicationDetails?.student?.id}</div>
      </div>
      <div className="p-5 h-fit flex flex-col gap-3 m-3 ">
        <div className="flex ">
          <span className="font-semibold mr-5">Status:</span>{" "}
          <span> {Status(choiceStatus)} </span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Email:</span>{" "}
          <span>{applicationDetails?.student?.user?.email}</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Department:</span>{" "}
          <span>{applicationDetails?.student?.department}</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Year of study:</span>{" "}
          <span>{applicationDetails?.student?.yearOfStudy}</span>
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
        <div className="">
          <span className="font-semibold mr-5">Current average:</span>{" "}
          <span>{applicationDetails?.student?.currentAverage}%</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Rank:</span>{" "}
          <span>#{activeIndex + 1} in applications</span>
        </div>

        <div className="">
          <span className="font-semibold mr-5">Project preference:</span>{" "}
          <span>#{applicationDetails?.rank} in student&apos;s choices</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Application date:</span>{" "}
          <span>{formatDate(applicationDetails?.createdAt)}</span>
        </div>
        <div className="flex items-center">
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

        <div className="">
          <span className="font-semibold">Statement of Interest:</span>{" "}
          <span>
            {applicationDetails?.statementOfInterest === null ||
            applicationDetails?.statementOfInterest === ""
              ? "No statement of interest"
              : applicationDetails?.statementOfInterest}
          </span>
        </div>

        {projectStatus == "ASSIGNED" ||
        applicationDetails?.status == "NOT_SELECTED" ? (
          ""
        ) : (
          <>
            <div className="w-full">
              <span className="font-semibold block text-center">
                Rate Statement of Interest(0-10):
              </span>
              <div className="flex items-center w-full">
                <div className="flex-grow">
                  <Range
                    disabled={projectStatus == "ASSIGNED"}
                    step={1}
                    min={0}
                    max={10}
                    values={statementScore}
                    onFinalChange={(values) => {
                      rateStatement(applicationDetails?.id, values[0]);
                    }}
                    onChange={(values) => {
                      setStatementScore(values);
                    }}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          flexGrow: 1,
                          height: "6px",
                          width: "100%",
                          backgroundColor: "#ccc",
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: "24px",
                          width: "24px",
                          backgroundColor: "#999",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  />
                </div>
                <span className="ml-3 text-lg font-semibold">
                  {statementScore[0]}
                </span>
              </div>
            </div>
            <div className=" w-full flex justify-end">
              {!user?.user?.isAdmin && (
                <button
                  disabled={choiceStatus === "NOT_SELECTED"}
                  className="mr-4 px-2 py-1 rounded-md bg-[#D8D8D8] bg-opacity-75"
                  onClick={() => {
                    console.log("request popped");
                    openReqPop();
                  }}
                >
                  Request Admin Input
                </button>
              )}
              <button
                disabled={choiceStatus === "NOT_SELECTED"}
                className="mr-4 px-2 py-1 rounded-md bg-green-400 bg-opacity-75"
                onClick={() => {
                  assignProjectToStudent(
                    applicationDetails.student.id,
                    projectId
                  );
                }}
              >
                {assigning ? (
                  <CircularProgress size={20} className="text-darkPurple" />
                ) : (
                  " Accept Application"
                )}
              </button>
              {/* <button className='mr-4 px-2 py-1 rounded-md bg-stone-700 bg-opacity-15'>Waitlist</button> */}
              <button
                className="px-2 py-1 rounded-md bg-red-500 bg-opacity-100 text-white"
                onClick={() => {
                  updateStudentChoiceStatus(
                    applicationDetails?.id,
                    "NOT_SELECTED"
                  );
                }}
              >
                {updating ? (
                  <CircularProgress size={20} className="text-darkPurple" />
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </>
        )}
      </div>
      {admins && !user?.user?.isAdmin && (
        <RequestAdminInput
          closeReqPop={closeReqPop}
          update={update}
          isOpen={requestPopUp}
          admins={admins}
          proId={projectId}
        />
      )}
    </>
  );
}
export default StudentDetails;
