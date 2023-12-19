import React, { useEffect,useState } from 'react'
import { FormFeedback, Input, Label } from "reactstrap";
import validator from 'validator';
export default function FormStatusChnage(props) {
    const [formData, setFormData] = useState('')

    useEffect(() => {
        setFormData(props.defValue)
    },[props.defValue] )
    const handleChange = (e)=>{
        props.getValue('status',(e.target.value==1)?true:false)
    }
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
                                    defaultChecked
                                    invalid={ props.error ? true : false}    
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
                                    invalid={ props.error ? true : false}    
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
                                    invalid={ props.error ? true : false}
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
                                    invalid={ props.error ? true : false}
                                />
                                <Label for="deactive" check>
                                    Deactive
                                </Label>
                            </div>
                }
                            
                    <FormFeedback >
                            {props.error}
                    </FormFeedback>
                    
            </>
        :
            ''
    )
}
