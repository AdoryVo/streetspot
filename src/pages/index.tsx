import {
  Button, Container, Heading, Input, Stack,
  VStack
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useRef } from 'react'
import { MdMyLocation } from 'react-icons/md'
import { text } from 'stream/consumers'

export default function Home() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  /** Get the user's location and redirect them to the map. */
  function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        router.push({
          pathname: '/map',
          query: { lat: position.coords.latitude, lng: position.coords.longitude },
        })
      })
    }
  }
  useEffect(() => {
    // Load Google Places API script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => {
      // Initialize Google Places Autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current as HTMLInputElement)
      // Set the types of predictions to return
      autocomplete.setTypes(['geocode'])
      // Bias predictions to the user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          const circle = new window.google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
          })
          const bounds = circle.getBounds()
          if (bounds) {
            autocomplete.setBounds(bounds)
          }
        })
      }
    }
    document.head.appendChild(script)
  }, [])

  return (
    <Stack minHeight="65vh" spacing={8} align="center" justify="center">
      <NextSeo
        title="Streetspot"
        description="A platform for citizens to report local infrastructure issues and improve their city."
      />
      <Heading>Streetspot</Heading>
      <Container p={5}>
        <Input id="autocomplete" placeholder="Enter a location" type="text" ref={inputRef} />
      </Container>
      <Stack direction="row" spacing={4} align="center">
        <Link href="/reports" passHref>
          <Button colorScheme="blue">
            Reports
          </Button>
        </Link>
        <Link href="/map" passHref>
          <Button colorScheme="blue">
            Map
          </Button>
        </Link>
      </Stack>
      <Button leftIcon={<MdMyLocation />} colorScheme="facebook" onClick={getCurrentLocation}>
        Use current location
      </Button>
    </Stack>
  )
}
