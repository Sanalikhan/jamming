import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import Callback from "./callback";

function App(){
  return (
    <Router>
      <Routes>
        {/*The default route for the home page*/}
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}
export default App;