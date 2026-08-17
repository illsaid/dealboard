import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BriefingPage } from './pages/BriefingPage';
import { DealBoardPage } from './pages/DealBoardPage';
import { RecordDetailPage } from './pages/RecordDetailPage';
import { BuyersPage } from './pages/BuyersPage';
import { BuyerDetailPage } from './pages/BuyerDetailPage';
import { AboutPage } from './pages/AboutPage';
import { SubscribePage } from './pages/SubscribePage';
import { AdminPage } from './pages/AdminPage';

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<BriefingPage />} />
          <Route path="/deals" element={<DealBoardPage />} />
          <Route path="/deals/:id" element={<RecordDetailPage />} />
          <Route path="/buyers" element={<BuyersPage />} />
          <Route path="/buyers/:id" element={<BuyerDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
