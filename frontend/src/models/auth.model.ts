import { IModule } from "./proposal.model";

export type ITutor = {
  id: number;
  specializations: string;
  created_at: string;
  updated_at: string;
  user: IUser;
};
export type IAdmin = {
  id: number;
  specializations: string;
  created_at: string;
  updated_at: string;
  isAdmin: boolean;
  user: IUser;
};

export type CommentRes = {
  adminComment: string;
  tutorComment: string;
};

export type IUser = {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
};
// export type IStudentProfile = {
//   id: number;
//   project_choices: any;
//   yearOfStudy: number;
//   created_at: string;
//   updated_at: string;
//   department: string;
//   currentAverage: number;
//   interests: string[];
//   user: IUser;
//   chosenProjects: any[];
//   previousModules: IModule[];
// };
