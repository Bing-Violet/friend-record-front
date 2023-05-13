import { create } from "middleware-axios/dist";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";
import axios from "axios";

const cookies = new Cookies();
const accessToken = cookies.get("access_token");
const refreshToken = cookies.get("refresh_token");
const data = accessToken?jwt(accessToken):''

export const customAxios = create({
  baseURL: "http://127.0.0.1:8000/",
});
customAxios.use(async (config, next, defaults) => {
    if(data) {
        if (data.exp < Date.now() / 1000) {
            await getAccessTokenFromRefreshToken()
            defaults.headers.common["Authorization"] = `Bearer ${cookies.get("access_token")}`
            console.log("EXPIRED")
            await next(config)
          } else {
            defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
            await next(config)
          }
    }
});

async function getAccessTokenFromRefreshToken() {
  if (refreshToken) {
    try {
      await axios({
        method: "post",
        url: "/api/token/refresh/",
        data: {
          refresh: refreshToken,
        },
      }).then((res) => {
        cookies.set("access_token", res.data.access);
        cookies.set("refresh_token", res.data.refresh);
      });
    } catch (e) {
      console.log(e);
      throw "no valid token";
    }
  } else {
    throw "no valid token";
  }
}
