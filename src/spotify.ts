import { generatePkcePair } from "./lib/pkce";

const handleLogin = async() => {
    const {codeVerifier, codeChallenge} = await generatePkcePair();
    //Store the verifier in sessionStorage for later token exchange
    sessionStorage.setItem('spotify_code_verifier', codeVerifier);

    const clientID: string = import.meta.env.VITE_SPOTIFY_CL_ID
    const redirectURI: string = "http://127.0.0.1:5173/callback"
    const scopes: string[] = [
        'user-read-private',
        'user-library-read', 
        'playlist-read-private',
        'playlist-read-collaborative'
    ]
    const scopeString: string = scopes.join(' ')

    const authUrl = new URL("https://accounts.spotify.com/authorize")
    authUrl.search = new URLSearchParams({
        response_type: 'code',
        client_id: clientID,
        scope: scopeString,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectURI
    }).toString()
    //direct users to Spotify's Authorization page
    window.location.href = authUrl.toString()
}
export default handleLogin;
