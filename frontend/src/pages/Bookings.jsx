import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]); // We need rooms for the dropdown
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Load Rooms (for the dropdown menu)
      const roomsRes = await api.get('/rooms');
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);

      // 2. Load Existing Bookings (if your API has a GET /bookings endpoint)
      try {
        const bookingsRes = await api.get('/bookings');
        setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      } catch (err) {
        console.warn("Could not load bookings list (API might not exist yet)", err);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      // ⚠️ CHECK SWAGGER: Ensure these field names match your BookingSchema!
      await api.post('/bookings', {
        user_id:1,
        room_id: parseInt(selectedRoomId), 
        check_in: checkInDate,  // Format: "YYYY-MM-DD"
        check_out: checkOutDate // Format: "YYYY-MM-DD"
      });

      alert('Booking Successful!');
      fetchData(); // Reload list
      
    } catch (err) {
      console.error("Full Error:", err.response?.data);
      alert('Booking Failed: ' + JSON.stringify(err.response?.data?.detail));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Booking Management</h1>

        {/* --- CREATE BOOKING FORM --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">New Booking</h2>
          <form onSubmit={handleCreateBooking} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Room Dropdown */}
            <select 
              className="border p-2 rounded w-full"
              value={selectedRoomId}
              onChange={e => setSelectedRoomId(e.target.value)}
              required
            >
              <option value="">Select a Room</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  Room {room.room_number} (${room.price_per_night})
                </option>
              ))}
            </select>

            {/* Dates */}
            <input 
              type="date" 
              className="border p-2 rounded w-full"
              value={checkInDate}
              onChange={e => setCheckInDate(e.target.value)}
              required
            />
            <input 
              type="date" 
              className="border p-2 rounded w-full"
              value={checkOutDate}
              onChange={e => setCheckOutDate(e.target.value)}
              required
            />

            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Book Now
            </button>
          </form>
        </div>

        {/* --- BOOKINGS LIST --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Existing Bookings</h2>
          {loading ? <p>Loading...</p> : (
            <ul className="space-y-4">
              {bookings.length === 0 && <p className="text-gray-500">No bookings found.</p>}
              
              {bookings.map((booking) => (
                <li key={booking.id} className="border-b pb-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-blue-600">Room {booking.room_id}</span>
                    <span className="text-gray-600 mx-2">|</span>
                    <span>{booking.check_in_date} to {booking.check_out_date}</span>
                  </div>
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded">ID: {booking.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}