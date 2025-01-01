import { useState,useEffect } from "react";
import { getValidAccessToken } from "./pkceutilities";


 function Tracks({id, playlist}){
    const [tracks, setTracks] = useState([]);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showTracks, setShowTracks] = useState(false);
    const [trackId, setTrackId] = useState([]);
    
    useEffect(()=>{
        const fetchTracks = async () => {
            setLoading(true);
            try{
                const token= await getValidAccessToken();
                if (!token){
                    throw new Error('Failed to retrieve a valid access token')
                }
                
                const tracksResponse= await fetch(`/spotify-api/v1/playlists/${id}/tracks`,
                    {
                    method: 'GET',
                    headers: {
                            authorization: `Bearer ${token}`,
                        },
                    });
                if (!tracksResponse.ok){
                    throw new Error (`The tracks were not fetched. Status: ${tracksResponse.status}`);
                }
                const tracksResponseJson= await tracksResponse.json();
                console.log(`Tracks Data: ${tracksResponseJson.items}`);
                setTracks(tracksResponseJson.items.map((itemObj)=>(itemObj.track.name)));
                console.log(`Tracks:${tracks}`);
                setTrackId(tracksResponseJson.items.track.map((item)=>item.id));
            }
            catch(error){
                console.error('Error fetching the Tracks:', error.message);
                setErr(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTracks();
    }, [id]);
    //handle delete
    const handleDelete = (playlist) => {
        return playlist.filter((item)=>item.id !==playlist.id);
    };



    return (
        <div className="flex flex-col gap-y-2 mt-4">
            {loading && <p>Loading tracks...</p>}
            { err ? (
                <p className="text-red-500">Error: {err}</p>
            ) : (
                    <ul className="list-none flex flex-col gap-y-1">
                        {tracks.map((track, index)=> (
                            <li 
                            key={index} 
                            className="flex flex-row justify-between items-center">
                            <span>{track}</span>
                            <span className=" material-symbols-outlined text-white text-xs hover:bg-blue-600 rounded-full px-1 hover:bg-opacity-70 bg-blue-500 cursor-pointer" 
                            onClick={()=>handleDelete(playlist)}
                            >delete</span>
                            </li>
                        ))}
                    </ul>
                )
            }
        </div>
    );
 }


 export default Tracks;