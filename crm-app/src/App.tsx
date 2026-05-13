import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ─── Layout ───────────────────────────────────────────────────────────────────
import Layout from './components/Layout';

// ─── Pages ───────────────────────────────────────────────────────────────────
import DashboardPage from './pages/DashboardPage';
import LeadsListPage from './pages/LeadsListPage';
import LeadDetailPage from './pages/LeadDetailPage';
import LeadEditPage from './pages/LeadEditPage';
import NotFoundPage from './pages/NotFoundPage';

// ─── TanStack Query client ────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/*
           * All routes share the Layout shell (top nav + page wrapper).
           * Add new top-level pages as additional <Route> children here.
           */}
          <Route element={<Layout />}>
            {/* Dashboard  →  / */}
            <Route index element={<DashboardPage />} />

            {/* Leads list  →  /leads */}
            <Route path="leads" element={<LeadsListPage />} />

            {/* Lead detail  →  /leads/:id */}
            <Route path="leads/:id" element={<LeadDetailPage />} />

            {/* Lead edit  →  /leads/:id/edit */}
            <Route path="leads/:id/edit" element={<LeadEditPage />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}