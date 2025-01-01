import React from "react";

const AddressList = ({
  addresses,
  toggleEditAddressForm,
  toggleAddAddressForm,
  handleDeleteAddress,
  setDefaultAddress,
}) => {
  return (
    <div className="space-y-2 font-overpass">
      {addresses.length > 0 ? (
        addresses.map((address) => (
          <div key={address.id} className="w-full border-b pb-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-md text-[#333333] font-overpass font-bold">
                  {address.city_type} {address.city_name}
                </p>
                <p className="text-sm text-gray-600 font-overpass">
                  {address.subdistrict_name}, {address.province_name}
                </p>
                <p className="text-sm text-gray-600 font-overpass">
                  {address.detail_address}
                </p>
                <p className="text-sm text-gray-600 font-overpass">
                  Pos Code: {address.postal_code}
                </p>
                {address.is_primary && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                    Main Address
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <button
                  className="font-overpass text-right font-bold hover:text-gray-600 transition-colors text-sm"
                  onClick={() => toggleEditAddressForm(address.id)}
                >
                  Edit
                </button>
                <button
                  className="font-overpass font-bold text-right text-red-600 hover:text-red-700 transition-colors text-sm"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  Delete
                </button>
                {!address.is_primary && (
                  <button
                    className="font-overpass font-bold text-right text-blue-600 hover:text-blue-700 transition-colors text-sm"
                    onClick={() => setDefaultAddress(address.id)}
                  >
                    Make Primary Address
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="block text-md text-[#333333] font-overpass text-center">
          No addresses saved yet
        </p>
      )}

      <button
        className="bg-[#333] hover:bg-white font-garamond text-white hover:text-[#333] transition-colors w-full py-2 border border-[#333]"
        onClick={toggleAddAddressForm}
      >
        Add New Address
      </button>
    </div>
  );
};

export default AddressList;
