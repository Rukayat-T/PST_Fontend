"use client";
import CustomTable from "@/components/Tables/Tables";
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu } from "@base-ui-components/react/menu";
import { useRouter } from "next/navigation";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  CustomTableHeader,
  IAdminStudent,
  IBaseFetchProjectTutor,
} from "@/models/proposal.model";
import GlobalPagination from "@/components/Pagination/GlobalPagination";
import { useOnboarding } from "@/context/OnboardingContext";
import { formatDate } from "@/utils/helpers";
import { Skeleton } from "@mui/material";
import ProposalsService from "@/services/ProposalsServices/proposals.service";
import EmptyState from "../Modals/EmptyState";
import TutorViewProject from "../Modals/viewProjects";
import EditProject from "../Modals/editProject";
import AuthorizationServices from "@/services/AuthServices/auth.service";
export default function AdminStudentComponent() {
  const [searchValue, setSearchValue] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projects, setProjects] = useState<IBaseFetchProjectTutor[]>([]);
  const [students, setStudents] = useState<IAdminStudent[]>([]);
  const [offset, setOffset] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const [selectedproject, setSelectedProject] =
    useState<IBaseFetchProjectTutor | null>();
  const [isFetching, setIsfetching] = useState<boolean>(false);
  const { user } = useOnboarding();
  const handlePageClick = (page: number) => {
    if (!user) return;
    const newOffset = page;
    setOffset(newOffset);
    //   getAllProjects(user?.user.profileId, newOffset, limit);
  };

  const reFetch = () => {
    if (user?.user.id) {
      // getAllProjects(user?.user.profileId, offset, limit);
    }
  };

  const Status = (status: boolean) => {
    if (status === true) {
      return (
        <div className="bg-[#8AE979] py-1 px-2 rounded-md text-sm">
          {" "}
          Allocated{" "}
        </div>
      );
    }
    if (status === false) {
      return (
        <div className="bg-[#FFC9A5] py-1 px-2 rounded-md text-sm">
          {" "}
          Unallocated{" "}
        </div>
      );
    }
  };

  const headers: CustomTableHeader[] = [
    {
      name: "Student Name",
      sortable: false,
      sortValues: ["Asc", "Desc"],
    },

    {
      name: "Status",
      sortable: true,
      sortValues: ["All", "Allocated", "Unallocated"],
      sortFunction(sortBy, sortOrder) {
        getAllStudents(
          offset,
          limit,
          undefined,
          sortOrder?.toLowerCase() === "all"
            ? undefined
            : sortOrder?.toLowerCase() === "allocated"
            ? "true"
            : "false"
        );
      },
    },

    { name: "More details", sortable: false, sortValues: null },
  ];

  const router = useRouter();

  const getAllStudents = async (
    offset: number,
    limit: number,
    search?: string,
    allocated?: string
  ) => {
    setIsfetching(true);
    try {
      const res = await AuthorizationServices.GetAllStudent(
        offset,
        limit,
        search,
        allocated
      );
      if (res.status === 201) {
        setIsfetching(false);
        setStudents(res.response.students);
      } else {
        console.log(res.message);
        setIsfetching(false);
      }
    } catch (error) {
      console.log(error);
      setIsfetching(false);
    }
  };
  // console.log(proposals)
  useEffect(() => {
    getAllStudents(offset, limit);
  }, []);

  return (
    <>
      <div className="pt-8 w-full h-full flex flex-col gap-5">
        <div className="w-full border border-black   rounded-xl h-full flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xl pt-3 pl-3 font-semibold">Students</p>
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
            ) : students.length > 0 ? (
              <CustomTable
                headers={headers}
                render={() => {
                  return students?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b-[1px] border-[#00000025]"
                    >
                      <td className="px-5 py-2 text-sm">{item?.name}</td>

                      <td className="text-center  py-2">
                        <div className="flex w-full justify-center">
                          {Status(item.hasAssignedProject)}
                          {/* {item.hasAssignedProject
                            ? "Allocated"
                            : "Unallocated"} */}
                        </div>
                      </td>

                      <td className="text-center py-2">
                        <RemoveRedEyeIcon
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/Admin/students/${item?.id}/view_student`
                            );
                          }}
                        />
                      </td>
                    </tr>
                  ));
                }}
              />
            ) : (
              <EmptyState heading="No Student yet" subText="" />
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
