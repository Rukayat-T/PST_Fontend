"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useOnboarding } from "@/context/OnboardingContext";
import CookieManager from "@/utils/cookie_manager";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

function AdminSideNav() {
  const { setUser } = useOnboarding();
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    setUser(null);
    localStorage.removeItem("onb");
    localStorage.removeItem("user");
    CookieManager.deleteCookie("token");

    router.push("/login");
  };

  return (
    <>
      <div className="bg-lightPurple-20 p-5 border-r-2 border-darkPurple h-screen w-[17%]">
        <div className="flex flex-col h-16 w-32 overflow-hidden text-xs">
          <Image
            src={"/images/logoA.svg"}
            alt="logo"
            width={500}
            height={500}
            className="w-full h-full"
          />
        </div>
        <div className="nav-items mt-3 flex flex-col items-center gap-y-5 ">
          <div
            className={
              pathname === "/Admin"
                ? " border-2 rounded-lg border-darkPurple item text-xl cursor-pointer py-1 px-5"
                : "item text-xl cursor-pointer px-5"
            }
            onClick={() => {
              router.push("/Admin");
            }}
          >
            Overview
          </div>
          <div
            className={
              pathname.includes("/Admin/projects")
                ? " border-2 rounded-lg border-darkPurple item text-xl cursor-pointer py-1 px-5"
                : "item text-xl cursor-pointer px-5"
            }
            onClick={() => {
              router.push("/Admin/projects");
            }}
          >
            Projects
          </div>
          <div
            className={
              pathname === "/Admin/proposals"
                ? " border-2 rounded-lg border-darkPurple item text-xl cursor-pointer py-1 px-5"
                : "item text-xl cursor-pointer px-5"
            }
            onClick={() => {
              router.push("/Admin/proposals");
            }}
          >
            Proposals
          </div>
          <div
            className={
              pathname === "/Admin/students"
                ? " border-2 rounded-lg border-darkPurple item text-xl cursor-pointer py-1 px-5"
                : "item text-xl cursor-pointer px-5"
            }
            onClick={() => {
              // toast.error("Page no dey");
              router.push("/Admin/students");
            }}
          >
            Students
          </div>
          <div
            className={
              pathname === "/Admin/conflicts"
                ? " border-2 rounded-lg border-darkPurple item text-xl cursor-pointer py-1 px-5"
                : "item text-xl cursor-pointer px-5"
            }
            onClick={() => {
              // toast.error("Page no dey");
              router.push("/Admin/conflicts");
            }}
          >
            Conflicts
          </div>
          {/* <div
            className={
              pathname === "/Admin/past_projects"
                ? " border-2 rounded-lg border-darkPurple item text-xl cursor-pointer py-1 px-5"
                : "item text-xl cursor-pointer px-5"
            }
            onClick={() => {
              router.push("/Admin/past_projects");
            }}
          >
            Past Projects
          </div> */}

          <div className="divider mt-32 border-t-2 border-t-lightPurple-30 w-[100%]"></div>
          {/* <div className='logoutBtn text-xl cursor-pointer px-5 '>
            {" "}
            <Link href='/Projects'>Student View</Link>
          </div> */}
          {/* " border-2 rounded-lg border-darkPurple item text-xl cursor-pointer py-1 px-5 */}
          <div
            className="logoutBtn text-xl cursor-pointer px-5 "
            onClick={logout}
          >
            Sign Out
          </div>
          {/* <p className='cursor-pointer' onClick={logout}> */}
          {/* Logout */}
          {/* </p> */}
        </div>
      </div>
    </>
  );
}

export default AdminSideNav;
