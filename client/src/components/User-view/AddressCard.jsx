import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  isSelected
}) => {
  return (
    <div
      className={`border rounded-xl p-4 cursor-pointer transition duration-200 relative
        ${isSelected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-300'}`}
      onClick={() => setCurrentSelectedAddress(addressInfo)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 text-blue-600">
          <CheckCircle2 size={20} />
        </div>
      )}

      <p><strong>Address:</strong>er {addressInfo.address}</p>
      <p><strong>City:</strong> {addressInfo.city}</p>
      <p><strong>Phone:</strong> {addressInfo.phone}</p>
      <p><strong>Pincode:</strong> {addressInfo.pincode}</p>
      <p><strong>Notes:</strong> {addressInfo.notes}</p>

      <div className="flex gap-3 mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          className="text-blue-500 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
