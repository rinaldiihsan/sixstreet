import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const secretKey = import.meta.env.VITE_KEY_LOCALSTORAGE;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);

  function getUserId(key) {
    const encryptedItem = sessionStorage.getItem(key);
    if (!encryptedItem) {
      return null;
    }
    const itemStr = decryptData(encryptedItem);
    const item = JSON.parse(itemStr);
    return item.user_id;
  }

  function decryptData(data) {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(
      new Date(date)
    );
  };

  const fetchOrderHistory = async () => {
    try {
      const token = Cookies.get("accessToken");
      const userId = getUserId("DetailUser");
      if (!userId || !token) return;

      const response = await axios.get(`${backendUrl}/transaction/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setTransactions(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error("Error fetching order history:", error);
      }
    }
  };

  const handlePayment = (transaction) => {
    const userId = getUserId("DetailUser");
    navigate(`/checkout/${userId}/${transaction.transaction_uuid}`);
  };

  const handleDetail = (transaction) => {
    const userId = getUserId("DetailUser");
    navigate(`/order-detail/${userId}/${transaction.transaction_uuid}`);
  };

  const handleCancel = async (transaction) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this transaction?"
    );

    if (!confirmed) return;

    try {
      const token = Cookies.get("accessToken");
      if (!token) return;

      const response = await axios.delete(
        `${backendUrl}/transaction/${transaction.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Transaction canceled successfully");
        await fetchOrderHistory();
      } else {
        console.error("Failed to cancel transaction. Status:", response.status);
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // Kelompokkan transaksi berdasarkan transaction_uuid
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.transaction_uuid]) {
      acc[transaction.transaction_uuid] = {
        ...transaction,
        product_name: [],
        product_size: [],
        quantity: [],
        total: transaction.total,
        city: transaction.city || "",
        sub_district: transaction.sub_district || "",
        detail_address: transaction.detail_address || "",
        expedition: transaction.expedition || "",
        expedition_services: transaction.expedition_services || "",
        etd: transaction.etd || "",
        resi: transaction.resi || "",
      };
    }
    acc[transaction.transaction_uuid].product_name.push(
      transaction.product_name
    );
    acc[transaction.transaction_uuid].product_size.push(
      transaction.product_size
    );
    acc[transaction.transaction_uuid].quantity.push(transaction.quantity);
    return acc;
  }, {});

  const groupedArray = Object.values(groupedTransactions);

  return (
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-4 md:px-6 lg:px-8 font-overpass min-h-screen">
      <h1 className="font-garamond text-[#333333] text-3xl font-semibold text-center mb-8">
        Order History
      </h1>

      <div className="w-full overflow-x-auto">
        <div className="inline-block min-w-full border border-gray-200  overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Header cells */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Transaksi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Produk
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ukuran
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Penerima
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kota
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kecamatan
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat Detail
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ekspedisi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Layanan
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estimasi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Resi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupedArray.length > 0 ? (
                groupedArray.map((transaction) => (
                  <tr
                    key={transaction.transaction_uuid}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.transaction_uuid}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.product_name.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.product_size.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.quantity.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.city || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.sub_district || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.detail_address || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.expedition || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.expedition_services || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.etd ? `${transaction.etd} hari` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.resi || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold  
                        ${
                          transaction.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : transaction.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.status.toLowerCase() === "pending" ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePayment(transaction)}
                            className="text-white bg-[#333333] hover:bg-[#444444] px-3 py-1.5  text-sm font-medium transition-colors duration-200"
                          >
                            Pay
                          </button>
                          <button
                            onClick={() => handleCancel(transaction)}
                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1.5  text-sm font-medium transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDetail(transaction)}
                          className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5  text-sm font-medium transition-colors duration-200"
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="16"
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No order history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
