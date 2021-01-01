import fetch from "node-fetch";
import {Signage} from "./type";
export const postWebSignage = async (data:Signage): Promise<boolean> => {
    return fetch("https://us-central1-web-digital-signage.cloudfunctions.net/addInterruptPage", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return true;
    }).catch(e=>{
        throw new Error(e)
    })
}