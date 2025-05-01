import { CreateUserDto } from "@/models/onboarding.model";
import HTTPClient from "../http_instance/wrapped_instance";
import { ChooseProjectDTO } from "@/models/proposal.model";

export default class DashboardService {
  static async getTutorMetric(id: number) {
    const response = await HTTPClient.get(`/tutorDashboard/getMetrics/${id}`);
    return response.data;
  }
  static async getAdminMetric(id: number) {
    const response = await HTTPClient.get(`/adminDashboard/getMetrics/${id}`);
    return response.data;
  }
  static async getTutorRecentActivities(id: number) {
    const response = await HTTPClient.get(
      `/tutorDashboard/getRecentActivities/${id}`
    );
    return response.data;
  }
  static async getTutorPopularProjects(id: number) {
    const response = await HTTPClient.get(
      `/tutorDashboard/getPopularProjects/${id}`
    );
    return response.data;
  }
  static async getAdminPopularProjects() {
    const response = await HTTPClient.get(`/adminDashboard/getPopularProjects`);
    return response.data;
  }
  static async getAdminAppCountByWeek() {
    const response = await HTTPClient.get(
      `/adminDashboard/application_count-by-week`
    );
    return response.data;
  }
  static async getTutorAppCountByWeek() {
    const response = await HTTPClient.get(
      `/tutorDashboard/application_count-by-week`
    );
    return response.data;
  }
  static async getTutorStatusDistribution(id: number) {
    const response = await HTTPClient.get(
      `/tutorDashboard/getProjectStatusDistribution/${id}`
    );
    return response.data;
  }
  static async getAdminStatusDistribution() {
    const response = await HTTPClient.get(
      `/adminDashboard/getAllocationDistribution`
    );
    return response.data;
  }
}
