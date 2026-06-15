import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <RootNavigator />
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>);
}
