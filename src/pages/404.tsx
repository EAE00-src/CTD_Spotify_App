import { OctagonAlertIcon } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router"

const NotFound: React.FC = () =>{

    const navigate = useNavigate();
    const handleReturn = () => {
        //check if user is authenticated before sending them elsewhere
        const token = sessionStorage.getItem('spotify_access_token')

        if(token) {
            navigate('/library')
        } else {
            //send them back to login screen if authentication is invalid
            navigate('/')
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-7 mt-20">
            <OctagonAlertIcon size={100} className="text-error" />
            <p className="text-error text-3xl">Looks like you ended up in the wrong place!</p>
            <button onClick={handleReturn} className="btn btn-error">
                Return Home
            </button>
        </div>
    )
}

export default NotFound