// Quick import test - verify all exports work
import { 
  airQualityAxios, 
  coreApiAxios,
  handleApiError,
  ERROR_TYPES 
} from './services';

console.log('Phase 2 imports verified:');
console.log('  - airQualityAxios:', typeof airQualityAxios);
console.log('  - coreApiAxios:', typeof coreApiAxios);
console.log('  - handleApiError:', typeof handleApiError);
console.log('  - ERROR_TYPES:', ERROR_TYPES);
console.log('\n Phase 2 Complete!\n');
