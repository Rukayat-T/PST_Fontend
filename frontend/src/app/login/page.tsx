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
import SuspenseLogin from "@/components/Login/SuspenseLogin";

function Login() {
  // const [isClient, setIsClient] = React.useState<boolean>(false);
  // const { setLayout } = useOnboarding();
  // const [seePass, setSeePass] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const { setUser } = useOnboarding();
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });

  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const redirect = searchParams.get("redirect"); // Extract redirect URL
  // const [redirectTo, setRedirectTo] = useState<string>(""); // Default redirect

  // useEffect(() => {
  //   if (typeof redirect === "string") {
  //     setRedirectTo(redirect); // Set redirect if it's a valid string
  //   }
  // }, [redirect]);

  // const submit = async (e: any) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const data = formData;
  //   try {
  //     const res = await AuthorizationServices.LoginUser(data);
  //     if (res) {
  //       if (res.status === 400) {
  //         toast.warning(res?.message);
  //         setLoading(false);
  //       } else {
  //         setLoading(false);
  //         const userData = jwtDecode(res.token);

  //         const d = new Date(0);
  //         //@ts-ignore
  //         d.setUTCSeconds(userData?.exp);
  //         console.log(userData);

  //         CookieManager.setCookie("token", res.token, d.getTime());
  //         //@ts-ignore
  //         CookieManager.setCookie("role", userData.user?.role);
  //         toast.success("Successfully signed in");
  //         //@ts-ignore
  //         setUser(userData);

  //         if (redirectTo !== "") {
  //           router.push(redirectTo);
  //         } else {
  //           const userData = jwtDecode(res.token);
  //           //@ts-ignore
  //           if (userData.user?.role == "student") {
  //             router.push("/Projects");
  //           } else {
  //             router.push("/Tutor");
  //           }
  //         }
  //       }
  //     } else {
  //       toast.error("Something went wrong");
  //       setLoading(false);
  //     }
  //   } catch (error: any) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <Suspense fallback={<div>Loading....</div>}>
        <SuspenseLogin />
      </Suspense>
    </>
  );
}

export default Login;
