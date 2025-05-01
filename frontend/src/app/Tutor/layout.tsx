"use client";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { OnboardingProvider } from "@/context/OnboardingContext";
import SideNav from "@/components/Tutor-dashboard/SideNav";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <OnboardingProvider>
          <div className="h-screen flex w-full ">
            <SideNav />
            <div className="overflow-y-scroll w-full h-full">
              <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
            </div>
          </div>
        </OnboardingProvider>
      </body>
    </html>
  );
}
