import { useRouter } from "next/navigation";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
export type BreadCrumbItems = {
  breadCrumbText: string;
  breadCrumbPath: string;
};

interface BreadProps {
  breadCrumbItems?: BreadCrumbItems[];
  breadCrumbActiveItem: string;
}

export function BreadCrumbs({ breadCrumbItems, breadCrumbActiveItem }: BreadProps) {
  const router = useRouter();
  return (
    <div className='md:flex hidden gap-1 items-center text-[#00000045]'>
    
      {breadCrumbItems?.map((item, index) => (
        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => {
            router.push(item.breadCrumbPath);
          }}
          key={index}>
          {/* <ChevronRightIcon className='text-sm' /> */}
          <p className='text-sm font-semibold'>{item.breadCrumbText}</p>
        </div>
      ))}
      <ChevronRightIcon className="text-sm" />
      <p className='text-sm font-semibold'>{breadCrumbActiveItem}</p>
    </div>
  );
}
