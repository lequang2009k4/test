# API Integration Summary

## API Endpoints Configuration

### Air Quality API (Port 51761)
- **Base URL**: `http://3.27.249.236:51761`
- **SignalR Hub**: `/airqualityhub`
- **Purpose**: Real-time air quality data and updates

**Available Endpoints:**
```javascript
GET  /api/airquality          // Get all air quality data
GET  /api/airquality/latest   // Get latest reading
GET  /api/airquality/history  // Get historical data
POST /api/iot-data            // Submit IoT sensor data (admin only)
```

**SignalR Events:**
- `ReceiveAirQualityUpdate` - Real-time air quality updates
- `ReceiveLatestData` - Latest data response
- `ReceiveAlert` - Air quality alerts

---

### Core API (Port 5252)
- **Base URL**: `http://3.27.249.236:5252`
- **Purpose**: Devices, Users, Authentication

**Available Endpoints:**

#### Devices
```javascript
GET    /api/devices          // Get all devices
PUT    /api/devices/{id}     // Update device
DELETE /api/devices/{id}     // Delete device
```

#### Users & Auth
```javascript
GET    /api/users                  // Get all users
POST   /api/users/signup           // Register new user
POST   /api/users/login            // Login
POST   /api/users/verify-email     // Verify email
DELETE /api/users/{id}             // Delete user
```

---

## Configuration Files Updated

### 1. Environment Variables (`.env.development`)
```env
# Air Quality API + SignalR
REACT_APP_AIR_API_URL=http://3.27.249.236:51761
REACT_APP_AIR_WS_URL=http://3.27.249.236:51761

# Core API (Devices, Users, Auth)
REACT_APP_CORE_API_URL=http://3.27.249.236:5252

# Features
REACT_APP_ENABLE_WEBSOCKET=true
REACT_APP_USE_MOCK=false
```

### 2. Axios Instances (`src/services/api/axiosInstance.js`)
```javascript
// Air Quality API (51761)
export const airQualityAxios = axios.create({
  baseURL: 'http://3.27.249.236:51761',
  timeout: 10000
});

// Core API (5252) - Devices, Users, Auth
export const coreApiAxios = axios.create({
  baseURL: 'http://3.27.249.236:5252',
  timeout: 10000
});
```

### 3. Services Available

#### Air Quality Service
```javascript
import { airQualityService } from './services';

// Get latest air quality data
const data = await airQualityService.getLatest();

// Get historical data
const history = await airQualityService.getHistory({
  from: '2025-11-01T00:00:00Z',
  to: '2025-11-13T23:59:59Z'
});
```

#### Devices Service
```javascript
import { devicesService } from './services';

// Get all devices
const devices = await devicesService.getAll();

// Update device
await devicesService.update(deviceId, {
  name: 'Updated Name',
  status: 'active',
  location: { lat: 21.0285, lng: 105.8542 }
});

// Delete device
await devicesService.remove(deviceId);
```

#### Users Service
```javascript
import { usersService } from './services';

// Login
const result = await usersService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Signup
await usersService.signup({
  username: 'newuser',
  email: 'new@example.com',
  password: 'password123',
  fullName: 'New User'
});

// Get all users
const users = await usersService.getAll();
```

#### SignalR WebSocket
```javascript
import { airQualityWebSocket } from './services';

// Connect to SignalR
await airQualityWebSocket.connect();

// Listen for real-time updates
airQualityWebSocket.on('newData', (data) => {
  console.log('New air quality data:', data);
});

// Check connection status
const isConnected = airQualityWebSocket.isConnected();
```

---

## Testing

### 1. Test Air Quality API
```bash
# Test REST endpoint
curl http://3.27.249.236:51761/api/airquality/latest

# Test SignalR hub (should return 200 or connection negotiation)
curl http://3.27.249.236:51761/airqualityhub
```

### 2. Test Core API
```bash
# Test devices endpoint
curl http://3.27.249.236:5252/api/devices

# Test users endpoint (may require auth)
curl http://3.27.249.236:5252/api/users
```

### 3. Test in Browser Console

After starting the app (`npm start`), open browser console:

```javascript
// Check environment variables
console.log('Air API:', process.env.REACT_APP_AIR_API_URL);
console.log('Core API:', process.env.REACT_APP_CORE_API_URL);
console.log('WebSocket:', process.env.REACT_APP_AIR_WS_URL);

// Import services (if needed)
// You can access services through components using the services
```

---

## How to Use in Components

### Example: Fetch Devices

```javascript
import { useEffect, useState } from 'react';
import { devicesService } from '../services';

function DevicesList() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const data = await devicesService.getAll();
        setDevices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {devices.map(device => (
        <div key={device.id}>
          {device.name} - {device.status}
        </div>
      ))}
    </div>
  );
}
```

### Example: Real-time Air Quality

```javascript
import { useAirQuality } from '../hooks';

function AirQualityDashboard() {
  const { 
    data, 
    loading, 
    error, 
    isConnected 
  } = useAirQuality({
    enableWebSocket: true,
    autoRefresh: true
  });

  return (
    <div>
      <div>WebSocket: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {data && (
        <div>
          <p>PM2.5: {data.pm25} µg/m³</p>
          <p>Temperature: {data.temperature}°C</p>
          <p>Humidity: {data.humidity}%</p>
        </div>
      )}
    </div>
  );
}
```

---

## Next Steps

1. ✅ APIs configured
2. ✅ Services ready to use
3. ⏳ Restart frontend: `npm start`
4. ⏳ Check console for connection status
5. ⏳ Test API calls in components
6. ⏳ Implement authentication flow (if needed)

---

## Troubleshooting

### CORS Errors
If you see CORS errors, backend needs to allow `http://localhost:3000`:

```csharp
// Backend: Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

### 404 Errors
- Verify backend is running at the correct ports
- Check endpoint paths match backend routes
- Check browser Network tab for actual request URLs

### SignalR Connection Fails
- Check if backend has SignalR hub at `/airqualityhub`
- Verify CORS allows credentials
- Check console logs for detailed error messages
