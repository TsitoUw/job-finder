import axios from "axios";
import TokenService from "./TokenService"
import { baseUrl } from "../config/api";

// instanciate axios with api url and headers
const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  }
})

// add token on Authorizatiion so we don't have to do it manually each time
instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// try getting new Access token when the actual expires
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/auh/signin" && err.response) {
      // Access Token expired
      if (err.response.status === 403 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await instance.post("/auth", {
            token: TokenService.getLocalRefreshToken()
          });

          const { accessToken } = rs.data;
          TokenService.updateLocalAccessToken(accessToken);

          return instance(originalConfig);
        }catch (_error) {
          return Promise.reject(_error)
        }
      } 
    }
    return Promise.reject(err);
  }
)

export default instance;