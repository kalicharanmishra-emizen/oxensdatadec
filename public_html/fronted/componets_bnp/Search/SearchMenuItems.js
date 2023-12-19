import React, { useEffect, useState } from 'react'
import { Col, Container, Form, FormGroup, Input, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import Link from 'next/link'
import Image from 'next/image'
import searchIocn from '../../public/images/search-iocn.svg';
import innerSearch from '../../public/images/inner-search.svg';
import closeIcon from '../../public/images/close-icon.svg';
import styles from "../../styles/search.module.css"
import { callApi } from '../../Helper/helper';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const SearchMenuItems = (props) => {
    const router = useRouter()
    const storeList = useSelector(state => state.storeSlice.storeList)
    const [searchText, setSearchText] = useState("")    
    const [itemObj, setItemObj] = useState("")    
    const [searchModal, setSearchModal] = useState(false) 
    const { area, lat, lng } = router.query
    const chagetext = async () => {
        try {
          const data = {
             filter:searchText,
             area:area,
             lat:lat,
             lng:lng,
             location:storeList.location
          }
          const res =  await callApi("post", "/front/search", data)
          console.log("search respone ", res.data.data);
          const storeItemData = res.data.data
          setItemObj(res.data.data)
        } catch (error) {
          console.log("error", error);
        }
      }

      const searchBox=()=>{
        if(document.body.classList.contains('searchBox-open')){
            document.body.classList.remove('searchBox-open')
            setSearchText("")
            setSearchModal(searchModal)
        }else{
            document.body.classList=''
            document.body.classList.add('searchBox-open')
            setSearchText("")
            setSearchModal(searchModal)
        }
      }
  
      useEffect(() => {
        searchText != "" ? chagetext() : "" 
      }, [searchText])
      console.log("searchModal------", searchModal);
      console.log("searchText", searchText);
      console.log("storeList", storeList);

  return (
    <>
        <span role="button" ><a onClick={searchBox}><Image src={searchIocn} alt="Search Iocn" /></a></span>
        <Form>
            <FormGroup>
                <span className="searchinner" onClick={()=>setSearchModal(!searchModal)} ><Image src={innerSearch} alt="Cart Icon" /></span>
                <Input type="search" name="filter" onClick={()=>setSearchModal(true)} value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search for Restaurant or Dishes" />
                <span className="search-close"  onClick={searchBox}><Image src={closeIcon} alt="Cart Icon" /></span>
            </FormGroup>
        </Form>

        <Container id={styles.searchBox}>
           
            { searchText ? 
               itemObj ? itemObj.map((item) => (
                    <div key={item._id} onClick={searchBox}>
                         <Link className={styles.searchLink} href={{
                            pathname:`/store/${item.vendorId}`,
                            query:{
                                area:area,
                                lat:lat,
                                lng:lng
                            }}}><a>
                              <Row>
                                <Col xl="4" lg="4" md="4" sm="2" >
                                    <div className={`${styles.imgBlock}`} style={{backgroundImage: `url(${item.item_img})`,}}> </div>
                                </Col>
                                <Col xl="4" lg="4" md="4" sm="2" >
                                    <div>
                                        <span>{item.title}</span>
                                    </div>
                                </Col>
                            </Row>
                        </a></Link>
                        <p>{item.title}</p>
                    </div>
                )) 
                : "" : ""
            } 
        </Container>
    </>
  )
}

export default SearchMenuItems