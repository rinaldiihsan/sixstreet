import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'react-toastify';
import { expeditionOptions } from '../constans/expeditions';

const useCheckoutStore = create(
  persist(
    (set, get) => ({
      // State awal
      selectedAddress: null,
      shippingCosts: [],
      selectedCourier: null,
      selectedShipping: null,
      loading: false,
      error: null,

      // Mengatur alamat yang dipilih
      setSelectedAddress: (address) => {
        set({ selectedAddress: address });
        toast.success('Alamat berhasil dipilih');
      },

      // Menghitung biaya pengiriman
      calculateShipping: async (subdistrictId) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        // Reset state sebelum memulai
        set({
          loading: true,
          error: null,
          shippingCosts: [],
        });

        try {
          // Daftar kurir yang akan dicek
          const couriers = Object.keys(expeditionOptions);

          // Membuat promise untuk setiap kurir
          const shippingPromises = couriers.map((courier) =>
            axios.post(`${backendUrl}/rajacost`, {
              origin: '3917', // Pastikan ini adalah kode subdistrict asal yang benar
              originType: 'subdistrict',
              destination: subdistrictId,
              destinationType: 'subdistrict',
              weight: 1000, // Berat dalam gram
              courier: courier,
            })
          );

          // Menjalankan semua permintaan secara bersamaan
          const responses = await Promise.all(shippingPromises);

          // Mengekstrak data biaya kirim dari respons
          const allShippingCosts = responses.map((response) => response.data.rajaongkir.results[0]).filter((result) => result && result.costs.length > 0); // Menyaring hasil yang valid

          // Memperbarui state dengan biaya kirim
          set({
            shippingCosts: allShippingCosts,
            loading: false,
          });

          // Memberi notifikasi jika tidak ada pilihan pengiriman
          if (allShippingCosts.length === 0) {
            toast.warning('Tidak ada pilihan pengiriman tersedia');
          }
        } catch (error) {
          // Menangani kesalahan
          console.error('Error calculating shipping:', error);
          set({
            error: 'Gagal menghitung ongkos kirim',
            loading: false,
            shippingCosts: [],
          });
          toast.error('Gagal menghitung ongkos kirim');
        }
      },

      // Mengatur pengiriman yang dipilih
      setSelectedShipping: (shipping) => set({ selectedShipping: shipping }),

      // Mengatur ulang seluruh state checkout
      clearCheckout: () =>
        set({
          selectedAddress: null,
          shippingCosts: [],
          selectedCourier: null,
          selectedShipping: null,
          loading: false,
          error: null,
        }),
    }),
    {
      name: 'checkout-storage',
    }
  )
);

export default useCheckoutStore;
