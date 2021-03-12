import { useState } from 'react';
import { useDebounce } from 'react-use';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import BaseTableToolbar from 'common/Table/TableToolbar';
import SearchInput from 'common/Form/SearchInput';

export interface TableToolbarProps {
  search: string;
  onChangeSearchValue: (search: string) => void;
  onClickCreateUser: () => void;
}

const TableToolbar = ({
  search,
  onChangeSearchValue,
  onClickCreateUser,
}: TableToolbarProps) => {
  const classes = useStyles();
  const [_search, setSearch] = useState<string>(search);
  useDebounce(
    () => {
      onChangeSearchValue(_search);
    },
    500,
    [_search]
  );

  return (
    <BaseTableToolbar className={classes.toolbar}>
      <SearchInput
        value={_search}
        onChange={e => {
          setSearch(e.target.value);
        }}
        onResetValue={() => {
          setSearch('');
        }}
      />
      <Tooltip title="Utwórz użykownika">
        <IconButton onClick={onClickCreateUser}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </BaseTableToolbar>
  );
};

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: 'flex-end',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(0.5),
    },
  },
}));

export default TableToolbar;
