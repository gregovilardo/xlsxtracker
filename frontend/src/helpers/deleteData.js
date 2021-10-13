import getCookie from "./getCookie";

const csrftoken = getCookie('csrftoken');

export async function deleteData(url) {
    const response = await fetch(`${url}/delete/`, {
        method: "POST",
        headers:{
            'X-CSRFToken': csrftoken,
            "Access-Control-Allow-Headers": ["X-CSRF-Token", "Access-Control-Allow-Headers"],
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            // "Content-Type": "application/json"
        },
        credentials: "include",
    })
    return response
}



