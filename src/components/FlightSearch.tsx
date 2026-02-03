import React, { useState } from 'react';
import styles from './FlightSearch.module.css';

interface FlightSearchProps {
    onSearch: (flightNumber: string) => void;
    isLoading: boolean;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter flight number (e.g. UA123)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading}
                />
                <button type="submit" className={styles.button} disabled={isLoading} aria-label="Search">
                    {isLoading ? (
                        <div className="loader" style={{ width: 20, height: 20, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                        <svg className={styles.icon} viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    )}
                </button>
            </form>
            <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default FlightSearch;
