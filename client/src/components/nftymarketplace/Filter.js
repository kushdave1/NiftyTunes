import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import ArtistFilter from '../nftymarketplace/GalleryFilters/ArtistFilter'
import { useFilterGallery } from "../../providers/GalleryProvider/FilterGalleryProvider";

function FullFilterBar() {

    const { galleryTokenIds, setGalleryTokenIds }  = useFilterGallery()


    return (
    <FilterContainer>
            <FilterRow>
                <Col md={2}>
                <ArtistFilter>
                <Dropdown.Toggle className="btn" style={{background: "none", border: "none", width: "100%"}}>
                    Artist
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
                </ArtistFilter>
                </Col>
                <Col md={2}>
                <TierFilter></TierFilter>
                </Col>
                <Col md={2}>
                <TypeFilter></TypeFilter>
                </Col>
                <Col md={2}>
                <GenreFilter></GenreFilter>
                </Col>
                <Col md={2}>
                </Col>
                <Col md={2}>
                <SortFilter></SortFilter>
                </Col>
            </FilterRow>
        </FilterContainer>
    )
    }

export default FullFilterBar

const FilterContainer = styled.div`
    position: absolute;
    width: 1300px;
    height: 46px;
    left: calc(50% - 1300px/2 - 10px);
    top: 274px;
`

const FilterRow = styled(Row)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0px;
`

// const ArtistFilter = styled(Dropdown)`
//     display: flex;
//     flex-direction: row;
//     justify-content: center;
//     align-items: center;
//     gap: 10px;

//     width: 200px;
//     height: 46px;

//     /* white */

//     background: #FFFFFF;
//     border-radius: 30px;

// `

const TierFilter = styled.div`
    /* Auto layout */

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    width: 200px;
    height: 46px;

    /* white */

    background: #FFFFFF;
    border-radius: 30px;

`

const TypeFilter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    width: 200px;
    height: 46px;

    /* white */

    background: #FFFFFF;
    border-radius: 30px;
`

const GenreFilter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    width: 200px;
    height: 46px;

    /* white */

    background: #FFFFFF;
    border-radius: 30px;
`

const SortFilter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    width: 200px;
    height: 46px;

    /* white */

    background: #FFFFFF;
    border-radius: 30px;
`
