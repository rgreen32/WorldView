import React, { useState } from "react"
import ReactDOM from "react-dom"
import ReactGlobe from "react-globe"

import defaultMarkers from "./markers"

function getTooltipContent(marker) {
  return `CITY: ${marker.city} (Value: ${marker.value})`
}

function App() {
  const randomMarkers = defaultMarkers.map(marker => ({
    ...marker,
    value: Math.floor(Math.random() * 100)
  }))
  const [markers, setMarkers] = useState([])
  const [event, setEvent] = useState(null)
  const [details, setDetails] = useState(null)
  function onClickMarker(marker, markerObject, event) {
    setEvent({
      type: "CLICK",
      marker,
      markerObjectID: markerObject.uuid,
      pointerEventPosition: { x: event.clientX, y: event.clientY }
    })
    setDetails(getTooltipContent(marker))
  }
  function onDefocus(previousCoordinates, event) {
    setEvent({
      type: "DEFOCUS",
      previousCoordinates,
      pointerEventPosition: { x: event.clientX, y: event.clientY }
    })
    setDetails(null)
  }

  return (
    <div style={{ width: "100vw", height: "50vh" }}>
      <ReactGlobe
        markers={markers}
        markerOptions={{
          getTooltipContent
        }}
        onClickMarker={onClickMarker}
        onDefocus={onDefocus}
      />
      {details && (
        <div
          style={{
            background: "white",
            position: "absolute",
            fontSize: 20,
            top: 0,
            right: 0,
            padding: 12
          }}
        >
          <p>{details}</p>
          <p>
            EVENT: type={event.type}, position=
            {JSON.stringify(event.pointerEventPosition)})
          </p>
        </div>
      )}
      <button onClick={() => setMarkers(randomMarkers)}>
        Randomize markers
      </button>
      <button disabled={markers.length === 0} onClick={() => setMarkers([])}>
        Clear markers
      </button>
      <button
        disabled={markers.length === randomMarkers.length}
        onClick={() => setMarkers([...markers, randomMarkers[markers.length]])}
      >
        Add marker
      </button>
      <button
        disabled={markers.length === 0}
        onClick={() => setMarkers(markers.slice(0, markers.length - 1))}
      >
        Remove marker
      </button>
    </div>
  )
}

export default App
