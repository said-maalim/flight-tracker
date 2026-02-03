'use client';

import { useState } from 'react';
import FlightSearch from '@/components/FlightSearch';
import FlightCard from '@/components/FlightCard';
import { Flight } from '@/app/api/flights/route';

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/flights?flightNumber=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to fetch flights');
      const data = await res.json();
      setFlights(data);
    } catch (error) {
      console.error(error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="content">
        <header className="header">
          <h1 className="title">Flight Tracker</h1>
          <p className="subtitle">Real-time status updates</p>
        </header>

        <FlightSearch onSearch={handleSearch} isLoading={loading} />

        <div className="results">
          {loading ? (
            <p className="status-text">Searching flights...</p>
          ) : hasSearched && flights.length === 0 ? (
            <div className="empty-state">
              <p className="status-text">No flights found for this number.</p>
              <p className="status-sub">Try searching for UA123, BA249, AA992...</p>
            </div>
          ) : (
            flights.map((flight) => (
              <FlightCard key={flight.flightNumber} flight={flight} />
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4rem 1rem;
        }
        
        .content {
          width: 100%;
          max-width: 600px;
        }
        
        .header {
           text-align: center;
           margin-bottom: 3rem;
        }

        .title {
          font-size: 3.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
            color: #64748b;
            font-size: 1.25rem;
        }

        .status-text {
            color: #94a3b8;
            text-align: center;
            font-size: 1.125rem;
        }
        
        .status-sub {
            color: #64748b;
            text-align: center;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        
        .empty-state {
            margin-top: 2rem;
            padding: 2rem;
            background: rgba(255,255,255,0.02);
            border-radius: 1rem;
            border: 1px dashed rgba(255,255,255,0.1);
        }
      `}</style>
    </main>
  );
}
