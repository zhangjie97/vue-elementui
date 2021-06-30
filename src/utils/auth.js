import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // 创建一个有效时间为7天的cookie
  //Cookies.set(name, value, { expires: 7 })
  return Cookies.set(TokenKey, token,{expires:7})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
