import { gql, useQuery } from '@apollo/client';
import { Box, IconButton, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { MouseEventHandler, useState } from 'react';
import AdminFrame from '../../../components/AdminFrame';

const GET_COURSE = gql`
  query GetCourse($id: Float!) {
    getCourse(id: $id) {
      name
      description
      videos {
        id
        title
        url
      }
    }
  }
`;

interface IVideo {
  id: number;
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
}> = ({ params }) => {
  const router = useRouter();
  const { loading, error, data } = useQuery<ICourse>(GET_COURSE, {
    variables: { id: parseInt(params.id) },
    skip: !router,
  });
  const [editingVideos, setEditingVideos] = useState<number[]>([]);
  if (!router || loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;
  const course = data.getCourse;
  return (
    <AdminFrame>
      <Box sx={{ display: 'flex', flexFlow: 'column', gap: 1 }}>
        {course.videos.map((video) => {
          if (!editingVideos.includes(video.id)) {
            return (
              <VideoBox
                key={video.id}
                video={video}
                onEdit={() => {
                  setEditingVideos([...editingVideos, video.id]);
                }}
              />
            );
          } else {
            return (
              <VideoEditBox
                key={video.id}
                video={video}
                onSave={() => {
                  setEditingVideos(
                    editingVideos.filter((id) => id !== video.id)
                  );
                }}
              />
            );
          }
        })}
      </Box>
    </AdminFrame>
  );
};

const VideoBox: React.FC<{
  video: IVideo;
  onEdit: MouseEventHandler<HTMLButtonElement>;
}> = ({ video, onEdit }) => {
  return (
    <Box
      sx={{
        padding: 1,
        backgroundColor: 'white',
        borderRadius: 1,
        boxShadow: '2px 2px 8px #00000020',
        display: 'flex',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography>{video.title}</Typography>
      </Box>
      <IconButton onClick={onEdit}>edit</IconButton>
    </Box>
  );
};

const VideoEditBox: React.FC<{
  video: IVideo;
  onSave: MouseEventHandler<HTMLButtonElement>;
}> = ({ video, onSave }) => {
  return (
    <Box
      sx={{
        padding: 1,
        backgroundColor: 'white',
        borderRadius: 1,
        boxShadow: '2px 2px 8px #00000020',
        display: 'flex',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography>{video.title}</Typography>
      </Box>
      <IconButton onClick={onSave}>save</IconButton>
    </Box>
  );
};

export default Page;
