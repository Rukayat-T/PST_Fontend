"use client";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useOnboarding } from "@/context/OnboardingContext";
import React, { useEffect, useState } from "react";
import {toast} from "react-toastify";
import { BreadCrumbItems, BreadCrumbs } from "@/components/Breadcrumbs/BreadCrumbs";
import { useRouter, useParams } from "next/navigation";
import { IBaseFetchProjectTutor } from "@/models/proposal.model";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import StudentDetails from "@/components/Tutor-dashboard/Modals/StudentDetails";
import EmptyState from "@/components/Tutor-dashboard/Modals/EmptyState";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { ChoiceStatus } from "@/models/statuses.model";
import { CircularProgress } from "@mui/material";

import Image from "next/image";

function ContactTutor() {
    const params = useParams()

    const [formData, setFormData] = useState({
        tutorId: params?.tutorId,
        studentId: params?.studentId,
        projectTitle: "",
        subject: "",
        message: "",
    });   

    const router = useRouter()

    const submit = () => {
      router.back();
      toast.success("message sent");
    }
    const [loading, setLoading] = useState(false); 

    return(
    <>
    <div className="flex items-center justify-center h-[100vh] w-full">
         <div className="border-[1.5px] border-darkPurple rounded-lg xl:w-[40%] lg:w-[65%] w-[80%] flex flex-col justify-center items-center p-5 pb-20">
                  <div className="logo">
                    <Image
                      src="https://i.postimg.cc/yY8PXfry/temp-Imagei-G8es-N.avif"
                      alt="Aston logo"
                      priority
                      width={347}
                      height={145}
                      className="mb-10 mt-10"
                    />
                  </div>
    <form
            action=""
            // onSubmit={}
            className="w-full flex flex-col gap-y-5 items-center"
            autoComplete="on"
          >

<div className="w-[100%] flex flex-col" id="input">
              <label htmlFor="email" className="text-[1rem]">
                Subject:
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="border-[1.5px] border-darkPurple rounded-lg py-1 px-3"
                value={formData.subject}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    subject: e.target.value,
                  });
                }}
                required
              />
            </div>
            <div className="w-[100%] flex flex-col" id="input">
              <label htmlFor="email" className="text-[1rem]">
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                className="border-[1.5px] border-darkPurple rounded-lg py-1 px-3 min-h-[30vh] max-h-[70vh]"
                value={formData.message}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  });
                }}
                required
              />
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className=" bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg py-1 mt-5 px-8"
            >
              {loading ? (
                <CircularProgress size={20} className="text-darkPurple" />
              ) : (
                "Send"
              )}
            </button>

            </form>
            </div>
    </div>
    </>
    )
}

export default ContactTutor;
