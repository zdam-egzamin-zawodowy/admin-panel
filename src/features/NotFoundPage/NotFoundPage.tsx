import { Route } from 'config/routing';

import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography } from '@material-ui/core';
import Link from 'common/Link/Link';

const NotFoundPage = () => {
  const classes = useStyles();

  return (
    <main>
      <Container className={classes.container}>
        <Typography gutterBottom variant="h1">
          Nie znaleziono strony
        </Typography>
        <Typography gutterBottom variant="h4">
          Wygląda na to, że kliknąłeś uszkodzony link lub wpisałeś adres URL,
          który nie istnieje.
        </Typography>
        <Typography variant="h4">
          <Link to={Route.SignInPage}>Wróć na stronę główną</Link>
        </Typography>
      </Container>
    </main>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '100vh',
  },
}));

export default NotFoundPage;
