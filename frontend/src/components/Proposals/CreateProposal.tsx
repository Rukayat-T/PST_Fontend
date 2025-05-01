"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Tags from "../Tags/Tags";
import ViewProject from "../Modal/ViewProject";
import DOMPurify from "dompurify";
import ViewProposal from "./ViewProposal";
import { useOnboarding } from "@/context/OnboardingContext";
import AuthorizationServices from "@/services/AuthServices/auth.service";
import { ITutor } from "@/models/auth.model";
import dynamic from "next/dynamic";
import CancelIcon from "@mui/icons-material/Cancel";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import Select from "react-select";
import { toast } from "react-toastify";

import AddedItem from "./AddedItem";
import ProjectsService from "@/services/ProjectsServices/Projects.service";
import { CreateProposalDto, IModule } from "@/models/proposal.model";
import ProposalsService from "@/services/ProposalsServices/proposals.service";
import { CircularProgress } from "@mui/material";
// import "react-quill/dist/quill.snow.css";

function CreateProposal({
  isOpen,
  closeModal,
  update,
}: {
  isOpen: any;
  closeModal: any;
  update?: any;
}) {
  const { user } = useOnboarding();
  const profileId = user?.user?.profileId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingTag, setAddingTag] = useState<boolean>(false);
  const [addingResource, setAddingResource] = useState<boolean>(false);
  const [tagText, setTagText] = useState<string>("");
  const [createdTags, setCreatedTags] = useState<any>([]);
  const [tutors, setTutors] = useState<ITutor[]>([]);
  const [resourceText, setResourceText] = useState<string>("");
  const [createdResources, setCreatedResources] = useState<any>([]);
  const [modules, setModules] = useState<IModule[]>([]);
  const [opts, setopts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [values, setValues] = useState<any>([]);
  useEffect(() => {
    // console.log(values);
  }, [values]);

  const colourStyles: any = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      outline: "none",
      ":focus": {
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
      },
    }),

    multiValue: (styles: any, { data }: any) => {
      return {
        ...styles,
        backgroundColor: "#5C006110",
        padding: "1px",
        borderRadius: 9999,
        fontSize: 12,
        color: "#5C0061",
      };
    },
    // multiValueLabel: (styles, { data }) => ({
    //   ...styles,
    //   color: data.color,
    // }),
    multiValueRemove: (styles: any, { data }: any) => ({
      ...styles,
      color: "#C793C5",
      backgroundColor: "#5C0061",
      borderRadius: 9999,
      ":hover": {
        backgroundColor: "#33333370",
        borderRadius: "12px",
        color: "white",
      },
    }),
  };

  const getAllModules = async () => {
    try {
      const res = await ProjectsService.getAllModules();
      if (res.status === 201) {
        setModules(res.response);

        const options = Array.from(res.response, (item: IModule) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        setopts(options);
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

  const [proposalData, setProposalData] = useState<CreateProposalDto>({
    title: "",
    description: "",
    expectedDeliverable: "",
    resources: [],
    tags: [],
    created_by: profileId as number,
    proposed_to: 0,
    moduleIds: [],
  });

  const resetData = () => {
    setCreatedResources([]);
    setCreatedTags([]);
    setValues([]);
    setProposalData({
      title: "",
      description: "",
      expectedDeliverable: "",
      resources: [],
      tags: [],
      created_by: profileId as number,
      proposed_to: 0,
      moduleIds: [],
    });
  };

  const createProposal = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const cleanDescription = DOMPurify.sanitize(proposalData.description);

    const data = {
      ...proposalData,
      moduleIds: Array.from(values, (item: any) => item.value),
      description: cleanDescription,
    };
    try {
      const res = await ProposalsService.proposeProject(data);
      if (res) {
        if (res.status === 400) {
          setLoading(false);
          toast.warning(res?.message);
        } else {
          setLoading(false);
          toast.success("Successfully submitted proposal");
          resetData();
          update();
          closeModal();
        }
      }
      // console.log(data);
    } catch (error) {
      setLoading(false);
    }
  };

  // Refactor when your head is not full
  const handleTagManagement = (
    e: React.KeyboardEvent<HTMLInputElement>,
    text: string
  ): void => {
    if (text === "") return;
    const { key, target } = e;
    if (key === "Enter") {
      const existing = [...createdTags];
      if (existing.includes(text)) {
        setCreatedTags(existing);
      } else {
        existing.push(text);
        setCreatedTags(existing);
      }
      setAddingTag(false);
      setTagText("");
    }
  };

  const handleResourcesManagement = (
    e: React.KeyboardEvent<HTMLInputElement>,
    text: string
  ): void => {
    if (text === "") return;
    const { key, target } = e;
    if (key === "Enter") {
      const existing = [...createdResources];
      if (existing.includes(text)) {
        setCreatedResources(existing);
      } else {
        existing.push(text);
        setCreatedResources(existing);
      }
      setAddingResource(false);
      setResourceText("");
    }
  };

  useEffect(() => {
    getAllTutors();
    getAllModules();
  }, [profileId]);
  useEffect(() => {
    // console.log(createdTags);
    setProposalData({
      ...proposalData,
      tags: createdTags,
    });
  }, [createdTags]);
  useEffect(() => {
    setProposalData({
      ...proposalData,
      resources: createdResources,
    });
  }, [createdResources]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-85 z-50"
      // onClick={() => {
      //   closeModal();
      //   resetData();
      // }}
    >
      <div
        className="bg-white p-5 rounded-lg w-[50%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            className=" bg-lightPurple-20 border border-darkPurple px-3 py-1 rounded-md"
            onClick={() => {
              closeModal();
              resetData();
            }}
          >
            Close
          </button>
        </div>
        <form
          action=""
          onSubmit={createProposal}
          className="w-full flex flex-col gap-y-5 items-center"
        >
          <div className="w-full flex gap-5 items-center" id="input">
            <label htmlFor="title" className="text-[1rem]">
              Proposal Title:
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className=" border-[1.5px] border-darkPurple rounded-md  px-3 w-[50%]"
              value={proposalData.title}
              onChange={(e) => {
                setProposalData({
                  ...proposalData,
                  title: e.target.value,
                });
              }}
              required
            />
          </div>

          <div className="w-full flex gap-5 items-center" id="input">
            <label htmlFor="tutors" className="text-[1rem]">
              Tutor:
            </label>
            <select
              className=" border-[1.5px] border-darkPurple rounded-md py-1 px-3 w-[50%]"
              value={proposalData.proposed_to}
              onChange={(e) => {
                setProposalData({
                  ...proposalData,
                  proposed_to: parseInt(e.target.value),
                });
              }}
            >
              <option value="0">Select a tutor</option>
              {tutors.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full flex flex-col gap-3" id="input">
            <label htmlFor="email" className="text-[1rem]">
              Description:
            </label>
            <ReactQuill
              placeholder="Please describe your proposal in detail"
              // className=' border-[1.5px] border-darkPurple rounded-md w-full min-h-[20vh] max-h-[40vh] overflow-scroll scrollbar-hide'

              // style={{ minHeight: "20vh", maxHeight: "40vh" }}
              // style={{ height: "16vh", marginBottom: "3vh", borderRadius: "20px" }}
              theme="snow"
              className="rounded-md w-full scrollbar-hide"
              value={proposalData.description}
              onChange={(e) => {
                setProposalData({
                  ...proposalData,
                  description: e,
                });
              }}
            />
          </div>

          <div className="w-full flex gap-5 items-center" id="input">
            <div className="flex items-center gap-1 flex-wrap w-full">
              <label htmlFor="tags" className="text-[1rem] ">
                Tags:
              </label>
              {createdTags.map((item: any, index: any) => (
                <AddedItem
                  key={index}
                  onClick={() => {
                    setCreatedTags(
                      createdTags.filter((tag: any) => item !== tag)
                    );
                  }}
                  item={item}
                />
              ))}
              {addingTag && (
                <input
                  className="w-[100px] p-1 border-darkPurple border rounded-lg"
                  value={tagText}
                  onChange={(e) => setTagText(e.target.value)}
                  placeholder="Press Enter to save"
                  onKeyDown={(e) => {
                    handleTagManagement(e, tagText);
                  }}
                />
              )}
              <svg
                width="24"
                height="27"
                viewBox="0 0 24 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                cursor={"pointer"}
                onClick={() => {
                  setAddingTag(true);
                }}
              >
                <rect
                  x="0.582667"
                  y="2.76617"
                  width="21.9269"
                  height="21.9269"
                  rx="4.69862"
                  fill="#C793C5"
                  fillOpacity="0.19"
                  stroke="#5C0061"
                  strokeWidth="1.04414"
                />
                <path
                  d="M10.8862 16.9864V9.36837H12.2394V16.9864H10.8862ZM7.74547 13.8623V12.5091H15.3635V13.8623H7.74547Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
          <div className="w-full flex gap-5 items-center" id="input">
            <div className="flex items-center gap-1 flex-wrap w-full">
              <label htmlFor="tags" className="text-[1rem] ">
                Resources
              </label>
              {createdResources.map((item: any, index: any) => (
                <AddedItem
                  key={index}
                  onClick={() => {
                    setCreatedResources(
                      createdResources.filter((tag: any) => item !== tag)
                    );
                  }}
                  item={item}
                />
              ))}
              {addingResource && (
                <input
                  className="w-[100px] p-1 border-darkPurple border rounded-lg"
                  value={resourceText}
                  onChange={(e) => setResourceText(e.target.value)}
                  placeholder="Press Enter to save"
                  onKeyDown={(e) => {
                    handleResourcesManagement(e, resourceText);
                  }}
                />
              )}
              <svg
                width="24"
                height="27"
                viewBox="0 0 24 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                cursor={"pointer"}
                onClick={() => {
                  setAddingResource(true);
                }}
              >
                <rect
                  x="0.582667"
                  y="2.76617"
                  width="21.9269"
                  height="21.9269"
                  rx="4.69862"
                  fill="#C793C5"
                  fillOpacity="0.19"
                  stroke="#5C0061"
                  strokeWidth="1.04414"
                />
                <path
                  d="M10.8862 16.9864V9.36837H12.2394V16.9864H10.8862ZM7.74547 13.8623V12.5091H15.3635V13.8623H7.74547Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>

          <div className="w-full flex gap-5 items-center" id="input">
            <label htmlFor="expectedDeliverable" className="text-[1rem]">
              Expected deliverable:
            </label>
            <input
              type="text"
              id="expectedDeliverable"
              name="expectedDeliverable"
              className=" border-[1.5px] border-darkPurple rounded-md  px-3 w-[50%]"
              value={proposalData.expectedDeliverable}
              onChange={(e) => {
                setProposalData({
                  ...proposalData,
                  expectedDeliverable: e.target.value,
                });
              }}
              required
            />
          </div>

          <div className="w-full flex gap-5 items-center" id="input">
            <label htmlFor="tags" className="text-[1rem]">
              Prerequisite modules:
            </label>
            <Select
              isClearable
              isMulti
              options={opts}
              value={values}
              onChange={setValues}
              // createOptionPosition="last"
              styles={colourStyles}
            />
          </div>
          <div className=" w-full flex justify-end">
            <button className="bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg py-1 px-2 mt-5">
              {loading ? (
                <CircularProgress size={20} className="text-darkPurple" />
              ) : (
                "Submit Proposal"
              )}
            </button>
          </div>
          {/* structured procrastination!!!  requirements engineering */}

          {/* <div className='w-full flex gap-5 items-center' id='input'>
            <label htmlFor='email' className='text-[1rem]'>
              Contact email:
            </label>
            <input
              type='text'
              id='email'
              name='email'
              className=' border-[1.5px] border-darkPurple rounded-lg py-1 px-3 w-[50%]'
              value={proposalData.contactEmail}
              onChange={(e) => {
                setProposalData({
                  ...proposalData,
                  contactEmail: e.target.value,
                });
              }}
              required
            />
          </div> */}
        </form>
      </div>
    </div>
  );
}

export default CreateProposal;
