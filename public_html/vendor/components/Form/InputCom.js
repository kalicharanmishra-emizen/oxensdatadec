import React, { useEffect,useState } from 'react'
import { FormFeedback, Input, } from "reactstrap";
export default function InputCom(props) {
    let isDefault= false;
    if ('isDefault' in props) {
        isDefault= props.isDefault
    }
    const handleChange = async (e)=>{
        props.getValue(props.name,e.target.value);
    }
    return (
            <>
                <Input
                    className="form-control-alternative"
                    type={props.type}
                    name={props.name}
                    placeholder={props.placeholder}
                    value={props.defValue}
                    disabled={isDefault}
                    onChange={handleChange}
                    invalid={ props.error ? true : false}
                />
                <FormFeedback >
                    {props.error}
                </FormFeedback>
            </>
    )
}
