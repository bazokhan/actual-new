/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { TYPES, query } from 'libs/query';
import prefetch from 'libs/prefetch';
import TransactionsTable from 'components/TransactionsTable';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';

export const getServerSideProps = async ({ params: { account, year } }) => {
  try {
    const { data, next, nextUrl, rowsCount } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'date', type: TYPES.GTE, value: Number(year) * 10000 },
        { column: 'date', type: TYPES.LT, value: (Number(year) + 1) * 10000 },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 }
      ]
    });
    const { accounts, categories, payees } = await prefetch();
    return {
      props: {
        transactions: data,
        next,
        nextUrl,
        rowsCount,
        accounts,
        categories,
        payees,
        year
      }
    };
  } catch {
    return {
      props: {
        transactions: [],
        categories: [],
        year
      }
    };
  }
};

const Home = ({
  transactions,
  next,
  nextUrl,
  rowsCount,
  accounts,
  categories,
  payees
}) => {
  const {
    query: { account: accountid, year }
  } = useRouter();

  const account = accounts.find((a) => a.id === accountid);

  return (
    <MainLayout
      title={account?.name || 'Unknown Account'}
      accounts={accounts}
      gridAutoRows="auto 1fr"
    >
      <Navbar
        account={account}
        title={year}
        sections={[{ url: 'dates', name: 'All Years' }]}
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
      />
    </MainLayout>
  );
};

Home.propTypes = {
  transactions: PropTypes.array,
  next: PropTypes.string,
  nextUrl: PropTypes.string,
  rowsCount: PropTypes.number.isRequired,
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array
};

Home.defaultProps = {
  transactions: [],
  next: null,
  nextUrl: null,
  accounts: [],
  categories: [],
  payees: []
};

export default Home;
