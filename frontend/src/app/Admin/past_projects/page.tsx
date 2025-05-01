"use client";
import PastProjects from "@/components/Tutor-dashboard/pages/PastProjects";
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
      <div className="px-5 w-full">
        <PastProjects />
      </div>
    </>
  );
}

export default TutorDashboard;
