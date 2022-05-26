import { gql, useMutation } from '@apollo/client';
import { Box, Button, Card, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { signIn } from 'next-auth/react';
import Router from 'next/router';

interface Values {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordAgain: string;
}

const SETUP_APP = gql`
  mutation SetupApp($input: SetupAppInput!) {
    setupApp(input: $input) {
      id
    }
  }
`;

const Setup: React.FC = () => {
  const [setupApp, { loading, error }] = useMutation(SETUP_APP);
  const setupHandler = async (values: Values) => {
    await setupApp({
      variables: {
        input: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        },
      },
    });
    await signIn('credentials', {
      email: values.email,
      password: values.password,
    });
  };

  const initialValues: Values = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordAgain: '',
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          width: { xs: '100%', md: '40%' },
          maxWidth: { sm: '400px' },
          padding: '10px',
        }}
      >
        <Typography variant="h5">Setup your admin account</Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            await setupHandler(values);
          }}
          validate={(values) => {
            // TODO: Validate
          }}
        >
          <Form>
            <Field
              name="firstName"
              label="First Name"
              margin="dense"
              fullWidth
              component={TextField}
            />
            <Field
              name="lastName"
              label="Last Name"
              margin="dense"
              fullWidth
              component={TextField}
            />
            <Field
              name="email"
              label="Email"
              margin="dense"
              fullWidth
              component={TextField}
            />
            <Field
              name="password"
              label="Password"
              type="password"
              margin="dense"
              fullWidth
              component={TextField}
            />
            <Field
              name="passwordAgain"
              label="Password one more time"
              type="password"
              margin="dense"
              fullWidth
              component={TextField}
            />
            <Box
              sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}
            >
              <Button variant="contained" type="submit" disabled={loading}>
                Setup
              </Button>
            </Box>
          </Form>
        </Formik>
      </Card>
    </Box>
  );
};

export default Setup;
