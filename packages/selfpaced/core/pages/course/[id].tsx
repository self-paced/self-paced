import { gql, useQuery } from '@apollo/client';
import { Box, Icon, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { MouseEventHandler } from 'react';
import PageFrame from '../../components/PageFrame';
import ThemedPage from '../../components/ThemedPage';

const RIGHT_AREA_WIDTH = '40ch';

const GET_COURSE = gql`
  query GetCourse($id: Float!) {
    getCourse(id: $id) {
      name
      description
      videos {
        title
        url
      }
    }
  }
`;

interface IVideo {
  title: string;
  url: string;
}

interface ICourse {
  getCourse: {
    name: string;
    description: string;
    videos: IVideo[];
  };
}

const Page: NextPage<{
  Theme?: React.FC;
  params: { [key: string]: string };
}> = ({ Theme, params }) => {
  const router = useRouter();
  const { loading, error, data } = useQuery<ICourse>(GET_COURSE, {
    variables: { id: parseInt(params.id) },
    skip: !router,
  });

  if (!router || loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;
  const course = data.getCourse;
  if (course.videos.length === 0) return <p>This Course has no Videos!</p>;

  const vParam = parseInt(router.query.v as string);
  const videoIndex = vParam ? vParam - 1 : 0;

  const videoIdMatch = course.videos[videoIndex].url.match(/\?v=(.+)$/);
  const videoId = videoIdMatch ? videoIdMatch[1] : undefined;

  const openVideo = (i: number) => {
    if (i !== videoIndex) {
      router.push(
        {
          pathname: `/[...sppage]`,
          query: { v: i + 1 },
        },
        {
          pathname: `/course/${params.id}`,
          query: { v: i + 1 },
        },
        {
          shallow: true,
        }
      );
    }
  };

  return (
    <ThemedPage Theme={Theme}>
      <PageFrame>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
            <Box sx={{ height: '500px', backgroundColor: 'black' }}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </Box>
            <Box sx={{ padding: '10px' }}>
              <Typography variant="h4">{course.name}</Typography>
              <Typography textAlign="justify">{course.description}</Typography>
            </Box>
          </Box>
          <Box sx={{ flexBasis: RIGHT_AREA_WIDTH, minWidth: 0 }}>
            <Box
              sx={{
                height: 'calc(100% - 64px)',
                position: 'fixed',
                top: '64px',
                right: 0,
                width: RIGHT_AREA_WIDTH,
                overflow: 'scroll',
                borderLeft: '1px solid #00000010',
                zIndex: 1,
              }}
            >
              {course.videos.map((video, index) => (
                <VideoItem
                  key={index}
                  onClick={() => openVideo(index)}
                  index={index}
                  videoIndex={videoIndex}
                  video={video}
                ></VideoItem>
              ))}
            </Box>
          </Box>
        </Box>
      </PageFrame>
    </ThemedPage>
  );
};

const VideoItem: React.FC<{
  index: number;
  videoIndex: number;
  video: IVideo;
  onClick?: MouseEventHandler<HTMLDivElement>;
}> = ({ index, videoIndex, video, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        borderBottom: '1px solid #00000010',
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: index === videoIndex ? '#00000010' : undefined,
        ':hover': {
          backgroundColor: '#00000010',
        },
      }}
    >
      <Typography>
        {index + 1}. {video.title}
      </Typography>
      <Box
        sx={{
          borderRadius: 99,
          backgroundColor: '#00000020',
          display: 'inline-flex',
          padding: '2px 8px',
          alignItems: 'center',
        }}
      >
        <Typography fontSize="0.8rem">Play</Typography>
        <Icon fontSize="small" sx={{ color: 'gray', marginLeft: '3px' }}>
          play_circle
        </Icon>
      </Box>
    </Box>
  );
};

export default Page;
