import React, { useState } from 'react';
function MyList({mylist,deleteHandling,setPlayList}){
    const [playlistName,setPlaylistName]=useState("");
    const removeSong=(song)=>{
        const targetTitle=song.title;
        const newList=mylist.filter((item)=>item.title!==targetTitle);
        deleteHandling(newList);
    }
    const trackUris=()=>mylist.map((item)=>item.uri);

    const handleSavePlayList=(playlistName,trackUris)=>{

        if (!playlistName.trim()){
            alert('please provide a playlist name');
            return;
        }
        if (trackUris.length === 0){
            alert('No tracks in the playlist to save.Please first add the tracks!');
            return;
        }
        console.log(`Saving Playlist: ${playlistName}`);
        console.log(`Track URIs: ${trackUris}`);
        alert (`Playlist : ${playlistName} saved successfully!`);
        const playlist={
            name:playlistName,
            songs:mylist
        };

        //clear the list and reset playlist name
        setPlayList(playlist);
        deleteHandling([]);
        setPlaylistName("");
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
            <button className='bg-blue-500 rounded-full py-2 mt-6 w-[50%] hover:bg-blue-600' 
            onClick={()=>{handleSavePlayList(playlistName,trackUris())}}
            disabled={!playlistName.trim() || mylist.length===0}
            >Save to Spotify</button>
        </div>
    );
}

export default MyList;