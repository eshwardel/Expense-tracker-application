import React from "react";

const ExpenseList = React.memo(({ items, onDelete, CAT_COLORS, fmt }) => {
  if (items.length === 0) return <div className="empty">No expenses found.</div>;

  return (
    <div className="list">
      {items.map((exp) => (
        <div key={exp.id} className="expCard">
          <div className="expAccent" style={{ background: CAT_COLORS[exp.category] }} />
          <div className="expInfo">
            <div className="expTitle">{exp.title}</div>
            <div className="expMeta">
              <span style={{ color: CAT_COLORS[exp.category] }}>{exp.category}</span>
              <span className="expDate">{exp.date}</span>
            </div>
          </div>
          <div className="expRight">
            <div className="expAmount">{fmt(exp.amount)}</div>
            <button className="delBtn" onClick={() => onDelete(exp.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ExpenseList;