"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/Nav/NavBar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useOnboarding } from "@/context/OnboardingContext";
import withAuth from "@/components/HigherOrder/Auth";
import ProposalsService from "@/services/ProposalsServices/proposals.service";
import ProposalBox from "@/components/Proposals/ProposalBox";
import AuthorizationServices from "@/services/AuthServices/auth.service";
import ChoiceBox from "@/components/Choices/ChoiceBox";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import Rerank from "@/components/Modal/Rerank";

function Choices() {
  const [choices, setChoices] = useState([]);
  const { user } = useOnboarding();
  const [isClient, setIsClient] = useState(false);
  const [isFetching, setIsfetching] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const profileId = user?.user?.profileId;

  const getAllChoices = async (studentId: number) => {
    setIsfetching(true);
    try {
      const res = await AuthorizationServices.GetStudentChoices(studentId);
      if (res.status === 201) {
        setIsfetching(false);
        setChoices(res.response);
      } else {
        setIsfetching(false);
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
      setIsfetching(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    if (profileId) getAllChoices(profileId);
  }, [profileId]);

  if (!isClient) return null;

  return (
    <>
      <div className="flex flex-col w-full">
        <NavBar />

        <div className="intro w-full flex justify-center mb-3">
          <div className="text w-[40%] text-center">
            <p>Hello {user?.user?.name},</p>
            <p>here are your project choices, </p>
            <p>you can view and manage them. </p>
          </div>
        </div>
        <div className="filterSection w-full border-t-[1px] py-3 border-greyOutline"></div>
        <div className="projectsSection w-full px-10">
          <div className="flex flex-col gap-2">
            <div className="flex justify-end">
              <button
                className="p-1 w-fit bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg"
                onClick={openModal}
              >
                Re-Rank Choices
              </button>
            </div>
            <div className="projects ">
              {isFetching ? (
                <div className="projects grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3">
                  {[1, 2, 3].map((item, index) => (
                    <Skeleton
                      animation="wave"
                      height={500}
                      width={"100%"}
                      className="rounded-xl"
                      key={index}
                    />
                  ))}
                </div>
              ) : choices.length > 0 ? (
                <div className="projects grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3">
                  {choices.map((choice: any, index: number) => (
                    <ChoiceBox
                      key={index}
                      choice={choice}
                      getChoice={getAllChoices}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5">
                  <div className="w-[50%] h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src={"/images/7098306.jpg"}
                      alt="noPic"
                      width={1000}
                      height={1000}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="font-semibold text-sm">
                    No Project match your search.
                  </p>
                </div>
              )}
            </div>
            <Rerank
              isOpen={isModalOpen}
              closeModal={closeModal}
              projects={choices}
              reload={() => getAllChoices(profileId as number)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Choices;
