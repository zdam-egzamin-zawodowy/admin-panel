import { useForm } from 'react-hook-form';
import { useSnackbar } from 'material-ui-snackbar-provider';
import { useAuth } from 'libs/auth';
import { ApolloError } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
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
  Box,
} from '@material-ui/core';
import { Role } from '../../config/app';

type FormData = {
  email: string;
  password: string;
  staySignedIn: boolean;
};

const SignInPage = () => {
  const snackbar = useSnackbar();
  const { signIn } = useAuth();
  const { register, errors, handleSubmit } = useForm<FormData>();
  const classes = useStyles();

  const onSubmit = async (data: FormData) => {
    try {
      await signIn(data.email, data.password, data.staySignedIn, user => {
        if (user.role !== Role.Admin) {
          throw new Error('Brak uprawnień.');
        }
        return true;
      });
      snackbar.showMessage('Logowanie przebiegło pomyślnie.');
    } catch (e) {
      snackbar.showMessage(
        e instanceof ApolloError && e.graphQLErrors.length > 0
          ? e.graphQLErrors[0].message
          : e.message
      );
    }
  };

  return (
    <div className={classes.container}>
      <Container maxWidth="xs">
        <div className={classes.logoWrapper}>
          <img
            className={classes.logo}
            src="/logo.svg"
            alt="Zdam Egzamin Zawodowy"
          />
        </div>
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

const useStyles = makeStyles(theme => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#330000',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Cdefs%3E%3CradialGradient id='a' cx='396' cy='281' r='514' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23D18'/%3E%3Cstop offset='1' stop-color='%23330000'/%3E%3C/radialGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='400' y1='148' x2='400' y2='333'%3E%3Cstop offset='0' stop-color='%23FA3' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23FA3' stop-opacity='0.5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='800' height='400'/%3E%3Cg fill-opacity='0.4'%3E%3Ccircle fill='url(%23b)' cx='267.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='532.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='400' cy='30' r='300'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  logo: {
    width: '112px',
  },
  logoWrapper: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
}));

export default SignInPage;
