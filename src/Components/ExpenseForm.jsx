import React, { useState, useRef,} from "react";

const ExpenseForm = ({ onAdd, CATEGORIES, CAT_COLORS }) => {
  const [form, setForm] = useState({ title: "", amount: "", category: "Food", date: "" });
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  const handleSubmit = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title required";
    if (!form.amount || +form.amount <= 0) e.amount = "Invalid amount";
    if (!form.date) e.date = "Date required";

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    onAdd({ ...form, id: Date.now(), amount: parseFloat(form.amount) });
    setForm({ title: "", amount: "", category: "Food", date: "" });
    setErrors({});
    titleRef.current.focus();
  };

  return (
    <div className="card">
      <h2 className="cardTitle"><span className="cardTitleAccent">+</span> New Expense</h2>
      <div className="field">
        <label className="label">Title</label>
        <input
          ref={titleRef}
          className={`input ${errors.title ? "inputError" : ""}`}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="What did you spend on?"
        />
      </div>
      <div className="row">
        <div className="field flex1">
          <label className="label">Amount (₹)</label>
          <input
            type="number"
            className={`input ${errors.amount ? "inputError" : ""}`}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <div className="field flex1">
          <label className="label">Date</label>
          <input
            type="date"
            className={`input ${errors.date ? "inputError" : ""}`}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
      </div>
      <div className="catGrid">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className="catBtn"
            style={{
              background: form.category === c ? CAT_COLORS[c] : "transparent",
              color: form.category === c ? "#fff" : "#8f9aa9"
            }}
            onClick={() => setForm({ ...form, category: c })}
          >
            {c}
          </button>
        ))}
      </div>
      <button className="addBtn" onClick={handleSubmit}>Add Expense →</button>
    </div>
  );
};

export default ExpenseForm;