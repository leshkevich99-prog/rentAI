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
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { Car } from './types';
import { CARS as MOCK_CARS } from './constants';
import { fetchCars, saveCar, deleteCarById, isConfigured } from './services/supabase';

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
  const handleAddCar = async (newCar: Car) => {
    // Handle demo mode
    if (!isConfigured) {
      const demoCar = { ...newCar, id: Math.random().toString(36).substring(2, 9) };
      setCars(prev => [demoCar, ...prev]);
      alert("Демо режим: Автомобиль добавлен локально (не сохранено в БД)");
      return;
    }

    // Optimistic update
    setCars(prev => [newCar, ...prev]);
    try {
      await saveCar(newCar);
      // Reload to get real ID
      const updated = await fetchCars();
      setCars(updated);
    } catch (e) {
      console.error(e);
      alert('Ошибка при сохранении');
    }
  };

  const handleUpdateCar = async (updatedCar: Car) => {
    setCars(prev => prev.map(c => c.id === updatedCar.id ? updatedCar : c));
    
    if (!isConfigured) {
      alert("Демо режим: Автомобиль обновлен локально (не сохранено в БД)");
      return;
    }

    try {
      await saveCar(updatedCar);
    } catch (e) {
      console.error(e);
      alert('Ошибка при обновлении');
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      setCars(prev => prev.filter(c => c.id !== id));
      
      if (!isConfigured) {
        alert("Демо режим: Автомобиль удален локально (не сохранено в БД)");
        return;
      }

      try {
        await deleteCarById(id);
      } catch (e) {
        console.error(e);
        alert('Ошибка при удалении');
      }
    }
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-500 selection:text-black">
      {!isAdminRoute && <Navbar />}
      
      <main>
        <Routes>
          <Route path="/" element={<Home cars={cars} onBookCar={handleBookCar} />} />
          <Route path="/fleet" element={<Fleet cars={cars} onBookCar={handleBookCar} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/user-agreement" element={<UserAgreement />} />
          
          <Route 
            path="/admin" 
            element={
              <Admin 
                cars={cars} 
                onAddCar={handleAddCar}
                onUpdateCar={handleUpdateCar}
                onDeleteCar={handleDeleteCar}
              />
            } 
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      
      {selectedCar && (
        <BookingModal car={selectedCar} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;