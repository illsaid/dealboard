import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './data/DataProvider';
import { AppShell } from './AppShell';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
