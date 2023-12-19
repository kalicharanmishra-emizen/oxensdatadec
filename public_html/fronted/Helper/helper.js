import axios from "axios";
import ratingIcon1 from '../public/images/ratingIcon1.svg';
import ratingIcon2 from '../public/images/ratingIcon2.svg';
import ratingIcon3 from '../public/images/ratingIcon3.svg';
import ratingIcon4 from '../public/images/ratingIcon4.svg';
import ratingIcon5 from '../public/images/ratingIcon5.svg';

export const callApi=async (type,url,value=null,headers={})=>{
    try {
        let api_headers = Object.assign({},headers,{'x-access-token':localStorage.getItem('auth-user-token')},{'Accept':'application/json'});
        switch (type) {
            case 'post':
                return await axios.post(process.env.API_BASE_URL+url,value,{headers:api_headers})
                break;
            default:
                break;
        }
    } catch (e) {
        if (e.response) {
           throw  e.response.data
        } else {
            throw e.message
        }
    }
}
export const callOtherApi=async (url,value=null,headers={})=>{
    try {
        // {'x-access-token':localStorage.getItem('auth-user-token')},{'Accept':'application/json'}
        return await axios.post(url,value,{headers:headers})
    } catch (e) {
        if (e.response) {
            throw  e.response.data
        } else {
            throw e.message
        }
    }
}
export const calculateDistance = async (origin = {lat:0,lng:0},destination = {lat:0,lng:0} )=>{
    try {
        let returnData = []
        const matrix = new google.maps.DistanceMatrixService();
        const response = await matrix.getDistanceMatrix({
            origins: [new google.maps.LatLng(origin.lat, origin.lng)],
            destinations: [new google.maps.LatLng(destination.lat, destination.lng)],
            travelMode: google.maps.TravelMode.DRIVING,
        });
        response.rows[0]['elements'].forEach(element=>{
            if (element.status == 'OK') {
                /* convert meter to miles */
                returnData.push({
                    distance:Number((element.distance.value/1609).toFixed(2)),
                    duration:element.duration.value
                })
            } else {
                returnData.push({
                    distance:0,
                    duration:0
                })
            }
        })
        return returnData[0]
    } catch (e) {
        console.log('dis map error',e);
    }
}
export const calculateMultitpleDistance = async (origin = {lat:0,lng:0},destination)=>{
    try {
        let returnData = []
        const matrix = new google.maps.DistanceMatrixService();
        let googleMapDestination = []
        destination.forEach(element=>{
            googleMapDestination.push(new google.maps.LatLng(element.lat, element.lng))
        })
        const response = await matrix.getDistanceMatrix({
            origins: [new google.maps.LatLng(origin.lat, origin.lng)],
            destinations: googleMapDestination,
            travelMode: google.maps.TravelMode.DRIVING,
        });
        response.rows[0]['elements'].forEach(element=>{
            if (element.status == 'OK') {
                /* convert meter to miles */
                returnData.push(Number((element.distance.value/1609).toFixed(2)))
            }else{
                returnData.push(0)
            }
        })
        console.log("returnData of address", returnData);
        return returnData
    } catch (e) {
        console.log('dis map error',e);
    }
}

export const badgesColor = (data) =>{
    let text = ''
    switch (data) {
        case 1:
            text = 'rgb(151, 0, 255)' 
            break;
        case 2:
            text = '#F00'
            break;
        case 3:
            text = 'rgb(255, 131, 0)'
            break;
        case 4:
            text = 'rgb(0, 159, 255)'
            break;
        case 5:
            text = 'rgb(144, 177, 72)'
            break;
        default:
            text = ''
            break;
    }
    return text
}
export const badgesText = (data) =>{
    let text = ''
    switch (data) {
        case 1:
            text = 'New Arrival'
            break;
        case 2:
            text = 'Bestseller'
            break;
        case 3:
            text = 'Featured'
            break;
        case 4:
            text = 'Popular'
            break;
        case 5:
            text = 'Trending'
            break;
        default:
            text = ''
            break;
    }
    return text
}


export const paymentStatusColor = (data) =>{
    let text = ''
    switch (data) {
        case 0:
            text = '#b7af3a'
            break;
        case 1:
            text = '#3AB757'
            break;
        case 2:
            text = '#b73a3a'
            break;
        default:
            text = ''
            break;
    }
    return text
}
export const paymentStatusText = (data) =>{
    let text = ''
    switch (data) {
        case 0:
            text = 'processing'
            break;
        case 1:
            text = 'success'
            break;
        case 2:
            text = 'payment failed'
            break;
        default:
            text = ''
            break;
    }
    return text
}

export const emoji = (data) =>{
    let text = ''
    switch (data) {
        case 1:
            text = ratingIcon1
            break;
        case 2:
            text = ratingIcon2
            break;
        case 3:
            text = ratingIcon3
            break;
        case 4:
            text = ratingIcon4
            break;
        case 5:
            text = ratingIcon5
            break;
        default:
            text = ''
            break;
    }
    return text
}
