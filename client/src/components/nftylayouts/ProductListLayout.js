import {useState, useEffect} from 'react'

//Bootstrap
import Container from 'react-bootstrap/Container'
import CardGroup from 'react-bootstrap/CardGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import styled from 'styled-components'


function ProductListLayout({children}) {

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
            <NFTRow>
                  {children}
            </NFTRow>) : (
            <Container fluid style={{alignItems: "center"}}>
                  {children}
            </Container>
            )}
        </>
       
  )
}

export default ProductListLayout


const NFTRow = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 20px;

width: 1300px;
height: 382px;
flex-wrap: wrap;

`

const NFTRowMobile = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 20px;

width: 340px;
height: 1760px;

`