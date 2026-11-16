import React, {useEffect, useState, useRef} from "react";
import type { SpotifyTrack } from "../lib/services/spotifyPlaylists";
import toast from "react-hot-toast";
import { PauseCircleIcon, PlayCircleIcon, SkipBackIcon, SkipForwardIcon, Volume2Icon } from "lucide-react";

interface PlayerProps{
    currentTrack: SpotifyTrack | null;
    queue: SpotifyTrack[];
    onTrackChange: (track: SpotifyTrack) => void;
}

export const Player: React.FC<PlayerProps> = ({currentTrack, queue, onTrackChange}) =>{
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    //Whenever the current track changes, update audio source and play if valid
    useEffect(() => {
        if(audioRef.current){
            if(currentTrack?.preview_url){
                audioRef.current.src = currentTrack.preview_url;
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch((err) => {
                        console.error(`Playback error: ${err}`)
                        toast.error('Playback error!', {icon:'❌'})
                        setIsPlaying(false)

                    })
            }else{
                audioRef.current.pause();
                audioRef.current.src = '';
                setIsPlaying(false);
                if(currentTrack){
                    toast.error(`"${currentTrack.name}" has no 30-second preview available. It's recommended that you listen to the song directly from Spotify itself!`, {icon: '❌'})
                }
            }
        }
    }, [currentTrack])

    const togglePlayPause = () => {
        if(!audioRef.current || !currentTrack?.preview_url) return;
        if(isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        }else{
            audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {console.error(`Playback failed: ${err}`), toast.error(`Playback failed!`)})
        }
    }

    const handleNext = () => {
        if(!currentTrack || queue.length === 0) return;
        const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
        if(currentIndex !== -1 && currentIndex < queue.length - 1) {
            onTrackChange(queue[currentIndex + 1]);
        }else if(queue.length > 0){
            //loop back to the start of queue
            onTrackChange(queue[0])
        }
    };
    const handlePrevious = () => {
        if(!currentTrack || queue.length === 0) return;
        const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
        if(currentIndex > 0) {
            onTrackChange(queue[currentIndex - 1]);
        }
    }

    return(
        <div className="h-20 bg-base-300 border-t border-base-content/10 px-6 flex items-center justify-between w-full z-50">
            {/**Hidden HTML5 Audio Element */}
            <audio
                ref={audioRef}
                onEnded={handleNext}
            />
            {/**Left: Track info */}
            <div className="flex items-center gap-4 w-1/4">
                {currentTrack?.album?.images?.[0]?.url ? (
                    <img 
                        src={currentTrack.album.images[0].url}
                        alt={currentTrack.name}
                        className="w-12 h-12 rounded object-cover shadow"
                    />
                ) : (
                    <div className="w-12 h-12 rounded bg-neutral flex items-center justify-center text-xs text-neutral-content">
                        🎶
                    </div>
                )}
                <div className="truncate">
                    <p className="font-semibold text-sm truncate">{currentTrack?.name || "Select a track"}</p>
                    <p className="text-xs opacity-70 truncate">
                        {currentTrack?.artists?.map(a => a.name).join(', ') || "No artist"}
                    </p>
                </div>
            </div>
            {/**Center: Playback controls */}
            <div className="flex flex-col items-center gap-1 w-2/4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handlePrevious}
                        className="btn btn-ghost btn-circle btn-sm"
                        disabled={!currentTrack}
                    >
                        <SkipBackIcon size={18} />
                    </button>

                    <button 
                        onClick={togglePlayPause} 
                        className="btn btn-primary btn-circle text-primary-content"
                        disabled={!currentTrack?.preview_url}
                    >
                        {isPlaying ? <PauseCircleIcon size={20} /> : <PlayCircleIcon size={20} />}
                    </button>

                    <button 
                        onClick={handleNext} 
                        className="btn btn-ghost btn-circle btn-sm"
                        disabled={!currentTrack}
                    >
                        <SkipForwardIcon size={18} />
                    </button>
                </div>
                {!currentTrack?.preview_url && currentTrack && (
                    <span className="text-[12px] text-warning">Preview unavailable for this track (retired/deprecated Spotify feature)</span>
                )}
            </div>

            {/* Right: Extra controls / volume placeholder */}
            <div className="flex items-center justify-end gap-3 w-1/4 opacity-70">
                <Volume2Icon size={18} />
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    defaultValue="1"
                    onChange={(e) => {
                        if (audioRef.current) {
                            audioRef.current.volume = parseFloat(e.target.value);
                        }
                    }}
                    className="range range-xs range-primary w-24" 
                />
            </div>
        </div>
    )
}