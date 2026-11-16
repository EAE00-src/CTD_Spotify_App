import axios from "axios";
import type { AxiosInstance } from "axios";

const spotifyApi: AxiosInstance = axios.create({
    baseURL: 'https://api.spotify.com/v1',
});
//Request interceptors to automatically attach the token to every request
spotifyApi.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('spotify_access_token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})

export interface SpotifyUserProfile {
    display_name: string;
    images: {url: string; height: number; width: number}[];
    email: string; //deprecated on Spotify's end
    id: string
}

export const getUserProfile = async(): Promise<SpotifyUserProfile> => {
    const response = await spotifyApi.get<SpotifyUserProfile>('/me');
    return response.data
}