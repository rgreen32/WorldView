import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import axios from "axios"
import Globe from "./Globe"
import ImageList from "./ImageList"
import Radium from "radium"
import "./App.css"
import "./ImageList/imageList.css"

function App() {
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    const fetchImageData = async () => {
      await axios.get("http://127.0.0.1:5000/").then(res => {
        const images = res.data
        // console.log(images)

        images.forEach(entry => {
          entry.size = 0.05
          entry.color = "white"
        })
        setMarkers(images)
      })
    }
    fetchImageData()
  }, [])
  return (
    <>
      {markers.length != 0 && <Globe markers={markers} />}
      {markers.length != 0 && <ImageList images={markers} />}
    </>
  )
}

export default App
