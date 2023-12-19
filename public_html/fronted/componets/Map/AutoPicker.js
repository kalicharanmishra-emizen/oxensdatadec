import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
const AutoPicker = (props) => {
    let autoComplete = null
    let  google = null
    const [location,setLocation] = useState('')
    const [predection,setPredection] = useState({
        loading:true,
        data:[]
    })
    useEffect(()=>{
        setLocation(props.location.address)
    },[props.location])
    const debounceLoad = useCallback(
        debounce(
            (location)=>{
                if (location!='') {                    
                    autoComplete.getQueryPredictions({ input: location }, displaySuggestions);
                }
            }
            , 1000)
        , []
    );
    useEffect(() => {
        google = window.google;
        autoComplete = new google.maps.places.AutocompleteService();
    }, []);
    const displaySuggestions = (predictions, status) =>{
        let tempArray=[]
        if (predictions && predictions.length > 0 ) {
            predictions.forEach(list=>tempArray.push({
                place_id:list.place_id,
                title:list.structured_formatting.main_text,
                description:list.structured_formatting.secondary_text
            }))
        }
        setPredection({
            loading:false,
            data:tempArray
        })     
    }
    const hangelLocationSelect = (e)=>{
        let place_id = e.currentTarget.getAttribute('value')
        google = window.google;
        const geoCode = new google.maps.Geocoder()
        geoCode.geocode({ placeId: place_id }).then(({results}) => {
            if (results[0]) {
              props.getLocation(results[0])
              setPredection({
                loading:true,
                data:[]
            })
            } else {
                console.log("No results found");
            }
          })
          .catch((e) => console.log("Geocoder failed due to: " + e));
    }
    return (
        <>
            <div className="form-group map-form-group">
            <label>Delivery Area</label>
            <div className="FormWrap">
                <input
                    className="form-control"
                    type="text"
                    placeholder="Search Location"
                    onChange={(e)=>{
                            setLocation(e.target.value)
                            debounceLoad(e.target.value)
                        }
                    }
                    value={location}
                />
            </div>
            <div className={`locationSuggestion ${predection.loading?"d-none":"d-block"}`}>
                {
                    predection.data.length==0?
                        <span className="predectionList">No data found</span>
                    :predection.data.map(list=>(
                        <span className="predectionList" onClick={hangelLocationSelect} key={list.place_id} value={list.place_id}> 
                            <h4>{list.title}</h4>
                            {list.description}
                        </span>
                    ))
                }
            </div>
            </div>
        </>
    );
};
export default AutoPicker
