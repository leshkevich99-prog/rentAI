
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Fleet } from './components/Fleet';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { Terms } from './components/Terms';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { UserAgreement } from './components/UserAgreement';
import { CallbackModal } from './components/CallbackModal';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { CarDetails } from './pages/CarDetails';
import { NotFound } from './pages/NotFound';
import { Car } from './types';
import { CARS as MOCK_CARS } from './constants';
import { fetchCars, isConfigured } from './services/supabase';
import { Phone } from 'lucide-react';
import { LanguageProvider, useTranslation } from './context/LanguageContext';

function AppContent() {
  const { t } = useTranslation();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const loadCars = async () => {
      if (!isConfigured) {
        setCars(MOCK_CARS);
        setIsLoading(false);
        return;
      }
      try {
        const data = await fetchCars();
        if (data.length > 0) {
          setCars(data);
        } else {
          setCars(MOCK_CARS); 
        }
      } catch (error) {
        console.error("Failed to load cars", error);
        setCars(MOCK_CARS);
      } finally {
        setIsLoading(false);
      }
    };
    loadCars();
  }, []);

  const handleBookCar = (car: Car) => {
    setSelectedCar(car);
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
  };

  const handleAddCar = async (newCar: Car) => {
    const tempCar = { ...newCar, id: newCar.id || Math.random().toString(36).substring(7) };
    setCars(prev => [tempCar, ...prev]);
  };

  const handleUpdateCar = async (updatedCar: Car) => {
    setCars(prev => prev.map(c => c.id === updatedCar.id ? updatedCar : c));
  };

  const handleDeleteCar = async (id: string) => {
    setCars(prev => prev.filter(c => c.id !== id));
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="bg-black min-h-screen flex flex-col font-sans text-gray-100">
      {!isAdminPage && <Navbar />}
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home cars={cars} onBookCar={handleBookCar} />} />
          <Route path="/fleet" element={<div className="pt-20"><Fleet cars={cars} onBookCar={handleBookCar} /></div>} />
          <Route path="/fleet/:id" element={<CarDetails cars={cars} onBookCar={handleBookCar} />} />
          
          <Route path="/services" element={<div className="pt-20"><Services /></div>} />
          <Route path="/about" element={<div className="pt-20"><About /></div>} />
          <Route path="/contact" element={<div className="pt-20"><Contact /></div>} />
          <Route path="/terms" element={<div className="pt-20"><Terms /></div>} />
          
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/user-agreement" element={<UserAgreement />} />
          
          <Route path="/admin" element={
            <Admin 
              cars={cars} 
              onAddCar={handleAddCar} 
              onUpdateCar={handleUpdateCar} 
              onDeleteCar={handleDeleteCar} 
            />
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!isAdminPage && <Footer />}

      {selectedCar && (
        <BookingModal car={selectedCar} onClose={handleCloseModal} />
      )}
      
      {!isAdminPage && (
        <>
          <button
            onClick={() => setIsCallbackOpen(true)}
            className="fixed bottom-8 right-8 z-40 bg-gold-500 text-black p-4 rounded-full shadow-lg shadow-gold-500/20 hover:bg-gold-400 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          >
            <Phone className="w-6 h-6 animate-pulse" />
            <span className="absolute right-full mr-4 bg-white text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {t('booking.floatingBtn')}
            </span>
          </button>
          
          {isCallbackOpen && (
            <CallbackModal onClose={() => setIsCallbackOpen(false)} />
          )}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
