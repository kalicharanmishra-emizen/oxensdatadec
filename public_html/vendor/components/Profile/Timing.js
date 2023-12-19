import React,{ useEffect, useState }from 'react'
import { useDispatch } from 'react-redux'
import { Button, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import FormInputCom from '../Form/FormInputCom'
import { updateTiming } from '../../reducers/authSlice';
import NProgress from 'nprogress';
export default function Timing(props) {
    const dispatch = useDispatch()
    const [formSubmit, setFormSubmit] = useState({})
    const [submitValidate, setsubmitValidate] = useState(false)
    const [confirmValidate, setConfirmValidate] = useState({})
    const [confirmValidateStatus, setConfirmValidateStatus] = useState(false)
    const [defData, setDefData] = useState(null)
    useEffect(() => {
        setDefData(props.list)
    }, [props.list])
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
        if(confirmValidateStatus){
            // console.log('tempData',formSubmit);
            NProgress.start()
            dispatch(updateTiming(formSubmit))
        }
    }
     useEffect(() => {
        let something = true
        if (Object.keys(confirmValidate).length==14) {
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

        <Form onSubmit={formSubmitHandal}>
            <div className="pl-lg-4">
                <Row>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="old_pass"
                            >
                                Monday
                            </label>
                            <Row>
                                <Col lg="6">
                                    <label>Open Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="mon_open"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.monday.open:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                                <Col lg="6">
                                    <label>Close Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="mon_close"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.monday.close:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="old_pass"
                            >
                                Tuesday
                            </label>
                            <Row>
                                <Col lg="6">
                                    <label>Open Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="tue_open"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.tuesday.open:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                                <Col lg="6">
                                    <label>Close Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="tue_close"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.tuesday.close:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="old_pass"
                            >
                                Wednesday
                            </label>
                            <Row>
                                <Col lg="6">
                                    <label>Open Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="wed_open"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.wednesday.open:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                                <Col lg="6">
                                    <label>Close Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="wed_close"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.wednesday.close:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="old_pass"
                            >
                                Thursday
                            </label>
                            <Row>
                                <Col lg="6">
                                    <label>Open Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="thu_open"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.thursday.open:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                                <Col lg="6">
                                    <label>Close Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="thu_close"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.thursday.close:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="old_pass"
                            >
                                Friday
                            </label>
                            <Row>
                                <Col lg="6">
                                    <label>Open Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="fri_open"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.friday.open:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                                <Col lg="6">
                                    <label>Close Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="fri_close"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.friday.close:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="old_pass"
                            >
                                Saturday
                            </label>
                            <Row>
                                <Col lg="6">
                                    <label>Open Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="sat_open"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.saturday.open:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                                <Col lg="6">
                                    <label>Close Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="sat_close"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.saturday.close:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="old_pass"
                            >
                                Sunday
                            </label>
                            <Row>
                                <Col lg="6">
                                    <label>Open Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="sun_open"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.sunday.open:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                                <Col lg="6">
                                    <label>Close Time</label>
                                    <FormInputCom
                                        type="time"
                                        name="sun_close"
                                        placeholder=""
                                        optionData={[]}
                                        validator={[]}
                                        getValue={getValue}
                                        defValue={defData?defData.sunday.open:''}
                                        submitValidate={submitValidate}
                                    />
                                </Col>
                            </Row>
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
