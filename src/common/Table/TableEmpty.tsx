import React from 'react';

import { TableRow, TableCell, Typography } from '@material-ui/core';

function TableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={100}>
        <Typography align="center">Brak danych do wyświetlenia</Typography>
      </TableCell>
    </TableRow>
  );
}

export default TableEmpty;
