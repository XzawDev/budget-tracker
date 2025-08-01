"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function ResetBalanceButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      const transaksiRef = collection(db, "transactions");
      const q = query(
        transaksiRef,
        where("userId", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);

      const deleteOps = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deleteOps);

      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Reset gagal:", err);
      alert("Terjadi kesalahan saat mereset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        Reset Saldo
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Reset</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Semua transaksi akan dihapus permanen dan saldo kamu kembali ke 0.
            Lanjutkan?
          </p>

          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Ya, Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
