"use client";

import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  collection,
  query,
  onSnapshot as onSnapshotTx,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

export default function BalanceCard() {
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const [newIncome, setNewIncome] = useState<string>("");
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [showInput, setShowInput] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  // Ambil UID user saat ini
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Ambil data saldo awal dan total pengeluaran milik user
  useEffect(() => {
    if (!uid) return;

    const unsubSetting = onSnapshot(
      doc(db, "users", uid, "settings", "budget"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInitialAmount(data.initialAmount || 0);
        }
      }
    );

    const txQuery = query(collection(db, "users", uid, "transactions"));
    const unsubTx = onSnapshotTx(txQuery, (snap) => {
      const total = snap.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.amount || 0);
      }, 0);
      setTotalExpense(total);
    });

    return () => {
      unsubSetting();
      unsubTx();
    };
  }, [uid]);

  // Fungsi untuk menambahkan dana
  const handleAddFund = async () => {
    if (!uid) return;
    const parsed = parseFloat(newIncome);
    if (isNaN(parsed)) return;

    try {
      await setDoc(
        doc(db, "users", uid, "settings", "budget"),
        {
          initialAmount: initialAmount + parsed,
        },
        { merge: true }
      );
      Swal.fire("Berhasil!", "Dana berhasil ditambahkan", "success");
      setNewIncome("");
      setShowInput(false);
    } catch (err) {
      console.error("Gagal menambahkan dana", err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan dana", "error");
    }
  };

  // Fungsi untuk reset saldo ke 0
  const handleResetSaldo = async () => {
    if (!uid) return;

    const confirm = await Swal.fire({
      title: "Setel Ulang Saldo?",
      text: "Saldo akan disetel ulang menjadi 0.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, setel ulang",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await setDoc(
          doc(db, "users", uid, "settings", "budget"),
          {
            initialAmount: 0,
          },
          { merge: true }
        );
        Swal.fire("Berhasil", "Saldo berhasil disetel ulang", "success");
      } catch (err) {
        console.error("Gagal reset saldo", err);
        Swal.fire("Gagal", "Tidak bisa reset saldo", "error");
      }
    }
  };

  const balance = initialAmount - totalExpense;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-base font-medium text-gray-700">Sisa Dana</h2>

      <p
        className={`text-3xl font-bold ${
          balance < 0 ? "text-red-600" : "text-green-600"
        }`}
      >
        Rp{balance.toLocaleString("id-ID")}
      </p>

      {showInput ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Input
            type="number"
            placeholder="Masukkan jumlah dana"
            value={newIncome}
            onChange={(e) => setNewIncome(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleAddFund} className="w-full sm:w-auto">
            Simpan
          </Button>
          <Button
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={() => setShowInput(false)}
          >
            Batal
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button
            onClick={() => setShowInput(true)}
            className="w-full sm:w-auto"
          >
            Tambah Dana
          </Button>
          <Button
            variant="destructive"
            onClick={handleResetSaldo}
            className="w-full sm:w-auto"
          >
            Reset Saldo
          </Button>
        </div>
      )}
    </div>
  );
}
