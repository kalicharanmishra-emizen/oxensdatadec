import React, { useEffect,useState } from 'react'
import { FormFeedback, Input, Label } from "reactstrap";
import validator from 'validator';
export default function FormStatusChnage(props) {
    const [formData, setFormData] = useState('')
    const [validation, setValidation] = useState('')
    const [submitValidate, setsubmitValidate] = useState(false)

    useEffect(() => {
            setFormData(props.defValue)
            setValidation(null)

    },[props.defValue] )


    const handleChange = (e)=>{
        if(validator.isEmpty(e.target.value)){
            setValidation('Status Required')
        }else{
            setValidation(null)
        }
        setFormData((e.target.value==1)?true:false)
    }
    useEffect(() => {
        if (validation !=='') {
            let rowReturnData={
                key:'status',
                error:validation,
                data:formData
            }
            props.getValue(rowReturnData)  
        }
    }, [validation,formData])

    useEffect(() => {
        setsubmitValidate(props.submitValidate)
    }, [props.submitValidate])
    useEffect(async () => {
        if (submitValidate) {
            if(formData===''){
                setValidation('Status Required')
            }else{
                setValidation(null)
            }
        }
    }, [submitValidate])
    return (
        (formData !== '') ?
            <>
                {
                    formData ?
                            <div className="radio-custom">
                                <Input 
                                    type="radio" 
                                    name="status" 
                                    id="active" 
                                    value="1" 
                                    onChange={handleChange} 
                                    defaultChecked={formData}
                                    invalid={ validation ? true : false}    
                                />
                                <Label for="active" check>
                                    Active
                                </Label>
                            </div>
                        :
                            <div className="radio-custom"> 
                                <Input 
                                    type="radio" 
                                    name="status" 
                                    id="active" 
                                    value="1" 
                                    onChange={handleChange}
                                    invalid={ validation ? true : false}    
                                />
                                <Label for="active" check>
                                    Active
                                </Label>
                            </div>
                }
                {
                    !formData ?
                            <div className="radio-custom">
                                <Input 
                                    type="radio" 
                                    name="status" 
                                    id="deactive" 
                                    value="0" 
                                    onChange={handleChange}
                                    defaultChecked
                                    invalid={ validation ? true : false}
                                />
                                <Label for="deactive" check>
                                    Deactive
                                </Label>
                            </div>
                    :
                            <div className="radio-custom">
                                <Input 
                                    type="radio" 
                                    name="status" 
                                    id="deactive" 
                                    value="0" 
                                    onChange={handleChange}
                                    invalid={ validation ? true : false}
                                />
                                <Label for="deactive" check>
                                    Deactive
                                </Label>
                            </div>
                }
                            
                    <FormFeedback >
                            {validation}
                    </FormFeedback>
                    
            </>
        :
            ''
    )
}
