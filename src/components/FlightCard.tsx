import React from 'react';
import styles from './FlightCard.module.css';
import { Flight } from '@/app/api/flights/route';

interface FlightCardProps {
    flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'On Time': return styles.onTime;
            case 'Delayed': return styles.delayed;
            case 'Cancelled': return styles.cancelled;
            default: return styles.arrived;
        }
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getAirportCode = (loc: string) => {
        const match = loc.match(/\(([A-Z]{3})\)/);
        return match ? match[1] : loc.substring(0, 3).toUpperCase();
    };

    const getCityIndex = (loc: string) => loc.indexOf('(');
    const getCity = (loc: string) => loc.substring(0, getCityIndex(loc)).trim();


    const generateGoogleCalendarUrl = (flight: Flight) => {
        const title = `Flight ${flight.flightNumber} to ${flight.destination}`;

        // Helper to format date for Google Calendar (YYYYMMDDTHHMMSSZ)
        // Note: This assumes dates are valid ISO strings.
        const formatGCalDate = (isoString: string) => {
            return isoString.replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const start = formatGCalDate(flight.departureTime);
        const end = formatGCalDate(flight.arrivalTime);

        const details = `
Airline: ${flight.airline}
Status: ${flight.status}
Gate: ${flight.gate}
Terminal: ${flight.terminal}
Origin: ${flight.origin}
Destination: ${flight.destination}
        `.trim();

        const location = `${flight.origin} to ${flight.destination}`;

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            details: details,
            location: location,
            dates: `${start}/${end}`,
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    const calendarUrl = generateGoogleCalendarUrl(flight);

    return (
        <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
        >
            <div className={styles.header}>
                <div className={styles.flightInfo}>
                    <h2>{flight.flightNumber}</h2>
                    <span className={styles.airline}>{flight.airline}</span>
                </div>
                <div className={`${styles.status} ${getStatusClass(flight.status)}`}>
                    {flight.status}
                </div>
            </div>

            <div className={styles.route}>
                <div className={`${styles.location} ${styles.start}`}>
                    <span className={styles.code}>{getAirportCode(flight.origin)}</span>
                    <span className={styles.city}>{getCity(flight.origin)}</span>
                </div>

                <div className={styles.path}>
                    <div className={styles.line}></div>
                    <div className={styles.planeIcon}>✈</div>
                </div>

                <div className={`${styles.location} ${styles.end}`}>
                    <span className={styles.code}>{getAirportCode(flight.destination)}</span>
                    <span className={styles.city}>{getCity(flight.destination)}</span>
                </div>
            </div>

            <div className={styles.details}>
                <div className={styles.detailItem}>
                    <span className={styles.label}>Departure</span>
                    <span className={styles.value}>{formatTime(flight.departureTime)}</span>
                    <span className={styles.date}>{formatDate(flight.departureTime)}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.label}>Arrival</span>
                    <span className={styles.value}>{formatTime(flight.arrivalTime)}</span>
                    <span className={styles.date}>{formatDate(flight.arrivalTime)}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.label}>Gate</span>
                    <span className={`${styles.value} ${styles.highlight}`}>{flight.gate}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.label}>Terminal</span>
                    <span className={styles.value}>{flight.terminal}</span>
                </div>
            </div>
        </a>
    );
};

export default FlightCard;
