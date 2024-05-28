import Dexie, { Table } from "dexie";

export interface Users {
  id?: number;
  email: string;
}
export interface Movies {
  id?: number;
  email: string;
  title: string;
  poster: string;
  plot: string;
  year: string;
  imdbID: string;
}
export class MyUsersDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  users!: Table<Users>;

  constructor() {
    super("watchlist");
    this.version(1).stores({
      users: "++id, email", // Primary key and indexed props
    });
  }
}
export class MyMovieDexie extends Dexie {
  movies!: Table<Movies>;

  constructor() {
    super("movies");
    this.version(1).stores({
      movies: "++id, email, title, poster, plot, year, imdbID",
    });
  }
}

export const usersDB = new MyUsersDexie();
export const moviesDB = new MyMovieDexie();
