"use client";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useOnboarding } from "@/context/OnboardingContext";
import React, { useEffect, useState } from "react";
import {
  BreadCrumbItems,
  BreadCrumbs,
} from "@/components/Breadcrumbs/BreadCrumbs";
import { useRouter, useParams } from "next/navigation";
import {
  IBaseFetchProjectTutor,
  IStudent,
  IStudentChoice,
} from "@/models/proposal.model";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import StudentDetails from "@/components/Tutor-dashboard/Modals/StudentDetails";
import EmptyState from "@/components/Tutor-dashboard/Modals/EmptyState";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { ChoiceStatus } from "@/models/statuses.model";
import AuthorizationServices from "@/services/AuthServices/auth.service";
import StudentChoiceDetails from "@/components/Tutor-dashboard/Modals/studentChoiceDetails";
import StarIcon from "@mui/icons-material/Star";
function ViewStudentsAdmin() {
  const [studentChoices, setStudentChoices] = useState<IStudentChoice[]>([]);
  const [activeChoice, setActiveChoice] = useState<any>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter();
  const [student, setStudent] = useState<IStudent>();
  const breadCrumbs: BreadCrumbItems[] = [
    {
      breadCrumbText: "Students",
      breadCrumbPath: "/Admin/students",
    },
  ];

  const params = useParams();
  // console.log(params?.id, "-----params");

  const getStudent = async (studentId: number) => {
    try {
      const res = await AuthorizationServices.GetStudent(studentId);
      if (res.status === 201) {
        setStudent(res.response);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStudentChoices = async (studentId: number) => {
    try {
      // console.log(studentId)
      const res = await AuthorizationServices.GetStudentChoices(studentId);
      if (res.status === 201) {
        // console.log(res.response.rankedStudents);
        setStudentChoices(res.response);
        if (activeChoice === undefined || activeChoice === null) {
          setActiveChoice(res.response[0]);
        }
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStudent(Number(params?.id));
    getStudentChoices(Number(params?.id));
  }, [params]);

  return (
    <>
      <div className="p-5 w-full flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 bg-transparent"
            onClick={() => router.push("/Admin/students")}
          >
            <ChevronLeftIcon />
            <p className="text-sm border-r-2 border-r-black-300 pr-2">Back</p>
          </button>
          <BreadCrumbs
            breadCrumbItems={breadCrumbs}
            breadCrumbActiveItem={student?.user.name as string}
          />
        </div>

        <input
          type="text"
          className="w-[30%] p-2 rounded-lg border border-black"
          placeholder={student?.user.name}
          disabled
        />
        <div className="flex gap-5">
          <div className="w-[35%] flex flex-col gap-5">
            <div className="flex flex-col w-full h-fit max-h-[60vh] overflow-scroll rounded-lg border border-black">
              <div className="p-3 font-semibold border-b-[1px] border-black">
                Student&apos;s Choices
              </div>
              <div className="p-3 flex flex-col gap-3 w-full">
                {studentChoices.length > 0 ? (
                  studentChoices.map((item, index) => (
                    <div
                      className={` flex cursor-pointer items-center text-xs justify-between px-5 py-2 rounded-lg font-semibold ${
                        activeChoice.id === item.id
                          ? "border-[1px] border-darkPurple bg-lightPurple-30"
                          : "border-none bg-lightPurple-20"
                      }`}
                      key={index}
                      onClick={() => {
                        setActiveChoice(item);
                        setActiveIndex(index);
                      }}
                    >
                      <div className="w-full flex items-center gap-2">
                        <p className="p-1 bg-white rounded-full">
                          #{index + 1}
                        </p>
                        <p>{item.project.title}</p>
                      </div>
                      {item.status === ChoiceStatus.ALLOCATED && (
                        <StarIcon className="text-white" />
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
          </div>
          <div className="flex flex-col w-[65%] rounded-lg border border-black max-h-[80vh]">
            {activeChoice ? (
              <StudentChoiceDetails
                student={student as IStudent}
                choice={activeChoice}
              />
            ) : (
              <EmptyState heading="Choice details:" subText="select a Choice" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewStudentsAdmin;
