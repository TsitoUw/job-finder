import { SongAttributes } from "./Song";

export default interface UserAttributes {
  id: string;
  name:string;
  artistname:string;
  username:string;
  photo?:string;
  email: string;
}

export interface Signin {
  email:string;
  password:string;
}
export interface Signup {
  name?:string;
  artistname:string;
  username:string;
  photo?:string;
  email:string;
  password:string;
  passwordConfirmation: string;
}

export interface UserSessionAttributes {
  uid: string;
  accessToken: string;
  refreshToken: string;
  lastListenedSong?:SongAttributes
}