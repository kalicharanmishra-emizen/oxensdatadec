import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import FormInputCom from '../Form/FormInputCom'
import validator from 'validator';
import { updatePassword } from '../../reducers/authSlice';
import NProgress from 'nprogress';
export default function Password(props) {
    const dispatch = useDispatch()
    const [formSubmit, setFormSubmit] = useState({
        old_pass:'',
        new_pass:'',
        con_pass:''
    })
    const [submitValidate, setsubmitValidate] = useState(false)
    const [confirmValidate, setConfirmValidate] = useState({})
    const [confirmValidateStatus, setConfirmValidateStatus] = useState(false)
    useEffect(() => {
        setFormSubmit({
            old_pass:'',
            new_pass:'',
            con_pass:''
        })
    }, [])
    const getValue=(data)=>{
        formSubmit[data.key]=data.data
        confirmValidate[data.key]=data.error
        setConfirmValidate({...confirmValidate})
        setFormSubmit({...formSubmit})
        setsubmitValidate(false)
    }
    const formSubmitHandal = async (e) =>{
        e.preventDefault()
        setsubmitValidate(true)
        // console.log('final data before validate',formSubmit);
        if(confirmValidateStatus){
            // console.log('final data',formSubmit);
            let data = formSubmit
            setFormSubmit({
                old_pass:'',
                new_pass:'',
                con_pass:''
            })
            NProgress.start()
            dispatch(updatePassword(data))
        }
    }
     useEffect(() => {
        let something = true
        if (Object.keys(confirmValidate).length==3) {
            for (const key in confirmValidate) {
                if (!(!confirmValidate[key])) {
                    something = false
                    setConfirmValidateStatus(false)
                }
            }
            if(something){
                setConfirmValidateStatus(true)
            }
        }
    }, [confirmValidate])
    return (
        <Form onSubmit={formSubmitHandal} autoComplete="off" id="passwordForm">
            <div className="pl-lg-4">
                <Row>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="old_pass"
                            >
                                Old Password
                            </label>
                            <FormInputCom
                                type="password"
                                name="old_pass"
                                placeholder="Old Password"
                                optionData={[]}
                                validator={
                                    [
                                        {
                                            property:validator.isEmpty,
                                            message:"Old password is required",
                                            isNot:false
                                        }
                                    ]
                                }
                                getValue={getValue}
                                defValue={formSubmit.old_pass}
                                submitValidate={submitValidate}
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-name"
                            >
                                New Password
                            </label>
                            <FormInputCom
                                type="password"
                                name="new_pass"
                                placeholder="New Password"
                                optionData={[]}
                                validator={
                                    [
                                        {
                                            property:validator.isEmpty,
                                            message:"New password is required",
                                            isNot:false
                                        }
                                    ]
                                }
                                getValue={getValue}
                                defValue={formSubmit.new_pass}
                                submitValidate={submitValidate}
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor=""
                            >
                            Confirm Password
                            </label>
                                <FormInputCom
                                    type="password"
                                    name="con_pass"
                                    placeholder="Confirm Password"
                                    optionData={[]}
                                    validator={
                                        [
                                            {
                                                property:validator.isEmpty,
                                                message:"Confirm password is required",
                                                isNot:false
                                            },
                                            {
                                                property:validator.equals,
                                                valOption:formSubmit.new_pass,
                                                message:"Confirm password not match with New password",
                                                isNot:true
                                            }
                                        ]
                                    }
                                    getValue={getValue}
                                    defValue={formSubmit.con_pass}
                                    submitValidate={submitValidate}
                                />
                        </FormGroup>
                    </Col>
                    <Col lg="12">
                        <Button
                            className="float-right"
                            color="primary"
                            type="submit"
                        >
                            Update
                        </Button>
                    </Col>
                </Row>
            </div>
        </Form>
    )
}
