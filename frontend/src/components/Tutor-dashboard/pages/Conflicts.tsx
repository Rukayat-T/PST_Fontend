"use client";
import CustomTable from "@/components/Tables/Tables";
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu } from "@base-ui-components/react/menu";
import { useRouter } from "next/navigation";
import GlobalPagination from "@/components/Pagination/GlobalPagination";

import {
  CustomTableHeader,
  IConflictProject,
  IConflict,
} from "@/models/proposal.model";
import { useOnboarding } from "@/context/OnboardingContext";
import { formatDate } from "@/utils/helpers";
import { Skeleton } from "@mui/material";
import ProposalsService from "@/services/ProposalsServices/proposals.service";
import EmptyState from "../Modals/EmptyState";
import TutorViewProject from "../Modals/viewProjects";
import EditProject from "../Modals/editProject";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import ConflictViewProject from "../Modals/ConflictViewProject";
import ConflictEditProject from "../Modals/ConflictEditProject";
export default function ConflictComponent() {
  const [searchValue, setSearchValue] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projects, setProjects] = useState<IConflictProject[]>([]);
  const [conflicts, setConflicts] = useState<IConflict[]>([]);
  const [offset, setOffset] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const [selectedproject, setSelectedProject] =
    useState<IConflictProject | null>();
  const [isFetching, setIsfetching] = useState<boolean>(false);
  const { user } = useOnboarding();
  const handlePageClick = (page: number) => {
    if (!user) return;
    const newOffset = page;
    setOffset(newOffset);
    //   getAllProjects(user?.user.profileId, newOffset, limit);
  };

  const openModal = () => {
    //   setIsModalOpen(true);
  };

  const reFetch = () => {
    if (user?.user.id) {
      // getAllProjects(user?.user.profileId, offset, limit);
    }
  };
  // console.log(projects);
  const closeModal = () => {
    //   setIsModalOpen(false);
  };
  const openViewModal = (project: IConflictProject) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };
  const openEditModal = (project: IConflictProject) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedProject(null);
    setIsViewModalOpen(false);
  };

  const closeEditModal = () => {
    setSelectedProject(null);
    setIsEditModalOpen(false);
  };
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
      sortFunction: (sortBy?: string, sortOrder?: string) => {
        if (user) {
          // getAllProjects(user.user.id, offset, limit, undefined, sortBy, sortOrder);
        }
      },
    },
    { name: "Status", sortable: false, sortValues: null },
    {
      name: "Tutor",
      sortable: false,
      sortValues: ["Asc", "Desc"],
      sortFunction: (sortBy?: string, sortOrder?: string) => {
        if (user) {
          // getAllProjects(user.user.id, offset, limit, undefined, sortBy, sortOrder);
        }
      },
    },
    {
      name: "Created at",
      sortable: false,
      sortValues: ["Asc", "Desc"],
      sortFunction: (sortBy?: string, sortOrder?: string) => {
        if (user) {
          // getAllProjects(user.user.id, offset, limit, undefined, sortBy, sortOrder);
        }
      },
    },

    { name: "More details", sortable: false, sortValues: null },
  ];

  const mockTabkeData = [
    {
      title: "Project 1",
      status: "Draft",
      tutor: "John Doe",
      createdAt: "2023-10-01",
    },
    {
      title: "Project 2",
      status: "Active",
      tutor: "Jane Smith",
      createdAt: "2023-09-15",
    },
    {
      title: "Project 2",
      status: "Assigned",
      tutor: "Jane Smith",
      createdAt: "2023-09-15",
    },
  ];

  const router = useRouter();

  const getAllProposals = async (adminId: number) => {
    try {
      const res = await ProjectsService.getAllAdminConflicts(adminId);
      if (res.status === 201) {
        setConflicts(res.response);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(proposals)
  useEffect(() => {
    if (user?.user?.profileId) {
      getAllProposals(user.user?.profileId);
    }
  }, [user]);

  const handleStatusRendering = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return (
          <div className="w-fit h-fit px-3 py-1 rounded-lg bg-[#BCBCBC]">
            <p className="text-sm">{status}</p>
          </div>
        );
      case "active":
        return (
          <div className="w-fit h-fit px-3 py-1 rounded-lg bg-[#AAD3FF]">
            <p className="text-sm">{status}</p>
          </div>
        );
      case "assigned":
        return (
          <div className="w-fit h-fit px-3 py-1 rounded-lg  bg-[#8AE979]">
            <p className="text-sm">{status}</p>
          </div>
        );
    }
  };

  return (
    <>
      <div className="pt-8 w-full h-full flex flex-col gap-5">
        <div className="w-full border border-black   rounded-xl h-full flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xl pt-3 pl-3 font-semibold">Conflicts</p>
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
            ) : conflicts.length > 0 ? (
              <CustomTable
                headers={headers}
                render={() => {
                  return conflicts.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b-[1px] border-[#00000025]"
                    >
                      <td className="px-5 py-2 text-sm">
                        {item?.project.title}
                      </td>
                      <td className="text-center  py-2">
                        <div className="flex w-full justify-center">
                          {handleStatusRendering(item.project.status)}
                        </div>
                      </td>
                      <td className="text-center py-2">
                        {item?.project.tutor.user?.name}
                      </td>
                      <td className="text-center py-2">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="text-center py-2">
                        <Menu.Root>
                          <Menu.Trigger>
                            <MoreVertIcon className="cursor-pointer" />
                          </Menu.Trigger>
                          <Menu.Portal>
                            <Menu.Positioner sideOffset={8}>
                              <Menu.Popup className="bg-white border py-2 px-2 rounded-lg">
                                {/* <Menu.Item
                                  className="bg-white hover:bg-[#fafafa] p-2 cursor-pointer"
                                  onClick={() => {
                                    openEditModal(item.project);
                                  }}
                                >
                                  Edit Project
                                </Menu.Item> */}
                                <Menu.Item
                                  className="bg-white hover:bg-[#fafafa] p-2 cursor-pointer  "
                                  onClick={() => {
                                    openViewModal(item.project);
                                  }}
                                >
                                  View Project
                                </Menu.Item>
                                <Menu.Item
                                  className="bg-white hover:bg-[#fafafa] p-2 cursor-pointer  "
                                  onClick={() => {
                                    router.push(
                                      `/Admin/conflicts/${item.id}/view_students?projectId=${item.project.id}`
                                    );
                                  }}
                                >
                                  View Students
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
              <EmptyState heading="No Conflicts yet" subText="" />
            )}
          </div>
          {isViewModalOpen && (
            <ConflictViewProject
              isOpen={isViewModalOpen}
              closeModal={closeViewModal}
              project={selectedproject as IConflictProject}
              onChooseProject={null}
            />
          )}
          {/* {isEditModalOpen && (
            <ConflictEditProject
              isOpen={isEditModalOpen}
              closeModal={closeEditModal}
              selectedProject={selectedproject as IConflictProject}
              reset={reFetch}
            />
          )} */}
          <div className="flex items-center p-2 justify-end">
            <GlobalPagination pageCount={1} onPageClick={() => {}} />
          </div>
        </div>
      </div>
    </>
  );
}
