import axios from "axios";
const serverURL = "http://localhost:4000"
const postData = async (url:any, body:any) => {
    try {
        var response = await axios.post(`${serverURL}/${url}`, body)
        var data = response.data
        return data
    }
    catch(e) {
        return null
    }
}
const getData = async (url:any) => {
    try {
        var response = await axios.get(`${serverURL}/${url}`)
        var data = response.data
        return data
    }
    catch(e) {
        return null
    }
}
export { serverURL, postData, getData }