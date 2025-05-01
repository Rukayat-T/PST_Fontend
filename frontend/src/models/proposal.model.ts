import { IAdmin, IUser } from "./auth.model";

export type CreateProposalDto = {
  title: string;

  description: string;

  expectedDeliverable: string;

  resources?: string[];

  tags: string[];

  created_by: number;

  proposed_to: number;

  moduleIds: number[];
};

export type RequestAdminInputDto = {
  projectId?: number;
  proposalId?: number;
  adminTutorProfileId: number;
  tutorComments: string;
};
export type IConflict = {
  id: number;
  tutorComments: string;
  adminComments: string | null;
  createdAt: string;
  admin: IAdmin;
  project: IConflictProject;
};

export type IConflictProject = {
  id: number;
  title: string;
  description: string;
  expectedDeliverable: string;
  tags: string[];
  resources: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  tutor: {
    id: number;
    user: any;
    specializations: string;
    created_at: string;
    updated_at: string;
    isAdmin: boolean;
  };
  prerequisiteModules: PreReqMods[];
};

export type ChoosenProjects = {
  id: number;
  rank: number;
  createdAt: string;
  status: string;
  statementOfInterest: string | null;
  statementOfInterestScore: number;
  hasCommunicated: number;
};
// export type IStudent ={}
export type IApplication = {
  id: number;
  rank: number;
  createdAt: string;
  status: string;
  statementOfInterest: string | null;
  statementOfInterestScore: number;
  hasCommunicated: number;
  student: IStudent;
};
export type IFullConflictRes = {
  conflict: IConflict;
  applications: IApplication[];
};

export type PreReqMods = {
  id: number;
  name: string;
  description: string;
};
export type IBaseFetchProject = {
  project_id: number;
  project_title: string;
  project_description: string;
  project_expectedDeliverable: string;
  project_tags: string[];
  project_resources: string[];
  project_createdAt: string;
  project_updatedAt: string;
  tutor_id: String;
  tutorname: String;
  popularity: number;
  prerequisiteModules: any;
  module_ids: any[];
  module_names: any[];
  rank?: number;
};
export type IBaseFetchProjectTutor = {
  project_id: number;
  project_title: string;
  project_description: string;
  project_expectedDeliverable: string;
  project_tags: string[];
  project_resources: string[];
  project_createdAt: string;
  project_updatedAt: string;
  tutor_id: number;
  module_ids: number[];
  module_names: string[];
  tutorname: string;
  popularity: string;
  project_status: string;
};
export type IStudent = {
  id: number;
  project_choices: null;
  yearOfStudy: number;
  created_at: string;
  updated_at: string;
  department: string;
  currentAverage: number;
  interests: string[];
  user: IUser;
  chosenProjects: ChoosenProjects[];
  previousModules: PreReqMods[];
};
export type IStudentChoice = {
  id: number;
  rank: number;
  createdAt: string;
  status: string;
  statementOfInterest: string | null;
  statementOfInterestScore: number;
  hasCommunicated: number;
  project: {
    id: number;
    title: string;
    description: string;
    expectedDeliverable: string;
    tags: string[];
    resources: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    contactTutor: null;
    tutor: {
      id: number;
      specializations: string;
      created_at: string;
      updated_at: string;
      isAdmin: boolean;
      contactLink: null;
      user: {
        id: number;
        email: string;
        password: string;
        name: string;
        role: string;
        created_at: string;
        updated_at: string;
      };
    };
    prerequisiteModules: PreReqMods[];
  };
};
export type IAdminStudent = {
  id: number;
  name: string;
  email: string;
  hasAssignedProject: boolean;
  assignedProjectTitle: null | string;
};
export type IProposal = {
  id: number;
  title: string;
  description: string;
  expectedDeliverable: string;
  status: string;
  tags: string[];
  resources: string[];
  createdAt: string;
  updatedAt: string;
};
export type IModule = {
  id: number;
  name: string;
  description: string;
};
export type ChooseProjectDTO = {
  projectId: number;
  statementOfInterest: string;
  hasCommunicated: number;
  rank: number;
};

export type CustomTableHeader = {
  name: string;
  sortable: boolean;
  sortValues: string[] | null;
  sortFunction?: (sortBy?: string, sortOrder?: string) => void;
};

export type ITutorMetric = {
  activeProjects: number;
  studentApplications: number;
  projectProposals: number;
  assignedProjects: number;
  [key: string]: any;
};
export type ITutorPopularProject = {
  projectId: number;
  projectTitle: string;
  popularity: number;
  applicationsLastWeek: number;
};
export type ITutorRecentActivity = {
  id: number;
  actionType: string;
  createdAt: string;
  project: {
    id: number;
    title: string;
    description: string;
    tags: string[];
    resources: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    tutor: {
      id: number;
      specializations: string;
      created_at: string;
      updated_at: string;
    };
    prerequisiteModules: [
      {
        id: number;
        name: string;
        description: string;
      }
    ];
  } | null;
  proposal: IProposal | null;
  student: IStudent | null;
};
export enum ProjectEvents {
  APPLIED_FOR_PROJECT = "APPLIED_FOR_PROJECT",
  PROJECT_ASSIGNED = "PROJECT_ASSIGNED",
  PROPOSAL_SUBMITTED = "PROPOSAL_SUBMITTED",
  PROJECT_CREATED = "PROJECT_CREATED",
  PROPOSAL_ACCEPTED = "PROPOSAL_ACCEPTED",
  PROPOSAL_REJECTED = "PROPOSAL_REJECTED",
  PROPOSAL_WITHDRAWN = "PROPOSAL_WITHDRAWN",
}
