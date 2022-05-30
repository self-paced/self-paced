import { gql, useQuery } from '@apollo/client';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import FixedRatioBox from '../components/FixedRatioBox';
import PageFrame from '../components/PageFrame';
import ThemedPage from '../components/ThemedPage';

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

const Page: NextPage<{ Theme?: React.FC }> = ({ Theme }) => {
  const { loading, error, data } = useQuery<IListCoursesRes>(LIST_COURSES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <ThemedPage Theme={Theme}>
      <PageFrame>
        <Box
          sx={{
            display: 'flex',
            height: '300px',
            borderBottom: '2px solid black',
            justifyContent: 'center',
            alignItems: 'center',
            typography: 'h2',
            fontWeight: 'bold',
            marginBottom: '30px',
          }}
        >
          SelfPaced Banner
        </Box>
        <Box sx={{ textAlign: 'center', typography: 'h4' }}>
          Learn from our best courses!
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'wrap',
            justifyContent: 'space-around',
            gap: '20px',
            margin: '20px',
          }}
        >
          {data?.listCourses.map((course) => (
            <CourseCard key={course.name} data={course} />
          ))}
        </Box>
        <Box sx={{ textAlign: 'center', typography: 'h4' }}>More Text!</Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
          <Typography sx={{ fontSize: 20, width: '70%', textAlign: 'center' }}>
            Integer molestie turpis vitae dui convallis laoreet. Phasellus non
            lacinia risus. Praesent magna ex, dictum non orci in, iaculis tempor
            neque. Donec sed arcu augue. Duis justo est, placerat non
            sollicitudin et, aliquam vitae nunc. Sed ornare velit consectetur
            felis blandit dapibus ac et turpis. Sed rutrum ex augue, ut suscipit
            est dignissim sed. Praesent eget mauris sodales, lobortis leo et,
            iaculis lorem. Fusce tincidunt mauris ac pretium posuere. Phasellus
            imperdiet scelerisque elementum. Nulla et aliquam tellus, at egestas
            dui.
          </Typography>
        </Box>
      </PageFrame>
    </ThemedPage>
  );
};

const CourseCard: React.FC<{
  data: ICourse;
}> = ({ data }) => {
  return (
    <Link href={`/course/${data.id}`} passHref>
      <Box
        sx={{
          flexBasis: '25%',
          borderRadius: '6px',
          boxShadow: '1px 1px 15px 0px #00000020',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <Box sx={{ flex: 30, minWidth: 0 }}>
          <FixedRatioBox width="100%" ratio={0.4}>
            <Box
              component="img"
              src={data.imageSrc}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                objectFit: 'cover',
              }}
            ></Box>
          </FixedRatioBox>
        </Box>
        <Box sx={{ margin: '10px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>{data.name}</Typography>
          <Typography
            sx={{
              flex: 70,
              minWidth: 0,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {data.description}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default Page;
