"use client";
import Projects from "@/components/Tutor-dashboard/pages/Projects";
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
      <div className="px-5 w-full h-full pb-5">
        <Projects isAdmin />
      </div>
    </>
  );
}

export default TutorDashboard;
