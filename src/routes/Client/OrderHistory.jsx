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
    <div className="mt-24 max-w-[115rem] py-5 mx-auto px-5 lg:px-2 flex flex-col items-center min-h-screen">
      <h1 className="font-overpass text-[#333333] font-semibold text-2xl my-4">
        Order History
      </h1>
      <div className="mt-10 w-full overflow-x-auto font-overpass">
        <table className="w-full table-auto border-collapse bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-gray-100">Date</th>
              <th className="py-3 px-4 bg-gray-100">Transaction ID</th>
              <th className="py-3 px-4 bg-gray-100">Product Name</th>
              <th className="py-3 px-4 bg-gray-100">Size</th>
              <th className="py-3 px-4 bg-gray-100">Quantity</th>
              <th className="py-3 px-4 bg-gray-100">Total</th>
              <th className="py-3 px-4 bg-gray-100">Customer Name</th>
              <th className="py-3 px-4 bg-gray-100">Address</th>
              <th className="py-3 px-4 bg-gray-100">Status</th>
              <th className="py-3 px-4 bg-gray-100">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {groupedArray.length > 0 ? (
              groupedArray.map((transaction) => (
                <tr key={transaction.transaction_uuid}>
                  <td className="py-3 px-4">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="py-3 px-4">{transaction.transaction_uuid}</td>
                  <td className="py-3 px-4">
                    {transaction.product_name.join(", ")}
                  </td>
                  <td className="py-3 px-4">
                    {transaction.product_size.join(", ")}
                  </td>
                  <td className="py-3 px-4">
                    {transaction.quantity.join(", ")}
                  </td>
                  <td className="py-3 px-4">
                    {formatCurrency(transaction.total)}
                  </td>
                  <td className="py-3 px-4">{transaction.name}</td>
                  <td className="py-3 px-4">{transaction.address}</td>
                  <td className="py-3 px-4">{transaction.status}</td>
                  <td className="py-3 px-4">
                    {transaction.status.toLowerCase() === "pending" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePayment(transaction)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Pay
                        </button>
                        <button
                          onClick={() => handleCancel(transaction)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDetail(transaction)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Detail
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-4 text-center">
                  No order history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
