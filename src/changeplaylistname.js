import React,{useEffect, useState} from "react";
import { getValidAccessToken, UserId} from "./pkceutilities";
function ChangePlayListName(){
    const [playList, setPlayList]= useState([]);
    const [error, setError] = useState(null);


    useEffect(()=>{
        const fetchPlaylists = async() =>{
            try{
                const userID = await UserId();
                if (!userID){
                    throw new Error ('User ID is undefined or null');
                }
                const accessToken= await getValidAccessToken();
                if (!accessToken){
                    throw new Error('Failed to retreive a valid access token.');
                }

                 const currentPlaylistResponse= await fetch(`https://api.spotify.com/v1/${userID}/playlists`, 
                {
                     method: 'GET',
                     headers:{
                             Authorization: `Bearer ${accessToken}`
                     },
                 });
                 if (!currentPlaylistResponse.ok){
                    throw new Error(
                        `Error while fetching the user's playlist. Status:${currentPlaylistResponse.status}`);
                 }
                 const response = await currentPlaylistResponse.json();
                 setPlayList(response.items);
                 console.log(`Fetched playlists: ${response.items}`);
                }
            catch (error){
                console.error('Error fetching the Saved Playlists', error.message);
                setError(error.message);
            }
        };
        fetchPlaylists();
    },[]);
    



    return (
        <div className="bg-slate-400 text-white flex flex-row">
            <h2>Saved Playlists</h2>
            <div>
            { error?
            (
            <p>Error: {error}</p>
            ):(
            <ul>
                {playList.map((playlist)=>(
                <li key={playlist.id}>{playlist.name}</li>
            ))}
            </ul>
            )
            }
        </div>
        </div>
    )
}


export default ChangePlayListName