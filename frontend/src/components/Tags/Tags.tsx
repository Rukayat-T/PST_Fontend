import React from "react";

function Tags({ tag }: { tag: any }) {
  return (
    <>
      <div className='border border-darkPurple  h-fit px-[5px] flex items-center rounded-[4px] text-xs bg-lightPurple-20 whitespace-nowrap'>{tag}</div>
    </>
  );
}

export default Tags;
