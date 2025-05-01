"use client";
import CustomTable from "@/components/Tables/Tables";
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu } from "@base-ui-components/react/menu";
import { useRouter } from "next/navigation";
import {
  CustomTableHeader,
  IBaseFetchProjectTutor,
} from "@/models/proposal.model";
import { useOnboarding } from "@/context/OnboardingContext";
import { formatDate } from "@/utils/helpers";
import GlobalPagination from "@/components/Pagination/GlobalPagination";
import { CircularProgress, Skeleton } from "@mui/material";
import ProposalsService from "@/services/ProposalsServices/proposals.service";
import EmptyState from "../Modals/EmptyState";
import { ProposalStatus } from "@/models/statuses.model";
function Proposals({ isAdmin }: { isAdmin?: boolean }) {
  const [selected, setSelected] = useState<any>();
  const [reviewing, setReviewing] = useState(false);
  const [projects, setProjects] = useState<IBaseFetchProjectTutor[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [selectedproject, setSelectedProject] =
    useState<IBaseFetchProjectTutor | null>();
  const [isFetching, setIsfetching] = useState<boolean>(false);
  const { user } = useOnboarding();

  // const reFetch = () => {
  //   if (user?.user.id) {
  //   getAllProjects(user?.user.id, offset, limit)
  //   }
  // }

  const headers: CustomTableHeader[] = [
    {
      name: "Title",
      sortable: false,
      sortValues: ["Asc", "Desc"],
    },
    { name: "Status", sortable: false, sortValues: null },
    {
      name: "Student",
      sortable: false,
      sortValues: ["Asc", "Desc"],
    },
    {
      name: "Submitted",
      sortable: false,
      sortValues: ["Asc", "Desc"],
    },

    { name: "More details", sortable: false, sortValues: null },
  ];

  const router = useRouter();

  const getAllProposals = async (tutorId: number) => {
    setIsfetching(true);
    try {
      const res = await ProposalsService.getAllTutorsProposals(tutorId);
      if (res.status === 201) {
        setIsfetching(false);
        setProposals(res.response);
      } else {
        setIsfetching(false);
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
      setIsfetching(false);
    }
  };
  const updateProposalStatus = async (proposalId: number, status: string) => {
    setSelected(proposalId);
    setTimeout(async () => {
      setReviewing(true);
      try {
        const res = await ProposalsService.updateProposalStatus(
          proposalId,
          status
        );
        if (res.status === 201) {
          setReviewing(false);
          router.push(
            `/${
              isAdmin ? "Admin" : "Tutor"
            }/proposals/${proposalId}/view_proposal`
          );
        } else {
        }
      } catch (error) {
        setReviewing(false);

        console.log(error);
      }
    }, 0.5);
  };
  // console.log(proposals)
  useEffect(() => {
    if (user?.user?.profileId) {
      getAllProposals(user.user?.profileId);
    }
  }, [user]);
  const Status = (status: string) => {
    if (status === ProposalStatus.APPROVED) {
      return (
        <div className="bg-[#8AE97940]  py-1 px-2 rounded-md text-sm">
          {" "}
          Approved
        </div>
      );
    }
    if (status === ProposalStatus.PENDING) {
      return (
        <div className="bg-[#FFC9A540]  py-1 px-2 rounded-md text-sm">
          {" "}
          Pending
        </div>
      );
    }
    if (status === ProposalStatus.REJECTED) {
      return (
        <div className="bg-[#ED292940]  py-1 px-2 rounded-md text-sm">
          {" "}
          Rejected
        </div>
      );
    }
    if (status === ProposalStatus.UNDER_REVIEW) {
      return (
        <div className="bg-[#FFEA7840]  py-1 px-2 rounded-md text-sm">
          {" "}
          Under Review
        </div>
      );
    }

    if (status === ProposalStatus.WITHDRAWN) {
      return (
        <div className="bg-[#BCBCBC40] py-1 px-2 rounded-md text-sm">
          {" "}
          Withdrawn{" "}
        </div>
      );
    }
  };

  return (
    <>
      <div className="pt-8 w-full h-full flex flex-col gap-5">
        <div className="w-full border border-black   rounded-xl h-screen flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xl pt-3 pl-3 font-semibold">Proposals</p>
            {isFetching ? (
              <div className="px-3">
                {[1, 2, 3, 4, 5, 6].map((item, index) => (
                  <Skeleton
                    key={index}
                    className="p-3 mb-2 w-full"
                    variant="rounded"
                    width={"100%"}
                    height={10}
                  />
                ))}
              </div>
            ) : proposals.length > 0 ? (
              <CustomTable
                headers={headers}
                render={() => {
                  return proposals.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b-[1px] border-[#00000025]"
                    >
                      <td className="px-5 py-2 text-sm">{item?.title}</td>
                      <td className="text-center py-2">
                        {Status(item?.status)}
                      </td>
                      <td className="text-center py-2">
                        {item?.created_by?.user?.name}
                      </td>
                      <td className="text-center py-2">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="text-center py-2">
                        <Menu.Root>
                          <Menu.Trigger>
                            {reviewing && selected === item.id ? (
                              <CircularProgress
                                size={20}
                                className="text-darkPurple"
                              />
                            ) : (
                              <MoreVertIcon className="cursor-pointer" />
                            )}
                          </Menu.Trigger>
                          <Menu.Portal>
                            <Menu.Positioner sideOffset={8}>
                              <Menu.Popup className="bg-white border py-2 px-2 rounded-lg">
                                <Menu.Item
                                  className="bg-white hover:bg-[#fafafa] p-2 cursor-pointer  "
                                  onClick={() => {
                                    if (
                                      item.status === ProposalStatus.PENDING
                                    ) {
                                      updateProposalStatus(
                                        item.id,
                                        ProposalStatus.UNDER_REVIEW
                                      );
                                    } else {
                                      router.push(
                                        `/${
                                          isAdmin ? "Admin" : "Tutor"
                                        }/proposals/${item.id}/view_proposal`
                                      );
                                    }
                                  }}
                                >
                                  View Proposal
                                </Menu.Item>
                              </Menu.Popup>
                            </Menu.Positioner>
                          </Menu.Portal>
                        </Menu.Root>
                      </td>
                    </tr>
                  ));
                }}
              />
            ) : (
              <EmptyState heading="No Proposals yet" subText="" />
            )}
          </div>
          <div className="flex justify-end p-5">
<GlobalPagination
inc
pageCount={1}
onPageClick={()=>{}}
/>
</div>
        </div>

      </div>
    </>
  );
}

export default Proposals;
