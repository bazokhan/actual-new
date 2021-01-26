/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { Flex } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import { getDatesWithDetails } from 'libs/transactions';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';
import { useState } from 'react';
import DateSelectHeader from 'components/DateSelectHeader';
import EmptyText from 'components/EmptyText';
import TransactionsTable from 'components/TransactionsTable';

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

const Transfer = ({ dates, accounts }) => {
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
        <DateSelectHeader
          dates={dates}
          activeYear={activeYear}
          activeMonth={activeMonth}
          setActiveYear={setActiveYear}
          setActiveMonth={setActiveMonth}
        />
        {activeYear ? (
          Object.keys(dates).map((year) =>
            year === activeYear ? (
              activeMonth ? (
                Object.keys(dates[year]).map((month) =>
                  month === activeMonth ? (
                    month === 'transactions' ||
                    month === 'categories' ||
                    month === 'payees' ? null : (
                      <TransactionsTable
                        key={month}
                        account={account}
                        transactions={dates[year][month].transactions.filter(
                          (t) => t.isTransfer
                        )}
                      />
                    )
                  ) : null
                )
              ) : (
                <TransactionsTable
                  key={year}
                  account={account}
                  skipList={['category', 'account', 'notes']}
                  transactions={dates[year].transactions.filter(
                    (t) => t.isTransfer
                  )}
                />
              )
            ) : null
          )
        ) : (
          <EmptyText>Please select a year</EmptyText>
        )}
      </Flex>
    </MainLayout>
  );
};

Transfer.propTypes = {
  accounts: PropTypes.array,
  dates: PropTypes.object
};

Transfer.defaultProps = {
  accounts: [],
  dates: {}
};

export default Transfer;
