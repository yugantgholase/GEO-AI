import React, { useState, useEffect } from 'react';
import { withGoogleMap, GoogleMap, Marker, Circle } from 'react-google-maps';
import axios from 'axios';
import ScriptjsLoader from 'react-async-script-loader';
import { useContext } from 'react';
import myContext from '../ChatBot/Context';

const MapComponent = withGoogleMap((props) => (
    <GoogleMap
        defaultZoom={15}
        defaultCenter={{ lat: props.latitude, lng: props.longitude }}
    >
        {/* Marker for the user's current location */}
        <Marker
            position={{ lat: props.latitude, lng: props.longitude }}
            title="Your Location"
            icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
        />
        {/* Circle representing the search radius */}
        {props.radius && (
            <Circle
                defaultCenter={{ lat: props.latitude, lng: props.longitude }}
                radius={parseInt(props.radius)}
                options={{
                    fillColor: '#007bff', // Color of the circle fill
                    fillOpacity: 0.3, // Opacity of the circle fill
                    strokeColor: '#007bff', // Color of the circle border
                    strokeOpacity: 0.8, // Opacity of the circle border
                    strokeWeight: 2, // Width of the circle border
                }}
            />
        )}

        {/* Markers for places nearby */}
        {props.places.map((place) => (
            <Marker
                key={place.place_id}
                position={{
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng,
                }}
                title={place.name}
                icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                }}
            />
        ))}
    </GoogleMap>
));

const NearbyPlacesMap = ({ apiKey, isScriptLoaded, isScriptLoadSucceed }) => {
    const { data, setData } = useContext(myContext);
    const [currentLocation, setCurrentLocation] = useState(null)
    const [currentLocationName, setCurrentLocationName] = useState('');
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [placeType, setPlaceType] = useState('');
    const [mapKey, setMapKey] = useState(0);
    const [radius, setRadius] = useState('500');

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });

                    // Fetch current location name using reverse geocoding
                    try {
                        const response = await axios.get(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${apiKey}`
                        );

                        if (response.data.results.length > 0) {
                            setCurrentLocationName(response.data.results[0].formatted_address);
                        }
                    } catch (error) {
                        console.error('Error fetching current location name:', error);
                    }
                },
                (error) => {
                    console.error(`Error getting current location: ${error.message}`);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    // const handlePlaceTypeChange = (event) => {
    //   setPlaceType(event.target.value);
    // };


    const setValues = async () => {
        const openaiResponse = await data;
        // console.log( openaiResponse.radius);
        setRadius(() => openaiResponse.radius);
        setPlaceType(() => openaiResponse.placeType);
    }
    const handleSearch = async () => {

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentLocation.latitude},${currentLocation.longitude}&radius=${radius}&type=${placeType}&key=${apiKey}`
            );
            //console.log(response);
            setNearbyPlaces(response.data.results);
            setMapKey((prevKey) => prevKey + 1);
        } catch (error) {
            console.error('Error fetching nearby places:', error);
        }

    };



    useEffect(() => {
        handleGetLocation();
    }, [isScriptLoaded, isScriptLoadSucceed]); // Empty dependency array ensures that the effect runs only once on mount

    useEffect(() => {
        setValues();
        handleSearch();
    }, [data, radius, placeType])

    if (!isScriptLoaded || !isScriptLoadSucceed) {
        return (
            <div>
                {/* Loading or error message */}
                {isScriptLoaded && !isScriptLoadSucceed && <div>Error loading Google Maps</div>}
                {!isScriptLoaded && <div>Loading...</div>}
            </div>
        );
    }


    return (
        <div >

            {currentLocationName && (
                <p style={{ color: 'white', marginLeft: "100px", marginRight: "100px", marginTop: "10px" }}> <strong>Current Location: </strong>{currentLocationName}</p>
            )}
            {currentLocation && (
                <>
                    <MapComponent
                        key={mapKey}
                        containerElement={<div style={{ height: '500px', width: '750px', marginLeft: "100px", marginRight: "100px", marginTop: "30px" }} />}
                        mapElement={<div style={{ height: '100%' }} />}
                        latitude={currentLocation.latitude}
                        longitude={currentLocation.longitude}
                        places={nearbyPlaces}
                        radius={radius}
                    />
                </>
            )}
        </div>
    );
};

//place ur api key here
export default ScriptjsLoader(['https://maps.googleapis.com/maps/api/js?key='])(NearbyPlacesMap);

