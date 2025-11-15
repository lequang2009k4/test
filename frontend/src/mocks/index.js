// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

/**
 * Mocks Index
 * Central export point for all mock utilities
 */

export * from './data/airQualityData';
export * from './data/devicesData';
export * from './data/usersData';

export { handlers } from './handlers';
export { worker, startMockServer } from './browser';

export { default as airQualityMockData } from './data/airQualityData';
export { default as devicesMockData } from './data/devicesData';
export { default as usersMockData } from './data/usersData';
