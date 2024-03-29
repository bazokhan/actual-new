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
import BalanceSheet from 'components/BalanceSheet';
import DateSelectHeader from 'components/DateSelectHeader';
import EmptyText from 'components/EmptyText';

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
                      <BalanceSheet
                        key={month}
                        account={account}
                        date={month}
                        transactions={dates[year][month].transactions}
                        categories={dates[year][month].categories}
                      />
                    )
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
          <EmptyText>Please select a year</EmptyText>
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
