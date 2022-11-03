import { useState, useEffect } from 'react'

//Bootstrap
import Container from 'react-bootstrap/Container'
import CardGroup from 'react-bootstrap/CardGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function CollectionListLayout({children}) {
  
  const [width, setWindowWidth] = useState()

  
  useEffect(async() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize",updateDimensions);
  }, []);

  const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

  const responsive = {
    showTopNavMenu: width > 1023
  }

  return (
        <>
        {(responsive.showTopNavMenu) ? (
        <Container fluid className="py-5" >
          
            <Row xs={1} md={4} style={{display: "flex"}}>
                  {children}
            </Row>
        
        </Container>

        ) : (

        <div className="py-5" style={{display: "flex", gap: "40px", flexDirection: "column", 
        alignItems: "center", position: "absolute", width: "340px", top: "262px", overflowX: "hidden", left: "calc(50% - 340px/2)"}}>
          
            <Row xs={1} md={1} style={{display: "flex"}}>
                  {children}
            </Row>
        
        </div>

        )}
        
       </>
  )
}

export default CollectionListLayout
