import { usePathname, useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext"; // Adjust this to your actual context location
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import CookieManager from "@/utils/cookie_manager";
import exp from "constants";

const withAuth = (
  WrappedComponent: React.ComponentType,
  allowedRoles: string[] = []
) => {
  const ProtectedRoute = (props: any) => {
    const { user } = useOnboarding();
    // const storedUserData = localStorage.getItem("user") || "{}";
    // const { user } = JSON.parse(storedUserData);
    const pathname = usePathname();

    const router = useRouter();

    const checkAuth = () => {
      const storedUserData = localStorage.getItem("user");

      if (storedUserData) {
        const { user, expiration } = JSON.parse(storedUserData);
        console.log(expiration);
        if (Date.now() < expiration) {
          const timeout = expiration - Date.now();
          setTimeout(() => {
            localStorage.removeItem("user");
            localStorage.removeItem("onb");
            CookieManager.deleteCookie("token");
            toast.error("You are not authorized. Please Sign in");
            router.push("/login");
          }, timeout);
        } else if (Date.now() > expiration || Date.now() == expiration) {
          // Clear expired data
          localStorage.removeItem("user");
          localStorage.removeItem("onb");
          CookieManager.deleteCookie("token");
          // toast.error("You are not authorized. Please Sign in");
          router.push("/login");
        }
      }
    };

    const redirectUser = () => {
      // Redirect to login if the user is not logged in
      if (!user?.user) {
        toast.warning("Please log in to access this page.");
        localStorage.removeItem("user");
        localStorage.removeItem("onb");
        CookieManager.deleteCookie("token");
        toast.error("You are not authorized. Please Sign in");
        router.push("/login");
        return;
      }

      // Redirect if the user's role is not in the allowedRoles
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.user?.role)) {
        toast.error("You are not authorized to view this page.");
        if (user.user?.role === "student") {
          router.push("/Projects");
        } else if (user.user?.role === "tutor") {
          router.push("/");
        }

        return;
      }
    };

    useEffect(() => {
      // checkAuth();
      redirectUser();
    }, [user, router]);

    // If still loading or redirecting, render nothing
    // if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    //   return null;
    // }

    return <WrappedComponent {...props} />;
  };

  return ProtectedRoute;
};

export default withAuth;
