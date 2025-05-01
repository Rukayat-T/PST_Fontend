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
import StudentDetails from "@/components/Tutor-dashboard/Modals/StudentDetails";
import EmptyState from "@/components/Tutor-dashboard/Modals/EmptyState";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { ChoiceStatus } from "@/models/statuses.model";
import AuthorizationServices from "@/services/AuthServices/auth.service";
import { CommentRes, IAdmin } from "@/models/auth.model";

function ViewStudents() {
  const { user } = useOnboarding();
  const profileId = user?.user?.profileId;
  const [studentApps, setStudentApps] = useState<any[]>([]);
  const [activeStudent, setActiveStudent] = useState<any>();
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [comments, setComments] = useState<CommentRes>();

  const router = useRouter();
  const [project, setProject] = useState<IBaseFetchProjectTutor | any>({});
  const breadCrumbs: BreadCrumbItems[] = [
    {
      breadCrumbText: "Projects",
      breadCrumbPath: "/Admin/projects",
    },
  ];

  console.log(project);

  const params = useParams();
  // console.log(params?.id, "-----params");

  const getProject = async (projectId: number) => {
    try {
      const res = await ProjectsService.getProjectById(projectId);
      if (res.status === 201) {
        setProject(res.response);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllAdmins = async () => {
    try {
      const res = await AuthorizationServices.GetAllAdmins();
      if (res.status === 201) {
        setAdmins(res.response);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStudentApps = async (projectId: number) => {
    try {
      // console.log(projectId)
      const res = await ProjectsService.getStudentsForProject(projectId);
      if (res.status === 201) {
        // console.log(res.response.rankedStudents);
        setStudentApps(res.response.rankedStudents);
        if (activeStudent === undefined || activeStudent === null) {
          setActiveStudent(res.response.rankedStudents[0].student);
        }
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getConflictComments = async (projectId: number) => {
    try {
      const res = await ProjectsService.getConflictComments(projectId);
      if (res.status === 201) {
        setComments(res.response);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const update = () => {
    getStudentApps(Number(params?.id));
  };

  useEffect(() => {
    getProject(Number(params?.id));
    getStudentApps(Number(params?.id));
    getAllAdmins();
    getConflictComments(Number(params?.id));
  }, [params]);

  return (
    <>
      <div className="p-5 w-full flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 bg-transparent"
            onClick={() => router.push("/Admin/projects")}
          >
            <ChevronLeftIcon />
            <p className="text-sm border-r-2 border-r-black-300 pr-2">Back</p>
          </button>
          <BreadCrumbs
            breadCrumbItems={breadCrumbs}
            breadCrumbActiveItem={project?.title}
          />
        </div>

        <input
          type="text"
          className="w-[30%] p-2 rounded-lg border border-black"
          placeholder={project?.title}
          disabled
        />
        <div className="flex gap-5">
          <div className="flex flex-col gap-3 w-[35%]">
            <div className="flex flex-col gap-3 w-full h-fit max-h-[80vh] overflow-scroll rounded-lg border border-black">
              <div className="p-3 font-semibold border-b-[1px] border-black">
                Students
              </div>
              <div className="p-3 flex flex-col gap-3 w-full">
                {studentApps.length > 0 ? (
                  studentApps.map((item, index) => (
                    <div
                      className={` flex w-full cursor-pointer justify-between px-5 py-2 rounded-lg font-semibold ${
                        activeStudent.id === item.student.id
                          ? "border-[1px] border-darkPurple bg-lightPurple-30"
                          : "border-none bg-lightPurple-20"
                      }`}
                      key={index}
                      onClick={() => {
                        setActiveStudent(item.student);
                        setActiveIndex(index);
                      }}
                    >
                      {item.student?.student?.user?.name}
                      {item?.student?.status === "ALLOCATED" ? (
                        <div className="bg-white rounded-md gap-x-2 px-2 flex items-center">
                          {" "}
                          <StarOutlineIcon />
                          Allocated
                        </div>
                      ) : index === 0 ? (
                        <div className="bg-white rounded-md gap-x-2 px-2 flex items-center">
                          {" "}
                          <StarOutlineIcon />
                          Best Match
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))
                ) : (
                  <EmptyState
                    heading="Students:"
                    subText="no applications yet"
                  />
                )}
              </div>
            </div>
            {comments && comments.tutorComment !== null && (
              <div className="flex flex-col w-full h-fit  rounded-lg border border-black">
                <div className="p-3 font-semibold border-b-[1px] border-black">
                  Tutor&apos;s Comment
                </div>
                <div className="p-3 flex flex-col gap-3 w-full">
                  <p> {comments && comments.tutorComment}</p>
                </div>
              </div>
            )}
            {comments && comments.adminComment !== null && (
              <div className="flex flex-col w-full h-fit  rounded-lg border border-black">
                <div className="p-3 font-semibold border-b-[1px] border-black">
                  Admin&apos;s Comment
                </div>
                <div className="p-3 flex flex-col gap-3 w-full">
                  <p> {comments && comments.adminComment}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col w-[65%] rounded-lg border border-black ">
            {activeStudent ? (
              <StudentDetails
                student={activeStudent}
                activeIndex={activeIndex}
                update={update}
                projectId={Number(params?.id)}
                projectStatus={project?.status}
                admins={admins}
              />
            ) : (
              <EmptyState
                heading="Student details:"
                subText="select a student"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewStudents;
