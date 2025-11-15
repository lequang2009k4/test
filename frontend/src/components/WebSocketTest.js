// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

/**
 * WebSocket Test Component
 * Test Air Quality WebSocket với realtime updates
 */

import React, { useState, useEffect } from 'react';
import airQualityWebSocket from '../services/websocket/airQualityWebSocket';
import { getAQILevel } from '../services/api/airQualityService';

const WebSocketTest = () => {
  const [status, setStatus] = useState(null);
  const [latestData, setLatestData] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket
    const init = async () => {
      const connected = await airQualityWebSocket.initialize();
      setIsConnected(connected);
      updateStatus();
    };

    init();

    // Subscribe to events
    const unsubscribeNewData = airQualityWebSocket.subscribe('newData', handleNewData);
    const unsubscribeUpdate = airQualityWebSocket.subscribe('update', handleUpdate);
    const unsubscribeAlert = airQualityWebSocket.subscribe('alert', handleAlert);
    const unsubscribeConnected = airQualityWebSocket.subscribe('connected', handleConnected);
    const unsubscribeDisconnected = airQualityWebSocket.subscribe('disconnected', handleDisconnected);

    // Cleanup
    return () => {
      unsubscribeNewData();
      unsubscribeUpdate();
      unsubscribeAlert();
      unsubscribeConnected();
      unsubscribeDisconnected();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewData = (data) => {
    console.log('📡 New Air Quality data received:', data);
    setLatestData(data);
    
    setUpdates(prev => [{
      id: Date.now(),
      type: 'newData',
      data,
      timestamp: new Date().toLocaleTimeString(),
    }, ...prev].slice(0, 10)); // Keep last 10 updates
  };

  const handleUpdate = (data) => {
    console.log('🔄 Air Quality update received:', data);
    setLatestData(data);
    
    setUpdates(prev => [{
      id: Date.now(),
      type: 'update',
      data,
      timestamp: new Date().toLocaleTimeString(),
    }, ...prev].slice(0, 10));
  };

  const handleAlert = (alert) => {
    console.log('🚨 Alert received:', alert);
    
    setAlerts(prev => [{
      ...alert,
      id: Date.now(),
      receivedAt: new Date().toLocaleTimeString(),
    }, ...prev].slice(0, 5)); // Keep last 5 alerts
  };

  const handleConnected = (info) => {
    console.log('✅ WebSocket connected:', info);
    setIsConnected(true);
    updateStatus();
  };

  const handleDisconnected = (info) => {
    console.log('❌ WebSocket disconnected:', info);
    setIsConnected(false);
    updateStatus();
  };

  const updateStatus = () => {
    const wsStatus = airQualityWebSocket.getStatus();
    setStatus(wsStatus);
  };

  const requestLatest = async () => {
    const data = await airQualityWebSocket.requestLatestData();
    console.log('🔍 Latest data requested:', data);
    setLatestData(data);
  };

  const disconnect = async () => {
    await airQualityWebSocket.disconnect();
    setIsConnected(false);
    updateStatus();
  };

  const reconnect = async () => {
    const connected = await airQualityWebSocket.initialize();
    setIsConnected(connected);
    updateStatus();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🌐 WebSocket Test (Phase 5)</h2>
      <p>Test Air Quality WebSocket với realtime updates</p>

      {/* Connection Status */}
      <div style={{
        padding: '15px',
        backgroundColor: isConnected ? '#c8e6c9' : '#ffebee',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <h3>{isConnected ? '✅ WebSocket Connected' : '❌ WebSocket Disconnected'}</h3>
        
        {status && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
            <div><strong>Enabled:</strong> {status.isEnabled ? 'Yes' : 'No'}</div>
            <div><strong>Connected:</strong> {status.isConnected ? 'Yes' : 'No'}</div>
            <div><strong>Polling:</strong> {status.isPolling ? 'Yes (Fallback)' : 'No'}</div>
            {status.connectionState && (
              <div><strong>State:</strong> {status.connectionState.connectionState}</div>
            )}
          </div>
        )}

        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={requestLatest}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🔍 Request Latest
          </button>

          {isConnected ? (
            <button 
              onClick={disconnect}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              🔌 Disconnect
            </button>
          ) : (
            <button 
              onClick={reconnect}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              🔄 Reconnect
            </button>
          )}

          <button 
            onClick={updateStatus}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ♻️ Refresh Status
          </button>
        </div>
      </div>

      {/* Latest Data */}
      {latestData && (
        <div style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h3>📊 Latest Air Quality Data</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '15px',
          }}>
            <div><strong>Date:</strong> {new Date(latestData.dateObserved).toLocaleString()}</div>
            <div><strong>Location:</strong> {latestData.location.address || `${latestData.location.lat.toFixed(4)}, ${latestData.location.lng.toFixed(4)}`}</div>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: getAQILevel(latestData.aqi).color,
            color: 'white',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px',
          }}>
            AQI: {latestData.aqi} - {getAQILevel(latestData.aqi).label}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
              <strong>PM2.5:</strong> {latestData.pm25?.toFixed(2)} µg/m³
            </div>
            <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
              <strong>PM10:</strong> {latestData.pm10?.toFixed(2)} µg/m³
            </div>
            <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
              <strong>O3:</strong> {latestData.o3?.toFixed(2)} µg/m³
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h3>🚨 Alerts ({alerts.length})</h3>
          
          {alerts.map(alert => (
            <div key={alert.id} style={{
              padding: '10px',
              backgroundColor: alert.type === 'danger' ? '#ffebee' : '#fff9c4',
              borderLeft: `4px solid ${alert.type === 'danger' ? '#f44336' : '#FF9800'}`,
              borderRadius: '4px',
              marginBottom: '10px',
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {alert.level === 'unhealthy' ? '⚠️' : '⚡'} {alert.message}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {alert.location} - AQI: {alert.aqi} - {alert.receivedAt}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update History */}
      <div style={{
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
      }}>
        <h3>📡 Update History ({updates.length})</h3>
        
        {updates.length === 0 ? (
          <p style={{ color: '#999' }}>No updates yet. Waiting for realtime data...</p>
        ) : (
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {updates.map(update => (
              <div key={update.id} style={{
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '4px',
                marginBottom: '10px',
                borderLeft: `4px solid ${update.type === 'newData' ? '#4CAF50' : '#2196F3'}`,
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {update.type === 'newData' ? '📥 New Data' : '🔄 Update'} - {update.timestamp}
                </div>
                <div style={{ fontSize: '14px' }}>
                  AQI: {update.data.aqi} | PM2.5: {update.data.pm25?.toFixed(2)} | PM10: {update.data.pm10?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '4px',
      }}>
        <h4>ℹ️ WebSocket Features:</h4>
        <ul>
          <li>✅ Realtime Air Quality updates (mỗi 10 giây)</li>
          <li>✅ Auto reconnect khi mất kết nối</li>
          <li>✅ Fallback to HTTP polling nếu WebSocket fail</li>
          <li>✅ Mock WebSocket server cho development</li>
          <li>✅ Event-based architecture</li>
          <li>✅ Alerts & notifications</li>
        </ul>
      </div>
    </div>
  );
};

export default WebSocketTest;
