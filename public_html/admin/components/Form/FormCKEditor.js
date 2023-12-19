import { useEffect,useState,useRef} from 'react'
export default function FormCKEditor(props) {
    const editorRef = useRef()
    const [ editorLoaded, setEditorLoaded ] = useState( false )
    const { CKEditor, ClassicEditor } = editorRef.current || {}
    useEffect( () => {
        editorRef.current = {
            CKEditor: require( '@ckeditor/ckeditor5-react' ).CKEditor,
            ClassicEditor: require( '@ckeditor/ckeditor5-build-classic' )
        }
        setEditorLoaded( true )
    }, [] )
    const [formData, setFormData] = useState('')
    const [validation, setValidation] = useState('')
    const [submitValidate, setsubmitValidate] = useState(false)
    useEffect(() => {
        setFormData(props.defValue)
        if (props.defValue!='') {
            setValidation(null)
        }
    },[props.defValue] )
    const validateData= async (value)=>{
        if (!props.validator.required) {
            setValidation(null)
        }else{
            if(value.length==0){
                setValidation(props.validator.message)
            }else{
                setValidation(null)
            }
        }
    }
    const handleChange = async (event, editor )=>{
        const data = editor.getData()
        // console.log( { event, editor, data } )
        setFormData(data)
        await validateData(data)
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
        setsubmitValidate(props.submitValidate)
    }, [props.submitValidate])
    useEffect(() => {
        if (submitValidate) {
            validateData(formData)
        }
    }, [submitValidate])
    return (
        editorLoaded ?
            <>
                <CKEditor
                    editor={ ClassicEditor }
                    data={formData}
                    onChange={handleChange }
                />
                {validation?<div className="validation-error-custome">{validation}</div>:''}
            </>
        :""         
    )
}
