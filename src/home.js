import React from 'react';
import { useState } from 'react';
import './App.css';
import Search from './search';
//import songsDataBase from './mockdata';
import Results from './results';
import MyList from './mylist';
import { getValidAccessToken } from './pkceutilities';
import ChangePlayListName from './changeplaylistname';

function Home() {
  const[searchQuery,setSearchQuery]=useState("");// to put the search query
  const[result,setResult]=useState([]); // to display the results fetched form the search and use them to our desired data
  const [list,setList]=useState([]); // to store the list of songs selected from the search results
  const [myPlayList,setMyPlayList]=useState([]);


  /*
 //this function was previously used when i was using mocked data 
  const handleSearch=(searchQuery)=>{
    setSearchQuery(searchQuery);
    const filteredResults=songsDataBase.filter((song,index)=>{
     return  song.title.toLowerCase().includes(searchQuery.toLowerCase()|| song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
    });
    setResult(filteredResults);
  }
    */
 const handleSearch = async (searchQuery) =>{
    setSearchQuery(searchQuery);
     if (!searchQuery){
      setResult([]);
     return;
     } //stop if the query is empty

     const accessToken= await getValidAccessToken(); 
     //(replacing this with the refresh toke to ensure a valid token every time)localStorage.getItem('access_token');

     try{
        const response=await fetch (
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response.ok){
              console.log('The search results cannot be displayed due to error');
                throw new Error('Spotify API request failed');
            }
            const data= await response.json();
            console.log('Spotify API Data:', data);

            //Transform the data for Results component
            const transformedResults=data.tracks.items.map((track)=>({
                id: track.id,
                title: track.name,
                artist: track.artists.map((artist)=> artist.name).join(", "),
                uri:track.uri,
            }));

            //set raw api result
            setResult(transformedResults);
        }
     catch(error){
        console.error('Error fetching from Spotify API:', error);
     };
 }


  const listHandler=(song)=>{
    setList((prev) => [...prev,song]);
  }
  const deleteHandling=(listAfterDeleting)=>{
    setList(listAfterDeleting);
  }
  const setPlayList=(plist)=>{
    setMyPlayList((prev)=>[...prev,plist]);
  }


  return (
    <div className="bg-[url('./images/neonbackgroundformusicparty.jpg')] bg-cover bg-center h-screen w-full">
      <Search onSearchChange={handleSearch} query={searchQuery}/>
      <div className="text-white pb-30 flex flex-row w-full justify-center gap-[10%]">
        <Results filteredResults={result} handleMyList={listHandler}/>
        <MyList list={list} deleteHandling={deleteHandling} setPlayList={setPlayList}/>
      </div>
      <div>
        <ChangePlayListName/>
      </div>
    </div>
  );
}

export default Home;
