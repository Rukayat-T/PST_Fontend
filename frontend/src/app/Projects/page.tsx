"use client";
import ProjectBox from "@/components/ProjectBox/ProjectBox";
import React, { ChangeEvent, useEffect, useState } from "react";
import NavBar from "../../components/Nav/NavBar";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import { useOnboarding } from "@/context/OnboardingContext";
import withAuth from "@/components/HigherOrder/Auth";
import ViewProject from "@/components/Modal/ViewProject";
import CreateProposal from "@/components/Proposals/CreateProposal";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import GlobalPagination from "@/components/Pagination/GlobalPagination";
import { IBaseFetchProject, IModule, IStudent } from "@/models/proposal.model";
import { Skeleton } from "@mui/material";
import { ITutor } from "@/models/auth.model";
import AuthorizationServices from "@/services/AuthServices/auth.service";
import Image from "next/image";

const defaultFilterValues = { module: "0", tutor: "0", search: "" };
function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [projects, setProjects] = useState<IBaseFetchProject[]>([]);
  const { user } = useOnboarding();

  const profileId = user?.user?.profileId;
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [userChoices, setUserChoices] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState(defaultFilterValues);
  const [appliedFilters, setAppliedFilters] = useState<any[]>([]);
  const [filterApplied, setFilterApplied] = useState<boolean>(false);
  const [isFetching, setIsfetching] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [offset, setOffset] = useState(1);
  const [modules, setModules] = useState<IModule[]>([]);
  const [tutors, setTutors] = useState<ITutor[]>([]);
  const [student, setStudent] = useState<IStudent>();
  const { module, tutor, search } = filterOptions;
  const limit = 9;
  const getChoices = async (studentId: number) => {
    try {
      const res = await ProjectsService.getStudentChoices(studentId);
      if (res.status === 201) {
        setUserChoices(res.response);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
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

  const isChoice = (projectId: number): { chosen: boolean; rank: number } => {
    if (userChoices.length > 0) {
      for (let i = 0; i < userChoices.length; i++) {
        if (userChoices[i].project.id === projectId) {
          return {
            chosen: true,
            rank: userChoices[i].rank,
          };
        }
      }
    }
    return {
      chosen: false,
      rank: 0,
    };
  };
  // const checkIfChosen = (projectId: number): boolean => {
  //   if (student && student.chosenProjects.length > 0) {
  //     const chosen = student.chosenProjects.find(
  //       (item) => item.project_id === projectId
  //     );
  //     return chosen ? true : false;
  //   }
  //   return false;
  // };

  const getAllModules = async () => {
    try {
      const res = await ProjectsService.getAllModules();
      if (res.status === 201) {
        setModules(res.response);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllTutors = async () => {
    try {
      const res = await AuthorizationServices.getAllTutors();
      if (res.status === 201) {
        setTutors(res.response);
        // console.log("tutors", res.response);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProjects = async (
    pageNo: number,
    pageSize: number,
    search?: string,
    moduleId?: number,
    tutorId?: number,
    sortBy?: string,
    order?: string
  ) => {
    setIsfetching(true);
    try {
      const res = await ProjectsService.getAllProjects(
        pageNo,
        pageSize,
        search,
        moduleId,
        tutorId,
        sortBy,
        order
      );
      if (res.status === 201) {
        setIsfetching(false);
        // console.log(res.response, "projects");
        setProjects(res.response.projects);
        setTotalCount(res.response.pagination.totalPages);
      } else {
        setIsfetching(false);
        console.log(res.message);
      }
    } catch (error) {
      setIsfetching(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getAllModules();
    getAllTutors();
    setIsClient(true);
    if (profileId) {
      getChoices(profileId);
      getStudent(profileId);
    }
  }, [profileId]);

  useEffect(() => {
    if (search === "") {
      getAllProjects(1, limit);
    }
  }, [search]);
  const handleDynamicFetch = (
    search: string,
    module: string,
    tutor: string,
    popularity: string = "popularity",
    sort?: "ASC" | "DESC"
  ) => {
    const mod = parseInt(module);
    const tut = parseInt(tutor);
    getAllProjects(
      1,
      limit,
      search !== "" ? search : undefined,
      mod !== 0 ? mod : undefined,
      tut !== 0 ? tut : undefined,
      popularity,
      sort ? sort : undefined
    );
  };
  const handlefilterChange = (e: any) => {
    setFilterOptions((prev) => {
      console.log(prev, "jjj");
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
    const filterState = [...appliedFilters];
    let appliedFilter: any;
    if (e.target.name === "module") {
      appliedFilter = {
        filter: e.target.name,
        value: modules.find((item) => item.id == e.target.value)?.name,
      };
    }
    if (e.target.name === "tutor") {
      appliedFilter = {
        filter: e.target.name,
        value: tutors.find((item) => item.id == e.target.value)?.user.name,
      };
    }

    if (filterState.some((item) => item.filter === appliedFilter.filter)) {
      const reorg = filterState.filter(
        (item) => item.filter !== appliedFilter.filter
      );
      reorg.push(appliedFilter);
      setAppliedFilters(reorg);
    } else {
      setAppliedFilters([...appliedFilters, appliedFilter]);
    }
  };
  const reset = () => {
    setFilterOptions(defaultFilterValues);
    getAllProjects(1, limit);
    if (profileId) {
      getChoices(profileId);
      getStudent(profileId);
    }
  };

  const handlePageClick = (page: number) => {
    const newOffset = page;
    setOffset(newOffset);
    getAllProjects(newOffset, limit);
    // call api again with new offset here
  };
  return (
    <>
      {!isClient ? null : (
        <>
          <div className="flex flex-col w-full">
            <NavBar />

            <div className="intro w-full flex justify-center mb-5">
              <div className="text w-[40%] text-center">
                <p>Hello {user?.user?.name},</p>
                <p>please select your project choices, </p>
                <p>each from a different supervisor, or propose a new one.</p>
              </div>
            </div>
            <div
              className={`filterSection w-full overflow-hidden transition-all duration-700 ease-in-out flex flex-col ${
                filterOpen ? "gap-5" : "gap-0"
              }  border-y-[1px] py-3 border-greyOutline mb-5`}
            >
              <div className="filter px-10 flex justify-between items-center">
                <div className="search flex justify-between w-[36%]">
                  <div className="input w-[80%]">
                    <input
                      type="text"
                      id="search"
                      name="search"
                      placeholder="Enter a tag, module, tutor or project title"
                      className="bg-lightPurple-20 border-[1px] border-darkPurple rounded-md py-[2px] px-3 w-[100%]"
                      onChange={(e) => getAllProjects(1, limit, e.target.value)}
                    />
                  </div>
                  <button
                    className="bg-lightPurple-20 border-[1px] border-darkPurple rounded-md py-[2px] px-3"
                    onClick={() => {
                      {
                        search != ""
                          ? reset()
                          : handleDynamicFetch(search, module, tutor);
                      }
                    }}
                  >
                    {search != "" ? <CloseIcon /> : "Search"}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="w-fit px-5 py-1 flex items-center border border-darkPurple bg-lightPurple-20 cursor-pointer rounded-lg gap-2"
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    {filterOpen ? (
                      <FilterAltOffOutlinedIcon />
                    ) : (
                      <FilterAltOutlinedIcon />
                    )}
                    <p>Filters</p>
                  </button>
                </div>
              </div>
              <div className="flex w-full items-center justify-center">
                <div
                  className={`${
                    filterOpen ? "h-fit opacity-100" : "h-0 opacity-0"
                  } overflow-hidden transition-all duration-700 ease-in-out`}
                >
                  {filterApplied ? (
                    <div className="flex items-center gap-2">
                      {appliedFilters.map((item, index) => (
                        <div
                          className="w-fit rounded-full h-fit px-3 py-1 text-sm border-darkPurple  bg-lightPurple-20 flex items-center gap-2"
                          key={index}
                        >
                          <p className="text-xs text-[#474A57]">
                            {item.filter} : {item.value}
                          </p>
                          {/* <CloseIcon
                            className="text-sm cursor-pointer"
                            onClick={() => {
                              setAppliedFilters(
                                appliedFilters.filter(
                                  (filter) => filter.filter !== item.filter
                                )
                              );
                            }}
                          /> */}
                        </div>
                      ))}
                      <button
                        className="w-fit h-fit flex items-center gap-2 px-5 py-2 text-[#757575]"
                        onClick={() => {
                          setFilterApplied(false);
                          setFilterOpen(false);
                          getAllProjects(1, limit);
                          setFilterOptions(defaultFilterValues);
                          setAppliedFilters([]);
                        }}
                      >
                        Clear All
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="sort flex items-center gap-x-2">
                        <p>Sort By:</p>
                        <div className="option flex gap-x-2 items-center bg-lightPurple-20 border-[1px] border-darkPurple rounded-md py-[2px] px-3">
                          Popularity
                          <button
                            className="asc"
                            onClick={() => {
                              handleDynamicFetch(
                                search,
                                module,
                                tutor,
                                undefined,
                                "ASC"
                              );
                            }}
                          >
                            <ExpandLessIcon />
                          </button>
                          <button
                            className="desc"
                            onClick={() => {
                              handleDynamicFetch(
                                search,
                                module,
                                tutor,
                                undefined,
                                "DESC"
                              );
                            }}
                          >
                            <ExpandMoreIcon />
                          </button>
                        </div>
                      </div>
                      <div className="flex border-darkPurple  bg-lightPurple-20 border items-center rounded-lg px-3 py-1">
                        <label
                          htmlFor="moduleFilter"
                          className="text-sm font-[500] text-[#959595]"
                        >
                          Module:
                        </label>
                        <select
                          name="module"
                          value={module}
                          className="border-none transparent outline-none"
                          onChange={handlefilterChange}
                        >
                          <option value="0">All</option>
                          {modules.map((item, index) => (
                            <option value={item.id} key={index}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex border-darkPurple  bg-lightPurple-20 border items-center rounded-lg px-3 py-1">
                        <label
                          htmlFor="statusFilter"
                          className="text-sm font-[500] text-[#959595]"
                        >
                          Tutor:
                        </label>
                        <select
                          name="tutor"
                          value={tutor}
                          className="border-none transparent outline-none"
                          onChange={handlefilterChange}
                        >
                          <option value="0">All</option>
                          {tutors.map((item, index) => (
                            <option value={item.id} key={index}>
                              {item.user.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        className="w-fit h-fit px-3 py-1 text-lightPurple border-darkPurple   border rounded-full border-[1px] hover:bg-lightPurple-20 hover:text-black ease-in-out duration-500 text-sm"
                        onClick={() => {
                          if (module === "" && tutor === "") {
                            toast.error("Select at least one filter");
                            return;
                          }

                          handleDynamicFetch(search, module, tutor);
                          setFilterApplied(true);
                        }}
                      >
                        Apply
                      </button>
                      <button
                        className="w-fit h-fit flex items-center gap-2 px-5 py-2 text-[#757575]"
                        onClick={() => {
                          setFilterOptions(defaultFilterValues);
                          getAllProjects(1, limit);
                        }}
                      >
                        <CloseIcon />
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="projectsSection w-full px-10">
              <div className="flex flex-col gap-5">
                <div className="mb-5 flex justify-end">
                  <button
                    className="p-1 bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg"
                    onClick={openModal}
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
                  ) : projects.length > 0 ? (
                    <div className="projects grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3">
                      {projects.map((project: any, index: number) => (
                        <ProjectBox
                          refetch={() => {
                            reset();
                          }}
                          key={project?.project_id}
                          project={project}
                          choicesCount={userChoices.length}
                          rank={isChoice(project?.project_id).rank}
                          isChoice={
                            isChoice(project?.project_id).chosen as boolean
                          }
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
                <div className="flex w-full justify-end mb-2">
                  <GlobalPagination
                    inc
                    pageCount={totalCount}
                    onPageClick={handlePageClick}
                  />
                </div>
              </div>
            </div>
          </div>
          <CreateProposal isOpen={isModalOpen} closeModal={closeModal} update={()=>{}}/>
        </>
      )}
    </>
  );
}

export default Projects;
