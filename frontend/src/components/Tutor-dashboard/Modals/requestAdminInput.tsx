"use client";
import React, { useEffect, useState } from "react";
import { IAdmin } from "@/models/auth.model";
import { RequestAdminInputDto } from "@/models/proposal.model";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

function RequestAdminInput({
  closeReqPop,
  isOpen,
  admins,
  update,
  proId,
}: {
  closeReqPop: any;
  isOpen: any;
  admins: IAdmin[];
  update: any;
  proId: number;
}) {
  const [formData, setFormData] = useState({
    adminTutorProfileId: 0,
    projectId: 0,
    proposalId: 0,
    tutorComments: "",
  });
  const [loading, setLoading] = useState(false);
  const { adminTutorProfileId, projectId, proposalId, tutorComments } =
    formData;

  const requestAdminInput = async () => {
    if (adminTutorProfileId === 0) {
      toast.warning("Please select an admin");
      return;
    }
    if (tutorComments === "") {
      toast.warning("Please add a comment");
      return;
    }
    setLoading(true);
    const data: RequestAdminInputDto = {
      projectId,

      adminTutorProfileId,
      tutorComments,
    };
    try {
      const res = await ProjectsService.RequestAdminInput(data);
      if (res) {
        if (res.status === 400 || res.status === 404) {
          toast.warning(res?.message);
          setLoading(false);
        } else {
          setLoading(false);
          toast.success("Successfully requested admin input");
          closeReqPop();
          update();
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (proId) {
      setFormData((prev) => ({
        ...prev,
        projectId: proId,
      }));
    }
  }, [proId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-85 z-50"
      onClick={() => {
        closeReqPop();
      }}
    >
      <div
        className="bg-white p-8 flex flex-col items-center gap-5 rounded-lg w-[50%]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <div className="flex justify-end">
          <button
            className=" bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md"
            onClick={() => {
              closeReqPop();
            }}
          >
            Close
          </button>
        </div> */}
        <div className="w-[95%] flex flex-col gap-3" id="input">
          <div className="flex items-center gap-3">
            <label htmlFor="admin">Admin:</label>
            <select
              onChange={(e) => {
                if (e.target.value !== "") {
                  setFormData((prev) => ({
                    ...prev,
                    adminTutorProfileId: parseInt(e.target.value),
                  }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    adminTutorProfileId: 0,
                  }));
                }
              }}
              className="p-1 rounded-lg border border-darkPurple"
            >
              <option value="">Select an Admin</option>
              {admins?.map((admin, index) => (
                <option key={index} value={admin.id}>
                  {admin?.user?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-[1rem]">
              Comments:
            </label>
            <textarea
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  tutorComments: e.target.value,
                }));
              }}
              className="w-full border p-3 rounded-xl border-black"
              rows={5}
            ></textarea>
          </div>
          <div className="w-full flex justify-end gap-2">
            <button
              onClick={closeReqPop}
              className="w-fit h-fit bg-[#D8D8D8] px-3 py-1 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                requestAdminInput();
              }}
              className="w-fit h-fit bg-[#8AE979] rounded-lg px-3 py-1"
            >
              {loading ? (
                <CircularProgress size={20} className="text-darkPurple" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestAdminInput;
