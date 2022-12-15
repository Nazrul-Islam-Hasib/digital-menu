require('dotenv').config();
import axios from "axios";

export default() => {
    return axios.create({
        baseURL: window.location.protocol+"//"+location.host.split(":")[0]+":9000/",
        headers: {
            Accept: "application./json",
            "content-type": "application/json"
        }
    });
};