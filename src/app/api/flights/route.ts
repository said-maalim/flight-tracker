import { NextResponse } from 'next/server';
import { fetchFlightStatus } from '@/utils/aviationStack';

export interface Flight {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string; // ISO string
  arrivalTime: string;   // ISO string
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Arrived';
  gate: string;
  terminal: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get('flightNumber');

  if (!flightNumber) {
    return NextResponse.json([]);
  }

  try {
    const apiResponse = await fetchFlightStatus(flightNumber);

    // Map external API data to internal Flight interface
    const flights: Flight[] = (apiResponse.data || []).map((item) => {
      // Map status to expected values
      let status: Flight['status'] = 'On Time';
      const apiStatus = (item.flight_status || '').toLowerCase();

      if (apiStatus === 'cancelled') status = 'Cancelled';
      else if (apiStatus === 'landed') status = 'Arrived';
      else if (item.departure.delay && item.departure.delay > 15) status = 'Delayed';
      else if (apiStatus === 'active') status = 'On Time';

      // Format Origin/Dest strings
      const origin = item.departure.airport
        ? `${item.departure.airport} (${item.departure.iata})`
        : item.departure.iata;

      const destination = item.arrival.airport
        ? `${item.arrival.airport} (${item.arrival.iata})`
        : item.arrival.iata;

      return {
        flightNumber: item.flight.iata || item.flight.number || 'Unknown',
        airline: item.airline.name || 'Unknown Airline',
        origin: origin,
        destination: destination,
        departureTime: item.departure.estimated || item.departure.scheduled,
        arrivalTime: item.arrival.estimated || item.arrival.scheduled,
        status: status,
        gate: item.departure.gate || 'TBD',
        terminal: item.departure.terminal || 'TBD',
      };
    });

    return NextResponse.json(flights);
  } catch (error) {
    console.error('API Error:', error);
    // Return empty array on error to prevent app crash
    return NextResponse.json([]);
  }
}
