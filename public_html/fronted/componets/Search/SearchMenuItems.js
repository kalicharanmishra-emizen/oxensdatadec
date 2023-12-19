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
        filter: searchText,
        area: area,
        lat: lat,
        lng: lng,
        location: storeList.location
      }
      const res = await callApi("post", "/front/search", data)
      console.log("search respone ", res.data.data);
      const storeItemData = res.data.data
      setItemObj(res.data.data)
    } catch (error) {
      console.log("error", error);
    }
  }

  const searchBox = () => {
    if (document.body.classList.contains('searchBox-open')) {
      document.body.classList.remove('searchBox-open')
      setSearchText("")
      setSearchModal(searchModal)
    } else {
      document.body.classList = ''
      document.body.classList.add('searchBox-open')
      setSearchText("")
      setSearchModal(searchModal)
    }
  }

  useEffect(() => {
    searchText != "" ? chagetext() : ""
  }, [searchText])

  return (
    <>
      <span role="button" ><a onClick={searchBox}><Image src={searchIocn} alt="Search Iocn" /></a></span>
      <div className='search-wrapper'>
        <Form>
          <FormGroup>
            <span className="searchinner" onClick={() => setSearchModal(!searchModal)} ><Image src={innerSearch} alt="Cart Icon" /></span>
            <Input type="search" name="filter" onClick={() => setSearchModal(true)} value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search for Restaurant or Dishes" />
            <span className="search-close" onClick={searchBox}><Image src={closeIcon} alt="Cart Icon" /></span>
          </FormGroup>
        </Form>
          {
            searchText
              ? <div className='search-result-wrapper'>
                  <ul className='search-result'>
                    {
                      itemObj 
                        ? itemObj.map((item) => (
                            <Link 
                                key={item._id} 
                                className={styles.searchLink} 
                                href={
                                  {
                                    pathname: `/store/${item.vendorId}`,
                                    query: {
                                      area: area,
                                      lat: lat,
                                      lng: lng
                                    }
                                  }
                                }>
                              <li onClick={searchBox} >
                                  <div style={{ backgroundImage: `url(${item.item_img})`}} className="item-image"> </div>
                                  <div className='item-title'>
                                    <span>{item.title}</span>
                                  </div>
                              </li>
                            </Link>
                          ))
                        : ""
                    }
                  </ul>
                </div>
              : ""
          }
      </div>
    </>
  )
}

export default SearchMenuItems