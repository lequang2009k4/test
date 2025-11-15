// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

/**
 * MSW Handlers Index
 * Combine all API handlers
 */

import { airQualityHandlers } from './airQualityHandlers';
import { devicesHandlers } from './devicesHandlers';
import { usersHandlers } from './usersHandlers';

// ============================================
// COMBINE ALL HANDLERS
// ============================================

export const handlers = [
  ...airQualityHandlers,
  ...devicesHandlers,
  ...usersHandlers,
];

export default handlers;
