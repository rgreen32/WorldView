import React, { useState, useEffect } from "react"
import { Spinner, Row, Col } from "reactstrap"
import axios from "axios"
import Globe from "./Globe"
import ImageList from "./ImageList"
import ImgsViewer from "react-images-viewer"
import Sparkle from "react-sparkle"
import { Tween, Easing, update } from "es6-tween"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
  toast.configure()

  // useEffect(() => {
  //   console.log("Ready?", loadingGlobe)
  // }, [loadingGlobe])

  useEffect(() => {
    if (fetchingData) {
      const fetchImageData = async () => {
        try {
          await axios.get("./images").then(res => {
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
        } catch (error) {
          toast.error("Couldn't get image list. :(")
        }
      }

      fetchImageData()

      setFetchingData(false)
    }
  }, [fetchingData])
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            #logo {
              transition: transform 0.2s;
            }
      
            #logo:hover {
              transform: scale(
                1.5
              ); 
            }
    `
        }}
      />
      <a
        href="https://greenboy.io"
        style={{
          pointerEvents: "all",
          zIndex: 50,
          position: "fixed",
          top: "25px",
          left: "30px"
        }}
        class="navbar-brand"
      >
        <img id="logo" height="40px" width="40px" src="./logo.png" />
      </a>
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
      <Row
        style={{ margin: 0, pointerEvents: "all" }}
        className="justify-content-end"
      >
        {markers.length != 0 && !loadingGlobe ? (
          <ImageList
            images={markers}
            setFocusedMarker={setFocusedMarker}
            focusedMarker={focusedMarker}
            setHoverFocusedMarker={setHoverFocusedMarker}
            setVisible={setVisible}
            setImage={setImage}
            setFetchingData={setFetchingData}
          />
        ) : fetchingData ? (
          <Col
            style={{
              margin: 0,
              position: "absolute",
              minWidth: "200px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            sm={3}
            className="text-center"
          >
            <Spinner color="secondary" />
          </Col>
        ) : (
          <></>
        )}
      </Row>
      <Row
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          pointerEvents: "none"
        }}
        className="justify-content-center align-items-center"
      >
        <Col className="text-center">
          {loadingGlobe && <Spinner color="secondary" />}
        </Col>
      </Row>
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
      <h6
        style={{
          color: "white",
          position: "absolute",
          left: 30,
          top: 100
        }}
      >
        Powered by Unsplash.com
      </h6>
    </>
  )
}

export default App
