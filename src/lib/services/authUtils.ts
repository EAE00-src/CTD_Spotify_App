import type { NavigateFunction } from "react-router";

export const performLogout = (navigate: NavigateFunction) =>{
    //Clear all Spotify-related items from session storage
    sessionStorage.removeItem('spotify_access_token');
    sessionStorage.removeItem('spotify_refresh_token');
    sessionStorage.removeItem('spotify_code_verifier');

    //redirect back to the public login page and replace history
    navigate('/', {replace: true})
}