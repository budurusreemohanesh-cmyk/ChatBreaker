import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Home } from '@/pages/Home';
import { Upload } from '@/pages/Upload';
import { Dashboard } from '@/pages/Dashboard';
import { Wrapped } from '@/pages/Wrapped';
import { NotFound } from '@/pages/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Fullscreen Wrapped story */}
        <Route path="/wrapped" element={<Wrapped />} />

        {/* Standard layout routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
