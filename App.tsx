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
import { AiConcierge } from './components/AiConcierge';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { CarDetails } from './pages/CarDetails';
import { NotFound } from './pages/NotFound';
import { Car } from './types';
import { CARS as MOCK_CARS } from './constants';
import { fetchCars, isConfigured } from './services/supabase';

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Load cars from Supabase
  useEffect(() => {
    const loadCars = async () => {
      // Check configuration first to avoid console errors
      if (!isConfigured) {
        console.log("Supabase not configured, using mock data");
        setCars(MOCK_CARS);
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchCars();
        if (data.length > 0) {
          setCars(data);
        } else {
          // Fallback if DB is empty, use mock but generally we want DB
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

  // Admin handlers wrapper
  // NOTE: The actual DB saving now happens inside Admin.tsx securely via API.
  // These handlers are just for Optimistic UI updates.
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

  return (
    <div className="bg-black min-h-screen flex flex-col font-sans text-gray-100">
      <Navbar />
      
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

      <Footer />

      {/* Global Modals/Widgets */}
      {selectedCar && (
        <BookingModal car={selectedCar} onClose={handleCloseModal} />
      )}
      
      <AiConcierge />
    </div>
  );
}

export default App;