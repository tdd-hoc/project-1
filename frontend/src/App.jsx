import { useEffect, useState } from 'react'
import api from  './api'
function App() {
  const [error, setError] = useState('')
  const [message, setMessage]= useState('londing')
  useEffect(() => {
    api.get('/')
      .then(res => setMessage(res.data.message))
      .catch(err =>{
        console.error(err)
        setError('Cannot connect to backend. is it running ?')
      })
  }, [])
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Hotel Management System</h1>
        
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-green-600 text-xl">Backend says: "{message}"</p>
        )}

        <div className="mt-4 text-sm text-gray-500">
          Connected to: {import.meta.env.VITE_API_URL}
        </div>
      </div>
    </div>
  )
}

export default App
