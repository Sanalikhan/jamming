import React from "react";

function Search({onSearchChange,query}){
    const onSearchChangeHandler=(e)=>{
        onSearchChange(e.target.value);
    }
    return(
        <div className="flex flex-col items-center">
            <h1 className='text-slate-50 text-7xl pb-10 font-serif pt-10' >Jammming</h1>
            <form className="flex flex-col items-center w-full">
               <input type="text" value={query} onChange={onSearchChangeHandler} className="mt-20 w-[40%] px-4 py-2 text-gray-700 border border-gray-300 rounded-3xl focus:outline-none focus:ring-1 focus:ring-black-500 focus:border-blue-500"/>
               <div>
                  <button type="submit" className=" px-4 py-2 mt-3 text-white bg-blue-600 rounded-3xl shadow-[0_0_10px_#00d2ff,0_0_20px_#00d2ff,0_0_40px_#00d2ff] 
                  hover:shadow-[0_0_15px_#00d2ff,0_0_30px_#00d2ff,0_0_60px_#00d2ff] active:shadow-[0_0_15px_#ffd700,0_0_30px_#ffd700,0_0_45px_#ffd700] 
                  transition duration-300 ease-in-out focus:outline-none focus:ring-yellow-500 focus:ring-2 focus:ring-offset-1 active:outline-none focus:outline-none mb-10">Search</button>
                </div>
        </form>
        </div>
    );
}

export default Search;