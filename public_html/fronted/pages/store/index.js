import { Container, Row, Col, FormGroup, Input, Form, ModalBody, ModalHeader, Modal} from 'reactstrap'
import Storelayout from "../../layouts/Store"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react';
import styles from "../../styles/store-list.module.css";
import Sidebar from '../../componets/posts/sidebar'
import { getStoreList, setFilterStoreList } from '../../reducers/storeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Stars from '../../componets/rating/stars';
function Index() {

    const router = useRouter()
    const dispatch = useDispatch()
    const loadingRef = useRef()
    const storeList = useSelector(state => state.storeSlice.storeList)
    const [filterValue, setFilterValue] = useState(null)
    const [searchModal, setSearchModal] = useState(false)
    const [nextPage, setNextPage] = useState(null)

    const getFilterValue = (value) => {
      let filterValue = value
      filterValue.lat = router.query.lat || 0
      filterValue.lng = router.query.lng || 0
      dispatch(setFilterStoreList(filterValue))
      setFilterValue(filterValue)
    }
    
    useEffect(() => {
        setNextPage(storeList.paginate.nextPage)
    }, [storeList])

    useEffect(() => {
        var options = {
          root: null, // Page as root
          rootMargin: '0px',
          threshold: 1.0
        };
        // Create an observer
        let observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              if (nextPage && entry.target.getAttribute('page') < nextPage) {
                entry.target.setAttribute('page',nextPage)
                dispatch(getStoreList(filterValue,nextPage))
              }
            }
          },
          options
        );
        if (loadingRef.current) {
          observer.observe(loadingRef.current);
        }
    }, [nextPage])

    return (
        <>
          <section className={`${styles.listingSection}`}>
            <Container fluid={true}>
              <Row>
                <Col xl="2" lg="3">
                  <Sidebar
                    getFilterValue={getFilterValue}
                  />
                </Col>
                <Col xl="10" lg="9">
                  <Row className={`${styles.innerRow}`}>
                    {storeList?.doc?.map((list)=>(
                        <Col xl="3" lg="4" md="4" sm="6" key={list._id}>
                            <Link href={{
                                pathname:`/store/${list._id}`,
                                query:{
                                  area:router.query.area,
                                  lat:router.query.lat,
                                  lng:router.query.lng
                                }
                              }}>
                              <a>
                                <div className={`${styles.listItem}`}>
                                  <div className={`${styles.imgBlock}`} style={{backgroundImage: `url(${list.pro_image})`,}}>
                                    {
                                      (
                                        Object.keys(list.discount).length!=0 && 
                                        (
                                          (
                                            list.discount.discountType==0 && 
                                            list.discount.discountValue > 0
                                          ) 
                                          || 
                                          (
                                            list.discount.discountType==1 && 
                                            list.discount.maxDiscount > 0
                                          )
                                        )
                                      ) ? list.discount.discountType == 0 
                                          ?  <span className={`${styles.offPrice}`}>
                                               <h6>{list.discount.discountValue}% Off</h6>
                                               { list.discount.maxDiscount > 0 ? <p>Off upto £{list.discount.maxDiscount}</p> : "" }
                                             </span>
                                          :  <span className={`${styles.offPrice}`}>
                                               <h6>Flat £{list.discount.maxDiscount} Off</h6>
                                             </span>
                                         : ""
                                    }
                                  </div>
                                  <div className={`${styles.listInfo}`}>
                                    <h6>{list.name}</h6>
                                    <div className={`${styles.ratingGroup}`}>
                                      { 
                                        list?.storeRating?.avg != null 
                                          ?  <Stars data={list?.storeRating?.avg}/> 
                                          : "" 
                                      }  
                                      { 
                                        list?.storeRating?.avg != null 
                                          ? <span className={`${styles.totleRating}`}>{list?.storeRating?.avg ?? ""}</span> 
                                          : "" 
                                      }
                                    </div>
                                    <p>{Array.prototype.map.call(list.categorys, cat => ` ${cat.title}`).toString()}</p>
                                    {/* <span className={`${styles.deliverTime}`}>Deliver in 25-45 mins</span> */}
                                  </div>
                                </div>
                              </a>
                            </Link>
                        </Col>
                    ))}
                  </Row>
                  {
                    storeList.paginate.nextPage
                      ? <Row>
                          <Col xl="12">
                            <div
                              className="loaderListing"
                              id="nprogress"
                              ref={loadingRef}
                              page={1}
                            >
                              <div className="spinner" role="spinner"><div className="spinner-icon"></div></div>
                            </div>
                          </Col>
                        </Row>
                      : ""
                  }
                </Col>
              </Row>
            </Container>
          </section>        
        </>
  )
 
}
Index.layout = Storelayout
export default Index
