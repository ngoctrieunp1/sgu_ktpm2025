import {jwtDecode} from "jwt-decode"


export const setToken=(token)=>{
    localStorage.setItem("__token__",token)

}

export const removeToken=()=>{
    localStorage.removeItem("__token__")
}

export const getToken=()=>{
  const token=  localStorage.getItem("__token__")
  return token
}

export const getUser=()=>{
  const token=getToken()
  const res=jwtDecode(token)
  console.log(res.sub);
}
