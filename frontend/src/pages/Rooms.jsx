import { useEffect, useState } from "react";
import api from "../services/api";


export default function Rooms(){
    const [rooms, setRooms] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // form state for adđing a room
    const [newRoomNumber, setNewRoomNumber] = useState('');
    const [newRoomPrice, setNewRoomPrice]  = useState('');

    //fetch Rooms on load
    useEffect(() => {
        fetchRooms();
    },[]);

    const fetchRooms = async () => {
        try{
           const response = await api.get('/rooms'); // connects to get /rooms
            // Ensure we are setting an array (sometimes APIs return {data}: [])
           setRooms(Array.isArray(response.data) ? response.data:[]);
           setLoading(false);
        } catch(err){
            console.error(err);
            setError('Failed to load rooms.');
            setLoading(false);
        }
    }
    // function to add a room
    const handleAddRoom = async (e) =>{
        e.preventDefault();
        try{
            await api.post('/rooms', {
                room_number: newRoomNumber,
                category: "Standard",
                price_per_night: parseFloat(newRoomPrice),
                description: "standard Room",
                is_active: true
            });
            // clear form add reload list
            setNewRoomNumber('');
            setNewRoomPrice('');
            fetchRooms();
        }
        catch(err){
            console.log("Full Error Details: ", err.response?.data);
            alert('Error creating room: '+ (err.response?.data?.detail || err.message));
        }
    };
    return(
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Room management
                </h1>
                <div className=" bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4 "> Add New Room </h2>
                    <form onSubmit={handleAddRoom} className=" flex gap-4">
                        <input type="text" 
                            placeholder="Room number (e. g. 101)"
                            className="border p-2 rounded w-full"
                            value={newRoomNumber}
                            onChange={e => setNewRoomNumber(e.target.value)}
                            required
                        />
                        <input type="text"
                            placeholder="Price ($)"
                            className="border p-2 rounded w-full"
                            value={newRoomPrice}
                            onChange={e => setNewRoomPrice(e.target.value)}
                            required
                            />
                        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            Add
                        </button>
                    </form>
                </div>
                {/* from list */}
                {Loading ? (
                    <p>Loading rooms ...</p>
                ):error ?(
                    <p className="text-red-500">{error}</p>
                ): (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {rooms.length === 0 && <p className="text-gray-500">no rooms found.</p>}
                      {
                        rooms.map((room) =>(
                            <div key={room.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                                <div className="text-2xl font-bold text-blue-600 mb-2">
                                    Room {room.number}
                                </div>
                                <div className="text-gray-600 mb-4">
                                    Price: <span className="font-semibold text-green-600">${room.price}</span>
                                </div>
                                <div className={`text-sm px-2 py-1 rounded inline-block ${room.is_active ? 'bg-green-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                                    {room.is_active ? 'available':'Occupied'}
                                </div>

                            </div>
                        ))
                      }
                    </div>
                )
                }
            </div>
        </div>
    );
   
}
