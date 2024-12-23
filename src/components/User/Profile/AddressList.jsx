import React from 'react';

const AddressList = ({ addresses, toggleEditAddressForm, toggleAddAddressForm, handleDeleteAddress }) => {
  return (
    <div className="space-y-2">
      {addresses.length > 0 ? (
        addresses.map((address) => (
          <div key={address.id} className="w-full border-b pb-2">
            <div className="flex justify-between items-start">
              <li className="block text-md text-[#333333] font-overpass">{address.address}</li>
              <div className="flex gap-x-4">
                <button className="font-overpass font-bold hover:text-gray-600 transition-colors" onClick={() => toggleEditAddressForm(address.id)}>
                  Edit
                </button>
                <button className="font-overpass font-bold text-red-600 hover:text-red-700 transition-colors" onClick={() => handleDeleteAddress(address.id)}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <li className="block text-md text-[#333333] font-overpass">No addresses found.</li>
      )}

      <button className="bg-[#333] hover:bg-white font-garamond text-white hover:text-[#333] transition-colors w-full py-2 border border-[#333]" onClick={toggleAddAddressForm}>
        Add Address
      </button>
    </div>
  );
};

export default AddressList;
