import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import axios from "axios"
import Globe from "./Globe"
import ImageList from "./ImageList"
import Radium from "radium"
import "./App.css"

function App() {
  const [markers, setMarkers] = useState([])
  const [focusedMarker, setFocusedMarker] = useState(null)
  const [hoverFocusedMarker, setHoverFocusedMarker] = useState(null)

  useEffect(() => {
    const fetchImageData = async () => {
      await axios.get("http://127.0.0.1:5000/").then(res => {
        const images = res.data

        images.forEach((entry, index) => {
          entry.id = index
          entry.size = 0.04
          entry.color = "gold"
          entry.alt = 0.02
          entry.radius = 2
        })
        setMarkers(images)
      })
    }
    fetchImageData()
  }, [])
  return (
    <>
      {markers.length != 0 && (
        <Globe
          markers={markers}
          setFocusedMarker={setFocusedMarker}
          focusedMarker={focusedMarker}
          hoverFocusedMarker={hoverFocusedMarker}
        />
      )}
      {markers.length != 0 && (
        <ImageList
          images={markers}
          setFocusedMarker={setFocusedMarker}
          focusedMarker={focusedMarker}
          setHoverFocusedMarker={setHoverFocusedMarker}
        />
      )}
    </>
  )
}

export default App
