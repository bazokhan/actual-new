import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { TYPES, query } from 'libs/query';
import prefetch from 'libs/prefetch';
import TransactionsTable from 'components/TransactionsTable';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';

export const getServerSideProps = async ({ params: { account } }) => {
  try {
    const { data, next, nextUrl, rowsCount } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 }
      ]
    });
    const { accounts, categories, payees } = await prefetch();
    return {
      props: {
        transactions: data,
        next: next || null,
        nextUrl: nextUrl || null,
        rowsCount: rowsCount || 0,
        accounts: accounts || [],
        categories: categories || [],
        payees: payees || []
      }
    };
  } catch {
    return {
      props: {
        transactions: [],
        categories: []
      }
    };
  }
};

const Account = ({
  transactions,
  next,
  nextUrl,
  rowsCount,
  accounts,
  categories,
  payees
}) => {
  const {
    query: { account: accountid }
  } = useRouter();

  const account = accounts?.find((a) => a?.id === accountid);

  return (
    <MainLayout
      title={account?.name || 'Unknown Account'}
      accounts={accounts}
      gridAutoRows="auto 1fr"
    >
      <Navbar
        account={account}
        title="Transactions"
        sections={[
          { url: 'categories', name: 'Categories' },
          { url: 'payees', name: 'Payees' },
          { url: 'revision', name: 'Revision' },
          { url: 'dates', name: 'By Date' }
        ]}
      />
      <TransactionsTable
        account={account}
        accounts={accounts}
        categories={categories}
        payees={payees}
        rowsCount={rowsCount}
        transactions={transactions}
        next={next}
        nextUrl={nextUrl}
        linkCategory
        linkPayee
      />
    </MainLayout>
  );
};

Account.propTypes = {
  transactions: PropTypes.array,
  next: PropTypes.string,
  nextUrl: PropTypes.string,
  rowsCount: PropTypes.number.isRequired,
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array
};

Account.defaultProps = {
  transactions: [],
  next: null,
  nextUrl: null,
  accounts: [],
  categories: [],
  payees: []
};

export default Account;
