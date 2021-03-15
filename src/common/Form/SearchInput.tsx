import { useRef } from 'react';

import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
} from '@material-ui/core';
import { Search as SearchIcon, Close as CloseIcon } from '@material-ui/icons';

export type SearchInputProps = TextFieldProps & {
  onResetValue?: () => void;
};

function SearchInput({ value, onResetValue, ...rest }: SearchInputProps) {
  const input = useRef<HTMLInputElement | null>(null);

  return (
    <TextField
      {...rest}
      value={value}
      inputRef={input}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            onClick={() => {
              if (input.current) {
                input.current.focus();
              }
            }}
          >
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              size="small"
              type="button"
              disabled={typeof value === 'string' && value === ''}
              onClick={() => {
                if (!value && input.current) {
                  input.current.value = '';
                }
                if (onResetValue) {
                  onResetValue();
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ),
        ...(rest.InputProps ?? {}),
      }}
    />
  );
}

export default SearchInput;
