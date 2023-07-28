import { UserSessionAttributes } from "../types/User";

class TokenService {
  getLocalRefreshToken():string|null{
    let store = localStorage.getItem("user");
    if(store){
      let user = JSON.parse(store) as UserSessionAttributes;
      return user.refreshToken
    }
    return null
  }

  getLocalAccessToken():string|null{
    let store = localStorage.getItem("user");
    if(store){
      let user = JSON.parse(store) as UserSessionAttributes;
      return user.accessToken
    }
    return null
  }

  updateLocalAccessToken(token:string){
    let store = localStorage.getItem("user");
    if(store){
      let user = JSON.parse(store) as UserSessionAttributes;
      user.accessToken = token;
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  getUser():UserSessionAttributes|null{
    let store = localStorage.getItem("user");
    if(store) return JSON.parse(store) as UserSessionAttributes;
    else return null;
  }

  setUser(user:UserSessionAttributes){
    localStorage.setItem("user", JSON.stringify(user));
  }

  removeUser(){
    localStorage.removeItem("user");  
  }
}

export default new TokenService();