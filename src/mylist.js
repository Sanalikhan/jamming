import React, { useState } from 'react';
import { getValidAccessToken,redirectToSpotifyAuth, UserId} from './pkceutilities';




function MyList({list,deleteHandling,setPlayList}){
    const [playlistName,setPlaylistName]=useState("");

    const removeSong=(song)=>{
        const targetTitle=song.title;
        const newList=list.filter((item)=>item.title!==targetTitle);
        deleteHandling(newList);
    }

    const handleSaveToSpotify= async (playlistName,trackUris )=> {
        const accessToken = await getValidAccessToken();
        if(!accessToken){
            redirectToSpotifyAuth();
            return;
        }
        if(list.length === 0){
            alert('No tracks in the playlist to save. Please add tracks first!');
            return;
        }
        if(!playlistName){
            alert('Playlist name cannot be empty!');
            return;
        }
        try{
        //get user_id
        const user_id=  await UserId();
        console.log(user_id);

        // creating the playlist
        const playlistResponse= await fetch(`/spotify-api/v1/users/${user_id}/playlists`,{
            method: 'POST',
            headers:{
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name:playlistName,
                public: true,
                description: 'Generated with Jammming App',
            }),
        });
        if (!playlistResponse.ok){
            const error= await playlistResponse.text();
            console.log('Error creating playlist:', playlistResponse.status, error);
            throw new Error('Failed to create playlist');
        }
        console.log(playlistResponse);

        const playListData = await playlistResponse.json();
        console.log('Playlist Created:', playListData);
        const playListID=playListData.id; //return the id for further use
        console.log(playListID);

        //Add tracks to the playlist
        const addTrackResponse=await fetch(`/spotify-api/v1/playlists/${playListID}/tracks`,{
            method:'POST',
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
            uris: trackUris,
            }),
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

    return (
        <div className='bg-gray-800 bg-opacity-70 shadow-md hover:shadow-lg transition-shadow duration-200 rounded-[30px] h-auto mx-2 flex flex-col px-10 w-[30%] items-center'>
            <h2 className='text-3xl font-serif text-center px-6 '>My List</h2>
            <form onSubmit={(e)=>e.preventDefault()}>
                <input className='my-3 px-2 rounded-full text-black'
                type='text' 
                placeholder='your playlist name' 
                onChange={({target})=>{setPlaylistName(target.value)}}
                value={playlistName}/>
            </form>
            <ul className='w-full'>{list.map((song,index)=>(
                <li key={song.uri || index} 
                className='border-b border-gray-500 flex flex-row justify-between items-center py-2'>
                    <div>
                    <p>{song.title}</p>
                    <p className='font-thin text-sm'>{song.artist}</p>
                    </div>
                    <span className="material-symbols-outlined text-white text-sm hover:bg-blue-600 rounded-full px-1 hover:bg-opacity-70 bg-blue-500 cursor-pointer" onClick={()=>removeSong(song)}>delete</span>
                </li>
            ))}
            </ul>
            <button className='bg-blue-500 rounded-full py-2 mt-6 w-[50%] hover:bg-blue-600' id='save-to-spotify'
            onClick={()=>handleSaveToSpotify(playlistName, list.map((song)=> song.uri))}
            >Save to Spotify</button>
        </div>
    );
}

export default MyList;