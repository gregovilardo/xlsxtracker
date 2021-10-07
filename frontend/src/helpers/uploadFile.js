import getCookie from "./getCookie";


const csrftoken = getCookie('csrftoken');


export async function uploadFile(url, file){
    const response = await fetch(`${url}/tracker/`, {
        method: "POST",
        body: file,
        headers:{
            'X-CSRFToken': csrftoken,
            "Access-Control-Allow-Headers": ["X-CSRF-Token", "Access-Control-Allow-Headers"],
        },
        
        credentials: "include",
    })
    return response
}

// change localhost for the env var