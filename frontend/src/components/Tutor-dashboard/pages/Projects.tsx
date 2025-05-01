"use client";
import CustomTable from "@/components/Tables/Tables";
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu } from "@base-ui-components/react/menu";
import { useRouter } from "next/navigation";
import CreateProject from "../Modals/createProject";
import ViewProject from "@/components/Modal/ViewProject";
import CloseIcon from "@mui/icons-material/Close";
import {
  CustomTableHeader,
  IBaseFetchProjectTutor,
} from "@/models/proposal.model";
import GlobalPagination from "@/components/Pagination/GlobalPagination";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import { useOnboarding } from "@/context/OnboardingContext";
import { formatDate } from "@/utils/helpers";
import { Skeleton } from "@mui/material";
import TutorViewProject from "../Modals/viewProjects";
import EditProject from "../Modals/editProject";
import EmptyState from "../Modals/EmptyState";
import { ProjectStatus } from "@/models/statuses.model";
function Projects({ isAdmin }: { isAdmin?: boolean }) {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projects, setProjects] = useState<IBaseFetchProjectTutor[]>([]);
  const [selectedproject, setSelectedProject] =
    useState<IBaseFetchProjectTutor | null>();
  const [offset, setOffset] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isFetching, setIsfetching] = useState<boolean>(false);
  const limit = 10;
  const { user } = useOnboarding();

  const handlePageClick = (page: number) => {
    if (!user) return;
    const newOffset = page;
    setOffset(newOffset);
    getAllProjects(user?.user.profileId, newOffset, limit);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const reFetch = () => {
    if (user?.user.id) {
      getAllProjects(user?.user.profileId, offset, limit);
    }
  };
  // console.log(projects);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openViewModal = (project: IBaseFetchProjectTutor) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };
  const openEditModal = (project: IBaseFetchProjectTutor) => {
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

  const headers: CustomTableHeader[] = [
    {
      name: "Title",
      sortable: true,
      sortValues: ["Asc", "Desc"],
      sortFunction: (sortBy?: string, sortOrder?: string) => {
        if (user) {
          getAllProjects(
            user.user.profileId,
            offset,
            limit,
            undefined,
            sortBy,
            sortOrder
          );
        }
      },
    },
    { name: "Status", sortable: false, sortValues: null },
    {
      name: "Popularity",
      sortable: true,
      sortValues: ["Asc", "Desc"],
      sortFunction: (sortBy?: string, sortOrder?: string) => {
        if (user) {
          getAllProjects(
            user.user.profileId,
            offset,
            limit,
            undefined,
            sortBy,
            sortOrder
          );
        }
      },
    },
    {
      name: "Created At",
      sortable: true,
      sortValues: ["Asc", "Desc"],
      sortFunction: (sortBy?: string, sortOrder?: string) => {
        if (user) {
          getAllProjects(
            user.user.profileId,
            offset,
            limit,
            undefined,
            sortBy,
            sortOrder
          );
        }
      },
    },

    { name: "More details", sortable: false, sortValues: null },
  ];

  const router = useRouter();
  const getAllProjects = async (
    tutorId: number,
    pageNo: number,
    pageSize: number,
    search?: string,
    sortBy?: string,
    order?: string
  ) => {
    setIsfetching(true);
    console.log(user, "userr");
    try {
      const res = await ProjectsService.getTutorCreatedProjects(
        tutorId,
        pageNo,
        pageSize,
        search,

        sortBy,
        order
      );

      if (res.status === 201) {
        setIsfetching(false);
        console.log(res.response, "projects+++++++++++++++");
        setProjects(res.response.formattedProjects);
        setTotalCount(res.response.pagination.totalPages);
      } else {
        // setIsfetching(false);
        console.log(res.message);
      }
    } catch (error) {
      // setIsfetching(false);
      console.log(error);
    }
  };
  useEffect(() => {
    if (user?.user.id) {
      getAllProjects(user.user?.profileId, offset, limit, searchValue);
    }
  }, [user, searchValue]);

  const Status = (status: string) => {
    if (status === ProjectStatus.ASSIGNED) {
      return (
        <div className="bg-[#8AE97940] py-1 px-2 rounded-md text-sm">
          {" "}
          Assigned
        </div>
      );
    }
    if (status === ProjectStatus.ACTIVE) {
      return (
        <div className="bg-[#FFC9A540] py-1 px-2 rounded-md text-sm">
          {" "}
          Active
        </div>
      );
    }

    if (status === ProjectStatus.DRAFT) {
      return (
        <div className="bg-[#FFEA7840] py-1 px-2 rounded-md text-sm">
          {" "}
          Draft
        </div>
      );
    }

    // if (status === ProjectStatus.WITHDRAWN) {
    //   return (
    //     <div className="bg-[#BCBCBC] py-1 px-2 rounded-md text-sm">
    //       {" "}
    //       Withdrawn{" "}
    //     </div>
    //   );
    // }
  };

  return (
    <>
      <div className="pt-8 w-full h-full flex flex-col gap-5">
        <div className="header h-[5%] flex items-center justify-between">
          <div className="flex items-center justify-between w-[45%] border-[1.5px] border-darkPurple rounded-lg py-1 px-3">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Search by Title"
              className="border-none outline-none w-full"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                // if (user) {
                //   getAllProjects(
                //     user.user.profileId,
                //     offset,
                //     limit,
                //     e.target.value
                //   );
                // }
              }}
              required
            />
            {searchValue.length > 0 && (
              <CloseIcon
                className="cursor-pointer text-xs"
                onClick={() => setSearchValue("")}
              />
            )}
          </div>

          <button
            className="px-5 py-1 border-[1.5px] border-darkPurple rounded-lg"
            onClick={openModal}
          >
            New Project
          </button>
        </div>

        <div className="w-full border border-black   rounded-xl h-full flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xl pt-3 pl-3 font-semibold">Projects</p>
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
            ) : projects.length > 0 ? (
              <CustomTable
                headers={headers}
                render={() => {
                  return projects.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b-[1px] border-[#00000025]"
                    >
                      <td className="px-5 py-2 text-sm">
                        {item?.project_title}
                      </td>
                      <td className="text-center py-2">
                        {Status(item?.project_status)}
                      </td>
                      <td className="text-center py-2">{item?.popularity}</td>
                      <td className="text-center py-2">
                        {formatDate(item?.project_createdAt)}
                      </td>
                      <td className="text-center py-2">
                        <Menu.Root>
                          <Menu.Trigger>
                            <MoreVertIcon className="cursor-pointer" />
                          </Menu.Trigger>
                          <Menu.Portal>
                            <Menu.Positioner sideOffset={8}>
                              <Menu.Popup className="bg-white border py-2 px-2 rounded-lg">
                                <Menu.Item
                                  className="bg-white hover:bg-[#fafafa] p-2 cursor-pointer"
                                  onClick={() => {
                                    openEditModal(item);
                                  }}
                                >
                                  Edit Project
                                </Menu.Item>
                                <Menu.Item
                                  className="bg-white hover:bg-[#fafafa] p-2 cursor-pointer"
                                  onClick={() => {
                                    openViewModal(item);
                                  }}
                                >
                                  View Project
                                </Menu.Item>
                                <Menu.Item
                                  className="bg-white hover:bg-[#fafafa] p-2 cursor-pointer  "
                                  onClick={() => {
                                    router.push(
                                      `/${
                                        isAdmin ? "Admin" : "Tutor"
                                      }/projects/${
                                        item.project_id
                                      }/view_students`
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
              <EmptyState heading={"No Projects"} subText={"create some"} />
            )}
          </div>
          <div className="flex justify-end p-5">
            <GlobalPagination
              inc
              pageCount={totalCount}
              onPageClick={handlePageClick}
            />
          </div>
        </div>
        <CreateProject
          isOpen={isModalOpen}
          closeModal={closeModal}
          reset={reFetch}
        />
        <TutorViewProject
          isOpen={isViewModalOpen}
          closeModal={closeViewModal}
          project={selectedproject as IBaseFetchProjectTutor}
          onChooseProject={null}
        />
        <EditProject
          isOpen={isEditModalOpen}
          closeModal={closeEditModal}
          selectedProject={selectedproject as IBaseFetchProjectTutor}
          reset={reFetch}
        />
      </div>
    </>
  );
}

export default Projects;
