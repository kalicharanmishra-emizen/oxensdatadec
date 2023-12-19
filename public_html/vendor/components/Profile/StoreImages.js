import React,{ useEffect, useState }from 'react'
import { useDispatch } from 'react-redux'
import { Button, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { callApi } from '../../Helper/helper';
import { getProfile } from "reducers/authSlice";
import { apiFail } from '../../reducers/mainSlice';
import NProgress from 'nprogress';
export default function StoreImages(props) {
    const dispatch = useDispatch()
    const [mainTemp, setMainTemp] = useState(null)
    const [otherTemp, setOtherTemp] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [otherImage, setOtherImage] = useState([])
    useEffect(() => {
        let mainImageRaw = props.images.find(data=>{
            return data.img_type==='main'
        })
        let otherImageRaw = props.images.filter(data=>{
            return data.img_type==='other'
        })
        setMainImage((mainImageRaw === undefined)?null:mainImageRaw);
        setOtherImage(otherImageRaw)
    }, [props.images])

    const uploadImage = async (e) =>{
        let formData = new FormData();
        formData.append('type',e.target.getAttribute('datafor'))
        if(e.target.getAttribute('datafor') == 'other'){
            formData.append('image',otherTemp)
            setOtherTemp(null);
            document.getElementById('otherImage').value =''
        }else{
            formData.append('image',mainTemp)
            setMainTemp(null);
            document.getElementById('mainImage').value =''
        }
        // props.setLoaderStatus(true);
        try {
            NProgress.start()
            await callApi('post','/auth/savevendorimages',formData,{'Content-Type': 'multipart/form-data'});
            dispatch(getProfile())
        } catch (e) {
            dispatch(apiFail(e))
        }
        
        
    }
    const mainImageChange = (e) =>{
        setMainTemp(e.target.files[0])
    }
    const otherImageChange = (e) =>{
        setOtherTemp(e.target.files[0])
    }
    const removeImage = async (e) => {
        let imgId = e.target.getAttribute('imgid');
        try {
            NProgress.start()
            await callApi('post','/auth/removevendorimages',{imgId:imgId});
            dispatch(getProfile())  
        } catch (e) {
            dispatch(apiFail(e))
        }
    }
    return (
        <div className="profile-block">
        <Form>
            <div className="pl-lg-4">
                <Row>
                    <Col lg="8">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="old_pass"
                            >
                                Big Images
                            </label>
                            <Input
                                type="file"
                                id="mainImage"
                                className="form-control-alternative"
                                onChange={mainImageChange}
                            />

                            {(mainTemp != null)?
                                    <Button
                                        className="btn btn-success mt-4"
                                        type="button"
                                        datafor="main"
                                        onClick={uploadImage}
                                    >
                                        Upload    
                                    </Button>
                                :""
                            }
                        </FormGroup>
                    </Col>
                    <Col lg="4">
                        <h4>
                            Preview Image
                        </h4>
                        <img
                            className="img-fluid"
                            src={(mainTemp != null)?URL.createObjectURL(mainTemp):require('assets/img/theme/img01.jpg')}
                            alt="preview image"
                        />
                    </Col>
                    <Col lg="12">
                        <h4> Upload Image</h4>
                        {mainImage?
                            <div className="img-block">
                                <img
                                    src={mainImage.image}
                                    className="img-fluid"
                                />
                                <span role="button" imgid={mainImage._id} onClick={removeImage}>&times;</span>
                            </div>
                        :
                        ''
                        }
                        
                    </Col>


                    <Col lg="8">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="old_pass"
                            >
                                Other Images
                            </label>
                            <Input
                                type="file"
                                id="otherImage"
                                className="form-control-alternative"
                                onChange={otherImageChange}
                            />
                            {(otherTemp != null)?
                                    <Button
                                        className="btn btn-success mt-4"
                                        type="button"
                                        datafor="other"
                                        onClick={uploadImage}
                                    >
                                        Upload    
                                    </Button>
                                :""
                            }
                        </FormGroup>
                    </Col>
                    <Col lg="4">
                        <h4>
                            Preview Image
                        </h4>
                        <img
                            className="img-fluid"
                            src={(otherTemp != null)?URL.createObjectURL(otherTemp):require('assets/img/theme/img01.jpg')}
                            alt="preview image"
                        />
                    </Col>
                    <Col lg="12">
                        <h4> Upload Image</h4>
                        <Row>
                            {otherImage.map((value,key)=>(
                                <Col lg="3" key={key}>
                                    <div className="img-block">
                                    <img
                                        src={value.image}
                                        className="img-fluid"
                                    />
                                    <span role="button" imgid={value._id} onClick={removeImage}>&times;</span>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        
                    </Col>
                </Row>
                
            </div>
        </Form>
    </div>
    )
}
