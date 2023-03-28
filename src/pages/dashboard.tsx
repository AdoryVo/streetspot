import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode
} from '@chakra-ui/react'
import ky from 'ky'
import ErrorPage from 'next/error'
import { type } from 'os'
import { useEffect, useState } from 'react'
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md'

import Report from '../components/Report'
import useReports from '../lib/hooks/useReports'

function AdminDashboard() {
  const { colorMode } = useColorMode()
  const [isAdmin, setIsAdmin] = useState(false)
  const { reports = [], error } = useReports()

  const handleDelete = async (id: string) => {
    try {
      await ky.delete(`/api/admin/delete?id=${id}`)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    ky.get('api/admin/auth').then(() => {
      setIsAdmin(true)
    }).catch(() => {
      return
    })
  })

  if (error) return <div>Failed to load the page...</div>

  if (!isAdmin) return <ErrorPage statusCode={404} />

  return (
    <Box bg={colorMode === 'light' ? 'gray.100' : 'gray.800'} minH="100vh">
      <Container maxW="container.lg" pt={10}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Admin Dashboard</Heading>
          <Button colorScheme="blue" size="sm">
            Add New
          </Button>
        </Flex>

        <Stack direction={['column', 'row']} spacing={8}>
          <Box flex={1}>
            <Heading size="md" mb={4}>
              Recent Posts
            </Heading>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {reports.map((report) => (
                  <Tr key={report.id}>
                    <Td>
                      <Text fontWeight="bold">{report.title}</Text>
                    </Td>
                    <Td>{report.createdAt.toLocaleString()}</Td>
                    <Td>
                      <IconButton
                        icon={<MdEdit />}
                        size="xs"
                        mr={2}
                        aria-label="Edit post"
                      />
                      <IconButton
                        icon={<MdVisibility />}
                        size="xs"
                        mr={2}
                        aria-label="View post"
                      />
                      <IconButton
                        icon={<MdDelete />}
                        size="xs"
                        aria-label="Delete post"
                        colorScheme="red"
                        onClick={() => handleDelete(report.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Divider orientation="vertical" />

          <Box flex={1}>
            <Heading size="md" mb={4}>
              Users
            </Heading>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Text fontWeight="bold">John Doe</Text>
                  </Td>
                  <Td>john.doe@example.com</Td>
                  <Td>
                    <IconButton
                      icon={<MdEdit />}
                      size="xs"
                      mr={2}
                      aria-label="Edit user"
                    />
                    <IconButton
                      icon={<MdDelete />}
                      size="xs"
                      aria-label="Delete user"
                      colorScheme="red"
                    />
                  </Td>
                </Tr>
                <Tr>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default AdminDashboard


