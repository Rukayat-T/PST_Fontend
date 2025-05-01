"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ErrorStatusEnum, IUser, OnboardingInitials } from "@/models/onboarding.model";
import CookieManager from "@/utils/cookie_manager";

import constate from "constate";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { toast } from "react-toastify";

export const initialState: OnboardingInitials = {
  progress: 0,
  stage: 0,
  layout: 0,
  errorMessage: "",
  errorStatus: "error",
  user: null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_PROGRESS":
      return {
        ...state,
        progress: action.payload,
      };
    case "SET_STAGE":
      return {
        ...state,
        stage: action.payload,
      };
    case "SET_LAYOUT":
      return {
        ...state,
        layout: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR_MESSAGE":
      return {
        ...state,
        errorStatus: action.errorStatus,
        errorMessage: action.errorMessage,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_CATEGORY":
      return {
        ...state,
        apiCategory: action.payload,
      };
  }
};

const useOnboardingContext = () => {
  const [data, setData] = useLocalStorage("onb", initialState);
  const [state, dispatch] = useReducer(reducer, data);
  const router = useRouter();
  useEffect(() => {
    setData(state);
  }, [state, setData]);
  useEffect(() => {
    const checkAuth = () => {
      const storedUserData = localStorage.getItem("user");

      if (storedUserData) {
        const { user, expiration } = JSON.parse(storedUserData);
        if (Date.now() < expiration) {
          dispatch({
            type: "SET_USER",
            payload: user,
          });
          const timeout = expiration - Date.now();
          console.log(timeout, "timeout");
          setTimeout(() => {
            console.log("user data is being deleted because expired");
            localStorage.removeItem("user");
            localStorage.removeItem("onb");
            CookieManager.deleteCookie("token");
            toast.error("You are not authorized. Please Sign in");
            router.push("/login");
          }, timeout);
        } else {
          // Clear expired data
          const timeout = expiration - Date.now();
          console.log(timeout, "timeout");
          console.log("user data is being deleted from onboarding context's checkAuth");
          localStorage.removeItem("user");
          localStorage.removeItem("onb");
          CookieManager.deleteCookie("token");
          toast.error("You are not authorized. Please Sign in");
          router.push("/login");
        }
      }
    };
    // checkAuth();
    // const interval = setInterval(checkAuth, 1000 * 60);
    // return () => clearInterval(interval);
  }, []);
  const { progress, stage, layout, errorMessage, errorStatus, user } = state as OnboardingInitials;

  const setProgress = useCallback((progress: number) => {
    dispatch({
      type: "SET_PROGRESS",
      payload: progress,
    });
  }, []);

  const setStage = useCallback((stage: number) => {
    dispatch({
      type: "SET_STAGE",
      payload: stage,
    });
  }, []);

  const setLayout = useCallback((layout: number) => {
    dispatch({
      type: "SET_LAYOUT",
      payload: layout,
    });
  }, []);

  const setUser = useCallback((user: IUser | null) => {
    // const expirationTime = Date.now() + 3600000;
    const d = new Date(0);
    //@ts-ignore
    d.setUTCSeconds(user?.exp);

    dispatch({
      type: "SET_USER",
      payload: user,
    });
    if (user) {
      // Store user and expiration in localStorage
      localStorage.setItem("user", JSON.stringify({ user, expiration: d }));
    } else {
      localStorage.removeItem("user");
      CookieManager.deleteCookie("token");
    }
  }, []);

  const setApiErrorMessage = useCallback(
    (errorMessage: string | null, errorStatus: ErrorStatusEnum = "error") => {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        errorMessage,
        errorStatus,
      });
    },
    [dispatch]
  );

  return useMemo(
    () => ({
      progress,
      stage,
      layout,
      setProgress,
      user,
      setStage,
      setLayout,
      errorMessage,
      errorStatus,
      setApiErrorMessage,
      setUser,
    }),
    [user, progress, setProgress, stage, setStage, layout, setLayout, errorMessage, errorStatus, setApiErrorMessage]
  );
};

// Create and export the provider using constate
export const [OnboardingProvider, useOnboarding] = constate(useOnboardingContext);
