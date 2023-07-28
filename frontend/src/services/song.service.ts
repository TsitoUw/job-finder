import { SongAttributes, SongMassive } from "../types/Song";
import axios from "./axios";

export interface SongQuery {
  user?: string;
  search?: string;
}

class SongService {
  async get({ user, search }: SongQuery = {}) {
    const userQuery = user ? `user=${user}&` : ''
    const searchQuery = search ? `search=${search}&` : ''

    const query = searchQuery;

    const res: any = await axios.get("/songs?" + query)
    return res.data.songs as Array<SongMassive>;
  }

  playThis(song: SongMassive, state: {
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  } | null, songContext: {
    currentSong: SongAttributes | SongMassive | null;
    setCurrentSong: React.Dispatch<React.SetStateAction<SongAttributes | SongMassive | null>>;
  } | null) {
    if (state?.isPlaying && song.filename === songContext?.currentSong?.filename) {
      state.setIsPlaying(isPlaying => !isPlaying);
    } else {
      const payload: SongMassive = {
        artist: song.artist,
        title: song.title,
        artwork: song.artwork,
        filename: song.filename,
      };
      songContext?.setCurrentSong(payload);
    }
  }
}
export default new SongService();