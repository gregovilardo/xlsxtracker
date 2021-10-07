import getCookie from "./getCookie";

const csrftoken = getCookie('csrftoken');

export async function fetchTokens(url){
    const response = await fetch(`${url}/api/auth/login`, {
        method: "GET",
        headers:{
            'X-CSRFToken': csrftoken,
            "Access-Control-Allow-Headers": ["X-CSRF-Token", "Access-Control-Allow-Headers"],
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        
        credentials: "include",
    })
    return response
}