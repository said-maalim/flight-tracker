export interface AviationStackResponse {
    pagination: Pagination;
    data: FlightData[];
}

export interface Pagination {
    limit: number;
    offset: number;
    count: number;
    total: number;
}

export interface FlightData {
    flight_date: string;
    flight_status: string;
    departure: FlightEndpoint;
    arrival: FlightEndpoint;
    airline: Airline;
    flight: Flight;
    aircraft: Aircraft | null;
    live: LiveData | null;
}

export interface FlightEndpoint {
    airport: string | null;
    timezone: string | null;
    iata: string;
    icao: string;
    terminal: string | null;
    gate: string | null;
    delay: number | null;
    scheduled: string;
    estimated: string;
    actual: string | null;
    estimated_runway: string | null;
    actual_runway: string | null;
    baggage?: string | null;
}

export interface Airline {
    name: string;
    iata: string | null;
    icao: string | null;
}

export interface Flight {
    number: string | null;
    iata: string | null;
    icao: string | null;
    codeshared: CodesharedFlight | null;
}

export interface CodesharedFlight {
    airline_name: string;
    airline_iata: string;
    airline_icao: string;
    flight_number: string;
    flight_iata: string;
    flight_icao: string;
}

export interface Aircraft {
    registration: string | null;
    iata: string | null;
    icao: string | null;
    icao24: string | null;
}

export interface LiveData {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
}

const ACCESS_KEY = process.env.AVIATION_STACK_ACCESS_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1/flights';

/**
 * Fetches flight status information from the Aviation Stack API.
 * 
 * @param query - The search query (e.g., flight number).
 * @returns A promise that resolves to the AviationStackResponse.
 */
export async function fetchFlightStatus(flightIata: string): Promise<AviationStackResponse> {
    // Using flight_iata to search by IATA flight code (e.g. AA123)
    const url = `${BASE_URL}?access_key=${ACCESS_KEY}&flight_iata=${encodeURIComponent(flightIata)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching flight data: ${response.statusText}`);
        }
        const data: AviationStackResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch flight status:", error);
        throw error;
    }
}
