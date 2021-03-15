import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Route } from 'config/routing';
import { Route as NavRoute } from './components/Nav/types';

import { useTheme } from '@material-ui/core/styles';
import {
  SwipeableDrawer,
  DrawerProps,
  Toolbar,
  Divider,
} from '@material-ui/core';
import useStyles from './useStyles';
import {
  Group as GroupIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from '@material-ui/icons';
import Nav from './components/Nav/Nav';
import CurrentUser from './components/CurrentUser/CurrentUser';

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
  const routes: NavRoute[] = [
    {
      name: 'Użytkownicy',
      to: Route.UsersPage,
      exact: true,
      Icon: <GroupIcon color="inherit" />,
    },
    {
      name: 'Zawody',
      to: Route.ProfessionsPage,
      exact: true,
      Icon: <WorkIcon color="inherit" />,
    },
    {
      name: 'Kwalifikacje',
      to: Route.QualificationsPage,
      exact: true,
      Icon: <DescriptionIcon color="inherit" />,
    },
    {
      name: 'Pytania',
      to: Route.QuestionsPage,
      exact: true,
      Icon: <QuestionAnswerIcon color="inherit" />,
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
        <CurrentUser />
        <Divider />
        <Nav routes={routes} />
      </div>
    </SwipeableDrawer>
  );
};

export default Sidebar;
