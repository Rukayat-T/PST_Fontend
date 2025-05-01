"use client";
import Proposals from "@/components/Tutor-dashboard/pages/Proposals";
import { useOnboarding } from "@/context/OnboardingContext";
import CookieManager from "@/utils/cookie_manager";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function TutorDashboard() {
  const router = useRouter();
  const { user } = useOnboarding();
  const profileId = user?.user?.profileId;
  const [activePage, setActivePage] = useState(0);
  const changeActivePage = (page: number) => {
    setActivePage(page);
  };

  useEffect(() => {
    const token = CookieManager.getCookie("token");

    if (!token) {
      router.push(`/login?redirect=/Tutor/proposals`);
    }
  }, [router]);

  return (
    <>
      <div className="px-5 h-full w-full pb-5 ">
        <Proposals isAdmin />
      </div>
    </>
  );
}

export default TutorDashboard;
