import React, { FormEvent, useEffect, useState } from "react";
import Close from "../icons/Close";
import { usersDB } from "../db";
import { useLiveQuery } from "dexie-react-hooks";

function LoginOverlay({
  onSubmit,
  showModal,
  setShowModal,
  setEmail,
}: {
  onSubmit: (v?: string) => void;
  showModal: boolean;
  setShowModal: (e: boolean) => void;
  setEmail: (v: string) => void;
}) {
  useEffect(() => {
    const getAllUsers = async () => {
      // const data = await wDb.allDocs();
      // setAllUsers(data);
      // console.log(users);
    };
    getAllUsers();
  }, []);
  const users = useLiveQuery(() => usersDB.users.toArray());

  return (
    <>
      {showModal && (
        <div className='absolute  top-0 w-[100vw] h-[100vh] bg-black bg-opacity-50 z-10 items-center text-center '>
          <div className='absolute min-w-64 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[500px] bg-white p-4 rounded-lg overflow-y-auto '>
            <p className='text-lg font-medium flex flex-row justify-center '>
              Login to watchlist
              <Close
                className='h-5 w-5 ml-2  translate-y-1 cursor-pointer'
                onClick={() => setShowModal(false)}
              />
            </p>

            <div className='mt-4 flex items-center relative rounded-lg overflow-hidden '>
              <input
                placeholder='Enter email here'
                prefix='e'
                className='border border-grey rounded-lg w-full h-12 pl-3.5   pr-[72px] sm:pr-[96px]  overflow-hidden  text-base'
                onChange={(v) => setEmail(v.target.value)}
              />
              <button
                className='absolute right-0 bg-red text-white rounded-lg px-4 sm:px-6 h-full'
                onClick={() => {
                  onSubmit();
                }}>
                Login
              </button>
            </div>

            <p className='my-2 text-base font-medium text-grey'>
              or choose saved
            </p>
            {users &&
              users.map((user: any) => (
                <div
                  key={user.id}
                  className='mb-2 rounded-lg border-[1px] border-lightGrey hover:bg-lightGrey p-2 text-base cursor-pointer'
                  onClick={() => {
                    onSubmit(user.email);
                  }}>
                  {user.email}
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default LoginOverlay;
