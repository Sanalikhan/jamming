import React from "react";
 function Results({filteredResults,handleMyList}){
    return (
        <div className="bg-gray-800 bg-opacity-70 rounded-[30px] shadow-md hover:shadow-lg transition-shadow duration-200 mx-10 w-[30%]">
            <h2 className="text-3xl font-serif text-center px-6">Results</h2>
            <ul className="flex flex-col py-5 px-10 mx-auto px-10 w-full">
                {filteredResults.map((song,index)=>(
                    <li key={index}
                        className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold">{song.title}</span>
                            <span className="text-sm text-gray-300">{song.artist}</span>
                        </div>
                        <div>
                        <button className="bg-blue-500 px-4 py-2 hover:bg-blue-600 text-white rounded-full shadow-md focus:outline-none transition duration-200 relative group" onClick={()=>handleMyList(song)}>
                                {'+'}
                        </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
 }



 export default Results;