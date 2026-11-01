// Edit from the new tab page (hover the bottom-right corner, click "edit"), or by hand.
// date = deadline, from = first day it shows (YYYY-MM-DD). Goals disappear the day after their deadline.
// These demo goals use dates relative to today. Saving from the editor replaces them with fixed dates.
const inDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((x) => String(x).padStart(2, "0")).join("-");
};

const GOALS = [
  { title: "Grant application submitted", from: inDays(0), date: inDays(2) },
  { title: "Thesis chapter 3 draft to advisor", from: inDays(0), date: inDays(9) },
  { title: "Portfolio site live", from: inDays(0), date: inDays(17) },
  { title: "Half marathon: training block 2", from: inDays(21), date: inDays(48) },
];
