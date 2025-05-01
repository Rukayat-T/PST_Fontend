import { CreateUserDto } from "@/models/onboarding.model";
import HTTPClient from "../http_instance/wrapped_instance";
import { CreateProposalDto } from "@/models/proposal.model";

export default class ProposalsService {
  static async getAllStudentsProposals(studentId: number) {
    const response = await HTTPClient.get(
      `proposal/getAllStudentsProposals/${studentId}`
    );
    return response.data;
  }

  static async proposeProject(data: CreateProposalDto) {
    const response = await HTTPClient.post(`proposal/createProposal`, data);
    return response.data;
  }

  static async getAllTutorsProposals(id: number) {
    const response = await HTTPClient.get(
      `proposal/getAllTutorsProposals/${id}`
    );
    return response.data;
  }

  static async getProposalById(id: number) {
    const response = await HTTPClient.get(`proposal/getProposal/${id}`);
    return response.data;
  }

  static async approveProposal(tutorId: number, proposalId: number) {
    const response = await HTTPClient.put(
      `proposal/approveProposal/${tutorId}/${proposalId}`,
      undefined
    );
    return response.data;
  }
  static async updateProposalStatus(proposalId: number, status: string) {
    const response = await HTTPClient.put(
      `/proposal/updateProposalStatus/${proposalId}/${status}`,
      undefined
    );
    return response.data;
  }

  static async rejectProposal(tutorId: number, proposalId: number) {
    const response = await HTTPClient.put(
      `proposal/rejectProposal/${tutorId}/${proposalId}`,
      undefined
    );
    return response.data;
  }

  static async withdrawProposal(studentId: number, proposalId: number) {
    const response = await HTTPClient.put(
      `proposal/withdrawProposal/${studentId}/${proposalId}`,
      undefined
    );
    return response.data;
  }
}
