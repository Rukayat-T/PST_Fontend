"use client";
import CustomTable from "@/components/Tables/Tables";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu } from "@base-ui-components/react/menu";
import { useRouter } from "next/navigation";
function PastProjects() {
  const [searchValue, setSearchValue] = useState("");
  const headers = ["Title", "Popularity", "Created At", "More"];
  const router = useRouter();
  return (
    <>
      <div className="mt-8 w-full flex flex-col gap-5">
        <div className="header flex justify-between">
          <div className="w-[45%] flex flex-col" id="input">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Search"
              className="bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg py-1 px-3"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              required
            />
          </div>
        </div>

        <div className="w-full border px-5 py-2 rounded-xl flex flex-col gap-3">
          <p className="text-xl font-semibold">Projects</p>
          {/* <CustomTable
            headers={headers}
            render={() => {
              return headers.map((item, index) => (
                <tr key={index}>
                  <td>hello</td>
                  <td className="text-center">hello</td>
                  <td className="text-center">hello</td>
                  <td className="text-center">
                    <Menu.Root>
                      <Menu.Trigger>
                        <MoreVertIcon className="cursor-pointer" />
                      </Menu.Trigger>
                      <Menu.Portal>
                        <Menu.Positioner sideOffset={8}>
                          <Menu.Popup className="bg-white border py-2 rounded-lg">
                            <Menu.Item
                              className="bg-white hover:bg-[#fafafa] p-2 cursor-pointer  "
                              onClick={() => {
                                router.push("/Tutor/projects/view_students");
                              }}
                            >
                              View Projects
                            </Menu.Item>
                            <Menu.Item className="bg-white hover:bg-[#fafafa] p-2 cursor-pointer  ">
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
          /> */}
        </div>
      </div>
    </>
  );
}

export default PastProjects;
