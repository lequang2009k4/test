// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

/**
 * API Test Component
 * Component để test axios instance trong React
 * 
 * USAGE:
 * 1. Import vào App.js để test
 * 2. Click button để test API calls
 * 3. Xem kết quả trong console và UI
 */

import React, { useState } from 'react';
import { airQualityAxios, coreApiAxios } from '../services';

const ApiTestComponent = () => {
  const [airQualityData, setAirQualityData] = useState(null);
  const [devicesData, setDevicesData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Test Air Quality API
  const testAirQualityAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Testing Air Quality API...');
      const data = await airQualityAxios.get('/api/airquality/latest');
      console.log('✅ Success:', data);
      setAirQualityData(data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test Core API (Devices)
  const testDevicesAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Testing Core API...');
      const data = await coreApiAxios.get('/api/Devices');
      console.log('✅ Success:', data);
      setDevicesData(data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>API Test Component (Phase 2)</h2>
      <p>Test axios instances với backend APIs</p>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={testAirQualityAPI}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Test Air Quality API
        </button>

        <button 
          onClick={testDevicesAPI}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Test Devices API
        </button>
      </div>

      {loading && <p>⏳ Loading...</p>}

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px',
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {airQualityData && (
        <div style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '4px',
          marginBottom: '20px',
        }}>
          <h3>✅ Air Quality Data:</h3>
          <pre style={{ overflow: 'auto', maxHeight: '300px' }}>
            {JSON.stringify(airQualityData, null, 2)}
          </pre>
        </div>
      )}

      {devicesData && (
        <div style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
        }}>
          <h3>✅ Devices Data:</h3>
          <pre style={{ overflow: 'auto', maxHeight: '300px' }}>
            {JSON.stringify(devicesData, null, 2)}
          </pre>
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fff3e0',
        borderRadius: '4px',
      }}>
        <h4>📝 Instructions:</h4>
        <ol>
          <li>Đảm bảo backend đang chạy (ports 5182, 5183)</li>
          <li>Click các button để test API</li>
          <li>Xem kết quả trong UI và browser console</li>
          <li>Nếu lỗi Network Error: Backend chưa chạy</li>
        </ol>
      </div>
    </div>
  );
};

export default ApiTestComponent;
