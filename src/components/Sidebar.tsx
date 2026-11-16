import { CirclePlayIcon, FlameIcon, HeartIcon, Library, RssIcon, SquareArrowRightExitIcon, } from "lucide-react";
import type { LucideIcon } from "lucide-react/types";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { performLogout } from "../lib/services/authUtils";
import { getUserProfile } from "../lib/services/spotifyApi";

interface NavItem {
        path: string;
        label: string;
        icon: LucideIcon;
    }

const Sidebar: React.FC = () => {
    //Profile image & name retrival & display
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string>('');
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile();
                console.log(profile)
                if(profile.images && profile.images.length > 0){
                    setProfileImg(profile.images[0].url)
                    console.log(profile.images)
                }
                setDisplayName(profile.display_name)
            } catch (error) {
                console.error(`Failed to fetch user profile: ${error}`)
            }
        };
        fetchProfile();
    }, [])

    //Logout button functionality
    const navigate = useNavigate();
    const handleLogout = () =>{
        performLogout(navigate);
    }
    //Navigation links
    const navItems: NavItem[] = [
        {path:'/feed', label: 'Feed', icon: RssIcon},
        {path:'/trending', label: 'Trending', icon:FlameIcon},
        {path:'/player', label: 'Player', icon: CirclePlayIcon},
        {path:'/favorites', label: 'Favorites', icon: HeartIcon},
        {path:'/library', label:'Library', icon: Library}
    ]
    //theme setting on /*<root>*/
    const themes: string[] = ['sunset', 'synthwave', 'dark', 'light', 'night', 'abyss', 'cmyk', 'autumn', 'caramellatte']
    const [theme, setTheme] = useState<string>(() => {
        return (
        document.documentElement.getAttribute('data-theme') || 'synthwave'
        )
    })
    //theme change's when different option is chosen:
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])
    

    const location = useLocation();
    const btnText: string = "text-accent text-shadow-accent-content text-lg tracking-tight"; 

    return (
    <nav className="w-28 h-full bg-secondary/40 border rounded-l-4xl flex flex-col justify-between items-center">
            {/*User Profile image*/}
            <img 
             src={profileImg ?? undefined} 
             alt={displayName || 'User avatar'} 
             className="w-15 h-15 mt-3 rounded-full object-cover border border-primary-content"
            />
            {/**theme selection*/}
            <select
             onChange={(e) => setTheme(e.target.value)}
             value={theme} 
             className='select select-accent'
             >
                {themes.map((el) => {
                   return( <option key={el} value={el}>
                        {el.charAt(0).toUpperCase() + el.slice(1)}
                    </option>
                   )
                })}
            </select>
        <div className="gap-5 flex flex-col items-center mb-2.5">
            {/**Dynamic render of Sidebar links */}
            {navItems.map((item: NavItem) => {
                //tailwind classes and switch for buttons in relation to active page location
                const isActive: boolean = location.pathname === item.path;
                const btnState: string = isActive ? 'active' : 'ghost';
                const btnClasses: string = `w-full h-full flex flex-col justify-center items-center btn btn-${btnState}`;

                //Lucide Icons rendered as Component elements
                const IconComponent = item.icon;

                return (
                    <Link key={item.path} to={item.path}>
                        <button className={btnClasses}>
                            <IconComponent size={30} />
                            <span className={btnText}>{item.label}</span>
                        </button>
                    </Link>
                )
            })}
        </div>
        {/**Sign out button */}
        <button onClick={handleLogout} className={`mb-1.5 flex flex-col justify-center items-center btn btn-ghost h-2/20`}>
            <SquareArrowRightExitIcon size={25} />
            <span className={btnText}>Logout</span>
        </button>
    </nav>
        
    )
}

export default Sidebar;