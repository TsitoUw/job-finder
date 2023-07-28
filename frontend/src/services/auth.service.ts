import axios from "./axios";
import TokenService from "./TokenService";

class AuthService {
  async signin(uid: string, password: string) {
    const response = await axios
      .post("/auth/signin", {
        uid,
        password
      });
    if (response.data.accessToken) {
      const store = {
        accessToken:response.data.accessToken,
        refreshToken: response.data.refreshToken,
        uid: response.data.user.id
      }
      TokenService.setUser(store);
    }
    return response;
  }

  signout() {
    axios
      .post("/auth/signout", {
        token: TokenService.getLocalRefreshToken(),
      })
      .then(() => {
        TokenService.removeUser();
      })
      .catch((err) => {
        console.log(err)
      })
  }

  test() {
    axios
      .post("/auth/test", {
        token: TokenService.getLocalRefreshToken(),
      })
      .then((res)=>{
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
  }

}

export default new AuthService();