import React from 'react';
import { useAuth } from 'libs/auth';

import { Box, Typography } from '@material-ui/core';

const CurrentUser = () => {
  const { user } = useAuth();

  return (
    <Box pr={0.5} pl={0.5}>
      <Typography variant="h6" align="center">
        Jesteś zalogowany jako: <br /> <strong>{user?.displayName}</strong> (ID:{' '}
        {user?.id})
      </Typography>
    </Box>
  );
};

export default CurrentUser;
