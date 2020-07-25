const { TYPES, query } = require('./query');

const prefetch = async () => {
  try {
    const { data: accounts } = await query('accounts', {
      where: [{ column: 'tombstone', type: TYPES.EXACT, value: 0 }]
    });
    const { data: categories } = await query('categories', {
      where: [{ column: 'tombstone', type: TYPES.EXACT, value: 0 }]
    });
    const { data: payees } = await query('payees', {
      where: [{ column: 'tombstone', type: TYPES.EXACT, value: 0 }]
    });
    console.log(accounts);
    return { accounts, categories, payees };
  } catch {
    return {
      accounts: [],
      categories: [],
      payees: []
    };
  }
};

export default prefetch;
