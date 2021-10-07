export async function createUser(username, email, password, url){
    const data = {username: username, password:password, email:email}
    const response = await fetch(`${url}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify(data),
        headers:{
            "Content-Type": "application/json"
        }
    })
    return response.json()
}