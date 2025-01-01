import React,{useEffect, useState} from "react";
import { getValidAccessToken, redirectToSpotifyAuth} from "./pkceutilities";
import Tracks from "./changetracks";
import { redirect } from "react-router-dom";

function ChangePlayListName(){
    const [playList, setPlayList]= useState([]);
    const [error, setError] = useState(null);
    const [showPlayLists, setShowPlaylists] = useState(false);
    const [selectedPlaylistId,setSelectedPlaylistId] = useState(null);
    const [editedPlayListName, setEditedPlayListName] = useState("");
    const [editedTracks, setEditedTracks] = useState([]);
    const [enableEdit, setEnableEdit]= useState(false);


    useEffect(()=>{
        const fetchPlaylists = async() => {
            try{
                const accessToken= await getValidAccessToken();
                if (!accessToken){
                    throw new Error('Failed to retrieve a valid access token.');
                }
                 const currentPlaylistResponse= await fetch(`/spotify-api/v1/me/playlists`, 
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
                 setPlayList(response.items || []);
                 console.log(`Fetched playlists: ${response.items}`);
                }
            catch (error){
                console.error('Error fetching the Saved Playlists', error.message);
                setError(error.message);
            }
        };
        fetchPlaylists();
    },[]);

//toggle whether to show or not show the playlists
    const togglePlaylists = () =>{
        setShowPlaylists((prev)=> !prev);
    };

// main function connected to edit button
    const edit = (playlist) => {
    setEditedPlayListName(playlist.name);
    setEditedPlayListId(playlist.id);
    setEnableEdit(true);
    setEditedTracks(playlist);
    };


//handleTrackIDs 
    const handleTrackIDs = (TrackId) =>{
        return TrackId.length > 5? TrackId.slice(0,5): TrackId;
    } 

//handle save to spotify 
    const handleSave = async(editedPlayListName, editedTracks, playlist) => {
        const accessToken= await getValidAccessToken();
        if (!accessToken) {
            redirectToSpotifyAuth();
            return;
        }
        if (editedTracks.length === 0){
            alert ('No Tracks in the playlist to save. Please add the tracks first');
            return;
        }
        if (!editedPlayListName){
            alert('Playlist name cannot be empty');
            return;
        }
        setEnableEdit(false);
        try {
            const addTrackResponse=await fetch(`/spotify-api/v1/playlists/${playlist.id}/tracks`,{
                method:'POST',
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(uris),
            });
    
            if(!addTrackResponse.ok){
                const error= await addTrackResponse.text();
                console.log('Error adding tracks:', addTrackResponse.status,error);
                throw new Error('Failed to add tracks to the playlist');
            }
            console.log('Playlist saved to Spotify successfully!');
        }
        catch(error){
            console.error('Error saving playlist to Spotify:' ,error);
        }
    };
    const handleRecommendations =async () =>{
        try {
            const accessToken = await getValidAccessToken();
            if (!accessToken){
                redirectToSpotifyAuth();
                return;
            }
            const trackIDs = handleTrackIDs(TrackId);
            const seedTracks = trackIDs.join(',');
            const baseUrl= 'https://api.spotify.com/v1/recommendations';
            const recommendationUrl =`${baseUrl}?seed_tracks=${seedTracks}`;
            console.log(recommendationUrl);
            const recommendations= await fetch (recommendationUrl,{
                method: 'GET',
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!recommendations.ok){
                console.error(`Error while fetching the recommendations:${error.message}`);
                throw new Error(`${Error.status}: ${Error.message}`);
            }
            const recommendationResponse =  await recommendationResponse.json();
            const artistName=recommendationResponse.map((item)=>(
            item.tracks.artists.name));
            const trackName=recommendationResponse.map((item)=>(
                    item.tracks.name));

        }
        catch(error){
            console.error(`Error fetching recommendations : ${error.message}`);
            throw new Error(`Error getting recommendations: ${error.status} `)
        }

    }


    

    return (
            <div className="bg-gray-800 bg-opacity-70 rounded-[30px] shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col mx-auto min-h-5 justify-center items-center w-[70%] mt-4 text-white">
            <h2 className="text-3xl font-serif text-center text-white pt-2">Saved Playlists</h2>
            <button
                className='bg-blue-500 rounded-full py-2 px-3 mt-6 w-auto hover:bg-blue-600 font-normal font-sans text-white'
                onClick={togglePlaylists}
                >{showPlayLists? "Hide Playlists" : "Show Playlists"}
            </button>
                { showPlayLists && (
                    <div className="w-full px-7">
                        error ? (
                            <p className="text-red-500">Error : {error}</p>
                        ):(
                        <div>
                            <ul className="list-none w-full">
                                {playList.map((playlist)=>(
                                    <li key={playlist.id} className="flex flex-col">
                                        enableEdit ? (
                                            <input
                                            type="text"
                                            placeholder={playlist.name}
                                            onChange= {(e)=> setEditedPlayListName(e.target.value)}
                                            className= "bg-gray-700 text-white rounded px-3 py-2 w-full"
                                            />
                                            selectedPlaylistId === playlist.id && 
                                            <div className="tracks-container flex flex-col gap-y-2">
                                            <Tracks id={selectedPlaylistId} playlist={playlist}/>
                                            <div className="flex flex-col gap-y-2">
                                            <button className="text-white text-sm bg-blue-500 hover:bg-blue-600 hover:bg-opacity-70 rounded-full px-1 hover:cursor-pointer self-center px-3 mb-2" onClick={()=>handleRecommendations}>Add more Tracks...</button>
                                            <button className="text-white text-sm bg-blue-500 hover:bg-blue-600 hover:bg-opacity-70 rounded-full px-3 hover:cursor-pointer self-end px-2 mb-4" onClick={()=>handleSave(editedPlayListName, editedTracks)}>Save</button> 
                                            </div>
                                            </div>
                                            ):(
                                        <div className="mb-2 flex flex-row justify-between items-center border-b border-gray-500">  
                                        <button className=' py-2'
                                         onClick={()=>setSelectedPlaylistId(playlist.id)}>
                                            {playlist.name}
                                        </button>
                                        <span className="material-symbols-outlined text-white text-sm bg-blue-500 hover:bg-blue-600 hover:bg-opacity-70 rounded-full px-1 hover:cursor-pointer" onClick={()=>edit(playlist)}>edit</span>
                                        </div>
                                        {
                                        selectedPlaylistId === playlist.id && 
                                        <div className="tracks-container flex flex-col gap-y-2">
                                        <Tracks id={selectedPlaylistId}/>
                                        <div className="flex flex-col gap-y-2">
                                        <button className="text-white text-sm bg-blue-500 hover:bg-blue-600 hover:bg-opacity-70 rounded-full px-1 hover:cursor-pointer self-center px-3 mb-2" onClick={()=>handleRecommendations}>Add more Tracks...</button>
                                        <button className="text-white text-sm bg-blue-500 hover:bg-blue-600 hover:bg-opacity-70 rounded-full px-3 hover:cursor-pointer self-end px-2 mb-4" onClick={()=>handleSave(editedPlayListName, editedTracks, playlist)}>Save</button> 
                                        </div>
                                        </div>
                                        }
                                        )
                                    </li> ))}
                            </ul>
                        </div>
                        )
                    </div>
                    )}
            </div>
    );
}


export default ChangePlayListName;