import React,{useEffect, useState} from "react";
import { getValidAccessToken, UserId} from "./pkceutilities";
function ChangePlayListName(){
    const [playList, setPlayList]= useState([]);
    const [error, setError] = useState(null);
    const [showPlayLists, setShowPlaylists] = useState(false);


    useEffect(()=>{
        const fetchPlaylists = async() => {
            try{
                const userID = await UserId();
                if (!userID){
                 throw new Error ('User ID is undefined or null');
                }
                const accessToken= await getValidAccessToken();
                if (!accessToken){
                    throw new Error('Failed to retrieve a valid access token.');
                }

                 const currentPlaylistResponse= await fetch(`/spotify-api/v1/${userID}/playlists`, 
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

    const togglePlaylists = () =>{
        setShowPlaylists((prev)=> !prev);
    };
    

    return (
            <div className="bg-gray-800 bg-opacity-70 rounded-[30px] shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col mx-auto min-h-5 justify-center items-center w-[50%] mt-4">
            <h2 className="text-3xl font-serif text-center text-white">Saved Playlists</h2>
            <button
                className='bg-blue-500 rounded-full py-2 mt-6 w-[30%] hover:bg-blue-600 font-normal font-sans text-white'
                onClick={togglePlaylists}
                >{showPlayLists? "Hide Playlists" : "Show Playlists"}
            </button>
                { showPlayLists && (
                    <div className="mt-5">
                        {error ? (
                            <p className="text-red-500">Error : {error}{error}</p>
                        ):(
                            <ul className="list-disc pl-6">
                                {playList.map((playlist)=>(
                                    <li key={playlist.id} className="mb-2">{playlist.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
        </div>
    )
}


export default ChangePlayListName