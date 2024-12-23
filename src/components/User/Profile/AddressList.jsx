
import React from 'react';

const AddressList = ({ addresses, toggleEditAddressForm, toggleAddAddressForm }) => {
  return (
    <div className="space-y-2">
      {addresses.length > 0 ? (
        addresses.map((address) => (
          <div key={address.id} className="flex w-full justify-between border-b pb-2">
            <li className="block text-md text-[#333333] font-overpass">{address.address}</li>
            <button className="font-overpass font-bold" onClick={() => toggleEditAddressForm(address.id)}>
              Edit Data
            </button>
          </div>
        ))
      ) : (
        <li className="block text-md text-[#333333] font-overpass">No addresses found.</li>
      )}

      {addresses.length === 0 && (
        <button className="bg-[#333] hover:bg-white font-garamond text-white hover:text-[#333] transition-colors w-full py-2 border border-[#333]" onClick={toggleAddAddressForm}>
          Add Address
        </button>
      )}
    </div>
  );
};

export default AddressList;
