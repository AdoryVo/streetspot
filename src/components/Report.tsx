import {
  Box, Button, Container, Heading, HStack, Popover,
  PopoverArrow, PopoverBody, PopoverCloseButton,   PopoverContent, PopoverHeader, PopoverTrigger,  Skeleton, Text
} from '@chakra-ui/react'
import type { Report } from '@prisma/client'
import { InfoWindowF } from '@react-google-maps/api'
import ky from 'ky'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { IoLogoInstagram } from 'react-icons/io'
import {
  MdPlace, MdShare, MdThumbDown, MdThumbUp
} from 'react-icons/md'
import { RiFacebookCircleFill, RiTwitterLine } from 'react-icons/ri'

import { useFormattedTimestamp } from '../lib/hooks/useFormattedTimestamp'

export default function Report({ report }: { report: Report }) {
  const [likes, setLikes] = useState(report.likes)
  const [dislikes, setDislikes] = useState(report.dislikes)
  const [selected, setSelected] = useState<typeof Button|null>(null)

  function handleLike() {
    ky.post('api/report/like', { json: { id: report.id } })
      .json<Report>()
      .then((updatedReport) => {
        setLikes(updatedReport.likes)
      }).catch((response) => {
        console.error(response)
      })
  }

  function handleDislike() {
    ky.post('api/report/dislike', { json: { id: report.id } })
      .json<Report>()
      .then((updatedReport) => {
        setDislikes(updatedReport.dislikes)
      }).catch((response) => {
        console.error(response)
      })
  }


  return (
    <Container bg="blackAlpha.200" borderRadius="md" p={5}>
      <Heading fontSize="3xl">{report.title}</Heading>
      <Skeleton isLoaded={useFormattedTimestamp(report.createdAt) !== ''} fitContent={true}>
        <Text>Reported at {useFormattedTimestamp(report.createdAt)}</Text>
      </Skeleton>

      {report.image &&
      <Box position="relative" h="64" my={3}>
        <Image
          src={`https://streetspot.s3.amazonaws.com/${report.image}`}
          alt={report.title}
          fill
          sizes="33vw"
        />
      </Box>
      }

      <Text>Category: {report.category}</Text>
      <Text>
        Description:
        <br />
        {report.description}
      </Text>

      <HStack mt={5}>
        <Button leftIcon={<MdThumbUp />} colorScheme="green" onClick={handleLike}>
          {likes}
        </Button>
        <Button leftIcon={<MdThumbDown />} colorScheme="red" onClick={handleDislike}>
          {dislikes}
        </Button>
        <Popover>
          <PopoverTrigger>
            <Button leftIcon={<MdShare />} colorScheme="cyan" onClick={() => setSelected(Button)}></Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Let Other People Know</PopoverHeader>
            <PopoverBody>
              <HStack>
                <Link href="https://twitter.com/intent/tweet">
                  <Button leftIcon={<RiTwitterLine />} colorScheme="twitter">
                    Tweet
                  </Button>
                </Link>
                <Box>
                  <div id="fb-root"></div>
                  <script
                    async
                    defer
                    crossOrigin="anonymous"
                    src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0"
                    nonce="uF5RBaAE"
                  ></script>

                  <div
                    className="fb-share-button"
                    data-href="https://streetspot.vercel.app/"
                    data-layout=""
                    data-size=""
                  >
                    <a
                      target="_blank"
                      href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fstreetspot.vercel.app%2F&amp;src=sdkpreparse"
                      className="fb-xfbml-parse-ignore" rel="noreferrer"
                    >
                      <Button leftIcon={<RiFacebookCircleFill />} colorScheme="facebook">
                        Share
                      </Button>
                    </a>
                  </div>
                </Box>
                <Link href="https://www.instagram.com">
                  <Button leftIcon={<IoLogoInstagram />} colorScheme="pink">
                    Post
                  </Button>
                </Link>
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
      <Link href={`/map?lat=${report.lat}&lng=${report.lng}`} passHref>
        <Button leftIcon={<MdPlace />} colorScheme="blue" mt={5}>
          View in map
        </Button>
      </Link>
    </Container>
  )
}
