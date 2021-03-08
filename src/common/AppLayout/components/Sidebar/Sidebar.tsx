import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import useStyles from './useStyles';
import { ROUTE } from 'config/routing';
import { Route } from './components/Nav/types';

import { useTheme } from '@material-ui/core/styles';
import { SwipeableDrawer, DrawerProps, Toolbar } from '@material-ui/core';
import { Dashboard as DashboardIcon } from '@material-ui/icons';
import Nav from './components/Nav/Nav';

export interface Props {
  className?: string;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  variant?: DrawerProps['variant'];
}

const Sidebar = ({ className, open, variant, onClose, onOpen }: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { pathname } = useLocation();
  const routes: Route[] = [
    {
      name: 'Dashboard',
      to: ROUTE.DASHBOARD_PAGE,
      Icon: <DashboardIcon color="inherit" />,
      exact: true,
    },
  ];

  useEffect(() => {
    onClose(); // eslint-disable-next-line
  }, [pathname]);

  return (
    <SwipeableDrawer
      anchor="left"
      classes={{ paper: classes.drawerPaper }}
      ModalProps={{ style: { zIndex: theme.zIndex.appBar - 1 } }}
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      variant={variant}
    >
      <Toolbar />
      <div className={clsx(classes.root, className)}>
        <Nav routes={routes} />
      </div>
    </SwipeableDrawer>
  );
};

export default Sidebar;
