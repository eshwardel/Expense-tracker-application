import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ExpenseForm from "./Components/ExpenseForm.jsx";
import ExpenseList from "./Components/ExpenseList.jsx";
import "./App.css";

const MOCK_EXPENSES = [
  { id: 1, title: "Grocery Run", amount: 84.5, category: "Food", date: "2026-04-01" },
  { id: 2, title: "Electric Bill", amount: 132.0, category: "Utilities", date: "2026-04-02" },
  { id: 3, title: "Netflix", amount: 15.49, category: "Entertainment", date: "2026-04-03" },
  { id: 4, title: "Gym Membership", amount: 45.0, category: "Health", date: "2026-04-04" },
  { id: 5, title: "Uber Ride", amount: 18.75, category: "Transport", date: "2026-04-05" },
];

const CATEGORIES = ["Food", "Utilities", "Entertainment", "Health", "Transport", "Other"];
const CAT_COLORS = { Food: "#f97316", Utilities: "#3b82f6", Entertainment: "#a855f7", Health: "#22c55e", Transport: "#eab308", Other: "#94a3b8" };

const fetchExpenses = () => new Promise((res) => setTimeout(() => res(MOCK_EXPENSES), 900));
const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    fetchExpenses().then((data) => {
      setExpenses(data);
      setLoading(false);
    });
    return () => clearTimeout(toastTimer.current);
  }, []);

  const showToast = useCallback((msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const handleAdd = useCallback((newExp) => {
    setExpenses((prev) => [newExp, ...prev]);
    showToast("Expense added!");
  }, [showToast]);

  const handleDelete = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast("Expense removed.", "error");
  }, [showToast]);

  const displayed = useMemo(() => {
    let list = filterCat === "All" ? expenses : expenses.filter((e) => e.category === filterCat);
    return [...list].sort((a, b) => sortBy === "date" ? new Date(b.date) - new Date(a.date) : b.amount - a.amount);
  }, [expenses, filterCat, sortBy]);

  const stats = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const bycat = CATEGORIES.reduce((acc, c) => {
      acc[c] = expenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0);
      return acc;
    }, {});
    return { total, bycat };
  }, [expenses]);

  return (
    <div className="root">
      <div className="grain" />
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <header className="header">
        <div className="headerInner">
          <div>
            <div className="logo">₹ SPENDR</div>
            <div className="tagline">Your money, mapped.</div>
          </div>
          <div className="totalBadge">
            <span className="totalLabel">Total Spent</span>
            <span className="totalAmount">{fmt(stats.total)}</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="left">
          <ExpenseForm onAdd={handleAdd} CATEGORIES={CATEGORIES} CAT_COLORS={CAT_COLORS} />
          
          <div className="card">
            <h2 className="cardTitle">Breakdown</h2>
            {CATEGORIES.map((c) => {
              const val = stats.bycat[c] || 0;
              const pct = stats.total ? (val / stats.total) * 100 : 0;
              return (
                <div key={c} className="breakRow">
                  <div className="breakLabel">
                    <span className="dot" style={{ background: CAT_COLORS[c] }} />
                    <span className="breakCat">{c}</span>
                  </div>
                  <div className="barWrap">
                    <div className="bar" style={{ width: `${pct}%`, background: CAT_COLORS[c] }} />
                  </div>
                  <span className="breakAmt">{fmt(val)}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="right">
          <div className="controls">
            <div className="filterRow">
              <span className="filterLabel">Filter:</span>
              {["All", ...CATEGORIES].map((c) => (
                <button key={c} className={`filterBtn ${filterCat === c ? 'active' : ''}`} onClick={() => setFilterCat(c)}>{c}</button>
              ))}
            </div>
          </div>

          {loading ? <div className="loadWrap"><div className="spinner" /></div> : 
           <ExpenseList items={displayed} onDelete={handleDelete} CAT_COLORS={CAT_COLORS} fmt={fmt} />}
        </section>
      </main>
    </div>
  );
}