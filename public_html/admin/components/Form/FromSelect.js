import React, { useEffect, useState } from 'react'
import Select from 'react-select';
export default function FromInputSelect(props) {
    const [defaultOption, setDefaultOption] = useState(null)
    let isDefault= props.isDefault;
        
    //   handleBlur = () => {
    //     // this is going to call setFieldTouched and manually update touched.topcis
    //     this.props.onBlur('topics', true);
    //   };
    useEffect(() => {
        if (typeof props.defValue === 'string') {
            setDefaultOption(props.options.find(data => data.value === props.defValue))
        }else{
            let optiondata=[]
            props.defValue.map(e=>{
                optiondata.push(props.options.find(data => data.value === e))
            })
            setDefaultOption(optiondata)
        }
    },[props.defValue] )
    const handleChange = e => {
        if (e.length === undefined) {
            props.getValue(props.name,e.value);
        }else{
            let optiondata=[]
            e.map(data=>{
                if (typeof data !== 'string') {
                    optiondata.push(data.value)
                }else{
                    optiondata.push(data)
                }
            })
            props.getValue(props.name,optiondata);
        }
    }
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
                        value={defaultOption}
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

        </>
    )
}
