"use client";
import AdminOverview from "@/components/Tutor-dashboard/pages/AdminOverview";

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
        <AdminOverview />
      </div>
    </>
  );
}

export default TutorDashboard;
