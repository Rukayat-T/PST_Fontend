import { CreateUserDto } from "@/models/onboarding.model";
import HTTPClient from "../http_instance/wrapped_instance";
import {
  ChooseProjectDTO,
  RequestAdminInputDto,
} from "@/models/proposal.model";

export default class ProjectsService {
  static async getAllProjects(
    page: number,
    limit: number,
    search?: string,
    moduleId?: number,
    tutorId?: number,
    sortBy?: string,
    order?: string
  ) {
    const response = await HTTPClient.get(
      `Projects?page=${page}&limit=${limit}${
        search ? `&search=${search}` : ""
      }${moduleId ? `&modules=${moduleId}` : ""}${
        tutorId ? `&tutorId=${tutorId}` : ""
      }${sortBy ? `&sortBy=${sortBy}` : ""}${
        order ? `&sortOrder=${order}` : ""
      }`
    );
    return response.data;
  }
  static async getTutorCreatedProjects(
    tutorId: number,
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    order?: string
  ) {
    const response = await HTTPClient.get(
      `Projects/getProjectsCreatedByTutor/${tutorId}?page=${page}&limit=${limit}${
        search ? `&search=${search}` : ""
      }${sortBy ? `&sortBy=${sortBy}` : ""}${
        order ? `&sortOrder=${order}` : ""
      }`
    );
    return response.data;
  }

  static async getStudentChoices(studentId: number) {
    const response = await HTTPClient.get(
      `Projects/getStudentChoices/${studentId}`
    );
    return response.data;
  }
  static async getAllModules() {
    const response = await HTTPClient.get(`Projects/getAllModules`);
    return response.data;
  }

  static async removeProjectChoice(studentId: number, projectId: number) {
    const response = await HTTPClient.put(
      `Projects/removeProjectChoice/${studentId}/${projectId}`,
      undefined
    );
    return response.data;
  }
  static async rerankChoices(studentId: number, data: any) {
    const response = await HTTPClient.put(
      `Projects/updateProjectsRanks/${studentId}`,
      data
    );
    return response.data;
  }
  static async chooseProject(
    studentId: number,
    Createchoice: ChooseProjectDTO
  ) {
    const response = await HTTPClient.post(
      `Projects/chooseProject/${studentId}`,
      Createchoice
    );
    return response.data;
  }
  static async RequestAdminInput(data: RequestAdminInputDto) {
    const response = await HTTPClient.post(
      `Projects/conflicts/requestAdminInput`,
      data
    );
    return response.data;
  }
  static async AddAdminComment(data: any, id: number) {
    const response = await HTTPClient.put(
      `Projects/conflicts/addAdminComments/${id}`,
      data
    );
    return response.data;
  }
  static async getConflictComments(id: number) {
    const response = await HTTPClient.get(
      `Projects/conflicts/getConflictCommentByProject/${id}`
    );
    return response.data;
  }
  static async getAllAdminConflicts(adminId: number) {
    const response = await HTTPClient.get(
      `Projects/conflicts/getAllConflicts/${adminId}`
    );
    return response.data;
  }

  static async getProjectById(id: number) {
    const response = await HTTPClient.get(`Projects/getProjectById/${id}`);
    return response.data;
  }
  static async getConflictById(id: number) {
    const response = await HTTPClient.get(
      `Projects/conflicts/getConflict/${id}`
    );
    return response.data;
  }

  static async getStudentsForProject(id: number) {
    const response = await HTTPClient.get(
      `Projects/getStudentsAppsForProject/${id}`
    );
    return response.data;
  }

  static async createProject(data: any) {
    const response = await HTTPClient.post(`projects/createProject`, data);
    return response.data;
  }

  static async editProject(data: any, id: number) {
    const response = await HTTPClient.put(
      `/Projects/updateProject/${id}`,
      data
    );
    return response.data;
  }

  static async rateStatement(data: any, choiceId: number) {
    const response = await HTTPClient.put(
      `/Projects/rateStatementOfInterest/${choiceId}`,
      data
    );
    return response.data;
  }

  static async assignProjectToStudent(studentId: number, projectId: number) {
    const response = await HTTPClient.post(
      `Projects/assignProjectToStudent/${studentId}/${projectId}`,
      undefined
    );
    return response.data;
  }

  static async updateStudentChoiceStatus(data: any, choiceId: number) {
    const response = await HTTPClient.put(
      `/Projects/updateStudentChoiceStatus/${choiceId}`,
      data
    );
    return response.data;
  }
}
