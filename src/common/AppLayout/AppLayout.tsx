import { useState } from 'react';
import clsx from 'clsx';
import { DRAWER_WIDTH } from './components/Sidebar/contants';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Toolbar } from '@material-ui/core';

import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';

export interface Props {
  children?: React.ReactNode;
}

function AppLayout({ children }: Props) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true,
  });
  const shouldOpenSidebar = isDesktop ? true : open;

  const openSidebar = () => {
    if (!isDesktop) {
      setOpen(true);
    }
  };

  const closeSidebar = () => {
    if (!isDesktop) {
      setOpen(false);
    }
  };

  return (
    <div
      className={clsx({
        [classes.shiftContent]: isDesktop,
      })}
    >
      <TopBar openSidebar={open ? closeSidebar : openSidebar} />
      <Toolbar />
      <Sidebar
        onClose={closeSidebar}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
        onOpen={openSidebar}
      />
      <main className={classes.content}>{children}</main>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  shiftContent: {
    paddingLeft: DRAWER_WIDTH,
  },
  content: {
    height: '100%',
    padding: theme.spacing(3),
  },
}));

export default AppLayout;
