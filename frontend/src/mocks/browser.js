// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

/**
 * MSW Browser Setup
 * Setup Mock Service Worker for browser
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// ============================================
// SETUP WORKER
// ============================================

export const worker = setupWorker(...handlers);

// ============================================
// START FUNCTION
// ============================================

/**
 * Start MSW worker
 * @param {object} options - MSW options
 */
export const startMockServer = (options = {}) => {
  const defaultOptions = {
    onUnhandledRequest: 'warn', // Warn for unhandled requests
    ...options,
  };

  return worker.start(defaultOptions);
};

export default worker;
