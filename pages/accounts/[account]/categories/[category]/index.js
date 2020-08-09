/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { TYPES, query } from 'libs/query';
import prefetch from 'libs/prefetch';
import TransactionsTable from 'components/TransactionsTable';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';

export const getServerSideProps = async ({ params: { account, category } }) => {
  try {
    const { data, next, nextUrl, rowsCount } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'category', type: TYPES.EXACT, value: category },
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
        payees
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

const Category = ({
  transactions,
  next,
  nextUrl,
  rowsCount,
  accounts,
  categories,
  payees
}) => {
  const {
    query: { account: accountid, category: categoryid }
  } = useRouter();

  const account = accounts.find((a) => a.id === accountid);
  const category = categories?.find((c) => c.id === categoryid);

  return (
    <MainLayout
      title={account?.name || 'Unknown Account'}
      accounts={accounts}
      gridAutoRows="auto 1fr"
    >
      <Navbar
        account={account}
        title={category.name || 'Uncategorized'}
        sections={[
          { url: 'categories', name: 'All Categories' },
          { url: `categories/${category.id}/timeline`, name: 'Timeline' }
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

Category.propTypes = {
  transactions: PropTypes.array,
  next: PropTypes.string,
  nextUrl: PropTypes.string,
  rowsCount: PropTypes.number.isRequired,
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array
};

Category.defaultProps = {
  transactions: [],
  next: null,
  nextUrl: null,
  accounts: [],
  categories: [],
  payees: []
};

export default Category;
