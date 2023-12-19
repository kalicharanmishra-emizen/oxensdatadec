import React, { useEffect,useState } from 'react'
import { FormFeedback, Input, } from "reactstrap";
export default function FormInputCom(props) {
    
    const [formData, setFormData] = useState('')
    const [validation, setValidation] = useState('')
    // const [submitValidate, setsubmitValidate] = useState(false)
    let isDefault= false;
    if ('isDefault' in props) {
        isDefault= props.isDefault
    }
    useEffect(() => {
        setFormData(props.defValue)
        if (props.defValue!='') {
            validateData(props.defValue)
            // setValidation(null)
        }
    },[props.defValue] )
    const validateData= async (value)=>{
        if (props.validator.length==0) {
            setValidation(null)
        }else{
            props.validator.some((data)=>{
                let option=[]
                if('valOption' in data)
                {
                    option = data.valOption
                }
                if ('isOptional' in data) { 
                    if (data.isNot) {
                        if((value !='' && value != null) && !data.property(value,option)){
                            setValidation(data.message)
                            return true
                        }else{
                            setValidation(null)
                        }
                    }else{
                        if((value !='' && value != null) && data.property(value,option)){
                            setValidation(data.message)
                            return true
                        }else{
                            setValidation(null)
                        }
                    }
                }else{
                    if (data.isNot) {
                        if(!data.property(value,option)){
                            setValidation(data.message)
                            return true
                        }else{
                            setValidation(null)
                        }
                    }else{
                        if(data.property(value,option)){
                            setValidation(data.message)
                            return true
                        }else{
                            setValidation(null)
                        }
                    }
                }
                
            })
        }
       
    }
    const handleChange = async (e)=>{
        setFormData(e.target.value)
        await validateData(e.target.value)
    }
    useEffect(() => {
        if (validation !=='') {
            let rowReturnData={
                key:props.name,
                error:validation,
                data:formData
            }
            props.getValue(rowReturnData)  
        }
    }, [validation,formData])
    useEffect(() => {
        if(props.submitValidate){
            validateData(formData)
        }
    }, [props.submitValidate])
    return (
            <>
                <Input
                    className="form-control-alternative"
                    type={props.type}
                    name={props.name}
                    placeholder={props.placeholder}
                    value={formData}
                    disabled={isDefault}
                    onChange={handleChange}
                    invalid={ validation ? true : false}
                />
                <FormFeedback >
                    {validation}
                </FormFeedback>
            </>
    )
}
