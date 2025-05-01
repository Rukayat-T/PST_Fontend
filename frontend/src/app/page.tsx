"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import { useOnboarding } from "@/context/OnboardingContext";
import CookieManager from "@/utils/cookie_manager";
import { useRouter } from "next/navigation";

function Home() {
  const [isClient, setIsClient] = React.useState<boolean>(false);
  const { setUser } = useOnboarding();
  const router = useRouter();
  const logout = () => {
    setUser(null);
    CookieManager.deleteCookie("token");
    router.push("/login");
  };

  return (
    <>
      <div className='w-[88%] min-h-full pl-3'>Home</div>
      <Button variant='contained' onClick={logout}>
        Log out
      </Button>
    </>
  );
}

export default Home;
