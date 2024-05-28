import Bookmark from "../icons/Bookmark";

function WelcomeCard() {
  return (
    <>
      <div className='border border-red rounded-lg  w-full flex flex-col  '>
        <div className='p-3 md:p-6  flex flex-col w-full '>
          <div className='mt-2 flex items-center'>
            <p className='text-2xl sm:text-4xl lg:text-5xl font-medium'>
              Welcome to
              <strong className='text-red font-semibold'>
                &nbsp; Watchlists
              </strong>
            </p>
          </div>

          <p className=' mt-4 sm:mt-6 md:mt-8 lg:mt-10 text-base sm:text-xl md:text-2xl'>
            Browse movies, add them to watchlists and share them with friends.
          </p>
          <div className='flex items-center'>
            <p className='text-base sm:text-xl md:text-2xl'>
              Just click the
              <span className='inline-flex items-center translate-y-2'>
                <Bookmark className='mt-1 mx-1 h-6 md:h-8 w-6 md:w-8' />
              </span>
              to add a movie, the poster to see more details and to mark the
              movie as watched.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default WelcomeCard;
