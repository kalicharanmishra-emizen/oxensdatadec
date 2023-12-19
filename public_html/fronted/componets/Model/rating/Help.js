import React, { useEffect, useState } from 'react'
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'
import Image from 'next/image'
import styles from "../../../styles/my-order.module.css";
import FileUpload from '../../../public/images/file-upload.svg';
import * as yup from 'yup'
import { Formik } from 'formik';
import { callApi } from '../../../Helper/helper';

const Help = (props) => {
    const [help, helpPopup] = useState(false);
    const [helpData, sethelpData] = useState({})
    const [ratingModel, setRatingModel] = useState({})
    const [fileImage, setFileImage] = useState(null)
    const validateSchema = yup.object().shape(
        {
            selectReason: yup.string().required('Reason is required'),
            description : yup.string().required('description is required'),
        }
    )

    const imgUpload = (e) => {
        setFileImage(e.target?.files[0])
    }

    const onformSubmit = async (value) => {
        try {
            let convertFormData= new FormData();
            Object.keys(value).forEach( key => {
                convertFormData.append(key,value[key])
            })
            if (fileImage) {
                convertFormData.append('file',fileImage)
            }

            let res = await callApi('post','/rating/help',convertFormData)
            if (res) {
                console.log("res", res);
                helpPopup(false) 
            }  
        } catch (error) {
          console.log("help form submit error", error);
        }
    }
    useEffect(()=>{
        sethelpData({
            storeId:props.selectData?.storeDetail?._id ?? "",
            orderId:props.selectData?._id ?? "",
            selectReason:"",
            description:""
        })
        helpPopup(props.isOpen)
    },[props.isOpen])
    
  return (
    <Modal isOpen={help} toggle={() => props.helpPopup()} className={`${styles.helpPopup}`}>
        <ModalHeader className={`${styles.modalHeader}`}>Help</ModalHeader>
        <span className={`${styles.closeButton}`} onClick={() => props.helpPopup()}></span>
        <ModalBody className={`${styles.modalBody}`}>
            <div className={`${styles.helpPopupWrap}`}>
                <span className={`${styles.helpTitle}`}>Order ID : <span>#{props?.selectData?._id}</span></span>
                <Formik
                    enableReinitialize
                    initialValues={helpData}
                    validationSchema={validateSchema}
                    onSubmit={onformSubmit}
                >{(formprops) => (
                    <Form onSubmit={formprops.handleSubmit}>
                        <FormGroup>
                            <Input id="exampleSelect" name="selectReason" type="select"  onChange={formprops.handleChange}>
                                <option value="">Select reason</option>
                                <option value="1" >Reason 1</option>
                                <option value="2" >Reason 2</option>
                                <option value="3" >Reason 3</option>
                                <option value="4" >Reason 4</option>
                                <option value="5" >Reason 5</option>
                            </Input>
                            {formprops.touched.selectReason && formprops.errors.selectReason ? <div className="form-error">{formprops.errors.selectReason}</div> : null}
                        </FormGroup>
                        <FormGroup>
                            <Input id="exampleText" name="description" type="textarea" value={formprops.values.description} onChange={formprops.handleChange} placeholder="Description" />
                            {formprops.touched.description && formprops.errors.description ? <div className="form-error">{formprops.errors.description}</div> : null}
                        </FormGroup>
                        <FormGroup>
                            <div className={`${styles.fileSelector}`}>
                                <Label for="fileSelector">
                                    <span>Upload your Image</span>
                                    <span className={`${styles.fileIcon}`}>
                                        <Image src={FileUpload}  alt="File" name='file'/>
                                    </span>
                                    <Input type="file" id="fileSelector" name='file' onChange={imgUpload}/>
                                </Label>
                            </div>
                        </FormGroup>
                        <div className={`${styles.btnBlock}`}>
                            <Button type="submit" className={`${styles.oxensBtn}`}>Send</Button>
                        </div>
                    </Form>
                 )}
                </Formik>
            </div>          
        </ModalBody>
    </Modal>
  )
}

export default Help