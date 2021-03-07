import Spinner, { CENTER_SPINNER } from 'common/Spinner/Spinner';
import { useAuth } from 'libs/auth';

export interface AppLoadingProps {
  children: JSX.Element;
}

function AppLoading({ children }: AppLoadingProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Spinner
        containerProps={{
          ...CENTER_SPINNER,
          minHeight: '100vh',
        }}
        description="Wczytywanie danych..."
      />
    );
  }

  return children;
}

export default AppLoading;
