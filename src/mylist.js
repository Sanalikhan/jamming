import React, { useState } from 'react';
import { redirectToSpotifyAuth } from './pkceutilities';




function MyList({mylist,deleteHandling,setPlayList}){
    const [playlistName,setPlaylistName]=useState("");
    const removeSong=(song)=>{
        const targetTitle=song.title;
        const newList=mylist.filter((item)=>item.title!==targetTitle);
        deleteHandling(newList);
    }

    const handleSaveToSpotify= async () => {
        const accessToken= window.localStorage.getItem('access_token');

        if(!accessToken){
            redirectToSpotifyAuth();
            return;
        }
        if (mylist.length===0){
            alert('No tracks in the playlist to save.Please add tracks first!');
            return;
        }
        if (!playlistName || !playlistName.trim()){
            alert('Playlist name cannot be empty!');
            return;
        }
    }

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
            <ul className='w-full'>{mylist.map((song,index)=>(
                <li key={song.uri || index} 
                className='border-b-2 border-white flex flex-row justify-between items-center py-2'>
                    <div>
                    <p>{song.title}</p>
                    <p>{song.artist}</p>
                    </div>
                    <span className="material-symbols-outlined text-white text-sm hover:bg-blue-600 rounded-full px-1 hover:bg-opacity-70 bg-blue-500" onClick={()=>removeSong(song)}>delete</span>
                </li>
            ))}
            </ul>
            <button className='bg-blue-500 rounded-full py-2 mt-6 w-[50%] hover:bg-blue-600' id='save-to-spotify'
            onClick={handleSaveToSpotify}
            >Save to Spotify</button>
        </div>
    );
}

export default MyList;