"use client";

import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { onAuthStateChanged } from "firebase/auth";

export default function TransactionForm() {
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [uid, setUid] = useState<string | null>(null);

  // Ambil UID user saat login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description.trim() || !uid) return;

    try {
      await addDoc(
        collection(db, "users", auth.currentUser!.uid, "transactions"),
        {
          amount: typeof amount === "string" ? parseFloat(amount) : amount,
          description: description.trim(),
          category,
          createdAt: serverTimestamp(),
        }
      );

      // Reset form
      setAmount("");
      setDescription("");
      setCategory("Makanan");

      // Notifikasi sukses
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Transaksi berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menambahkan transaksi",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6 mb-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-700">Tambah Transaksi</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="amount">Jumlah</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Rp"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="category">Kategori</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Makanan">🍔 Makanan</SelectItem>
              <SelectItem value="Transportasi">🚌 Transportasi</SelectItem>
              <SelectItem value="Hiburan">🎮 Hiburan</SelectItem>
              <SelectItem value="Lainnya">📝 Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">Deskripsi</Label>
        <Input
          id="description"
          type="text"
          placeholder="Contoh: Beli nasi goreng"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        Tambahkan
      </Button>
    </form>
  );
}
