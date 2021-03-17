import clsx from 'clsx';
import { useAuth } from 'libs/auth';
import { Route } from 'config/routing';

import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Hidden,
  IconButton,
  Typography,
  Button,
  Container,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import Link from 'common/Link/Link';

export interface Props {
  className?: string;
  openSidebar?: () => void;
}

const TopBar = ({ className, openSidebar }: Props) => {
  const classes = useStyles();
  const { signOut } = useAuth();

  return (
    <AppBar className={clsx(className)}>
      <Container maxWidth={false}>
        <Toolbar disableGutters className={classes.toolbar}>
          <div className={classes.leftSideContainer}>
            <Hidden lgUp>
              <IconButton color="inherit" onClick={openSidebar}>
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Hidden xsDown>
              <Typography variant="h4">
                <Link color="inherit" to={Route.UsersPage}>
                  zdamegzaminzawodowy.pl
                </Link>
              </Typography>
            </Hidden>
          </div>
          <div className={classes.rightSideContainer}>
            <Button color="inherit" onClick={signOut}>
              Wyloguj się
            </Button>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: 'space-between',
  },
  leftSideContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  rightSideContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default TopBar;
