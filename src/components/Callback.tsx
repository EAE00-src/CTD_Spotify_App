import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { tokenExchange } from "../lib/services/spotifyAuth";


const Callback: React.FC = () => {
    const [error, SetError] = useState<string | null>(null);
    const navigate = useNavigate();

    //Creating a ref flag to prevent double-firing of POST requests to Spotify's API to prevent odd behavior
    const hasFetchedToken = useRef<boolean>(false)

    useEffect(() => {
        const handleCallback = async () => {
            //if already attempted, exit immediately
            if(hasFetchedToken.current) return;
            hasFetchedToken.current = true;
            //Parse the URL query parameters
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const errorParam = urlParams.get('error')

            console.log("URL Code parsed successfully")

            if(errorParam){
                const msg: string = `Spotify authorization failed: ${errorParam}`
                console.error(msg)
                SetError(msg)
                toast.error(msg)
                return;
            }
            if(!code){
                const msg: string = 'No authorization code found in URL.'
                console.error(msg)
                SetError(msg)
                toast.error(msg)
                return
            }
            const codeVerifier = sessionStorage.getItem('spotify_code_verifier')
            console.log("Code verifier confirmed:", codeVerifier ? "EXISTS" : "MISSING");
            if(!codeVerifier){
                const msg: string = 'Missing code verifier in session storage'
                console.error(msg)
                SetError(msg)
                toast.error(msg)
                return
            }
            //Exchange the authorization code for tokens
            const clientID: string = import.meta.env.VITE_SPOTIFY_CL_ID
            const redirectURI: string = `${window.location.origin}/callback`

            console.log("Attempting token exchange...");

            //attempt token exchange
            try {
                const data = await tokenExchange(code, codeVerifier, clientID, redirectURI)
                console.log("Token exchange SUCCESS")
                //Store tokens securely
                if(data.access_token) sessionStorage.setItem('spotify_access_token', data.access_token)
                if(data.refresh_token) sessionStorage.setItem('spotify_refresh_token', data.refresh_token)

                //Clean up temporary verifier
                sessionStorage.removeItem('spotify_code_verifier')

                //clean URL & route back home
                window.history.replaceState({}, document.title, window.location.pathname)
                navigate('/library')
                toast.success('Login successful!', {
                    icon: '✅'
                })
            } catch (err: any) {
                const errorMessage = err.response?.data?.error_description || err.message || 'Token exchange failed. ❌'
                SetError(errorMessage);
                toast.error(errorMessage)
            }
        };
        handleCallback();
    }, [navigate])

    if (error){
        toast.error(error)
        return (
            <div className="flex flex-col items-center justify-center h-full w-full text-error">
                <p className="text-5xl">{error}</p>
                <button onClick={() => navigate('/')} className="mt-4 btn btn-error">
                    Return to Login
                </button>
            </div>
        )
    }
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-accent text-xl loading loading-dots">Authenticating with Spotify...</p>
        </div>
    )
}

export default Callback;