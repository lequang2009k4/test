// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

/**
 * Devices API Mock Handlers
 * Mock tất cả endpoints từ openapi (1).yaml - Devices
 */

import { http, HttpResponse } from 'msw';
import { MOCK_DEVICES } from '../data/devicesData';

const BASE_URL = 'http://localhost:5183';

// In-memory database (mutable for testing CRUD)
let devicesDB = [...MOCK_DEVICES];

// ============================================
// DEVICES HANDLERS
// ============================================

export const devicesHandlers = [
  // GET /api/Devices - List all devices
  http.get(`${BASE_URL}/api/Devices`, () => {
    console.log('[MSW] GET /api/Devices');
    
    return HttpResponse.json(devicesDB, { status: 200 });
  }),

  // PUT /api/Devices/:id - Update device
  http.put(`${BASE_URL}/api/Devices/:id`, async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    
    console.log(`[MSW] PUT /api/Devices/${id}`);
    
    const index = devicesDB.findIndex(d => d.id === id);
    
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Device not found' },
        { status: 404 }
      );
    }
    
    // Update device
    devicesDB[index] = {
      ...devicesDB[index],
      ...updates,
      id: id, // Preserve ID
    };
    
    return HttpResponse.json(devicesDB[index], { status: 200 });
  }),

  // DELETE /api/Devices/:id - Delete device
  http.delete(`${BASE_URL}/api/Devices/:id`, ({ params }) => {
    const { id } = params;
    
    console.log(`[MSW] DELETE /api/Devices/${id}`);
    
    const index = devicesDB.findIndex(d => d.id === id);
    
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Device not found' },
        { status: 404 }
      );
    }
    
    // Remove device
    devicesDB.splice(index, 1);
    
    return HttpResponse.json(
      { message: 'Device deleted successfully' },
      { status: 200 }
    );
  }),
];

export default devicesHandlers;
