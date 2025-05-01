import { CustomTableHeader } from "@/models/proposal.model";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Menu } from "@base-ui-components/react/menu";
type TableProps = {
  headers: CustomTableHeader[];
  render: () => React.ReactNode;
};

export default function CustomTable({ headers, render }: TableProps) {
  return (
    <table className='rounded-xl w-full'>
      <thead>
        <tr className='bg-lightPurple-20  '>
          {headers.map((item, index) => (
            <th key={index} className={`font-normal ${index === 0 ? "text-left px-5 " : "text-center "}`}>
              <div className={`flex w-full items-center gap-1 ${index === 0 ? "text-left  " : "text-center justify-center"}`}>
                <p>{item.name}</p>
                {item.sortable && (
                  <>
                    <Menu.Root>
                      <Menu.Trigger>
                        <ExpandMoreIcon className='cursor-pointer' />
                      </Menu.Trigger>
                      <Menu.Portal>
                        <Menu.Positioner sideOffset={8}>
                          <Menu.Popup className='bg-white border py-2 rounded-lg'>
                            {item.sortable &&
                              item.sortValues &&
                              item.sortValues.map((sorter, index) => (
                                <Menu.Item
                                  key={index}
                                  className='bg-white hover:bg-[#fafafa] p-2 cursor-pointer'
                                  onClick={() => {
                                    if (item.sortFunction) {
                                      item.sortFunction(item.name.toLowerCase(), sorter.toUpperCase());
                                    }
                                  }}>
                                  {sorter}
                                </Menu.Item>
                              ))}
                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.Root>
                  </>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{render()}</tbody>
    </table>
  );
}
