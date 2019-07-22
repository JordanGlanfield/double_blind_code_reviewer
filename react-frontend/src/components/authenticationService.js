const ACCESS_TOKEN = 'currentUser'
const REFRESH_TOKEN = 'currentUserRefresh'


function storeTokens({access_token, refresh_token}) {
    sessionStorage.setItem(ACCESS_TOKEN, access_token)
    sessionStorage.setItem(REFRESH_TOKEN, refresh_token)
}

function removeTokens() {
    sessionStorage.removeItem(ACCESS_TOKEN)
    sessionStorage.removeItem(REFRESH_TOKEN)
}

async function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    }

    const response = await fetch('/login', requestOptions)
    if (response.ok) {
        const tokens = await response.json()
        storeTokens(tokens)
        return true
    }
    return false
}

function logout() {
    removeTokens()
}

function userIsLoggedIn() {
    return sessionStorage.getItem(ACCESS_TOKEN) !== null
}

export default {
    login,
    logout,
    userIsLoggedIn
}