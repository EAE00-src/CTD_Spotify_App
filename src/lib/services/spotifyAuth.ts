import axios from "axios";

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

interface TokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
}

export const tokenExchange = async (
    code: string,
    codeVerifier: string,
    clientId: string,
    redirectUri: string
): Promise<TokenResponse> => {
    const params = new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
    })
    const response = await axios.post<TokenResponse>(TOKEN_ENDPOINT, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data
};