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
    return { accounts, categories, payees };
  } catch (err) {
    console.log(err);
    return {
      accounts: [],
      categories: [],
      payees: []
    };
  }
};

export default prefetch;
