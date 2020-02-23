import React, { useState, useEffect } from "react"
import { Button } from "reactstrap"
import axios from "axios"
import Globe from "./Globe"
import ImageList from "./ImageList"
import ImgsViewer from "react-images-viewer"
import Sparkle from "react-sparkle"
import "./App.css"

function App() {
  const [markers, setMarkers] = useState([])
  const [loadingGlobe, setLoadingGlobe] = useState(true)
  const [focusedMarker, setFocusedMarker] = useState(null)
  const [hoverFocusedMarker, setHoverFocusedMarker] = useState(null)
  const [visible, setVisible] = useState(false)
  const [image, setImage] = useState(null)
  const [imageCaption, setImageCaption] = useState(null)
  const [fetchingData, setFetchingData] = useState(true)
  const [enhanceHover, setEnhanceHover] = useState(false)
  const [enhanced, setEnhanced] = useState(false)

  useEffect(() => {
    if (fetchingData) {
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
      setFetchingData(false)
    }
  }, [fetchingData])
  return (
    <>
      {focusedMarker != null && (
        <ImgsViewer
          imgs={[{ src: image, caption: imageCaption }]}
          isOpen={visible}
          showCloseBtn={false}
          backdropCloseable={true}
          showImgCount={false}
          onClickImg={() => {
            setVisible(false)
            setFocusedMarker(null)
          }}
          onClose={() => {
            setVisible(false)
            setFocusedMarker(null)
          }}
        />
      )}
      <Globe
        markers={markers}
        setFocusedMarker={setFocusedMarker}
        focusedMarker={focusedMarker}
        hoverFocusedMarker={hoverFocusedMarker}
        setVisible={setVisible}
        setImage={setImage}
        setImageCaption={setImageCaption}
        setLoadingGlobe={setLoadingGlobe}
        enhanced={enhanced}
      />
      {markers.length != 0 && !loadingGlobe && (
        <ImageList
          images={markers}
          setFocusedMarker={setFocusedMarker}
          focusedMarker={focusedMarker}
          setHoverFocusedMarker={setHoverFocusedMarker}
          setVisible={setVisible}
          setImage={setImage}
          setFetchingData={setFetchingData}
        />
      )}
      <div
        style={{
          color: "white",
          position: "absolute",
          left: 40,
          bottom: 40,
          pointerEvents: "all",
          cursor: "pointer"
        }}
        onMouseEnter={() => {
          setEnhanceHover(true)
        }}
        onMouseOut={() => {
          setEnhanceHover(false)
        }}
        onClick={() => {
          setEnhanced(true)
        }}
      >
        <h1>Enhance</h1>

        {enhanceHover && !loadingGlobe && <Sparkle />}
      </div>
      >
    </>
  )
}

export default App
