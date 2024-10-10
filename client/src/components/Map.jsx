import React, { useState } from 'react'
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api'

const containerStyle = {
   width: '100%',
   height: '500px'
}

const center = {
   lat: 13.8713762349105,
   lng: 100.62768370461718
}

const Map = () => {

   const [mapLoaded, setMapLoaded] = useState(false)

   const handleMapLoad = () => {
      setMapLoaded(true)
   }

   return (
      <LoadScript googleMapsApiKey={process.env.GOOGLE_KEY} onLoad={handleMapLoad}>
         {mapLoaded ? (
            <GoogleMap
               mapContainerStyle={containerStyle}
               center={center}
               zoom={18}
            >
               <MarkerF position={center} />
            </GoogleMap>
         ) : (
            <div className="">Loading...</div>
         )}

      </LoadScript>
   )
}

export default Map