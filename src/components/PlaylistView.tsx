import React, {useEffect, useState} from "react";
import { getPlaylistTracks, type SpotifyTrack } from "../lib/services/spotifyPlaylists";
import toast from "react-hot-toast";
import { useOutletContext, useParams } from "react-router";

interface OutletContextType {
    setCurrentTrack: (track: SpotifyTrack) => void;
    setQueue: (tracks: SpotifyTrack[]) => void;
}


const PlaylistView: React.FC = () => {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    //const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null> (null);

    //Pull the global player setters from the layout outlet context
    const {setCurrentTrack, setQueue} = useOutletContext<OutletContextType>()
    const {playlistId} = useParams<{playlistId: string}>();

    //utilize fetch call
    useEffect(() => {
        const fetchTracks = async () => {

            
            try {
                setLoading(true);
                const data = await getPlaylistTracks(playlistId!);
                
                //Extract the inner track object from each playlist item
                const extractedTracks = data.items.map((track) => track.item).filter(Boolean)
                setTracks(extractedTracks)
                //update the global player queue in the layout
                setQueue(extractedTracks)

                if(extractedTracks.length > 0){
                    setCurrentTrack(extractedTracks[0]);
                }
            } catch (error) {
                console.error(`Failed to fetch playlist tracks: ${error}`)
                toast.error('Failed to fetch playlist tracks', {
                    icon: "❌"
                })
            } finally {
                setLoading(false)
            }
            
        }
        if(playlistId) {
                fetchTracks();
            }
    }, [playlistId, setQueue, setCurrentTrack])

    if(loading) {
        return <div className="w-full h-full flex justify-center items-center loading loading-infinity">Loading...</div>
    }

    return(
        <div className="p-6 flex flex-col h-full gap-6">
            <h2 className="text-2xl font-bold">Playlist Tracks</h2>
            {/**Track listing Table/List */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                {tracks.map((track, index) => (
                    <div 
                        key={track.id || index}
                        onClick={() => setCurrentTrack(track)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-base-200 transition-colors`}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-sm opacity-60 w-6 text-right">{index + 1}</span>
                            {track.album?.images?.[0]?.url && (
                                <img src={track.album.images[0].url} alt={track.name} className="w-10 h-10 rounded object-cover" />
                            )}
                            <div>
                                <p className="font-semibold text-sm truncate">{track.name}</p>
                                <p className="text-xs opacity-70 truncate">{track.artists.map(char => char.name).join(', ')}</p>
                            </div>
                            {/**Right side: Duration + Open in Spotify Link */}
                            <div className='flex items-center gap-4 ml-auto'>
                                <a 
                                    href={track.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()} // Prevents row click state conflicts
                                    className="btn btn-xs btn-outline btn-primary opacity-80 hover:opacity-100"
                                    title="Open track in Spotify"
                                >
                                    Open ↗
                                </a>
                            </div>
                            <span className="text-xs opacity-60">
                                {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    )

}

export default PlaylistView