import React,{useEffect, useState} from "react";
import { getValidAccessToken, redirectToSpotifyAuth} from "./pkceutilities";
import Tracks from "./changetracks";


function ChangePlayListName(){
    const [playList, setPlayList]= useState([]);
    const [error, setError] = useState(null);
    const [showPlayLists, setShowPlaylists] = useState(false);
    const [selectedPlayListId,setSelectedPlayListId] = useState(null);
    const [editedPlayListName, setEditedPlayListName] = useState("");
    const [editedTracks, setEditedTracks] = useState([]);
    const [editedTracksId, setEditedTracksId] = useState([]);
    const [editingPlaylistId, setEditingPlaylistId]= useState(null);
    const [artistName, setArtistName] = useState("");
    const [trackName, setTrackName] = useState("");
    const [trackId, setTrackId] = useState([]);
    const [message,setMessage] = useState('');


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
    setEditingPlaylistId(playlist.id);
    setSelectedPlayListId(null);
    };
    //handleTrackIDs 
    const handleTrackIDs = (trackId) =>{
        return trackId.length > 5? trackId.slice(0,5): trackId;
        } 
        const trackIDs = handleTrackIDs(trackId);


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
        setEditingPlaylistId(false);
        setEditedPlayListName(editedPlayListName);
        console.log("PlayList Name:", editedPlayListName);

        try {
            //update playlist name if changed
            const renamedPlaylistResponse=await fetch(`/spotify-api/v1/playlists/${playlist.id}`,{
                method:'PUT',
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name: editedPlayListName
                }),
            });
            console.log("Playlist ID:", playlist.id);
            console.log("Saving new name of the playlist:",renamedPlaylistResponse); 
    
            if(!renamedPlaylistResponse.ok){
                const error= await renamedPlaylistResponse.text();
                console.log('Error renaming playlist:', renamedPlaylistResponse.status,error);
                throw new Error('Failed to add tracks to the playlist');
            }
            console.log('Playlist name changed successfully!');

        // replace playlist Tracks
        const uris = editedTracksId.map((trackId)=> `spotify:track:${trackId}`);
        console.log(uris);
        const editedTracksResponse= await fetch(`/spotify-api/v1/playlists/${playlist.id}/tracks`,{
            method:"PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uris,
            }),
        });
        if (!editedTracksResponse.ok){
            throw new Error (`Failed to replace playlist tracks. Status: ${editedTracksResponse.status}`);
        }
        console.log('Playlist tracks updated successfully!');

         //update local states
         setEditedPlayListName("");
         setEditingPlaylistId(null);
         setEditedTracks([]);
         setEditedTracksId([]);
         alert("Playlist name updated successfully!");
        }
        catch(error){
            console.error('Error saving playlist to Spotify:' ,error);
            alert("Failed to save the edited playlist. Please try again.")
        }
    };
    const handleRecommendations =async () =>{
        console.log('Add more tracks button just ran!');
        setMessage((prevMessage)=> (prevMessage? "":"No recommendations available"));
        

        /*
        // recommendations feature is deprecated in Spotify Api so not using this part of code 
        try {
            const accessToken = await getValidAccessToken();
            if (!accessToken){
                redirectToSpotifyAuth();
                return;
            }

            const seedTracks = trackIDs.join(',');
            console.log("Seed Tracks:",seedTracks);
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
                const errorMsg = `Error while fetching the recommendations: ${recommendations.statusText}`;
                console.error(errorMsg);
                setError(errorMsg);
                return;
            }
            const recommendationResponse =  await recommendations.json();
            console.log("recommendations response:", recommendationResponse);
            if (!recommendationResponse.tracks || recommendationResponse.tracks.length === 0){
                setError("No recommendations found");
                return;
            }
            const artistName = recommendationResponse.tracks.map((item)=>
            item.artists?.[0]?.name || "Unknown Artist");
            const trackName= recommendationResponse.tracks.map((item)=>
                    item.name || "Unknown Track");
                    console.log("Artist Name:",artistName);
                    console.log("Track Name:", trackName);
                    //update the states
                    setTrackName(trackName);
                    setArtistName(artistName);
        }
        catch(error){
            console.error(`Error fetching recommendations : ${error.message}`);
            setError(`Error getting recommendations: ${error.message} `)
        }
            */

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
                        {error ? (
                            <p className="text-red-500">Error : {error}</p>
                        ):(
                        <div>
                            <ul className="list-none w-full">
                                {playList.map((playlist)=>
                                    <li key={playlist.id} className="flex flex-col">
                                        {editingPlaylistId === playlist.id ? (
                                        <>
                                            <input
                                            type="text"
                                            placeholder={playlist.name}
                                            onChange= {(e)=> setEditedPlayListName(e.target.value)}
                                            className= "bg-gray-700 text-white rounded px-3 py-2 w-full"
                                            />
                                            <div className="tracks-container flex flex-col gap-y-2">
                                            <div className="flex flex-row">
                                            <Tracks id={editingPlaylistId} setTrackId={setTrackId} trackId={trackId} isEditing={editingPlaylistId===playlist.id} editedTracks={editedTracks} setEditedTracks={setEditedTracks} editedTracksId={editedTracksId} setEditedTracksId={setEditedTracksId}/>
                                            </div>
                                            <div className="flex flex-col gap-y-2">
                                            <button className="text-white text-sm bg-blue-500 hover:bg-blue-600 hover:bg-opacity-70 rounded-full hover:cursor-pointer self-center px-3 mb-2" onClick={()=>handleRecommendations()}>Add more Tracks...</button>
                                            {message && <p className="text-white"> {message}</p>}
                                            {/* <div className="flex flex-row text-white">
                                            <div>
                                            <h3>Track Names:</h3>
                                            {trackName.map((name, index) => (
                                             <p key={index}>{name}</p>
                                            ))}
                                            </div>
                                            <div>
                                            <h3>Artist Names:</h3>
                                            {artistName.map((name, index) => (
                                             <p key={index}>{name}</p>
                                           ))}
                                           </div>
                                           </div> */}
                                            <button className="text-white text-sm bg-blue-500 hover:bg-blue-600 hover:bg-opacity-70 rounded-full px-3 hover:cursor-pointer self-end mb-4" onClick={()=>handleSave(editedPlayListName, editedTracks,playlist)}>Save</button> 
                                            </div>
                                            </div>
                                        </>
                                            ):(
                                        <>
                                        <div className="mb-2 flex flex-row justify-between items-center border-b border-gray-500">  
                                        <button className=' py-2'
                                         onClick={()=>setSelectedPlayListId(playlist.id)}>
                                            {playlist.name}
                                        </button>
                                        <span className="material-symbols-outlined text-white text-sm bg-blue-500 hover:bg-blue-600 hover:bg-opacity-70 rounded-full px-1 hover:cursor-pointer" onClick={()=>edit(playlist)}>edit</span>
                                        </div>
                                        {
                                        selectedPlayListId === playlist.id && 
                                        <div className="tracks-container flex flex-col gap-y-2">
                                        <Tracks id={selectedPlayListId} setTrackId={setTrackId} trackId={trackId} isEditing={false} editedTracks={editedTracks} setEditedTracks={setEditedTracks} editedTracksId={editedTracksId} setEditedTracksId={setEditedTracksId}/>
                                        </div>}
                                        </> )} </li> )}
                            </ul>
                        </div> )}
                    </div> )}
                    </div> 
    );
}



export default ChangePlayListName;