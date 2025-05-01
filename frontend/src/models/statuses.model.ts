export enum ChoiceStatus {
    APPLIED = 'APPLIED', // The student has submitted a request for a project.
    UNDER_REVIEW = 'UNDER_REVIEW', // The tutor is reviewing the student's application.
    SHORTLISTED = 'SHORTLISTED', // The student is among the top candidates but not yet confirmed.
    ALLOCATED = 'ALLOCATED', // The student has been assigned to the project.
    NOT_SELECTED = 'NOT_SELECTED', // The student was not selected for this project.
    WITHDRAWN = 'WITHDRAWN' // The student has removed their application from this project.
  }

  export enum ProjectStatus {
    ASSIGNED = 'ASSIGNED',
    ACTIVE = 'ACTIVE',
    DRAFT = 'DRAFT',
  }

  export enum ProposalStatus {
    PENDING = 'PENDING', // Proposal is submitted and awaiting review
    APPROVED = 'APPROVED', // Proposal has been approved by the tutor
    REJECTED = 'REJECTED', // Proposal has been rejected by the tutor
    UNDER_REVIEW = 'UNDER_REVIEW', // Proposal is currently being reviewed
    WITHDRAWN = 'WITHDRAWN', //// Proposal has been withdrawn by student
  }