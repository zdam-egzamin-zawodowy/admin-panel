import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
} from '@material-ui/core/styles';
import { blue, pink } from '@material-ui/core/colors';

const createTheme = (): Theme => {
  return responsiveFontSizes(
    createMuiTheme({
      palette: {
        primary: {
          main: blue['A200'],
        },
        secondary: {
          main: pink['A200'],
        },
      },
      overrides: {
        MuiTableContainer: {
          root: {
            overflow: 'auto',
          },
        },
      },
      props: {
        MuiLink: {
          underline: 'none',
        },
      },
    })
  );
};

export default createTheme;
