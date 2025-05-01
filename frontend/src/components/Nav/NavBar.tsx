import React from "react";
import Link from "next/link";
import { useOnboarding } from "@/context/OnboardingContext";
import CookieManager from "@/utils/cookie_manager";
import { useRouter } from "next/navigation";
import Image from "next/image";

function NavBar() {
  const { setUser } = useOnboarding();

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
      <div className="nav flex mb-2 h-fit items-center justify-between w-full pt-2 pb-2 border-b-[1.5px] border-darkPurple bg-lightPurple-20 ">
        <div className="flex flex-col  h-16 w-32 overflow-hidden text-xs">
          <Image
            src={"/images/logoS.svg"}
            alt="logo"
            width={500}
            height={500}
            className="w-full h-full"
          />
        </div>
        <div className="navItems pr-[2%] flex gap-x-7 justify-end w-[50%]">
          <Link href="/Projects">Projects</Link>
          <Link href="/Proposals">Your Proposals</Link>
          {/* <Link href='/Profile'>Profile</Link> */}
          <Link href="/Choices">Your Choices</Link>
          <p className="cursor-pointer" onClick={logout}>
            Logout
          </p>
        </div>
      </div>
    </>
  );
}

export default NavBar;
