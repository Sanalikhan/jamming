import React from 'react';
import { useState } from 'react';
import './App.css';
import Search from './search';
import songsDataBase from './mockdata';
import Results from './results';
import MyList from './mylist';

function App() {
  const[searchQuery,setSearchQuery]=useState("");
  const[result,setResult]=useState([]);
  const [list,setList]=useState([]);
  const [myPlayList,setMyPlayList]=useState([]);

  const handleSearch=(searchQuery)=>{
    setSearchQuery(searchQuery);
    const filteredResults=songsDataBase.filter((song,index)=>{
     return  song.title.toLowerCase().includes(searchQuery.toLowerCase()|| song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
    });
    setResult(filteredResults);
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
        <MyList mylist={list} deleteHandling={deleteHandling} setPlayList={setPlayList}/>
      </div>
    </div>
  );
}

export default App;
