import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import TransactionsTable from 'components/TransactionsTable';
import { getCategories } from 'libs/transactions';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';

export const getServerSideProps = async ({
  params: { account, year, month }
}) => {
  try {
    const { data, next, nextUrl, rowsCount } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        {
          column: 'date',
          type: TYPES.GTE,
          value: Number(year) * 10000 + Number(month) * 100
        },
        {
          column: 'date',
          type: TYPES.LT,
          value: Number(year) * 10000 + (Number(month) + 1) * 100
        },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 }
      ]
    });
    const { accounts, categories, payees } = await prefetch();
    const { data: allTransactions } = await loadAll(data, next, nextUrl);
    return {
      props: {
        transactions: data,
        next,
        nextUrl,
        rowsCount,
        accounts,
        categories: getCategories(allTransactions, categories),
        payees,
        year,
        month
      }
    };
  } catch {
    return {
      props: {
        transactions: [],
        categories: [],
        year,
        month
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
    query: { account: accountid, year, month }
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
        title={`${month}-${year}`}
        sections={[
          { url: 'dates', name: 'All Years' },
          { url: `dates/${year}`, name: `All Months of ${year}` },
          {
            url: `dates/${year}/${month}/categories`,
            name: 'Categories of the month'
          }
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
