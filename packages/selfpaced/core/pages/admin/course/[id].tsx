import { gql, useQuery } from '@apollo/client';
import { Box, Button, Icon, IconButton, Typography } from '@mui/material';
import { blue, red } from '@mui/material/colors';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useState } from 'react';
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
  id: string;
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
  const [editingVideos, setEditingVideos] = useState<(number | string)[]>([]);
  const [videos, setVideos] = useState<IVideo[]>([]);
  useEffect(() => {
    setVideos(data?.getCourse.videos ?? []);
  }, [data]);
  if (!router || loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;
  return (
    <AdminFrame>
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'column',
          gap: 1,
          maxWidth: '1000px',
          margin: 'auto',
        }}
      >
        {videos.map((video) => {
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
                onDelete={() => {
                  setEditingVideos(
                    editingVideos.filter((id) => id !== video.id)
                  );
                }}
                onSave={() => {
                  setEditingVideos(
                    editingVideos.filter((id) => id !== video.id)
                  );
                }}
                onCancel={() => {
                  if (video.id.startsWith('new-')) {
                    // if its an unsaved new video
                    setVideos(
                      videos.filter((fVideo) => fVideo.id !== video.id)
                    );
                  }
                  setEditingVideos(
                    editingVideos.filter((id) => id !== video.id)
                  );
                }}
              />
            );
          }
        })}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => {
              const id = 'new-' + (Math.random() + 1).toString(36).substring(2);
              setVideos([...videos, { id: id, title: '', url: '' }]);
              setEditingVideos([...editingVideos, id]);
            }}
          >
            <Icon>add</Icon>
          </Button>
        </Box>
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
      <IconButton onClick={onEdit}>
        <Icon>edit</Icon>
      </IconButton>
    </Box>
  );
};

const VideoEditBox: React.FC<{
  video: IVideo;
  onDelete: MouseEventHandler<HTMLButtonElement>;
  onSave: MouseEventHandler<HTMLButtonElement>;
  onCancel: MouseEventHandler<HTMLButtonElement>;
}> = ({ video, onDelete, onSave, onCancel }) => {
  return (
    <Formik
      initialValues={{
        title: video.title,
        url: video.url,
      }}
      onSubmit={async (values) => {
        console.log(values);
      }}
    >
      <Form>
        <Box
          sx={{
            padding: 1,
            backgroundColor: 'white',
            borderRadius: 1,
            boxShadow: '2px 2px 8px #00000020',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'start' }}>
            <Field
              name="title"
              label="Title"
              margin="dense"
              size="small"
              fullWidth
              component={TextField}
            />
            {!video.id.startsWith('new-') && (
              <IconButton onClick={onDelete} type="submit">
                <Icon sx={{ color: red[300] }}>delete</Icon>
              </IconButton>
            )}
            <IconButton onClick={onSave} type="submit">
              <Icon sx={{ color: blue[600] }}>save</Icon>
            </IconButton>
            <IconButton onClick={onCancel}>
              <Icon>cancel</Icon>
            </IconButton>
          </Box>
          <Field
            name="url"
            label="Url"
            margin="dense"
            size="small"
            fullWidth
            component={TextField}
          />
        </Box>
      </Form>
    </Formik>
  );
};

export default Page;
