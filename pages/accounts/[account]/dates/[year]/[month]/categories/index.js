/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { Flex } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import { getCategories } from 'libs/transactions';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';
import TransactionFieldCard from 'components/TransactionsFieldCard';

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
        payees: [],
        year,
        month
      }
    };
  }
};

const Home = ({ accounts, categories, payees }) => {
  const {
    query: { account: accountid, year, month }
  } = useRouter();

  const account = accounts?.find((a) => a.id === accountid);

  return (
    <MainLayout
      title={account?.name || 'Unknown Account'}
      accounts={accounts}
      gridAutoRows="auto 1fr"
    >
      <Navbar
        account={account}
        title={`${month}-${year} - Categories`}
        sections={[
          { url: 'dates', name: 'All Years' },
          { url: `dates/${year}`, name: `All Months of ${year}` },
          {
            url: `dates/${year}/${month}`,
            name: 'Back to month transactions table'
          }
        ]}
      />
      <Flex wrap="wrap" overflowY="auto">
        {categories?.map((category) => (
          <TransactionFieldCard
            key={category.id}
            name={category?.name || 'Uncategorized'}
            url={`/accounts/${accountid}/dates/${year}/${month}/categories/${category.id}`}
            transactions={category.transactions}
            transactionsTableProps={{ account, accounts, categories, payees }}
          />
        ))}
      </Flex>
    </MainLayout>
  );
};

Home.propTypes = {
  accounts: PropTypes.array,
  payees: PropTypes.array,
  categories: PropTypes.array
};

Home.defaultProps = {
  accounts: [],
  payees: [],
  categories: []
};

export default Home;
