"use client";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useOnboarding } from "@/context/OnboardingContext";
import React, { useEffect, useState } from "react";
import {
  BreadCrumbItems,
  BreadCrumbs,
} from "@/components/Breadcrumbs/BreadCrumbs";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  IBaseFetchProjectTutor,
  IFullConflictRes,
} from "@/models/proposal.model";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import StudentDetails from "@/components/Tutor-dashboard/Modals/StudentDetails";
import EmptyState from "@/components/Tutor-dashboard/Modals/EmptyState";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { ChoiceStatus } from "@/models/statuses.model";
import StudentDetailsConflict from "@/components/Tutor-dashboard/Modals/StudentDetailsConflict";

function ViewStudentsConflict() {
  const { user } = useOnboarding();
  const profileId = user?.user?.profileId;
  const [studentApps, setStudentApps] = useState<any[]>([]);
  const [activeStudent, setActiveStudent] = useState<any>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter();
  const [project, setProject] = useState<IBaseFetchProjectTutor | any>({});
  const [conflict, setConflict] = useState<IFullConflictRes>();
  const breadCrumbs: BreadCrumbItems[] = [
    {
      breadCrumbText: "Conflicts",
      breadCrumbPath: "/Admin/conflicts",
    },
  ];

  console.log(project);

  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const getConflict = async (conflictId: number) => {
    try {
      const res = await ProjectsService.getConflictById(conflictId);
      if (res.status === 201) {
        setConflict(res.response);
        setActiveStudent(res.response.applications[0]);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const update = () => {
    //     getStudentApps(Number(params?.id));
    getConflict(Number(params?.id));
  };

  useEffect(() => {
    if (params) {
      getConflict(Number(params?.id));
    }
  }, [params]);
  useEffect(() => {
    console.log(activeStudent, "active student");
  }, [activeStudent]);

  return (
    <>
      <div className="p-5 w-full flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 bg-transparent"
            onClick={() => router.push("/Admin/conflicts")}
          >
            <ChevronLeftIcon />
            <p className="text-sm border-r-2 border-r-black-300 pr-2">Back</p>
          </button>
          <BreadCrumbs
            breadCrumbItems={breadCrumbs}
            breadCrumbActiveItem={conflict?.conflict?.project?.title || ""}
          />
        </div>

        <input
          type="text"
          className="w-[30%] p-2 rounded-lg border border-black"
          placeholder={conflict?.conflict?.project?.title || ""}
          disabled
        />
        <div className="flex gap-5">
          <div className="w-[35%] flex flex-col gap-5">
            <div className="flex flex-col w-full h-fit max-h-[60vh] overflow-scroll rounded-lg border border-black">
              <div className="p-3 font-semibold border-b-[1px] border-black">
                Students
              </div>
              <div className="p-3 flex flex-col gap-3 w-full">
                {conflict && conflict.applications.length > 0 ? (
                  conflict.applications.map((item, index) => (
                    <div
                      className={` flex cursor-pointer justify-between px-5 py-2 rounded-lg font-semibold ${
                        activeStudent.id === item.id
                          ? "border-[1px] border-darkPurple bg-lightPurple-30"
                          : "border-none bg-lightPurple-20"
                      }`}
                      key={index}
                      onClick={() => {
                        setActiveStudent(item);
                        setActiveIndex(index);
                      }}
                    >
                      {item.student?.user?.name}
                      {index === 0 ? (
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
            {conflict && conflict.conflict.tutorComments !== null && (
              <div className="flex flex-col w-full h-fit  rounded-lg border border-black">
                <div className="p-3 font-semibold border-b-[1px] border-black">
                  Tutor&apos;s Comment
                </div>
                <div className="p-3 flex flex-col gap-3 w-full">
                  <p> {conflict && conflict.conflict.tutorComments}</p>
                </div>
              </div>
            )}
            {conflict && conflict.conflict.adminComments !== null && (
              <div className="flex flex-col w-full h-fit  rounded-lg border border-black">
                <div className="p-3 font-semibold border-b-[1px] border-black">
                  Admin&apos;s Comment
                </div>
                <div className="p-3 flex flex-col gap-3 w-full">
                  <p> {conflict && conflict.conflict.adminComments}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col w-[65%] rounded-lg border border-black ">
            {activeStudent ? (
              <StudentDetailsConflict
                student={activeStudent}
                activeIndex={activeIndex}
                update={update}
                conflict={conflict?.conflict}
                projectId={Number(projectId)}
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

export default ViewStudentsConflict;
