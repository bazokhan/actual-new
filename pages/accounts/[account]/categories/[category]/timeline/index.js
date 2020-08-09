import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';
import YearlyTimeline from 'components/YearlyTimeline';
import { getDates } from 'libs/transactions';

export const getServerSideProps = async ({ params: { account, category } }) => {
  try {
    const { data, next, nextUrl } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'category', type: TYPES.EXACT, value: category },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 }
      ]
    });

    const { data: allTransactions } = await loadAll(data, next, nextUrl);

    const { accounts, categories, payees } = await prefetch();
    return {
      props: {
        accounts,
        transactions: data,
        categories,
        payees,
        dates: getDates(allTransactions)
      }
    };
  } catch {
    return {
      props: {
        dates: {},
        transactions: [],
        accounts: [],
        categories: [],
        payees: []
      }
    };
  }
};

const Timeline = ({ accounts, dates, categories, payees }) => {
  const {
    query: { account: accountid, category: categoryid }
  } = useRouter();

  const account = accounts?.find((a) => a.id === accountid);
  const category = categories?.find((c) => c.id === categoryid);

  return (
    <MainLayout
      title={account?.name || 'Unknown Account'}
      accounts={accounts}
      gridAutoRows="auto 1fr"
    >
      <Navbar
        account={account}
        title={`${category?.name || 'Uncategorized'} - timeline`}
        sections={[
          { url: 'categories', name: 'All Categories' },
          { url: `categories/${category.id}`, name: 'Back to table' }
        ]}
      />
      <YearlyTimeline
        dates={dates}
        transactionsTableProps={{ account, accounts, categories, payees }}
      />
    </MainLayout>
  );
};

Timeline.propTypes = {
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array,
  dates: PropTypes.object
};

Timeline.defaultProps = {
  accounts: [],
  categories: [],
  payees: [],
  dates: {}
};

export default Timeline;
