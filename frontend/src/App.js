import {  useState } from 'react';
import './App.css';
import ChatBot from './ChatBot/chatbot'
import myContext from './ChatBot/Context';
import MapContainer from './GoogleMaps/MapContainer'



function App() {

  const [data, setData] = useState("");
  const Context = myContext;
  //console.log(data);
  return (
    <div className="App" style={{ display: 'flex', marginLeft: "100px", marginTop: "50px", marginRight: '100px' }}>
      <Context.Provider value={{data, setData}}>
      <ChatBot />
      <MapContainer apiKey="" />
      </Context.Provider>
    </div>
  );
}

export default App;
