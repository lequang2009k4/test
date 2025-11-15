import React from 'react';
import DeviceCard from './DeviceCard';
import './DeviceList.css';

/**
 * Device List Component
 * Displays all devices in a grid layout
 */
const DeviceList = ({ devices, onToggleStatus, onViewDetails, onDelete }) => {
  if (!devices || devices.length === 0) {
    return (
      <div className="device-list-empty">
        <div className="empty-icon">📭</div>
        <h3>Không có thiết bị nào</h3>
        <p>Nhấn "Thêm thiết bị mới" để bắt đầu thêm cảm biến IoT</p>
      </div>
    );
  }

  return (
    <div className="device-list">
      <div className="device-grid">
        {devices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onToggleStatus={onToggleStatus}
            onViewDetails={onViewDetails}
            onDelete={() => onDelete(device.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default DeviceList;
