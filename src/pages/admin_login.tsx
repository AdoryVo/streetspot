import {
  Button, Container, FormControl, FormLabel, Heading, Input
} from '@chakra-ui/react'
import ky from 'ky'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useRef } from 'react'
import React, { useState } from 'react'
import { MdMyLocation } from 'react-icons/md'
import { text } from 'stream/consumers'

function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    ky.post('api/admin/login', { json: { password: password } }).then(() => {
      // 200 OK: Server matched passwords successfully!
      router.push('/dashboard')
    }).catch(() => {
      // 401 Unauthorized: Incorrect password
      setError('Incorrect password')
    })
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
    setError('')
  }

  return (
    <div className="login-page">
      <Container>
        <Heading>Streetspot</Heading>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" mt={5}>
            login
          </Button>
        </form>
      </Container>
    </div>
  )
}

export default LoginPage
