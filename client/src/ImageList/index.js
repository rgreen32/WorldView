import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Card,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button
} from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Radium from "radium"
import color from "color"
import "./imageList.css"

import { faUserCircle } from "@fortawesome/free-solid-svg-icons"

const ImageList = props => {
  const [imageData, setImageData] = useState([])
  const [hasPages, setHasPages] = useState(false)
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState([])
  const [pageIndex, setPageIndex] = useState(0)
  const [activeButtonIndex, setActiveButtonIndex] = useState()

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
  }, [])

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
                  outline={index != activeButtonIndex}
                  style={{
                    padding: 0,
                    width: "100%",

                    minHeight: "100px",

                    height: "100%",
                    textAlign: "right",
                    borderRadius: 0
                  }}
                  onClick={() => {
                    if (index != activeButtonIndex) {
                      setActiveButtonIndex(index)
                    } else {
                      setActiveButtonIndex(null)
                    }
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
          <div style={{ position: "absolute", bottom: 50, left: 150 }}>
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
                      setActiveButtonIndex(null)
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
                      setActiveButtonIndex(null)
                    }}
                  >
                    {index + 1}
                  </Button>
                )
              }
            })}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default ImageList

const styles = {
  panel: {
    backgroundColor: "black",
    color: "white",
    width: "100%",
    border: "2px solid white",
    borderRadius: 0,
    ":hover": {
      color: "#ffffff",
      cursor: "pointer"
    },
    "@media (max-width: 700px)": {
      backgroundColor: "#ff0000"
    }
  }
}
