import React, { useState, useEffect } from "react"
import { Row, Col, Card, Button } from "reactstrap"
import { Tween, Easing, update } from "es6-tween"

const ImageList = props => {
  const [imageData, setImageData] = useState([])
  const [hasPages, setHasPages] = useState(false)
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState([])
  const [pageIndex, setPageIndex] = useState(0)

  useEffect(() => {
    const imageArray = props.images.slice()
    const pageLength = 5
    const quotient = Math.floor(imageArray.length / pageLength)

    const pageData = []

    for (let i = 0; i < quotient; i++) {
      pageData.push(imageArray.splice(0, pageLength))
    }

    if (imageArray > 0) {
      pageData.push(imageArray)
    }

    setPages(pageData)
    setHasPages(true)

    setCurrentPage(pageData[0])
    setPageIndex(0)
  }, [props.images])
  useEffect(() => {
    if (props.focusedMarker != null) {
      pages.forEach((page, x) => {
        page.forEach((item, y) => {
          if (props.focusedMarker == item.id) {
            setCurrentPage(pages[x])
            setPageIndex(x)
          }
        })
      })
    }
  }, [props.focusedMarker])

  return (
    <>
      <Row
        style={{ margin: 0, pointerEvents: "all" }}
        className="justify-content-end"
      >
        <Col
          style={{
            margin: 0,
            position: "absolute",
            minWidth: "200px",
            height: "100%"
          }}
          sm={3}
          className="text-center"
        >
          <div className="mt-3">
            <img
              id="refresh"
              className="mr-3"
              style={{ cursor: "pointer" }}
              onClick={() => {
                props.setFetchingData(true)
              }}
              onMouseEnter={() => {
                let icon = document.getElementById("refresh")
                console.log(icon)
                let coords = { x: 0 }
                var tween = new Tween(coords)
                  .to({ x: 360 }, 1000)
                  .easing(Easing.Quadratic.Out)
                  .on("update", () => {
                    icon.style.setProperty(
                      "transform",
                      `rotate(${coords.x}deg)`
                    )
                  })
                  .start()
              }}
              src="/refresh.png"
            ></img>

            {pages.map((page, index) => {
              if (index == pageIndex) {
                return (
                  <Button
                    key={index}
                    color="light"
                    outline={index != pageIndex}
                    style={{ borderRadius: 0 }}
                    onClick={() => {
                      setCurrentPage(pages[index])
                      setPageIndex(index)
                    }}
                  >
                    {index + 1}
                  </Button>
                )
              } else {
                return (
                  <Button
                    key={index}
                    color="light"
                    outline={index != pageIndex}
                    style={{ borderRadius: 0 }}
                    onClick={() => {
                      setCurrentPage(pages[index])
                      setPageIndex(index)
                    }}
                  >
                    {index + 1}
                  </Button>
                )
              }
            })}
          </div>
          {currentPage.map((img, index) => {
            return (
              <Card
                key={index}
                style={{
                  padding: 0,
                  backgroundColor: "black"
                }}
                className="mt-3"
                body
              >
                <Button
                  color="light"
                  outline={img.id != props.focusedMarker}
                  style={{
                    padding: 0,
                    width: "100%",

                    minHeight: "100px",

                    height: "100%",
                    textAlign: "right",
                    borderRadius: 0,
                    borderWidth: "2px"
                  }}
                  onClick={() => {
                    if (img.id != props.focusedMarker) {
                      props.setFocusedMarker(img.id)
                    } else {
                      props.setFocusedMarker(null)
                      props.setVisible(false)
                    }
                  }}
                  onMouseEnter={() => {
                    props.setHoverFocusedMarker(img.id)
                  }}
                  onMouseOut={() => {
                    props.setHoverFocusedMarker(null)
                  }}
                >
                  <h5 className="mt-2 mr-2" style={{}}>
                    {img.location}
                  </h5>
                  <h6 className="my-2 mr-2" style={{}}>
                    By {img.userName}
                  </h6>
                </Button>
              </Card>
            )
          })}
        </Col>
      </Row>
    </>
  )
}

export default ImageList
