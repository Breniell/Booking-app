import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';
import DashboardLayout from './layouts/DashboardLayout.tsx';
import HomePage from './pages/HomePage.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import BookingPage from './pages/BookingPage.tsx';
import BookingConfirmation from './pages/BookingConfirmation.tsx';
import ServiceDetail from './pages/ServiceDetail.tsx';
import HowItWorks from './pages/HowItWorks.tsx';
import Services from './pages/Services.tsx';
import CreateServicePage from './pages/CreateServicePage.tsx';
import { ThirdPartyServices } from './pages/ThirdPartyServices.tsx';
import VideoConferencePage from './pages/VideoConferencePage.tsx';
import  {CalendarManagement} from './pages/CalendarManagement.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services" element={<Services />} />
            <Route path="service/:id" element={<ServiceDetail />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="book" element={<BookingPage />} />
            <Route path="booking-confirmation" element={<BookingConfirmation />} />
            <Route path="video" element={<VideoConferencePage />} />
            <Route path="third-party" element={<ThirdPartyServices />} />
        </Route>


          <Route element={<DashboardLayout/>}>
            <Route path="expert/calendar" element={<CalendarManagement />} />
            <Route path="expert/dashboard" element={<Dashboard />} />
            <Route path="client/dashboard" element={<Dashboard />} />
            <Route path="expert/services/create" element={<CreateServicePage />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
