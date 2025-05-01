"use client";
import Overview from "@/components/Tutor-dashboard/pages/Overview";

import { useOnboarding } from "@/context/OnboardingContext";
import React, { useState } from "react";

function TutorDashboard() {
  const { user } = useOnboarding();
  const profileId = user?.user?.profileId;
  const [activePage, setActivePage] = useState(0);
  const changeActivePage = (page: number) => {
    setActivePage(page);
  };

  return (
    <>
      <div className="px-5 ">
        <Overview />
      </div>
    </>
  );
}

export default TutorDashboard;
