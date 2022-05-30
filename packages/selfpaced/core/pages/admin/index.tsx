import { gql, useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Link from 'next/link';
import AdminFrame from '../../components/AdminFrame';

const LIST_COURSES = gql`
  query ListCourses {
    listCourses {
      id
      name
      description
      imageSrc
    }
  }
`;

interface ICourse {
  id: number;
  name: string;
  description: string;
  imageSrc?: string;
}

interface IListCoursesRes {
  listCourses: ICourse[];
}

const Page: NextPage = () => {
  const { loading, error, data } = useQuery<IListCoursesRes>(LIST_COURSES);
  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  return (
    <AdminFrame>
      <Typography variant="h4">Courses</Typography>
      <Box sx={{ display: 'flex', flexFlow: 'column', gap: 1 }}>
        {data.listCourses.map((courseInfo) => (
          <Link
            key={courseInfo.id}
            href={`/admin/course/${courseInfo.id}`}
            passHref
          >
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                boxShadow: '2px 2px 8px #00000020',
                cursor: 'pointer',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                <Box
                  component="img"
                  src={courseInfo.imageSrc}
                  sx={{
                    height: '100px',
                    width: '200px',
                    objectFit: 'cover',
                  }}
                />
                <Typography>{courseInfo.name}</Typography>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    </AdminFrame>
  );
};

export default Page;
