import react from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./Pages/Registers.jsx";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Privatecomponent from "./component/PrivateComponenet/Privatecomponent.jsx";
import ErrorPage from "./component/Error/errorpage.jsx";
import Sidebar from "./component/Sidebar/Sidebar.jsx";
import {BrowserRouter,Routes,Route} from "react-router-dom";
const App=()=>{
  return(
      <>
        <BrowserRouter>
          <Routes>
              <Route element={<Privatecomponent/>}>
                  <Route path="/" element={<Sidebar/>}/>
                  <Route path="*" element={<ErrorPage/>}/>
              </Route>
              <Route path="/register" element={<Register/>}/>
              <Route path="/notfound" element={<ErrorPage/>}/>
          </Routes>
        </BrowserRouter>
      </>
  )
}
export default App;