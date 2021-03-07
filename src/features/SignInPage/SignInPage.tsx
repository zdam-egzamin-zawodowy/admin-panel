import { useForm } from 'react-hook-form';
import { ApolloError } from '@apollo/client';
import { useAuth } from 'libs/auth';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import { Role } from '../../config/app';

type FormData = {
  email: string;
  password: string;
  staySignedIn: boolean;
};

const SignInPage = () => {
  const { signIn } = useAuth();
  const { register, errors, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await signIn(data.email, data.password, data.staySignedIn, user => {
        if (user.role !== Role.Admin) {
          throw new Error('Brak uprawnień.');
        }
        return true;
      });
    } catch (e) {
      if (e instanceof ApolloError) {
        if (e.graphQLErrors.length > 0) {
          console.log(e.graphQLErrors[0]);
        }
      }
    }
  };

  return (
    <div>
      <Container maxWidth="xs">
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h4">
              Zaloguj się
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Adres e-mail"
                name="email"
                margin="dense"
                inputRef={register({ required: 'Te pole jest wymagane.' })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />
              <TextField
                type="password"
                label="Hasło"
                margin="dense"
                fullWidth
                name="password"
                inputRef={register({ required: 'Te pole jest wymagane.' })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox inputRef={register} name="staySignedIn" />}
                  label="Pozostań zalogowany"
                />
              </FormGroup>
              <Button variant="contained" color="primary" type="submit">
                Zaloguj się
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default SignInPage;
