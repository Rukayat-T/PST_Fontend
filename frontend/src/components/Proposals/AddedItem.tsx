import CancelIcon from "@mui/icons-material/Cancel";
type ItemProps = {
  onClick: () => void;
  item: string;
};
export default function AddedItem({ onClick, item }: ItemProps) {
  return (
    <div className="relative w-fit h-fit bg-lightPurple-20 text-xs text-darkPurple px-3 py-1 rounded-lg">
      <CancelIcon
        className="absolute top-[-5px] right-0 cursor-pointer"
        style={{
          fontSize: 12,
        }}
        onClick={() => onClick()}
      />
      {item}
    </div>
  );
}
