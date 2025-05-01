import { ITutorRecentActivity, ProjectEvents } from "@/models/proposal.model";
import { formatDate } from "@/utils/helpers";

export default function RecentActivityCard({
  className,
  item,
}: {
  className: string;
  item: ITutorRecentActivity;
}) {
  const handleDynamictexts = (actionType: string) => {
    switch (actionType) {
      case ProjectEvents.PROPOSAL_SUBMITTED:
        return `${item.student!.user?.name} submitted a proposal to you for ${
          item.proposal!.title
        } `;
      case ProjectEvents.PROPOSAL_ACCEPTED:
        return `You accepted a proposal submitted by ${
          item.student!.user?.name
        }`;
      case ProjectEvents.PROPOSAL_WITHDRAWN:
        return `${item.student!.user?.name} has withdrawn a proposal for ${
          item.proposal!.title
        }`;
      case ProjectEvents.PROJECT_CREATED:
        return `You created a project: ${item.project!.title}`;
      case ProjectEvents.PROJECT_ASSIGNED:
        return `You assigned a project: ${item.project!.title} to ${
          item.student!.user?.name
        }`;
      case ProjectEvents.PROPOSAL_REJECTED:
        return `you accepted a proposal submitted by ${
          item.student!.user?.name
        }`;
      case ProjectEvents.APPLIED_FOR_PROJECT:
        return `${item.student!.user?.name} has applied for a project ${
          item.project!.title
        }`;

      default:
        return "";
    }
  };

  return (
    <div className={className}>
      <p className="text-sm font-[400]">
        {handleDynamictexts(item.actionType)}
      </p>
      <p className="text-[#00000040] text-xs">{formatDate(item.createdAt)}</p>
    </div>
  );
}
