export type CreateUserDto = {
  email: string;
  password: string;
};
export type OnboardingInitials = {
  progress: number;
  stage: number;
  layout: number;

  errorMessage: string;
  errorStatus: ErrorStatusEnum;
  user: IUser | null;
};

export type ErrorStatusEnum =
  | "error"
  | "info"
  | "warning"
  | "success"
  | "loading";
export type IUser = {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    profileId: number;
    isAdmin: boolean;
  };
  iat: number;
  exp: number;
};
