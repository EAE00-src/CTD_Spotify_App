import React, {useEffect, useState} from "react";
import { getUserPlaylists, type SpotifyPlaylist } from "../lib/services/spotifyPlaylists";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";


const Library: React.FC = () => {
    const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    //fetch call for playlists
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const data = await getUserPlaylists();
                setPlaylists(data.items)
            } catch (error) {
                console.error(`Failed to GET playlists: ${error}`)
                toast.error('Failed to fetch playlists', {
                    icon: "❌"
                })
            } finally {
                setLoading(false)
            }
        }
        fetchPlaylists();
    }, [])
    if(loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <span className="loading loading-spinner"></span>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold tracking-tight">Your Playlists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {playlists.map((playlist) => (
                    <div onClick={() => navigate(`/library/playlist/${playlist.id}`)} key={playlist.id} className="card bg-base-200 shadow-md p-4 flex flex-col gap-2">
                        {playlist.images && playlist.images.length > 0 ? (
                            <img
                                src={playlist.images[0].url}
                                alt={playlist.name}
                                className="w-full aspect-square object-cover rounded-md"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full aspect-square bg-neutral rounded-md flex items-center justify-center text-neutral-content">
                                No Cover
                            </div>
                        )}
                        <h3 className="font-semibold truncate">{playlist.name}</h3>
                        {/**problem reading total property, excluded for now */}
                        {/*<p className="text-xs opacity-70">Tracks: playlist.tracks.total</p>*/}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Library;