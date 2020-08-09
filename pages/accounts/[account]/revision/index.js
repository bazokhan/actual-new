/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import PropTypes from 'prop-types';
import { Grid, Heading, Text, Flex } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';
import TransactionsButton from 'components/TransactionsButton';
import { getDates, getCategories } from 'libs/transactions';
import MoneyText from 'components/MoneyText';

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
        categories: getCategories(allTransactions, categories),
        payees,
        transactions: allTransactions,
        dates: getDates(allTransactions)
      }
    };
  } catch {
    return {
      props: {
        dates: {},
        accounts: [],
        categories: [],
        transactions: [],
        payees: []
      }
    };
  }
};

const Revision = ({ accounts, categories, payees }) => {
  const {
    query: { account: accountid }
  } = useRouter();

  const account = accounts?.find((a) => a.id === accountid);

  return (
    <MainLayout title={account?.name || 'Unknown Account'} accounts={accounts}>
      <Navbar
        account={account}
        title="Revision"
        sections={[
          { url: '', name: 'Transactions' },
          { url: 'categories', name: 'Categories' },
          { url: 'payees', name: 'Payees' },
          { url: 'dates', name: 'By Date' }
        ]}
      />
      <Flex flexDirection="column" overflowY="auto">
        {categories.map((c, index) => {
          const paymentTransactions = c.transactions.filter(
            (t) => t.amount < 0
          );
          const depositTrnasactions = c.transactions.filter(
            (t) => t.amount > 0
          );
          const invalidTransactions = c.transactions.filter(
            (t) => t.amount === 0
          );
          return (
            <Grid
              gridTemplateColumns="1fr 1fr 1fr"
              columnGap="20px"
              borderWidth="1px"
              my="5px"
              bg={index % 2 === 0 ? 'rgba(0, 0, 0, 0.04)' : '#fff'}
              borderColor={
                paymentTransactions.length > depositTrnasactions.length
                  ? 'pink.100'
                  : paymentTransactions.length < depositTrnasactions.length
                  ? 'teal.100'
                  : 'gray.100'
              }
              boxShadow="md"
            >
              <Heading
                gridColumn="1 / 4"
                fontSize="lg"
                textAlign="center"
                p="10px 20px"
                color={
                  paymentTransactions.length > depositTrnasactions.length
                    ? 'pink.500'
                    : paymentTransactions.length < depositTrnasactions.length
                    ? 'teal.500'
                    : 'gray.500'
                }
              >
                {c.name || 'Unknown Category'}
              </Heading>
              <TransactionsButton
                margin="10px"
                p="20px"
                d="flex"
                height="auto"
                variantColor="pink"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 3px 3px 0 rgba(0, 0, 0, 0.16)"
                borderRadius="5px"
                transactions={paymentTransactions}
                account={account}
                accounts={accounts}
                categories={categories}
                payees={payees}
                variant={paymentTransactions.length ? 'solid' : 'ghost'}
              >
                <Text>Payment</Text>
                <Text>{paymentTransactions.length} transactions</Text>
                <MoneyText
                  bg="gray.50"
                  p="5px 20px"
                  borderRadius="3px"
                  marginTop="10px"
                  amount={paymentTransactions.reduce(
                    (prev, t) => prev + t.amount,
                    0
                  )}
                />
              </TransactionsButton>
              <TransactionsButton
                margin="10px"
                p="20px"
                d="flex"
                height="auto"
                variantColor="teal"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 3px 3px 0 rgba(0, 0, 0, 0.16)"
                borderRadius="5px"
                transactions={depositTrnasactions}
                account={account}
                accounts={accounts}
                categories={categories}
                payees={payees}
                variant={depositTrnasactions.length ? 'solid' : 'ghost'}
              >
                <Text>Deposit</Text>
                <Text>{depositTrnasactions.length} transactions</Text>
                <MoneyText
                  bg="gray.50"
                  p="5px 20px"
                  borderRadius="3px"
                  marginTop="10px"
                  amount={depositTrnasactions.reduce(
                    (prev, t) => prev + t.amount,
                    0
                  )}
                />
              </TransactionsButton>
              <TransactionsButton
                margin="10px"
                p="20px"
                d="flex"
                height="auto"
                variantColor="gray"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 3px 3px 0 rgba(0, 0, 0, 0.16)"
                borderRadius="5px"
                transactions={invalidTransactions}
                account={account}
                accounts={accounts}
                categories={categories}
                payees={payees}
                variant={invalidTransactions.length ? 'solid' : 'ghost'}
              >
                <Text>Invalid</Text>
                <Text>{invalidTransactions.length} transactions</Text>
                <MoneyText
                  bg="gray.50"
                  p="5px 20px"
                  borderRadius="3px"
                  marginTop="10px"
                  amount={invalidTransactions.reduce(
                    (prev, t) => prev + t.amount,
                    0
                  )}
                />
              </TransactionsButton>
            </Grid>
          );
        })}
      </Flex>
    </MainLayout>
  );
};

Revision.propTypes = {
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array
};

Revision.defaultProps = {
  accounts: [],
  categories: [],
  payees: []
};

export default Revision;
