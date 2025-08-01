"use client";

import React, { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { format, subDays, isSameDay } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import { getWeek, startOfMonth } from "date-fns";

interface ChartData {
  date: string;
  total: number;
}

const ChartDashboard = () => {
  const [dailyData, setDailyData] = useState<ChartData[]>([]);
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);

    const startDate = subDays(selectedDate, 27); // 4 minggu = 28 hari
    const endDate = selectedDate;

    const q = query(
      collection(db, "users", user.uid, "transactions"),
      where("createdAt", ">=", Timestamp.fromDate(startDate)),
      where("createdAt", "<=", Timestamp.fromDate(endDate))
    );

    try {
      const snapshot = await getDocs(q);
      const rawDaily: Record<string, number> = {};
      const rawWeekly: number[] = [0, 0, 0, 0];

      snapshot.forEach((doc) => {
        const { amount, createdAt } = doc.data();
        if (!createdAt || typeof amount !== "number") return;

        const dateObj = (createdAt as Timestamp).toDate();
        const date = format(dateObj, "yyyy-MM-dd");

        // Hitung pengeluaran harian
        rawDaily[date] = (rawDaily[date] || 0) + amount;

        // Hitung pengeluaran mingguan
        const daysAgo = Math.floor(
          (selectedDate.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
        );
        const weekIndex = Math.floor((27 - daysAgo) / 7); // 0 = minggu terbaru, 3 = minggu terlama
        if (weekIndex >= 0 && weekIndex < 4) {
          rawWeekly[weekIndex] += amount;
        }
      });

      // Format data harian (7 hari terakhir)
      const formattedDaily = Array.from({ length: 7 }).map((_, i) => {
        const date = format(subDays(selectedDate, 6 - i), "yyyy-MM-dd");
        return {
          date,
          total: rawDaily[date] || 0,
        };
      });

      // Format data mingguan: balik urutan agar Week 1 = minggu terlama
      const formattedWeekly = rawWeekly
        .slice()
        .reverse()
        .map((total, i) => ({
          date: `Week ${i + 1}`,
          total,
        }));

      setDailyData(formattedDaily);
      setWeeklyData(formattedWeekly);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [selectedDate, user]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
        Spending Overview
      </h2>

      {/* Calendar Section */}
      <Card className="shadow-xl rounded-2xl border border-gray-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Select Date Range
            </h3>
            <p className="text-sm text-gray-500">
              Selected: {format(selectedDate, "dd MMM yyyy")}
            </p>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
          />
        </CardContent>
      </Card>

      {/* Loading or Charts */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Spending Chart */}
          <Card className="shadow-xl rounded-2xl border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Daily Spending (Last 7 Days)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Spending Chart */}
          <Card className="shadow-xl rounded-2xl border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Weekly Spending (Last 4 Weeks)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChartDashboard;
