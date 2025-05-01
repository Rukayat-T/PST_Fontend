"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/Nav/NavBar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useOnboarding } from "@/context/OnboardingContext";
import withAuth from "@/components/HigherOrder/Auth";
import ProposalsService from "@/services/ProposalsServices/proposals.service";
import ProposalBox from "@/components/Proposals/ProposalBox";
import CreateProposal from "@/components/Proposals/CreateProposal";
import Image from "next/image";
import { Skeleton } from "@mui/material";

function Proposals() {
  const [proposals, setProposals] = useState([]);
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

  const getAllProposals = async (studentId: number) => {
    setIsfetching(true);
    try {
      const res = await ProposalsService.getAllStudentsProposals(studentId);
      if (res.status === 201) {
        setIsfetching(false);

        setProposals(res.response);
      } else {
        setIsfetching(false);
        console.log(res.message);
      }
    } catch (error) {
      setIsfetching(false);
      console.log(error);
    }
  };

  const update = () => {
    getAllProposals(profileId as number);
  };

  useEffect(() => {
    if (profileId) getAllProposals(profileId);
    setIsClient(true);
  }, [profileId]);

  if (!isClient) return null;

  return (
    <>
      <div className="flex flex-col w-full">
        <NavBar />

        <div className="intro w-full flex justify-center mb-5">
          <div className="text w-[40%] text-center">
            <p>Hello {user?.user?.name},</p>
            <p>here are your project proposals, </p>
            <p>you can view and manage them. </p>
          </div>
        </div>
        <div className="filterSection w-full border-t-[1px] py-3 border-greyOutline"></div>
        <div className="projectsSection w-full px-10">
          <div className="">
            <div className="mb-5 flex justify-end">
              <button
                className="p-1 bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg"
                onClick={() => {
                  openModal();
                }}
              >
                Propose Project
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
              ) : proposals.length > 0 ? (
                <div className="projects grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3">
                  {proposals.map((proposal: any, index: number) => (
                    <ProposalBox
                      key={index}
                      proposal={proposal}
                      update={update}
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
          </div>
        </div>
      </div>
      <CreateProposal
        isOpen={isModalOpen}
        closeModal={closeModal}
        update={update}
      />
    </>
  );
}

export default Proposals;
