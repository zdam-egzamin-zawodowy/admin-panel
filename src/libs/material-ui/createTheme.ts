import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
} from '@material-ui/core/styles';

const createTheme = (): Theme => {
  return responsiveFontSizes(
    createMuiTheme({
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
