"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  createdAt?: any;
};

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("Semua");
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingReset, setLoadingReset] = useState(false);

  // Ambil UID user yang sedang login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Ambil transaksi berdasarkan UID dari koleksi users/{uid}/transactions
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "users", userId, "transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];

      setTransactions(data);
    });

    return () => unsubscribe();
  }, [userId]);

  const filteredTransactions =
    filter === "Semua"
      ? transactions
      : transactions.filter((tx) => tx.category === filter);

  const total = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  const handleDelete = async (id: string) => {
    if (!userId) return;

    const result = await Swal.fire({
      title: "Yakin hapus transaksi?",
      text: "Transaksi akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "users", userId, "transactions", id));

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Transaksi dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus transaksi.",
      });
    }
  };

  const handleResetAll = async () => {
    if (!userId) return;

    const result = await Swal.fire({
      title: "Setel Ulang Semua Transaksi?",
      text: "Semua data transaksi akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus semua",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      setLoadingReset(true);

      const txSnap = await getDocs(
        collection(db, "users", userId, "transactions")
      );
      const deletePromises = txSnap.docs.map((txDoc) =>
        deleteDoc(doc(db, "users", userId, "transactions", txDoc.id))
      );
      await Promise.all(deletePromises);

      Swal.fire({
        icon: "success",
        title: "Dihapus",
        text: "Semua transaksi telah dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Gagal menghapus semua transaksi:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus semua transaksi.",
      });
    } finally {
      setLoadingReset(false);
    }
  };

  const categoryIcon = (cat: string) => {
    switch (cat) {
      case "Makanan":
        return "🍔";
      case "Transportasi":
        return "🚌";
      case "Hiburan":
        return "🎮";
      case "Lainnya":
        return "📝";
      default:
        return "📦";
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Filter & Total */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-60 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Transportasi">Transportasi</option>
          <option value="Hiburan">Hiburan</option>
          <option value="Lainnya">Lainnya</option>
        </select>

        <h2 className="text-lg font-semibold text-gray-700">
          Total:{" "}
          <span className="text-blue-600 text-xl">
            Rp{total.toLocaleString("id-ID")}
          </span>
        </h2>
      </div>

      {/* Daftar Transaksi */}
      {filteredTransactions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">Belum ada transaksi</p>
      ) : (
        <div className="grid gap-4">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-xl">{categoryIcon(tx.category)}</span>
                    {tx.description}
                  </p>
                  <p className="text-sm text-gray-500">{tx.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-green-600">
                    Rp{tx.amount.toLocaleString("id-ID")}
                  </p>
                  {tx.createdAt?.toDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      {tx.createdAt.toDate().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      pukul{" "}
                      {tx.createdAt.toDate().toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => alert("Edit belum tersedia")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tx.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tombol Setel Ulang */}
      {transactions.length > 0 && (
        <div className="pt-2 flex justify-end">
          <Button
            variant="destructive"
            onClick={handleResetAll}
            disabled={loadingReset}
          >
            {loadingReset ? "Menghapus..." : "Setel Ulang Transaksi"}
          </Button>
        </div>
      )}
    </div>
  );
}
