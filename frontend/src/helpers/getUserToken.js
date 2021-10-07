import getCookie from "./getCookie";


const csrftoken = getCookie('csrftoken');


export async function getUserToken(username, password, url){
    const data = {username: username, password:password}
    const response = await fetch(`${url}/api/auth/login`, {
        method: "POST",
        body: new URLSearchParams(data),
        headers:{
            'X-CSRFToken': csrftoken,
            "Access-Control-Allow-Headers": ["X-CSRF-Token", "Access-Control-Allow-Headers"],
            // 'Access-Control-Allow-Origin': 'include',
            // 'Content-Type': 'application/json'
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        
        // withCredentials: true,
        credentials: "include",
    })
    return response
}

// change localhost for the env var