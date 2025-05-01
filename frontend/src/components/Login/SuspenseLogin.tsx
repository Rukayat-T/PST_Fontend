"use client";

import { useState, useEffect, Suspense } from "react";
import Button from "@mui/material/Button";
import { useOnboarding } from "@/context/OnboardingContext";
import Image from "next/image";
import AuthorizationServices from "@/services/AuthServices/auth.service";
import CookieManager from "@/utils/cookie_manager";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CircularProgress } from "@mui/material";

function SuspenseLogin() {
  // const [isClient, setIsClient] = React.useState<boolean>(false);
  // const { setLayout } = useOnboarding();
  const [seePass, setSeePass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useOnboarding();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect"); // Extract redirect URL
  const [redirectTo, setRedirectTo] = useState<string>(""); // Default redirect

  useEffect(() => {
    if (typeof redirect === "string") {
      setRedirectTo(redirect); // Set redirect if it's a valid string
    }
  }, [redirect]);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const data = formData;
    try {
      const res = await AuthorizationServices.LoginUser(data);
      if (res) {
        if (res.status === 400) {
          toast.warning(res?.message);
          setLoading(false);
        } else {
          setLoading(false);
          const userData = jwtDecode(res.token);

          const d = new Date(0);
          //@ts-ignore
          d.setUTCSeconds(userData?.exp);
          console.log(userData);

          CookieManager.setCookie("token", res.token, d.getTime());
          //@ts-ignore
          CookieManager.setCookie("role", userData.user?.role);
          toast.success("Successfully signed in");
          //@ts-ignore
          setUser(userData);

          if (redirectTo !== "") {
            router.push(redirectTo);
          } else {
            const userData = jwtDecode(res.token);
            //@ts-ignore
            if (userData.user?.role == "student") {
              router.push("/Projects");
            } 
            //@ts-ignore
            else if (userData.user?.role == "tutor") {
              //@ts-ignore
              if (userData.user?.isAdmin == true)
              {
                router.push("/Admin");
              }
              else{
                router.push("/Tutor");
              }
            }
          }
        }
      } else {
        toast.error("Something went wrong");
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Suspense fallback={<div>Loading....</div>}>
        <div className="flex items-center justify-center h-[100vh] w-full">
          <div className="border-[1.5px] border-darkPurple rounded-lg xl:w-[30%] lg:w-[45%] w-[70%] flex flex-col justify-center items-center p-5 pb-20">
            <div className="logo">
              <Image
                src="https://i.postimg.cc/yY8PXfry/temp-Imagei-G8es-N.avif"
                alt="Aston logo"
                priority
                width={347}
                height={145}
                className="mb-10 mt-10"
              />
            </div>
            {/* <div className='signinWith'>sign in with</div> */}
            <form
              action=""
              onSubmit={submit}
              className="w-full flex flex-col gap-y-5 items-center"
              autoComplete="on"
            >
              <div className="w-[75%] flex flex-col" id="input">
                <label htmlFor="email" className="text-[1rem]">
                  Email:
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg py-1 px-3"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    });
                  }}
                  required
                />
              </div>
              <div className="w-[75%] flex flex-col" id="input">
                <label htmlFor="password" className="text-[1rem]">
                  Password:
                </label>
                <div className="flex justify-between bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg py-1 px-3">
                  <input
                    type={seePass ? "text" : "password"}
                    id="password"
                    name="password"
                    className="bg-transparent w-full outline-none"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      });
                    }}
                    required
                  />
                  {seePass ? (
                    <VisibilityOffIcon
                      className="cursor-pointer"
                      onClick={() => {
                        setSeePass(!seePass);
                      }}
                    />
                  ) : (
                    <VisibilityIcon
                      className="cursor-pointer"
                      onClick={() => {
                        setSeePass(!seePass);
                      }}
                    />
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-[75%] bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg py-1 mt-5"
              >
                {loading ? (
                  <CircularProgress size={20} className="text-darkPurple" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </Suspense>
    </>
  );
}

export default SuspenseLogin;
