import HomeLayout from "../layouts/home"
import { Container, Row, Col, Form, FormGroup, Input,  Button} from 'reactstrap'
import Image from 'next/image'
import {useRouter} from "next/router";
import React, { useCallback, useEffect, useState } from 'react';
import 'react-slideshow-image/dist/styles.css'
import {Zoom} from 'react-slideshow-image';
import catImg1 from '../public/images/cat-img7.png';
import catImg2 from '../public/images/cat-img8.png';
import catImg3 from '../public/images/cat-img9.png';
import catImg4 from '../public/images/cat-img10.png';
import catImg5 from '../public/images/cat-img11.png';
import catImg6 from '../public/images/cat-img12.png';
import catImg7 from '../public/images/cat-img13.png';
import catImg8 from '../public/images/cat-img14.png';
import catImg9 from '../public/images/cat-img15.png';
import catImg10 from '../public/images/cat-img16.png';
import catImg11 from '../public/images/cat-img17.png';
import catImg12 from '../public/images/cat-img18.png';
import catImg13 from '../public/images/cat-img19.png';
import work from '../public/images/work-1.svg';
import work2 from '../public/images/work-2.svg';
import work3 from '../public/images/work-3.svg';
import RightArrow from '../public/images/right-arrow.svg';
import styles from "../styles/Home.module.css";
import { debounce } from "lodash";
function Index(props) {
  let autoComplete = null
  let  google = null
  const router = useRouter()
  const [location,setLocation] = useState({
    input:"",
    data:''
  })
  console.log("location input", location);
  const [predection,setPredection] = useState({
    loading:true,
    data:[]
  })
  useEffect(()=>{
    if (window.google) {
      google = window.google;
      autoComplete = new google.maps.places.AutocompleteService();
    }
  },[])
  const debounceLoad = useCallback(
    debounce(
        (value)=>{
            if (value!='' && value.length > 2) {                    
              autoComplete.getQueryPredictions({ input: value }, displaySuggestions);
            }else if (value=='') {
              setPredection({
                loading:true,
                data:[]
              })
            }
        }
        , 1000)
    , []
  );
  
  const displaySuggestions = (predictions) =>{
    let tempArray=[]
    if (predictions && predictions.length > 0 ) {
        predictions.forEach(list=>tempArray.push({
            place_id:list.place_id,
            title:list.structured_formatting.main_text,
            description:list.structured_formatting.secondary_text
        }))
    }
    setPredection({
        loading:false,
        data:tempArray
    })     
  }

  const hangelLocationSelect = (e)=>{
    let place_id = e.currentTarget.getAttribute('value')
    google = window.google;
    const geoCode = new google.maps.Geocoder()
    geoCode.geocode({ placeId: place_id }).then(({results}) => {
      if (results[0]) {
        location.input = results[0].formatted_address;
        location.data = results[0];
        setLocation({...location})
        setPredection({
          loading:true,
          data:[]
        })
      } else {
          console.log("No results found");
      }
    })
      .catch((e) => console.log("Geocoder failed due to: " + e));
  }


  const redirectStoreList=(e)=>{
    e.preventDefault()
    if (location.data!='') {
      let area = location.data.address_components.find(temp=>
        _.isEqual(temp.types,[
            "political",
            "sublocality",
            "sublocality_level_1"
        ])
      )
      router.push({
        pathname:'/store',
        query:{
          area:area?area.long_name:null,
          lat:location.data.geometry.location.lat(),
          lng:location.data.geometry.location.lng()
        }
      })  
    }
  }
  /* banner image start */
    const images = [
      {
        image:`${process.env.BASE_URL}/images/img1.png`,
        title:"Hungry?",
        des:"Order food from favourite restaurants near you."
      },
      {
        image:`${process.env.BASE_URL}/images/img2.png`,
        title:"Buy groceries",
        des:"and feed yourself, even on the road"
      }    
    ];

    const zoomOutProperties = {
      indicators: false,
      arrows: false,
      scale: 0.4,
      pauseOnHover: false,
      duration: 6000,
      transitionDuration: 800  
    } 
  /* banner image end */
  return (
    <>
      <section className={`${styles.banner}`}>      
        <div className="table-wrap">
          <div className="align-wrap">
            <Container className={`${styles.container}`}>
              <Zoom {...zoomOutProperties}>
                {images.map((each, index) => (
                  <div key={index} style={{width: "100%",height:"auto"}}>
                    <Row>
                      <Col md="6" className="order-md-1 order-2">
                        <div className={`${styles.bannerContent}`}>
                          <h2>{each.title}</h2>
                          <p>{each.des}</p>                          
                        </div>
                      </Col>
                      <Col md="6" className={`${styles.textRight} order-md-2 order-1`}>               
                        <img style={{objectFit:"cover",width:"100%"}} src={each.image} />
                      </Col>
                    </Row>
                  </div>
                ))}
              </Zoom>
              <div className={`${styles.formWrap}`}>
                <Form onSubmit={redirectStoreList}>
                  <FormGroup className={`${styles.formGroup}`}>
                    <Input 
                      type="search" 
                      onChange={
                        (e)=>{
                          location.input=e.target.value
                          setLocation({...location})
                          debounceLoad(e.target.value)
                        }
                      }
                      value={location.input}
                      className={`${styles.formCantrol}`} 
                      placeholder="Enter Your Full Address" 
                    />
                    <Button 
                      type="submit" 
                      className={`${styles.searchBtn}`}
                    >
                      <Image src={RightArrow} alt="Submit" />
                    </Button>
                  </FormGroup>
                </Form>
                <div className={`searchSuggestion ${predection.loading?"":"active"}`}>
                  {
                      predection.data.length==0?
                          <span className="predectionList">No data found</span>
                      :predection.data.map(list=>(
                          <span className="predectionList" onClick={hangelLocationSelect} key={list.place_id} value={list.place_id}> 
                              <h4>{list.title}</h4>
                              {list.description}
                          </span>
                      ))
                  }
                </div>
              </div>
            </Container>
          </div>
        </div>              
      </section>
    
      <section className={`${styles.catSection}`}>
        <Container className={`${styles.container}`}>
          <div className={`${styles.sectionTitle}`}>
            <h2>Work With Us</h2>
          </div>
          <Row className={`${styles.row}`}>
            <Col xl="6">
              <span role="button">
                <a className={`${styles.catItem}`}>
                  <div className={`${styles.catTitle}`}>
                    <h3>Grocery Categories</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                    <span className={`${styles.catArrow}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
                      </svg>
                    </span>
                  </div>
                                 
                    <Row className={`${styles.row}`}>
                      <Col md="4" sm="6" className="col-6">
                        <div className={`${styles.catImg}`} style={{backgroundImage: `url('https://oxens.ezxdemo.com/images/cat-img1.png')`}} >
                          <span>vegetable</span>
                        </div>
                      </Col>
                      <Col md="4" sm="6" className="col-6">
                        <div className={`${styles.catImg}`} style={{backgroundImage: `url('https://oxens.ezxdemo.com/images/cat-img2.png')`}}>
                          <span>fruits</span>
                        </div>
                      </Col>
                      <Col md="4" sm="6" className="col-6">
                        <div className={`${styles.catImg}`} style={{backgroundImage: `url('https://oxens.ezxdemo.com/images/cat-img3.png')`}}>
                          <span>confectionery</span>
                        </div>
                      </Col>
                      <Col md="4" sm="6" className="col-6">
                        <div className={`${styles.catImg}`} style={{backgroundImage: `url('https://oxens.ezxdemo.com/images/cat-img4.png')`}}>
                          <span>drinks</span>
                        </div>
                      </Col>
                      <Col md="4" sm="6" className="col-6">
                        <div className={`${styles.catImg}`} style={{backgroundImage: `url('https://oxens.ezxdemo.com/images/cat-img5.png')`}}>
                          <span>crisps, snacks and nuts</span>
                        </div>
                      </Col>
                      <Col md="4" sm="6" className="col-6">
                        <div className={`${styles.catImg}`} style={{backgroundImage: `url('https://oxens.ezxdemo.com/images/cat-img6.png')`}}>
                          <span>biscuits, cakes and des....</span>
                        </div>
                      </Col>
                    </Row>
                </a>
              </span>
            </Col>            
            <Col xl="6">
              <span role="button">
                <a className={`${styles.catItem}`}>
                  <div className={`${styles.catTitle}`}>
                    <h3>Restaurants</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                    <span className={`${styles.catArrow}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
                      </svg>
                    </span>
                  </div>
                  <Row className={`${styles.row}`}>
                    <Col md="3" sm="6" className="col-6">
                      <div className={`${styles.catImg}`}>
                        <div className={`${styles.tableWrap}`}>
                          <div className={`${styles.alignWrap}`}>
                          <Image src={catImg1} alt="catImg" />
                        </div>
                        </div>                        
                      </div>
                    </Col>
                    <Col md="3" sm="6" className="col-6">
                      <div className={`${styles.catImg}`}>
                        <div className={`${styles.tableWrap}`}>
                          <div className={`${styles.alignWrap}`}>
                          <Image src={catImg2} alt="catImg" />
                        </div>
                        </div>
                      </div>
                    </Col>
                    <Col md="3" sm="6" className="col-6">
                      <div className={`${styles.catImg}`}>
                        <div className={`${styles.tableWrap}`}>
                          <div className={`${styles.alignWrap}`}>
                          <Image src={catImg3} alt="Banner Img" />
                        </div>
                        </div>
                      </div>
                    </Col>
                    <Col md="3" sm="6" className="col-6">
                      <div className={`${styles.catImg}`}>
                        <div className={`${styles.tableWrap}`}>
                          <div className={`${styles.alignWrap}`}>
                          <Image src={catImg4} alt="Banner Img" />
                        </div>
                        </div>
                      </div>
                    </Col>
                    <Col md="3" sm="6" className="col-6">
                      <div className={`${styles.catImg}`}>
                        <div className={`${styles.tableWrap}`}>
                          <div className={`${styles.alignWrap}`}>
                          <Image src={catImg5} alt="Banner Img" />
                        </div>
                        </div>
                      </div>
                    </Col>
                    <Col md="3" sm="6" className="col-6">
                      <div className={`${styles.catImg}`}>
                        <div className={`${styles.tableWrap}`}>
                          <div className={`${styles.alignWrap}`}>
                          <Image src={catImg6} alt="Banner Img" />
                        </div>
                        </div>
                      </div>
                    </Col>
                    <Col md="3" sm="6" className="col-6">
                      <div className={`${styles.catImg}`}>
                        <div className={`${styles.tableWrap}`}>
                          <div className={`${styles.alignWrap}`}>
                          <Image src={catImg7} alt="Banner Img" />
                        </div>
                        </div>
                      </div>
                    </Col>
                    <Col md="3" sm="6" className="col-6">
                      <div className={`${styles.catImg}`}>
                        <div className={`${styles.tableWrap}`}>
                          <div className={`${styles.alignWrap}`}>
                          <Image src={catImg8} alt="Banner Img" />
                        </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </a>
              </span>
            </Col>
            <Col xl="6">
              <span role="button">
                <a className={`${styles.catItem}`}>
                  <div className={`${styles.catTitle}`}>
                    <h3>Cuisines</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                    <span className={`${styles.catArrow}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
                      </svg>
                    </span>
                  </div>

                  <div className={`${styles.animationEffact}`}>     
                    {/* <svg className={`${styles.animationEffactSVG}`} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 410 190" style={{enableBackground:"new 0 0 410 190"}} xmlSpace="preserve"><style type="text/css">
                      {`.st0{position: relative; top: -15px;opacity:0.5;fill:#0F4122;} .st0,.st1 {opacity:0.5;fill:#114D3F;transition: transform 2s ease; transform: translateX(50%);} svg:hover .st0{transform: none;} svg:hover .st1 {transform: translateX(-25%);}`} </style><circle className="st0" cx="103.6" cy="153.7" r="44.5"/><circle className="st1" cx="508.6" cy="242.7" r="44.5"/></svg> */}
                    <Row className={`${styles.row} justify-content-between` }>
                      <Col sm="9" className="col-8">
                        <div className={`${styles.catImg}`}>
                          <div className={`${styles.tableWrap}`}>
                            <div className={`${styles.alignWrap}`}>
                            <Image src={catImg9} alt="Banner Img" />
                          </div>
                          </div>
                          <span className={`${styles.catAnimation}`}></span>
                        </div>
                      </Col>
                      <Col sm="3" className="col-4 text-right text-sm-center">
                        <div className={`${styles.catImg}`}>
                          <div className={`${styles.tableWrap}`}>
                            <div className={`${styles.alignWrap}`}>
                            <Image src={catImg10} alt="Banner Img" />
                          </div>
                          </div>
                        </div>
                      </Col>
                      <Col md="3" className="col-4 d-none d-md-block">
                        <div className={`${styles.catImg}`}>
                          <div className={`${styles.tableWrap}`}>
                            <div className={`${styles.alignWrap}`}>
                            <Image src={catImg11} alt="Banner Img" />
                          </div>
                          </div>
                        </div>
                      </Col>
                      <Col md="3" className="col-4 text-right text-sm-center">
                        <div className={`${styles.catImg}`}>
                          <div className={`${styles.tableWrap}`}>
                            <div className={`${styles.alignWrap}`}>
                            <Image src={catImg12} alt="Banner Img" />
                          </div>
                          </div>
                        </div>
                      </Col>
                      <Col md="6" sm="8" className="col-8">
                        <div className={`${styles.catImg}`}>
                          <div className={`${styles.tableWrap}`}>
                            <div className={`${styles.alignWrap}`}>
                            <Image src={catImg13} alt="Banner Img" />
                          </div>
                          </div>
                          <span className={`${styles.catAnimation}`}></span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </a>
              </span>
            </Col>
            <Col xl="6">
              <span role="button">
                <a className={`${styles.catItem}`}>
                  <div className={`${styles.catTitle}`}>
                    <h3>Restaurant categories</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                    <span className={`${styles.catArrow}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
                      </svg>
                    </span>
                  </div>
                  <Row className={`${styles.row}`}>
                    <Col md="3" className="col-6">
                      <div className={`${styles.catImg}`} style={{backgroundImage: `url('https://oxens.ezxdemo.com/images/cat-img20.png')`}}></div>
                    </Col>
                    <Col md="3" className="col-6">
                      <div className={`${styles.catImg}`} style={{backgroundImage: `url('https://oxens.ezxdemo.com/images/cat-img21.png')`}}></div>
                    </Col>
                    <Col md="3" className="col-6">
                      <div className={`${styles.catImg}`} style={{backgroundImage: `url('https://oxens.ezxdemo.com/images/cat-img22.png')`}}></div>
                    </Col>
                    <Col md="3" className="col-6">
                      <div className={`${styles.catImg}`} style={{backgroundImage: `url('https://oxens.ezxdemo.com/images/cat-img23.png')`}}></div>
                    </Col>
                  </Row>
                </a>
              </span>
            </Col>
          </Row>
        </Container>
      </section>
    
      <section className={`${styles.workUs}`}>
        <Container>
          <div className={`${styles.sectionTitle}`}>
            <h2>Work With Us</h2>
          </div>
          <Row>
            <Col lg="4" md="6">
              <div className={`${styles.workWrap}`}>
                <div className={`${styles.imgBlock}`}>
                  <Image src={work} alt="Banner Img" />
                </div>
                <h4>Become a Rider</h4>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className={`${styles.workWrap}`}>
                <div className={`${styles.imgBlock}`}>
                  <Image src={work2} alt="Banner Img" />
                </div>
                <h4>Register as Restaurant/ Grocery Store</h4>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className={`${styles.workWrap}`}>
                <div className={`${styles.imgBlock}`}>
                  <Image src={work3} alt="Banner Img" />
                </div>
                <h4>Career</h4>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      </>
  ) 
}
Index.layout = HomeLayout
export default Index