/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { Flex } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';
import { getPayees } from 'libs/transactions';
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

    const { accounts, payees, categories } = await prefetch();
    return {
      props: {
        accounts,
        categories,
        payees: getPayees(allTransactions, payees)
      }
    };
  } catch {
    return {
      props: {
        payees: [],
        accounts: []
      }
    };
  }
};

const Payees = ({ accounts, payees, categories }) => {
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
        title="Payees"
        sections={[
          { url: '', name: 'Transactions' },
          { url: 'categories', name: 'Categories' },
          { url: 'revision', name: 'Revision' },
          { url: 'dates', name: 'By Date' }
        ]}
      />
      <Flex wrap="wrap" overflowY="auto">
        {payees?.map((payee) => {
          // Special for payee only
          const transferAccount = accounts?.find(
            (a) => a.id === payee.transfer_acct
          );
          return (
            <TransactionFieldCard
              key={payee.id}
              name={payee?.name || transferAccount?.name || 'Unknown Payee'}
              url={`/accounts/${accountid}/payees/${payee.id}`}
              transactions={payee.transactions}
              transactionsTableProps={{ account, accounts, categories, payees }}
            />
          );
        })}
      </Flex>
    </MainLayout>
  );
};

Payees.propTypes = {
  accounts: PropTypes.array,
  payees: PropTypes.array,
  categories: PropTypes.array
};

Payees.defaultProps = {
  accounts: [],
  payees: [],
  categories: []
};

export default Payees;
