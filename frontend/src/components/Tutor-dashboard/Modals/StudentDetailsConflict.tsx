"use client";
import Tags from "@/components/Tags/Tags";
import { ChoiceStatus, ProjectStatus } from "@/models/statuses.model";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import { formatDate } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { Range } from "react-range";
import { toast } from "react-toastify";
import RequestAdminInput from "./requestAdminInput";
import { useOnboarding } from "@/context/OnboardingContext";
import { IAdmin } from "@/models/auth.model";
import AdminComment from "./AdminComment";
import { IConflict, IConflictProject } from "@/models/proposal.model";
import { CircularProgress } from "@mui/material";
function StudentDetailsConflict({
  student,
  activeIndex,
  update,
  projectId,

  conflict,
}: {
  student: any;
  activeIndex: number;
  update: any;
  projectId: number;

  conflict: IConflict | undefined;
}) {
  // console.log(activeIndex);
  const applicationDetails = student;
  const [statementScore, setStatementScore] = useState([0]);
  const [requestPopUp, setRequestPopUp] = useState(false);
  const [choiceStatus, setChoiceStatus] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [loading, setLoading] = useState(false);
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
    projectId: number,
    assigning?: Boolean
  ) => {
    setAccepting(true);

    try {
      const res = await ProjectsService.assignProjectToStudent(
        studentId,
        projectId
      );
      if (res) {
        if (res.status === 400 || res.status === 404) {
          toast.warning(res?.message);
          setAccepting(false);
          if (assigning) {
          } else {
            setLoading(false);
          }
        } else {
          toast.success("Successfully assigned project");
          setChoiceStatus("ALLOCATED");
          update();
          setAccepting(false);
        }
      }
    } catch (error) {
      setAccepting(false);
    }
  };

  const updateStudentChoiceStatus = async (id: number, status: string) => {
    setLoading(true);
    const data = {
      status,
    };
    try {
      const res = await ProjectsService.updateStudentChoiceStatus(data, id);
      if (res) {
        if (res.status === 400 || res.status === 404) {
          toast.warning(res?.message);
          setLoading(false);
        } else {
          toast.success("Successfully updated");
          update();
          setChoiceStatus(status);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationDetails?.statementOfInterestScore != undefined) {
      setStatementScore([applicationDetails.statementOfInterestScore]);
    }
    console.log(student, "cosmeree");

    if (applicationDetails?.status != undefined) {
      setChoiceStatus(applicationDetails?.status);
    }
  }, [student]);

  return (
    <>
      <div className="p-3 font-semibold border-b-[1px] border-black flex justify-between">
        <div>
          {activeIndex >= 0 ? student?.student?.user?.name + "'s" : "Student's"}{" "}
          Details
        </div>
        <div>Student ID: {student?.student?.id}</div>
      </div>
      <div className="p-5 h-fit flex flex-col gap-3 m-3 ">
        <div className="flex ">
          <span className="font-semibold mr-5">Status:</span>{" "}
          <span> {student && Status(student.status)} </span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Email:</span>{" "}
          <span>{student?.student?.user?.email}</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Department:</span>{" "}
          <span>{student?.student?.department}</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Year of study:</span>{" "}
          <span>{student?.student?.yearOfStudy}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-5">Previous modules:</span>
          <span>
            <div className="flex flex-wrap gap-2">
              {student?.student.previousModules &&
                student?.student.previousModules.map(
                  (tag: any, index: number) => (
                    <Tags key={index} tag={tag?.name} />
                  )
                )}
            </div>
          </span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Current average:</span>{" "}
          <span>{student?.student?.currentAverage}%</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Rank:</span>{" "}
          <span>#{activeIndex + 1} in applications</span>
        </div>

        <div className="">
          <span className="font-semibold mr-5">Project preference:</span>{" "}
          <span>#{student?.rank} in student&apos;s choices</span>
        </div>
        <div className="">
          <span className="font-semibold mr-5">Application date:</span>{" "}
          <span>{formatDate(student?.createdAt)}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-5">Interests:</span>
          <span>
            <div className="flex flex-wrap gap-2">
              {student &&
                student?.student.interests.map((tag: any, index: number) => (
                  <Tags key={index} tag={tag} />
                ))}
            </div>
          </span>
        </div>

        <div className="">
          <span className="font-semibold">Statement of Interest:</span>{" "}
          <span>
            {student?.student.statementOfInterest === null ||
            student?.student.statementOfInterest === ""
              ? "No statement of interest"
              : student?.student.statementOfInterest}
          </span>
        </div>

        <div className="w-full">
          <span className="font-semibold block text-center">
            Rate Statement of Interest(0-10):
          </span>
          <div className="flex items-center w-full">
            <div className="flex-grow">
              <Range
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
          {/* {conflict?.adminComments === null ||
            (conflict?.adminComments === "" && (
              <button
                disabled={choiceStatus === "NOT_SELECTED"}
                className="mr-4 px-2 py-1 rounded-md bg-[#D8D8D8] bg-opacity-75"
                onClick={() => {
                  openReqPop();
                }}
              >
                Leave Comment
              </button>
            ))} */}

          {conflict?.project.status.toLowerCase() !== "assigned" ? (
            <>
              <button
                // disabled={choiceStatus === "NOT_SELECTED"}
                className="mr-4 px-2 py-1 rounded-md bg-[#D8D8D8] bg-opacity-75"
                onClick={() => {
                  openReqPop();
                }}
              >
                Leave Comment
              </button>
              <button
                disabled={choiceStatus === "NOT_SELECTED"}
                className="mr-4 px-2 py-1 rounded-md bg-green-400 bg-opacity-75"
                onClick={() => {
                  assignProjectToStudent(
                    applicationDetails.student.id,
                    projectId,
                    true
                  );
                }}
              >
                {accepting ? (
                  <CircularProgress size={20} className="text-darkPurple" />
                ) : (
                  "Accept Application"
                )}
              </button>
              <button
                className={` px-2 py-1 rounded-md bg-red-500 bg-opacity-100 text-white`}
                disabled={choiceStatus === "NOT_SELECTED"}
                onClick={() => {
                  updateStudentChoiceStatus(
                    applicationDetails?.id,
                    "NOT_SELECTED"
                  );
                }}
              >
                {loading ? (
                  <CircularProgress size={20} className="text-darkPurple" />
                ) : (
                  "Reject"
                )}
              </button>
            </>
          ) : null}
        </div>
      </div>

      <AdminComment
        closeReqPop={closeReqPop}
        isOpen={requestPopUp}
        proId={conflict?.id as number}
        update={update}
      />
    </>
  );
}
export default StudentDetailsConflict;
