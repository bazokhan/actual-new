/* eslint-disable no-param-reassign */
export const getDates = (transactions) =>
  transactions?.reduce((prev, t) => {
    const dateString = t.date.toString();
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    prev[year] = prev[year] || {};
    prev[year].transactions = prev[year].transactions || [];
    prev[year].transactions.push(t);
    prev[year][month] = prev[year][month] || {};
    prev[year][month].transactions = prev[year][month].transactions || [];
    prev[year][month].transactions.push(t);
    prev[year][month][day] = prev[year][month][day] || {};
    prev[year][month][day].transactions =
      prev[year][month][day].transactions || [];
    prev[year][month][day].transactions.push(t);
    return prev;
  }, {}) || {};

export const getCategories = (transactions, categories) =>
  (
    transactions?.reduce((prev, t) => {
      const category = categories?.find((c) => t.category === c.id) || null;
      if (!category || prev?.find((c) => c?.id === category?.id)) {
        return prev;
      }
      return [...prev, category];
    }, []) || []
  ).map((c) => ({
    ...c,
    transactions: transactions?.filter((t) => t.category === c.id) || []
  }));

export const getPayees = (transactions, payees) =>
  (
    transactions?.reduce((prev, t) => {
      const payee = payees?.find((p) => t.description === p.id) || null;
      if (!payee || prev?.find((p) => p?.id === payee?.id)) {
        return prev;
      }
      return [...prev, payee];
    }, []) || []
  ).map((p) => ({
    ...p,
    transactions: transactions?.filter((t) => t.description === p.id) || []
  }));
