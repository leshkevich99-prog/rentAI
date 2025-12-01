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
import { fetchCars, addCarToDb, updateCarInDb, deleteCarFromDb } from './services/supabase';
import { Loader2 } from 'lucide-react';

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const location = useLocation();

  // Load cars from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCars();
        setCars(data);
      } catch (error) {
        console.error("Failed to load fleet data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleBookCar = (car: Car) => {
    setSelectedCar(car);
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
  };

  // Admin handlers wrapping Supabase calls
  const handleAddCar = async (newCar: Car) => {
    try {
      // Optimistic update
      const tempId = Date.now().toString();
      const optimisitcCar = { ...newCar, id: tempId };
      setCars(prev => [...prev, optimisitcCar]);

      const addedCar = await addCarToDb(newCar);
      if (addedCar) {
        // Replace temp car with real DB data (real ID)
        setCars(prev => prev.map(c => c.id === tempId ? addedCar : c));
      }
    } catch (e) {
      alert("Ошибка сохранения в базу данных");
      // Revert optimistic update? For simplicity, we just reload or let user try again.
    }
  };

  const handleUpdateCar = async (updatedCar: Car) => {
    try {
      setCars(cars.map(c => c.id === updatedCar.id ? updatedCar : c));
      await updateCarInDb(updatedCar);
    } catch (e) {
      console.error(e);
      alert("Ошибка обновления базы данных");
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      try {
        setCars(cars.filter(c => c.id !== id));
        await deleteCarFromDb(id);
      } catch (e) {
        console.error(e);
        alert("Ошибка удаления из базы данных");
      }
    }
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold-400 animate-spin" />
      </div>
    );
  }

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