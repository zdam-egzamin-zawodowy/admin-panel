import {
  Box,
  Typography,
  CircularProgress,
  BoxProps,
  TypographyProps,
} from '@material-ui/core';

export const CENTER_SPINNER: BoxProps = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

export interface SpinnerProps {
  size?: number;
  containerProps?: BoxProps;
  typographyProps?: TypographyProps;
  description?: string;
}

function Spinner({
  size = 150,
  containerProps = CENTER_SPINNER,
  typographyProps = { variant: 'h3' },
  description = '',
}: SpinnerProps) {
  return (
    <Box {...containerProps}>
      <Box mb={description ? 1 : 0}>
        <CircularProgress size={size} />
      </Box>
      {description && (
        <Typography {...typographyProps}>{description}</Typography>
      )}
    </Box>
  );
}

export default Spinner;
