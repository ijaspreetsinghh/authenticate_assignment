import React from "react";
import Search from "../icons/Search";

interface SearchBarProps {
  handleSubmit: () => void;
  setTitle: (v: any) => void;
}
function Searchbar({ handleSubmit, setTitle }: SearchBarProps) {
  const submit = (e: any) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form onSubmit={submit}>
      <div className='mt-8 flex items-center relative rounded-lg overflow-hidden '>
        <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
          <Search className='h-5 w-5 text-grey' />
        </span>
        <input
          placeholder='Search movie title here'
          prefix='e'
          className='border border-grey rounded-lg w-full h-12 pl-8 sm:pl-10   pr-[72px] sm:pr-[96px]  overflow-hidden  text-base'
          onChange={(v) => setTitle(v.target.value)}
        />
        <button
          className='absolute right-0 bg-red text-white rounded-lg px-4 sm:px-6 h-full'
          type='submit'>
          Search
        </button>
      </div>
    </form>
  );
}

export default Searchbar;
