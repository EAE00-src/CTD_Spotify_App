import React from "react";
import { Navigate } from "react-router";

interface Props {
    children: React.ReactNode;
}

export const RequireAuthParams: React.FC<Props> = ({children}) =>{
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code');
    const codeVerifier = sessionStorage.getItem('spotify_code_verifier')

    //This will help ensure that nobody skips a step without Spotify sending a code
        //Those that lack a code from Spotify will get bounced back to the Login page
    if(!code || !codeVerifier){
        return <Navigate to='/' replace />
    }
    return <>{children}</>
}