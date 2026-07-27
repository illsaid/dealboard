import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeData } from './data/service';

async function bootstrap() {
  await initializeData();

  const root = document.getElementById('root')!;
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );

  if (root.innerHTML.trim().length > 0) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}

void bootstrap();
