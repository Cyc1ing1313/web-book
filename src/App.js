import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import {EpubReadView,ToolsView} from "./views";
function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<EpubReadView/>}></Route>
        <Route path="/tool" element={<ToolsView/>}></Route>
      </Routes>
     
    </div>
  );
}
export default App;
