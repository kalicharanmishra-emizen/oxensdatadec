import React, { useEffect, useState } from 'react'
import Select from 'react-select';
export default function FromInputSelect(props) {
    const [formData, setFormData] = useState('')
    const [validation, setValidation] = useState('')
    // const [submitValidate, setsubmitValidate] = useState(false)
    const [defaultOption, setDefaultOption] = useState(null)
    let isDefault= props.isDefault;
    
    useEffect(() => {
        if (typeof props.defValue === 'string') {
            setFormData(props.defValue)
            setDefaultOption(props.options.find(data => data.value === props.defValue))
        }else{
            let optiondata=[]
            props.defValue.map(data=>{
                optiondata.push(data.value)
            })
            setFormData(optiondata)
            setDefaultOption(props.defValue)
        }
        if (props.validation.required) {
            if (props.defValue!='' && props.defValue!=null && props.defValue!='empty' && (props.defValue.length !=undefined && props.defValue.length > 0)) {
                setValidation(null)
            }
        }else{
            setValidation(null)
        }
    },[props.defValue] )
    const validateData= async (value)=>{
        if (props.validation.required) {
            if (value!=null && value!='empty' && (value.length !=undefined && value.length > 0)) {
                setValidation(null)
            } else {
                setValidation('This field is required')
            }   
        }
        if (props.validation.limit!=null) {
            if (value.length > props.validation.limit) {
                setValidation(`Select not more than ${props.validation.limit} option`)
            } else {
                setValidation(null)
            }
        }
    }
    const handleChange = async (e)=>{
        if (e.length === undefined) {
            setFormData(e.value)
           await validateData(e.value)
        }else{
            let optiondata=[]
            e.map(data=>{
                optiondata.push(data.value)
            })
            setFormData(optiondata)
           await validateData(optiondata)
        } 
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
        // setsubmitValidate(props.submitValidate)
    }, [props.submitValidate])
    return (
        <>
            {defaultOption?
                <>
                    <Select
                        instanceId={props.id}
                        isDisabled={isDefault}
                        onChange={handleChange}
                        isMulti={props.isMulti}
                        options={props.options}
                        defaultValue={defaultOption}
                    />
                </>
                :
                <Select
                    instanceId={props.id}
                    isDisabled={isDefault}
                    onChange={handleChange}
                    isMulti={props.isMulti}
                    options={props.options}
                />
            }
            {props.error?<div className="validation-error-custome">{props.error}</div>:''}
            {validation?<div className="validation-error-custome">{validation}</div>:''}
        </>
    )
}
