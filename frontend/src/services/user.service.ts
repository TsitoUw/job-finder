import { Signup } from "../types/User";
import axios from "./axios"

class UserService {
  signup(user: Signup) {
    return axios.post("/users/", user)
  }

  getUser(uid: string) {
    const url = "/users/" + uid;
    return axios.get(url);
  }
}

export default new UserService();