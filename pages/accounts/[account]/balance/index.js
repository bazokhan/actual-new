import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
// import TransactionsTable from 'components/TransactionsTable';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';
import { Grid, Flex } from '@chakra-ui/core';
import TransactionFieldCard from 'components/TransactionsFieldCard';
import { getCategories } from 'libs/transactions';

export const getServerSideProps = async ({ params: { account } }) => {
  try {
    const {
      data: payment,
      next: paymentNext,
      nextUrl: paymentNextUrl,
      rowsCount: paymentRowsCount = 0
    } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 },
        { column: 'amount', type: TYPES.LT, value: 0 }
      ]
    });
    const { data: paymentTransactions } = await loadAll(
      payment,
      paymentNext,
      paymentNextUrl
    );
    const {
      data: deposit,
      next: depositNext,
      nextUrl: depositNextUrl,
      rowsCount: depositRowsCount = 0
    } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 },
        { column: 'amount', type: TYPES.GT, value: 0 }
      ]
    });
    const { data: depositTransactions } = await loadAll(
      deposit,
      depositNext,
      depositNextUrl
    );
    const {
      data: invalid,
      invalidNext,
      invalidNextUrl,
      invalidRowsCount = 0
    } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 },
        { column: 'amount', type: TYPES.EXACT, value: 0 }
      ]
    });
    const { data: invalidTransactions } = await loadAll(
      invalid,
      invalidNext,
      invalidNextUrl
    );
    const { accounts, categories, payees } = await prefetch();
    return {
      props: {
        paymentTransactions,
        paymentRowsCount,
        depositTransactions,
        depositRowsCount,
        invalidTransactions,
        invalidRowsCount,
        accounts,
        categories,
        paymentCategories: getCategories(paymentTransactions, categories),
        depositCategories: getCategories(depositTransactions, categories),
        invalidCategories: getCategories(invalidTransactions, categories),
        payees
      }
    };
  } catch {
    return {
      props: {
        paymentTransactions: [],
        paymentRowsCount: [],
        depositTransactions: [],
        depositRowsCount: [],
        invalidTransactions: [],
        invalidRowsCount: [],
        accounts: [],
        categories: [],
        paymentCategories: [],
        depositCategories: [],
        invalidCategories: [],
        payees: []
      }
    };
  }
};

const Account = ({
  paymentTransactions,
  depositTransactions,
  invalidTransactions,
  paymentCategories,
  depositCategories,
  invalidCategories,
  accounts,
  categories,
  payees
}) => {
  const {
    query: { account: accountid }
  } = useRouter();

  const account = accounts?.find((a) => a?.id === accountid);
  const hasInvalid = invalidTransactions?.length > 0;

  return (
    <MainLayout
      title={account?.name || 'Unknown Account'}
      accounts={accounts}
      gridAutoRows="auto 1fr"
    >
      <Navbar
        account={account}
        title="Balance"
        sections={[
          { url: 'categories', name: 'Categories' },
          { url: 'payees', name: 'Payees' },
          { url: 'revision', name: 'Revision' },
          { url: 'dates', name: 'By Date' }
        ]}
      />
      <Grid
        gridTemplateColumns={`repeat(${hasInvalid ? 3 : 2}, auto 1fr)`}
        overflowY="hidden"
      >
        <TransactionFieldCard
          name="Payments"
          transactions={paymentTransactions}
        />
        <Flex flexDirection="column" overflowY="auto">
          {paymentCategories?.map((category) => (
            <TransactionFieldCard
              noAvatar
              width="100%"
              margin="5px 0"
              key={`payment-${category.id}`}
              name={category?.name || 'Uncategorized'}
              transactions={category.transactions}
              transactionsTableProps={{ account, accounts, categories, payees }}
            />
          ))}
        </Flex>
        <TransactionFieldCard
          name="Deposit"
          transactions={depositTransactions}
          transactionsTableProps={{ account, accounts, categories, payees }}
        />
        <Flex flexDirection="column" overflowY="auto">
          {depositCategories?.map((category) => (
            <TransactionFieldCard
              noAvatar
              width="100%"
              margin="5px 0"
              key={`deposit-${category.id}`}
              name={category?.name || 'Uncategorized'}
              transactions={category.transactions}
              transactionsTableProps={{ account, accounts, categories, payees }}
            />
          ))}
        </Flex>
        {hasInvalid ? (
          <>
            <TransactionFieldCard
              name="Invalid"
              transactions={invalidTransactions}
              transactionsTableProps={{ account, accounts, categories, payees }}
            />
            <Flex flexDirection="column" overflowY="auto">
              {invalidCategories?.map((category) => (
                <TransactionFieldCard
                  noAvatar
                  key={`invalid-${category.id}`}
                  name={category?.name || 'Uncategorized'}
                  transactions={category.transactions}
                  transactionsTableProps={{
                    account,
                    accounts,
                    categories,
                    payees
                  }}
                />
              ))}
            </Flex>
          </>
        ) : null}
      </Grid>
    </MainLayout>
  );
};

Account.propTypes = {
  paymentTransactions: PropTypes.array,
  depositTransactions: PropTypes.array,
  invalidTransactions: PropTypes.array,
  paymentCategories: PropTypes.array,
  depositCategories: PropTypes.array,
  invalidCategories: PropTypes.array,
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array
};

Account.defaultProps = {
  paymentTransactions: [],
  depositTransactions: [],
  invalidTransactions: [],
  paymentCategories: [],
  depositCategories: [],
  invalidCategories: [],
  accounts: [],
  categories: [],
  payees: []
};

export default Account;
