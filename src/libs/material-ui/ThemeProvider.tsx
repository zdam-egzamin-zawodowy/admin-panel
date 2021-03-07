import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import createTheme from './createTheme';

interface ThemeProviderProps {
  children?: React.ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={createTheme()}>
      {children}
      <CssBaseline />
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
