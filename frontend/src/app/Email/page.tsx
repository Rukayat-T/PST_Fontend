import React from "react";
import Image from "next/image";

function Email() {
  return (
    <>
      <div className='flex items-center justify-center h-screen w-screen'>
        <div className='mainBody border-[3px] border-darkPurple rounded-lg p-8 w-[35%]'>
          <div className='astonLogo flex flex-col items-center justify-center'>
            <Image src='/images/astonMainLogo.png' alt='Aston logo' priority width={250} height={100} className='mb-8 mt-10' />
          </div>
          <div className='mailBody'>
            <div className='greeting mb-5'>Dear John Doe,</div>
            <div className='flex flex-col items-center justify-center'>
              <div className='messageTitle font-bold mb-2'>You have a new project proposal await your view</div>
              <div className='purpleSec rounded-lg py-8 px-10 bg-lightPurple-20 flex flex-col gap-y-8 justify-center mb-5'>
                <div className='projectTitle flex gap-5'>
                  <span className='font-bold'>Proposal Title:</span> Sudent Journal Application
                </div>
                <div className='description flex gap-5'>
                  <span className='font-bold'>Description:</span> Project to create a journal application for university students.
                </div>
                <div className='projectStatus flex gap-5'>
                  <span className='font-bold'>Proposal Status:</span> Pending
                </div>
              </div>
              <div className='reviewMessage font-bold mb-5'>Please review the student’s proposal and make a decision.</div>
              <div className='reviewLink'>
                <button className='bg-lightPurple-20 border-[1.5px] border-darkPurple rounded-lg py-1 px-3 font-semibold'>Click to review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Email;
