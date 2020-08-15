/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { Flex, Grid, Button, Text } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import { getDatesWithDetails } from 'libs/transactions';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';
import SectionHeading from 'components/SectionHeading';
import { useState } from 'react';
import TransactionsTable from 'components/TransactionsTable';
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
        categories,
        payees,
        dates: getDatesWithDetails(allTransactions, {
          accounts,
          categories,
          payees
        })
      }
    };
  } catch {
    return {
      props: {
        dates: {},
        accounts: [],
        categories: [],
        payees: []
      }
    };
  }
};

const BalanceSheet = ({ account, date, transactions, categories }) => {
  const depositTransactions =
    transactions?.filter((t) => t.isDeposit && !t.isTransfer) || [];
  const depositCategories =
    categories?.filter((c) =>
      depositTransactions.some((t) => t.category === c.id)
    ) || [];
  const paymentTransactions =
    transactions?.filter((t) => t.isPayment && !t.isTransfer) || [];
  const paymentCategories =
    categories?.filter((c) =>
      paymentTransactions.some((t) => t.category === c.id)
    ) || [];

  const [selectedDepositCategories, setSelectedDepositCategories] = useState(
    depositCategories.map((c) => c.id)
  );
  const [selectedPaymentCategories, setSelectedPaymentCategories] = useState(
    paymentCategories.map((c) => c.id)
  );

  const deposits = depositTransactions
    .filter((t) => selectedDepositCategories.includes(t.category))
    .reduce((prev, t) => prev + t.amount, 0);
  const payments = paymentTransactions
    .filter((t) => selectedPaymentCategories.includes(t.category))
    .reduce((prev, t) => prev + t.amount, 0);

  return date === 'transactions' ||
    date === 'categories' ||
    date === 'payees' ? null : (
    <Grid key={date} gridTemplateColumns="auto 1fr 1fr auto" overflowY="hidden">
      <SectionHeading containerProps={{ gridColumn: '1 / 3' }}>
        Deposit
      </SectionHeading>
      <SectionHeading containerProps={{ gridColumn: '3 / 5' }}>
        Payments
      </SectionHeading>
      <Flex direction="column">
        <Button
          variantColor="teal"
          leftIcon="up-down"
          onClick={() =>
            setSelectedDepositCategories(
              selectedDepositCategories.length
                ? []
                : depositCategories.map((c) => c.id)
            )
          }
        >
          {selectedDepositCategories.length ? 'Deselect all' : 'Select all'}
        </Button>
        {depositCategories.map((category) => (
          <Button
            key={category.id}
            d="flex"
            justifyContent="flex-start"
            variantColor="teal"
            variant={
              selectedDepositCategories.includes(category.id)
                ? 'outline'
                : 'ghost'
            }
            leftIcon={
              selectedDepositCategories.includes(category.id)
                ? 'check-circle'
                : null
            }
            onClick={() =>
              setSelectedDepositCategories(
                selectedDepositCategories.includes(category.id)
                  ? selectedDepositCategories.filter((id) => id !== category.id)
                  : [...selectedDepositCategories, category.id]
              )
            }
          >
            {category.name}
          </Button>
        ))}
      </Flex>
      <TransactionsTable
        transactions={depositTransactions.filter((t) =>
          selectedDepositCategories.includes(t.category)
        )}
        rowsCount={
          depositTransactions.filter((t) =>
            selectedDepositCategories.includes(t.category)
          ).length
        }
        skipList={['account', 'payee', 'date']}
        categories={categories}
        account={account}
      />
      <TransactionsTable
        transactions={paymentTransactions.filter((t) =>
          selectedPaymentCategories.includes(t.category)
        )}
        rowsCount={
          paymentTransactions.filter((t) =>
            selectedPaymentCategories.includes(t.category)
          ).length
        }
        skipList={['account', 'payee', 'date']}
        categories={categories}
        account={account}
      />
      <Flex direction="column">
        <Button
          variantColor="pink"
          leftIcon="up-down"
          onClick={() =>
            setSelectedPaymentCategories(
              selectedPaymentCategories.length
                ? []
                : paymentCategories.map((c) => c.id)
            )
          }
        >
          {selectedPaymentCategories.length ? 'Deselect all' : 'Select all'}
        </Button>
        {paymentCategories.map((category) => (
          <Button
            key={category.id}
            d="flex"
            justifyContent="flex-start"
            variantColor="pink"
            variant={
              selectedPaymentCategories.includes(category.id)
                ? 'outline'
                : 'ghost'
            }
            leftIcon={
              selectedPaymentCategories.includes(category.id)
                ? 'check-circle'
                : null
            }
            onClick={() =>
              setSelectedPaymentCategories(
                selectedPaymentCategories.includes(category.id)
                  ? selectedPaymentCategories.filter((id) => id !== category.id)
                  : [...selectedPaymentCategories, category.id]
              )
            }
          >
            {category.name}
          </Button>
        ))}
      </Flex>
      <MoneyText
        gridColumn="1 / 3"
        width="100%"
        justifyContent="center"
        fontSize="20px"
        title="Total Deposit"
        amount={deposits}
      />
      <MoneyText
        gridColumn="3 / 5"
        width="100%"
        justifyContent="center"
        fontSize="20px"
        title="Total Payment"
        amount={payments}
      />
      <MoneyText
        gridColumn="1 /5"
        width="100%"
        justifyContent="center"
        fontSize="20px"
        title="Net"
        amount={deposits + payments}
      />
    </Grid>
  );
};

BalanceSheet.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  date: PropTypes.string.isRequired,
  transactions: PropTypes.array,
  categories: PropTypes.array
};

BalanceSheet.defaultProps = {
  transactions: [],
  categories: []
};

const Balance = ({ dates, accounts }) => {
  const {
    query: { account: accountid }
  } = useRouter();

  const account = accounts?.find((a) => a.id === accountid);

  const [activeYear, setActiveYear] = useState(null);
  const [activeMonth, setActiveMonth] = useState(null);

  return (
    <MainLayout
      title={account?.name || 'Unknown Account'}
      accounts={accounts}
      gridAutoRows="auto 1fr"
    >
      <Navbar
        account={account}
        title="Balance sheet"
        sections={[
          { url: '', name: 'Transactions' },
          { url: 'payees', name: 'Payees' },
          { url: 'revision', name: 'Revision' },
          { url: 'dates', name: 'By Date' }
        ]}
      />
      <Flex direction="column" overflowY="hidden">
        <Flex justifyContent="center" alignItems="center">
          <Text marginRight="20px">Select a year:</Text>
          {Object.keys(dates).map((year) => (
            <Button
              variant={activeYear === year ? 'solid' : 'outline'}
              variantColor={activeYear === year ? 'blue' : 'gray'}
              width="auto"
              key={year}
              onClick={() => {
                setActiveMonth(null);
                setActiveYear(activeYear === year ? null : year);
              }}
            >
              {year}
            </Button>
          ))}
          {activeYear ? (
            <>
              <Text mx="20px">Select a month</Text>
              {Object.keys(dates[activeYear])
                .sort()
                .map((month) =>
                  month === 'transactions' ||
                  month === 'categories' ||
                  month === 'payees' ? null : (
                    <Button
                      variant={activeMonth === month ? 'solid' : 'outline'}
                      variantColor={activeMonth === month ? 'blue' : 'gray'}
                      width="auto"
                      key={month}
                      onClick={() =>
                        setActiveMonth(activeMonth === month ? null : month)
                      }
                    >
                      {month}
                    </Button>
                  )
                )}
            </>
          ) : null}
        </Flex>
        {activeYear ? (
          Object.keys(dates).map((year) =>
            year === activeYear ? (
              activeMonth ? (
                Object.keys(dates[year]).map((month) =>
                  month === activeMonth ? (
                    <BalanceSheet
                      key={month}
                      account={account}
                      date={month}
                      transactions={dates[year][month].transactions}
                      categories={dates[year][month].categories}
                    />
                  ) : null
                )
              ) : (
                <BalanceSheet
                  key={year}
                  account={account}
                  date={year}
                  transactions={dates[year].transactions}
                  categories={dates[year].categories}
                />
              )
            ) : null
          )
        ) : (
          <Text
            width="100%"
            height="100%"
            d="flex"
            justifyContent="center"
            alignItems="center"
            color="gray.500"
          >
            Please select a year
          </Text>
        )}
      </Flex>
    </MainLayout>
  );
};

Balance.propTypes = {
  accounts: PropTypes.array,
  dates: PropTypes.object
};

Balance.defaultProps = {
  accounts: [],
  dates: {}
};

export default Balance;
