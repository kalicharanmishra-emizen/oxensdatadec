import { useEffect, useRef } from "react";

function DriverTrack(props) {

    const mapRef = useRef(null);
    const driverMarker= useRef(null);

    useEffect(() => {
        props.socket.on('updateLocation',data=>{
            mapRef.current.setCenter({lat:data?.lat, lng:data?.lng})
            // update driver live location
            driverMarker.current.setPosition({lat:data?.lat, lng:data?.lng}) 
        })
    }, [props.socket])

    useEffect(() => {
        let google = window.google;
        const myLatlng = new google.maps.LatLng(props?.allLatLng?.driver?.lat || 26.8802281, props?.allLatLng?.driver?.lng || 75.75572939999999);
        const dropLocation = new google.maps.LatLng(props?.allLatLng?.user?.lat || 26.885990, props?.allLatLng?.user?.lng || 75.755000);
        const pickUpLocation = new google.maps.LatLng(props?.allLatLng?.vender?.lat || 26.8804290, props?.allLatLng?.vender?.lng || 75.74572999999999);
        // const geoCode = new google.maps.Geocoder()
        const mapOptions = {
            zoom: 15.02,
            center: dropLocation,
            scrollwheel: false,
            zoomControl: true,
            fullscreenControl:false,
            mapTypeControl:false,
            streetViewControl: false,
            styles: [
                {
                    featureType: "administrative",
                    elementType: "labels.text",
                    // stylers: [{ color: "#666666" }],
                    stylers: [{ visibility: "off" }],
                },
                {
                    featureType: "landscape",
                    elementType: "all",
                    stylers: [{ color: "#f3f3f3" }],
                },
                {
                    featureType: "poi",
                    elementType: "all",
                    stylers: [{ visibility: "off" }],
                },
                {
                    featureType: "road",
                    elementType: "all",
                    stylers: [{ saturation: -100 }, { lightness: 50 }],
                },
                {
                    featureType: "road.highway",
                    elementType: "all",
                    stylers: [{ visibility: "simplified" }],
                },
                {
                    featureType: "road.arterial",
                    elementType: "labels",
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

        // drop location marker
        new google.maps.Marker({
            position:dropLocation,
            icon:{
                url:`${process.env.BASE_URL}/drop.png`,
                scaledSize: new google.maps.Size(35, 40),
            },
            map: mapRef.current,
        })

        // pick location marker
        new google.maps.Marker({
            position:pickUpLocation,
            icon:{
                url:`${process.env.BASE_URL}/pickup.png`,
                scaledSize: new google.maps.Size(35, 40),
            },
            map: mapRef.current
        })

        // // inital Driver Location
        driverMarker.current = new google.maps.Marker({
            position: myLatlng,
            map: mapRef.current,
            // animation: google.maps.Animation.DROP,
            icon:{
                url:`${process.env.BASE_URL}/bike.png`,
                scaledSize: new google.maps.Size(50, 50),
            },
            // title: "Light Bootstrap Dashboard PRO React!",
        });
        
        // polyline 
        // const map = new google.maps.Map(document.getElementById("map"), {
        //     zoom: 3,
        //     center: { lat: 0, lng: -180 },
        //     mapTypeId: "terrain",
        // });
        // const flightPlanCoordinates = [
        //     { lat: 37.772, lng: -122.214 },
        //     { lat: -27.467, lng: 153.027 },
        // ];
        // const flightPath = new google.maps.Polyline({
        //     path: flightPlanCoordinates,
        //     geodesic: true,
        //     strokeColor: "#FF0000",
        //     strokeOpacity: 1.0,
        //     strokeWeight: 2,
        // });

        // flightPath.setMap(map);

    }, []);

  return (
    <div
        className="map-canvas"
        id="map-canvas"
        ref={mapRef}
    />
  )
}

export default DriverTrack