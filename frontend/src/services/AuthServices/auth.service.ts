import { CreateUserDto } from "@/models/onboarding.model";
import HTTPClient from "../http_instance/wrapped_instance";

export default class AuthorizationServices {
  // static async CreateStudentUser(data: CreateUserDto) {
  //   const response = await HTTPClient.post(`/Auth`, data);
  //   return response.data;
  // }
  // static async CreateTutorUser(data: CreateUserDto) {
  //   const response = await HTTPClient.post(`/Auth`, data);
  //   return response.data;
  // }
  static async LoginUser(data: CreateUserDto) {
    const response = await HTTPClient.post(`/Auth/login`, data);
    return response.data;
  }

  static async GetStudentChoices(studentId: number) {
    const response = await HTTPClient.get(
      `/Projects/getStudentChoices/${studentId}`
    );
    return response.data;
  }
  static async GetStudent(studentId: number) {
    const response = await HTTPClient.get(
      `/Auth/getStudentProfile/${studentId}`
    );
    return response.data;
  }
  static async GetAllStudent(
    pageNo: number,
    pageSize: number,
    search?: string,
    allocated?: string
  ) {
    const response = await HTTPClient.get(
      `/Auth/getAllStudents?page=${pageNo}&limit=${pageSize}${
        search ? `&search=${search}` : ""
      }${allocated ? `&allocated=${allocated}` : ""}`
    );
    return response.data;
  }
  static async GetAllAdmins() {
    const response = await HTTPClient.get(`/Auth/getAllAdmins`);
    return response.data;
  }
  static async getAllTutors() {
    const response = await HTTPClient.get(`/Auth/getAllTutors`);
    return response.data;
  }
}
