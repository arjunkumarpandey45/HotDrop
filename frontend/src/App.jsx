
import Loader from "./components/Loader.jsx"
import Navbar from "./components/Navbar.jsx"
import CreatePost from "./components/CreatePost.jsx"
import Baground from "./components/Baground.jsx"


function App() {
 

  return (
    <>
    <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
    <Loader></Loader>
    <Baground raysOrigin="top-center"
    raysColor="#ffffff"
    raysSpeed={1}
    lightSpread={0.5}
    rayLength={3}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0}
    distortion={0}
    className="custom-rays"
    pulsating={false}
    fadeDistance={1}
    saturation={1}>

    </Baground>
    </div>
    
     
     {/* <Navbar ></Navbar> */}
     {/* <CreatePost></CreatePost> */}
     
    </>
  )
}

export default App
