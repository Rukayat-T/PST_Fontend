import { ITutorPopularProject } from "@/models/proposal.model";

export default function PopularProjectCard({
  item,
  className,
}: {
  item: ITutorPopularProject;
  className: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm font-[400]">{item.projectTitle}</p>
      <div className="flex items-center text-xs justify-between">
        <p className="text-[#00000040]">{item.popularity} Applications</p>
        <p className="text-[#00000040]">+{item.popularity} this week</p>
      </div>
    </div>
  );
}
