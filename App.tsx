import { NotesProvider } from './context/NotesContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <NotesProvider>
      <RootNavigator />
    </NotesProvider>);
}
