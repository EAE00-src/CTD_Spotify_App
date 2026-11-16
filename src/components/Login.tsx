import handleLogin from "../spotify"

const Login: React.FC = () =>{
    
    return(
        <div className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden gap-8">
            <img 
             src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" 
             alt="spotify-logo"
             className="w-3/10"
             loading="lazy"
            />
                <button 
                 className="btn btn-primary btn-ghost w-50 text-center border rounded-4xl mt-2/10"
                 onClick={handleLogin}
                >
                    <span className="tracking-tight text-2xl p-2">Login</span>
                </button>
        </div>
    )
}

export default Login