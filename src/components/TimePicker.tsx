import React, { Dispatch } from "react";

interface ITimer {
  selectedTime: string;
  setSelectedTime: Dispatch<string>;
}

export default function TimePicker({ selectedTime, setSelectedTime }: ITimer) {
  // const [open, setOpen] = useState(false);
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
  };
  // return (
  //   <div className="w-[16rem]">
  //     <button
  //       className="text-blue-700 dark:text-blue-500 text-base font-medium hover:underline p-0 inline-flex items-center mb-2"
  //       onClick={() => setOpen((prev) => !prev)}
  //     >
  //       Select time
  //       <svg
  //         className="w-8 h-8 ms-0.5"
  //         aria-hidden="true"
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="24"
  //         height="24"
  //         fill="none"
  //         viewBox="0 0 24 24"
  //       >
  //         <path
  //           stroke="currentColor"
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth="2"
  //           d="m8 10 4 4 4-4"
  //         />
  //       </svg>
  //     </button>
  //     <div
  //       className={`bg-primary absolute max-w-[16rem] mx-auto grid grid-cols-2 gap-4 mb-2 ${open ? "block" : "hidden"} z-10`}
  //     >
  //       <div>
  //         <div className="relative">
  //           <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
  //             <svg
  //               className="w-4 h-4 text-gray-500 dark:text-gray-400"
  //               aria-hidden="true"
  //               xmlns="http://www.w3.org/2000/svg"
  //               fill="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 fillRule="evenodd"
  //                 d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
  //                 clipRule="evenodd"
  //               />
  //             </svg>
  //           </div>
  //           <input
  //             type="time"
  //             id="start-time"
  //             className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  //             value={selectedTime}
  //             onChange={handleTimeChange}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="w-[5rem]">
      <div className="relative">
        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-[8px] pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="time"
          id="time"
          placeholder="HH:mm"
          className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={selectedTime}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
}
