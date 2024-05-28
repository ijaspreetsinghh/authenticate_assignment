import { useEffect, useMemo, useState } from "react";
import Searchbar from "./components/Searchbar";
import WelcomeCard from "./components/WelcomeCard";
import Home from "./icons/Home";
import Bookmark from "./icons/Bookmark";
import User from "./icons/User";
import More from "./icons/More";
import LoginOverlay from "./components/LoginOverlay";
import Check from "./icons/Check";
import { moviesDB, usersDB } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

function App() {
  const [searchTitle, setSearchTitle] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = async () => {
    await searchMovies();
  };
  const storedWatchList = useLiveQuery(() => moviesDB.movies.toArray()); //reading all because no users signed in at first

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("home");
  const apiEndpoint = `https://www.omdbapi.com/?t=${searchTitle}&apikey=3c65f399`;

  const searchMovies = async () => {
    setIsLoading(true);
    await fetch(apiEndpoint)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const switchTab = (tab: string) => {
    setCurrentTab(tab);
  };

  const addBookmark = async ({
    title,
    year,
    poster,
    plot,
    imdbID,
  }: {
    title: string;
    year: string;
    poster: string;
    plot: string;
    imdbID: string;
  }) => {
    const doc = {
      _id: `${currentUser}-${imdbID}`,
      email: currentUser,
      imdbID: imdbID,
      title: title,
      year: year,
      poster: poster,
      plot: plot,
    };

    const it = storedWatchList?.find(
      (item) => item.email === currentUser && item.imdbID === imdbID
    );
    if (!it) {
      await moviesDB.movies.add({
        email: currentUser!,
        imdbID: imdbID,
        title: title,
        year: year,
        poster: poster,
        plot: plot,
      });
    } else {
      console.log("haigi aa");
    }
    console.log("it", it);
  };

  const deleteBookmark = async ({ imdbID }: { imdbID: string }) => {
    const id = storedWatchList?.find(
      (item) => item.email === currentUser && item.imdbID === imdbID
    );
    if (id) {
      console.log(id.id);
      moviesDB.movies.delete(id.id);
    }
  };

  const login = async (v?: string) => {
    setCurrentUser(v ?? email);
    setCurrentUser(v ?? email);
    setShowModal(false);

    if (email) {
      try {
        const id = await usersDB.users
          .where("email")
          .equals(v ?? email)
          .first();
        if (!id) {
          await usersDB.users.add({
            email: v ?? email,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const BookMarkViewComponent = ({
    title,
    poster,
    plot,
    year,
    imdbID,
  }: {
    title: string;
    poster: string;
    plot: string;
    year: string;
    imdbID: string;
  }) => {
    const handleAddBookmark = () => {
      if (!currentUser) {
        alert("Please Login first");
      } else {
        addBookmark({ title, poster, plot, year, imdbID });
      }
    };

    const handleDeleteBookmark = () => {
      if (!currentUser) {
        alert("Please Login first");
      } else {
        deleteBookmark({ imdbID });
      }
    };

    return (
      <div className='relative max-w-80 mx-auto border-2 border-lightGrey'>
        <div className='absolute p-6'>
          {storedWatchList?.find(
            (item) => item.email === currentUser && item.imdbID === imdbID
          ) ? (
            <Check
              className='text-white h-8 w-8 hover:text-green cursor-pointer'
              onClick={handleDeleteBookmark}
            />
          ) : (
            <Bookmark
              className='text-white h-8 w-8 hover:text-green cursor-pointer'
              onClick={handleAddBookmark}
            />
          )}
        </div>
        <div className='w-full bg-white min-w-64 min-h-52'>
          {poster.length > 5 ? (
            <img src={poster} alt='Poster' className='mx-auto flex' />
          ) : (
            <div className='bg-white text-black min-h-48 flex justify-center items-center align-middle'>
              No Poster Found
            </div>
          )}

          <div className='p-3'>
            <p className='text-xl font-medium'>{title}</p>
            <p className='text-base font-medium text-grey'>{year}</p>
            <p className='text-base font-medium text-grey'>{plot}</p>
          </div>
        </div>
      </div>
    );
  };

  const SideBar = () => {
    return (
      <div className='max-md:hidden flex   max-w-[220px] lg:max-w-72 border-r-[1px] border-lightGrey h-[100vh]'>
        <div className='p-4 md:p-6 lg:p-8 h-[100vh] overflow-y-auto min-h-96 '>
          <h1 className='text-red font-bold    text-3xl md:text-4xl lg:text-5xl justify-center items-center mx-auto flex'>
            Watchlists
          </h1>
          <div className='mt-8 h-[calc(100vh-192px)]'>
            <button
              className={`flex flex-row p-2.5  w-full rounded-lg items-center ${
                currentTab === "home" ? "bg-red text-white" : "text-black"
              }`}
              onClick={() => switchTab("home")}>
              <Home className='h-5 w-5  ' />
              <p className='text-base  ml-2 '>Home</p>
            </button>
            <hr className='w-full bg-grey h-[1px] my-4' />
            <button
              className={`flex flex-row p-2.5  w-full rounded-lg items-center ${
                currentTab === "watchlist" ? "bg-red text-white" : "text-black"
              }`}
              onClick={() => switchTab("watchlist")}>
              <Bookmark className='h-5 w-5  ' />
              <p className='text-base   ml-2 '>Watchlist</p>
            </button>
          </div>
          <div
            className='h-12  flex flex-row border-[1px] border-lightGrey px-2.5 rounded-lg items-center cursor-pointer '
            onClick={() => setShowModal(true)}>
            <User className='h-6 w-6  text-grey' />
            <p className='ml-2 text-base w-full '>{currentUser ?? "Guest"}</p>
            <More className='h-6 w-6  text-grey ' />
          </div>
        </div>
      </div>
    );
  };

  const TopBar = () => {
    return (
      <>
        <div className='max-md:flex hidden justify-between  flex-col sm:flex-row'>
          <div className=' pb-4  justify-center'>
            <div className=''>
              <h1 className='text-red font-bold text-center   text-2xl   justify-center items-center mx-auto flex'>
                Watchlists
              </h1>
            </div>
          </div>{" "}
          <div className='flex flex-col sm:flex-row mb-4'>
            <button
              className={`flex flex-row p-2.5  w-full rounded-lg items-center ${
                currentTab === "home" ? "bg-red text-white" : "text-black"
              }`}
              onClick={() => switchTab("home")}>
              <Home className='h-5 w-5  ' />
              <p className='text-base  ml-2 '>Home</p>
            </button>

            <button
              className={`flex flex-row p-2.5  w-full rounded-lg items-center ${
                currentTab === "watchlist" ? "bg-red text-white" : "text-black"
              }`}
              onClick={() => switchTab("watchlist")}>
              <Bookmark className='h-5 w-5  ' />
              <p className='text-base   ml-2 '>Watchlist</p>
            </button>
            <div
              className='h-12  flex flex-row border-[1px] border-lightGrey px-2.5 rounded-lg items-center cursor-pointer '
              onClick={() => setShowModal(true)}>
              <User className='h-6 w-6  text-grey' />
              <p className='ml-2 text-base w-full '>{currentUser ?? "Guest"}</p>
              <More className='h-6 w-6  text-grey ' />
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className='   flex flex-row  h-full w-full max-w-screen-2xl justify-center  mx-auto'>
        <SideBar />
        <div className='p-4 md:py-10 lg:px-16 w-full flex  flex-col h-[100vh] overflow-y-auto '>
          <TopBar />
          {currentTab === "home" ? (
            <>
              <div className=' '>
                <WelcomeCard />
                <div>
                  <Searchbar
                    handleSubmit={handleSubmit}
                    setTitle={setSearchTitle}
                  />
                </div>
                <div className='mt-8'>
                  {!isLoading && data !== null ? (
                    <BookMarkViewComponent
                      title={data["Title"]}
                      plot={data["Plot"]}
                      poster={data["Poster"]}
                      year={data["Year"]}
                      key={data["Title"]}
                      imdbID={data["imdbID"]}
                    />
                  ) : !isLoading && data == null ? (
                    <p className='text-lg justify-center items-center mx-auto w-full flex min-h-24 '>
                      Search movile title
                    </p>
                  ) : (
                    <p className='text-lg justify-center items-center mx-auto w-full flex min-h-24 '>
                      Loading
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className=''>
                <div className='text-2xl sm:text-4xl lg:text-5xl font-medium'>
                  My Watchlist
                </div>

                <div className='mt-8 grid grid-flow-row	md:grid-cols-2 xl:grid-cols-3 	  gap-3 mx-auto justify-center items-start    '>
                  {storedWatchList
                    ?.filter((item) => item.email === currentUser)
                    .map((item) => (
                      <div key={item.id} className='mb-8'>
                        <BookMarkViewComponent
                          title={item.title}
                          plot={item.plot}
                          poster={item.poster}
                          year={item.year}
                          key={item.id}
                          imdbID={item.imdbID}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <LoginOverlay
        onSubmit={login}
        setEmail={setEmail}
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </>
  );
}

export default App;
