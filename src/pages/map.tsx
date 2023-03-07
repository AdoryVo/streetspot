import {
  Box, Button, Container, Heading,
  Modal,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { Loader } from '@googlemaps/js-api-loader'
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useMemo, useState } from 'react'
import { MdMyLocation } from 'react-icons/md'

import ReportForm from '../components/ReportForm'
import { type Coords, parseCoords } from '../lib/util'



const SD_COORDS: Coords = { lat: 32.716, lng: -117.161 }
const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
}
export default function Map() {
  const router = useRouter()
  const query = router.query

  const [lat, setLat] = useState(SD_COORDS.lat)
  const [lng, setLng] = useState(SD_COORDS.lng)
  const [watchID, setWatchID] = useState(0)

  // Controls report form modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' })

  const center = useMemo(() => ({ lat, lng }), [lat, lng])

  const onLoad = (marker: google.maps.Marker) => {
    console.log('marker: ', marker)
  }

  /** Retrieve & track the user's location through the browser. */
  function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
    } else {
      const id = navigator.geolocation.watchPosition((position) => {
        changeCoords(position.coords)
      }, null, WATCH_OPTIONS)
      setWatchID(id)
    }
  }

  /** Set the map's location to specific coordinates. */
  function changeCoords(coords: Coords | GeolocationCoordinates) {
    if (coords instanceof GeolocationCoordinates) {
      setLat(coords.latitude)
      setLng(coords.longitude)
    }
    else {
      setLat(coords.lat)
      setLng(coords.lng)
    }
  }

  useEffect(() => {
    // Init map to url query coordinates
    const coords = parseCoords(query.lat, query.lng)
    if (coords) {
      changeCoords(coords)
    }

    return () => {
      // Stop watching user's location when unmounting
      if (watchID) {
        navigator.geolocation.clearWatch(watchID)
      }
    }
  }, [query, watchID])

  if (!isLoaded) return <div>loading...</div>

  return (
    <GoogleMap
      zoom={18}
      center={center}
      mapContainerStyle={{ width: '50%', height: '50vh' }}
    >
      <MarkerF position={center} onLoad={onLoad} title="raster"
        icon={{ url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png', scaledSize: new window.google.maps.Size(40, 40) }} />
    </GoogleMap>
  )

  return (
    <>
      <NextSeo
        title="Map | Streetspot"
        description="Report local infrastructure issues to raise awareness and improve your city."
      />
      <Container p={5}>
        <Link href="/" passHref>
          <Button colorScheme="facebook" mb={4} me={2}>Home</Button>
        </Link>
        <Link href="/reports" passHref>
          <Button colorScheme="blue" mb={4}>
            Reports
          </Button>
        </Link>

        <Heading>Map</Heading>
        <p>
          Coords: ({lat}, {lng})
        </p>

        <Button colorScheme="facebook" mt={5} onClick={onOpen}>Create Report</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ReportForm onClose={onClose} lat={lat} lng={lng} />
        </Modal>

        <br />

        <Button leftIcon={<MdMyLocation />} colorScheme="purple" mt={5} onClick={getCurrentLocation}>
          Use current location
        </Button>

        <br />

        <Button colorScheme="blue" mt={5} onClick={() => changeCoords(SD_COORDS)}>
          Change coords back to SD
        </Button>
      </Container>
    </>
  )
}
