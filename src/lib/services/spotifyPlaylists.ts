import { spotifyApi } from "./spotifyApi";
//Playlist interfaces and GET request function
export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string | null;
    images: {url: string; height: number | null; width: number | null}[];
    tracks: {total: number};
    owner: {display_name: string; id: string};
}
export interface SpotifyPlaylistsResponse {
    items: SpotifyPlaylist[];
    total: number;
    limit: number;
    offset: number;
}

export const getUserPlaylists = async (): Promise<SpotifyPlaylistsResponse> => {
    //Sends a GET request to Spotify's API
    const response = await spotifyApi.get<SpotifyPlaylistsResponse>('/me/playlists')
    return response.data
}

//Individual song within playlist interfaces and GET request function
export interface SpotifyArtist {
    id: string;
    name: string;
}
export interface SpotifyAlbum {
    id: string;
    name: string;
    images: {url: string; height: number; width: number}[];
}
export interface SpotifyTrack {
    id: string;
    name: string;
    duration_ms: number;
    preview_url: string | null; //30-sec audio previews provided by Spotify
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
    uri: string;
}
export interface PlaylistTrackItem {
    track: SpotifyTrack;
}
export interface PlaylistTracksResponse{
    items: PlaylistTrackItem[];
    total: number;
}

//axios fetch method
export const getPlaylistTracks = async(playlistId: string): Promise<PlaylistTracksResponse> => {
    const response = await spotifyApi.get<PlaylistTracksResponse>(`/playlists/${playlistId}/tracks`);
    return response.data
}