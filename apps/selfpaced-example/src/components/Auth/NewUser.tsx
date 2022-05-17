import { gql, useMutation } from '@apollo/client';
import { Box, Button, Card } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { signOut, useSession } from 'next-auth/react';

interface Values {
  firstName: string;
  lastName: string;
  email: string;
}

const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      id
    }
  }
`;

const NewUser: React.FC = () => {
  const { data: session, status } = useSession();
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);
  const createUser = async (values: Values) => {
    await registerUser({
      variables: {
        input: {
          firstName: values.firstName,
          lastName: values.lastName,
        },
      },
    });

    // Force session reload
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  if (status === 'loading') return null;

  const initialValues: Values = {
    firstName: session!.user!.name!.split(' ')[0],
    lastName: session!.user!.name!.split(' ').slice(1).join(' '),
    email: session!.user!.email!,
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
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            await createUser(values);
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
              disabled
              fullWidth
              component={TextField}
            />
            <Box
              sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}
            >
              <Button
                onClick={async () => {
                  await signOut();
                }}
              >
                Cancel
              </Button>
              <Button variant="contained" type="submit" disabled={loading}>
                Register
              </Button>
            </Box>
          </Form>
        </Formik>
      </Card>
    </Box>
  );
};

export default NewUser;
