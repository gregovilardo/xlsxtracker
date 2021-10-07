export async function getTracker(type, url) {
    const response = await fetch(`${url}/${type}/`, {
        method: "GET",
        credentials: "include",
    })
    return response
}



