import { useState,useEffect } from "react";
import { getValidAccessToken } from "./pkceutilities";


 function Tracks({id, setTrackId, trackId, isEditing, editedTracks, setEditedTracks,editedTracksId, setEditedTracksId}) {
    const [tracks, setTracks] = useState([]);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);
    
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
                const tracks =tracksResponseJson.items.map((itemObj)=>(itemObj.track.name));
                console.log(`Tracks:${tracks}`);
                const trackId = tracksResponseJson.items.map((item)=>item.track.id);
                console.log(tracks);
                console.log(trackId);
                setTracks(tracks); 
                setTrackId(trackId);
            }
            catch(error){
                console.error('Error fetching the Tracks:', error.message);
                setErr(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTracks();
    }, [id, setTrackId]);
    useEffect(() => {
        setEditedTracks(tracks); // Initialize editedTracks with tracks when tracks change
        setEditedTracksId(trackId); // Initialize editedTracksId with trackIds when tracks change
    }, [tracks, setEditedTracks]);
    //use Effect to see the updates happening actually or not 
    useEffect(()=>{
        console.log('editedTracks state updated:', editedTracks);
        console.log('The editedTrackIds:',editedTracksId);
    }, [editedTracks,editedTracksId]);

    //handle delete for editing tracks
    const handleDelete = (trackToRemove, idToRemove) => {
        console.log("Tracks to be edited from:",editedTracks);
        setEditedTracks((prevEditedTracks)=> {
            const updatedTracks = prevEditedTracks.filter((track)=> track !== trackToRemove);
            console.log("Updated Tracks",updatedTracks);
            return updatedTracks;
        });
        setEditedTracksId((prevEditedTrackIds)=> {
            const updatedIds = prevEditedTrackIds.filter((id)=> id!==idToRemove);
            console.log("Updated Edited Track ids:", updatedIds);
            return updatedIds;
        });
        console.log("Edited Tracks:",editedTracks);//will log the stale value due to asynchronous update of the state
        console.log("Deleted Track:", trackToRemove);
        console.log("Id to be removed:",idToRemove);
    }


    return (
        <div className="flex flex-col gap-y-2 mt-4">
            {loading && <p>Loading tracks...</p>}
            { err ? (
                <p className="text-red-500">Error: {err}</p>
            ) :
                    isEditing ? (     
                // Editing Mode: Show delete buttons              
                <ul className="list-none flex flex-col gap-y-1">
                {editedTracks.map((track, index)=>(
                    <li 
                    key={index} className="flex flex-row justify-between gap-x-10 items-center">
                    <span>{track}</span>
                    <span className=" material-symbols-outlined text-white text-xs hover:bg-blue-600 rounded-full px-1 hover:bg-opacity-70 bg-blue-500 cursor-pointer" onClick={()=>handleDelete(track, trackId[index])}>
                    delete</span>
                    </li>
                ))}
                 </ul>
           ):(
            //normal mode : Display tracks without delete buttons
                <ul className="list-none flex flex-col gap-y-1">
                {tracks.map((track,index)=>(
                    <li key={index} className="flex flex-col gap-y-1">
                    {track}
                    </li>
                ))}
                </ul>
            )
        }   
        </div>
    );
 }


 export default Tracks;