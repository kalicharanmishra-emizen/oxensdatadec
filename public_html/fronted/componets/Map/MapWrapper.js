import { useEffect, useRef, useState } from "react";

const MapWrapper = (props) => {
    const markerRef= useRef(null);
    const mapRef = useRef(null);
    const [location,setLocation] = useState({
        lat:"40.748817",
        lng:"-73.985428"
    })
    useEffect(()=>{
        setLocation({
            lat:props.location.lat!=''?props.location.lat:"40.748817",
            lng:props.location.lng!=''?props.location.lng:"-73.985428"
        })
    },[props.location])
    useEffect(() => {
        let google = window.google;
        let lat = Number(location.lat);
        let lng = Number(location.lng);
        const myLatlng = new google.maps.LatLng(lat, lng);
        const geoCode = new google.maps.Geocoder()
        const mapOptions = {
            zoom: 16,
            center: myLatlng,
            scrollwheel: false,
            zoomControl: true,
            fullscreenControl:false,
            mapTypeControl:false,
            streetViewControl: false,
            styles: [
                {
                    featureType: "administrative",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#444444" }],
                },
                {
                    featureType: "landscape",
                    elementType: "all",
                    stylers: [{ color: "#f2f2f2" }],
                },
                {
                    featureType: "poi",
                    elementType: "all",
                    stylers: [{ visibility: "off" }],
                },
                {
                    featureType: "road",
                    elementType: "all",
                    stylers: [{ saturation: -100 }, { lightness: 45 }],
                },
                {
                    featureType: "road.highway",
                    elementType: "all",
                    stylers: [{ visibility: "simplified" }],
                },
                {
                    featureType: "road.arterial",
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }],
                },
                {
                    featureType: "transit",
                    elementType: "all",
                    stylers: [{ visibility: "off" }],
                },
                {
                    featureType: "water",
                    elementType: "all",
                    stylers: [{ color: "#5e72e4" }, { visibility: "on" }],
                },
            ],
        };
        mapRef.current = new google.maps.Map(mapRef.current, mapOptions);
        markerRef.current = new google.maps.Marker({
            position: myLatlng,
            map: mapRef.current,
            animation: google.maps.Animation.DROP,
            // title: "Light Bootstrap Dashboard PRO React!",
        });
        google.maps.event.addListener(mapRef.current, 'drag', function () {  
            markerRef.current.setPosition(this.getCenter());
        });
        google.maps.event.addListener(mapRef.current, 'dragend', function () {
            markerRef.current.setPosition(this.getCenter()); // set marker position to map center
            geoCode.geocode(
                {
                    latLng: this.getCenter()
                }, 
                function(responses) {
                    if (responses && responses.length > 0) {
                        props.getLocation(responses[0])
                    } else {
                        console.log('error map');
                    }
                }
            )
        });
    }, []);
    useEffect(() => {
        mapRef.current.setCenter({lat:Number(location.lat), lng:Number(location.lng)})
        markerRef.current.setPosition({lat:Number(location.lat), lng:Number(location.lng)})    
    }, [location]);
    return (
      <div
        className="map-canvas"
        id="map-canvas"
        ref={mapRef}
      />
    );
};
export default MapWrapper