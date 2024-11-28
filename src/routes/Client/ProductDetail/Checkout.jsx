import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Checkout = () => {
  const { user_id, transaction_uuid } = useParams();
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showProvider, setShowProvider] = useState(false);

  const handleChangeProvider = (e) => {
    e.preventDefault();
    setShowProvider(true);
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get(
          `${backendUrl}/transaction/${user_id}/${transaction_uuid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactionData(response.data);
      } catch (err) {
        setError("Failed to fetch transaction data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [user_id, transaction_uuid, backendUrl]);

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const handlePayment = async () => {
    // Menyiapkan data produk sebagai array
    const items = transactionData.map((transaction) => ({
      id: transaction.product_id,
      price: transaction.product_price,
      quantity: transaction.quantity,
      name: transaction.product_name,
    }));

    const data = {
      transaction_id: transactionData[0].transaction_uuid,
      name: transactionData[0].name,
      address: transactionData[0].address,
      items: items, // Mengirim data produk dalam array
      total: transactionData.reduce(
        (acc, transaction) => acc + transaction.total,
        0
      ),
    };

    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(`${backendUrl}/payment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Periksa apakah Snap dan token ada
      if (window.snap && response.data.token) {
        window.snap.pay(response.data.token, {
          onSuccess: function (result) {
            console.log("Payment success:", result);
            navigate("/thank-you");
          },
          onPending: function (result) {
            console.log("Payment pending:", result);
          },
          onError: function (result) {
            console.error("Payment error:", result);
          },
          onClose: function () {
            console.log("Payment closed");
          },
        });
      } else {
        console.error("Snap not available or token missing");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Menggabungkan produk dengan koma
  const productNames = transactionData
    .map((transaction) => transaction.product_name)
    .join(", ");
  const productSizes = transactionData
    .map((transaction) => transaction.product_size)
    .join(", ");
  const quantities = transactionData
    .map((transaction) => transaction.quantity)
    .join(", ");
  // ambil total dari salah satu data transaksi
  const total = transactionData.length > 0 ? transactionData[0].total : 0;

  return (
    <div className="flex justify-center items-center h-screen bg-white my-[5rem] md:my-0">
      {transactionData.length > 0 ? (
        <div className="bg-white p-8 shadow-md mx-3 md:max-w-[50rem] w-full space-y-10">
          <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">
            Transaction Detail
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Transaction Date</p>
              <p className="font-overpass md:text-end">
                {formatDate(transactionData[0].createdAt)}
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">ID Transaction</p>
              <p className="font-overpass md:text-end">{transaction_uuid}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Product Name</p>
              <p className="font-overpass md:text-end">{productNames}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Product Size</p>
              <p className="font-overpass md:text-end">{productSizes}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Quantity</p>
              <p className="font-overpass md:text-end">{quantities}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Total</p>
              <p className="font-overpass md:text-end">
                {formatCurrency(total)}
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Customer Name</p>
              <p className="font-overpass md:text-end">
                {transactionData[0].name}
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Customer Address</p>
              <p className="font-overpass max-w-md md:text-end">
                {transactionData[0].address}
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Expedition</p>
              <select
                className="font-overpass md:text-end"
                onClick={handleChangeProvider}
              >
                <option value="jne">JNE</option>
                <option value="tiki">Tiki</option>
                <option value="pos">Pos Indonesia</option>
              </select>
            </div>
            {showProvider && (
              <div className="flex flex-col md:flex-row justify-between">
                <p className="font-overpass font-semibold">Provider</p>
                <select className="font-overpass md:text-end">
                  <option value="cod">COD</option>
                  <option value="trucking">Trucking</option>
                  <option value="ekonomi">Ekonomis</option>
                  <option value="reguler">Reguler</option>
                </select>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between">
              <p className="font-overpass font-semibold">Status</p>
              <p className="font-overpass md:text-end">
                {transactionData[0].status}
              </p>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className="bg-[#333333] text-white py-2 px-4 mt-4 rounded font-overpass capitalize"
          >
            Pay for this item
          </button>
        </div>
      ) : (
        <p>No transaction details available.</p>
      )}
    </div>
  );
};

export default Checkout;
