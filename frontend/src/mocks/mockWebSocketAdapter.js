// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

/**
 * Mock WebSocket Adapter
 * Adapter pattern để mock SignalR WebSocket cho development
 * Thay thế real WebSocket connection bằng mock events
 */

import mockWebSocketServer from './mockWebSocketServer';

class MockWebSocketAdapter {
  constructor() {
    this.eventHandlers = new Map();
    this.isConnected = false;
    this.connectionId = `mock-${Date.now()}`;
    this.onNewData = null;
    this.onAlert = null;
    this.onDeviceStatusChanged = null;
  }

  /**
   * Mock start connection
   */
  async start() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        console.log('[MockWS Adapter] Connected with ID:', this.connectionId);
        
        // Register with mock server
        mockWebSocketServer.registerClient(this);
        
        // Simulate initial data
        if (this.onNewData) {
          setTimeout(() => {
            console.log('[MockWS Adapter] Sending initial data...');
            mockWebSocketServer.broadcastNewData();
          }, 1000);
        }
        
        resolve();
      }, 500); // Simulate connection delay
    });
  }

  /**
   * Mock stop connection
   */
  async stop() {
    return new Promise((resolve) => {
      this.isConnected = false;
      mockWebSocketServer.unregisterClient(this);
      console.log('[MockWS Adapter] Disconnected');
      resolve();
    });
  }

  /**
   * Mock event subscription
   */
  on(eventName, handler) {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    
    this.eventHandlers.get(eventName).push(handler);

    // Map to mock server callbacks
    if (eventName === 'NewAirQualityData') {
      this.onNewData = handler;
    } else if (eventName === 'AirQualityUpdate') {
      this.onNewData = handler; // Same as NewAirQualityData for mock
    } else if (eventName === 'AirQualityAlert') {
      this.onAlert = handler;
    } else if (eventName === 'DeviceStatusChanged') {
      this.onDeviceStatusChanged = handler;
    }

    console.log(`[MockWS Adapter] Subscribed to event: ${eventName}`);
  }

  /**
   * Mock event unsubscription
   */
  off(eventName, handler = null) {
    if (handler) {
      const handlers = this.eventHandlers.get(eventName) || [];
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    } else {
      this.eventHandlers.delete(eventName);
    }

    console.log(`[MockWS Adapter] Unsubscribed from event: ${eventName}`);
  }

  /**
   * Mock invoke server method
   */
  async invoke(methodName, ...args) {
    console.log(`[MockWS Adapter] Invoking method: ${methodName}`, args);

    return new Promise((resolve) => {
      setTimeout(() => {
        switch (methodName) {
          case 'GetLatestAirQuality':
            // Return mock data
            mockWebSocketServer.broadcastNewData();
            resolve({ success: true });
            break;

          case 'JoinLocationGroup':
            console.log(`[MockWS Adapter] Joined location group: ${args[0]}`);
            resolve({ success: true });
            break;

          case 'LeaveLocationGroup':
            console.log(`[MockWS Adapter] Left location group: ${args[0]}`);
            resolve({ success: true });
            break;

          default:
            resolve({ success: true, message: 'Mock response' });
        }
      }, 200); // Simulate network delay
    });
  }

  /**
   * Mock send message (fire and forget)
   */
  async send(methodName, ...args) {
    console.log(`[MockWS Adapter] Sending message: ${methodName}`, args);
    return Promise.resolve();
  }

  /**
   * Get connection state
   */
  get state() {
    return this.isConnected ? 'Connected' : 'Disconnected';
  }
}

export default MockWebSocketAdapter;
