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

export const getServerSideProps = async ({ params: { account } }) => {
  try {
    const { data, next, nextUrl } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 }
      ]
    });

    const { data: allTransactions } = await loadAll(data, next, nextUrl);

    const { accounts, categories, payees } = await prefetch();
    return {
      props: {
        accounts,
        payees,
        categories: getCategories(allTransactions, categories)
      }
    };
  } catch {
    return {
      props: {
        categories: [],
        payees: [],
        accounts: []
      }
    };
  }
};

const Categories = ({ accounts, categories, payees }) => {
  const {
    query: { account: accountid }
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
        title="Categories"
        sections={[
          { url: '', name: 'Transactions' },
          { url: 'payees', name: 'Payees' },
          { url: 'revision', name: 'Revision' },
          { url: 'dates', name: 'By Date' },
          { url: 'balance', name: 'Balance Sheet' }
        ]}
      />
      <Flex wrap="wrap" overflowY="auto">
        {categories?.map((category) => (
          <TransactionFieldCard
            key={category.id}
            name={category?.name || 'Uncategorized'}
            url={`/accounts/${accountid}/categories/${category.id}`}
            transactions={category.transactions}
            transactionsTableProps={{ account, accounts, categories, payees }}
          />
        ))}
      </Flex>
    </MainLayout>
  );
};

Categories.propTypes = {
  accounts: PropTypes.array,
  payees: PropTypes.array,
  categories: PropTypes.array
};

Categories.defaultProps = {
  accounts: [],
  payees: [],
  categories: []
};

export default Categories;
