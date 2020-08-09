/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { Grid, Text, Flex } from '@chakra-ui/core';
import MoneyText from './MoneyText';
import TransactionsButton from './TransactionsButton';
import Bar from './Bar';

const YearlyTimeline = ({ dates, transactionsTableProps, ...props }) => {
  const maxAmount = Math.max(
    ...Object.keys(dates).map((year) => {
      const yearAmount = dates[year].transactions?.reduce(
        (prev, t) => prev + t.amount,
        0
      );
      return Math.abs(yearAmount);
    })
  );
  return (
    <Flex flexDirection="column" overflowY="auto" p="20px" {...props}>
      {Object.keys(dates).map((year) => {
        const rawYearAmount = dates[year].transactions?.reduce(
          (prev, t) => prev + t.amount,
          0
        );
        const yearAmount = Math.abs(rawYearAmount);
        return year === 'transactions' ? null : (
          <Flex key={year} flexDirection="column">
            <Grid
              gridTemplateColumns="70px 1fr 120px 120px"
              columnGap="10px"
              alignItems="center"
            >
              <Text textAlign="right" fontWeight="400" color="purple.900">
                {year}
              </Text>
              <Bar
                amount={yearAmount}
                max={maxAmount}
                color={
                  rawYearAmount > 0
                    ? 'teal.900'
                    : rawYearAmount < 0
                    ? 'pink.900'
                    : 'blue.900'
                }
              />
              {transactionsTableProps ? (
                <TransactionsButton
                  transactions={dates[year].transactions}
                  {...transactionsTableProps}
                >
                  {dates[year].transactions?.length} transactions
                </TransactionsButton>
              ) : (
                <Text>{dates[year].transactions?.length} transactions</Text>
              )}
              <MoneyText amount={yearAmount} />
            </Grid>
            {Object.keys(dates[year])
              .sort()
              .map((month) => {
                const rawMonthAmount = dates[year][month].transactions?.reduce(
                  (prev, t) => prev + t.amount,
                  0
                );
                const monthAmount = Math.abs(rawMonthAmount);
                return month === 'transactions' ? null : (
                  <Grid
                    key={month}
                    gridTemplateColumns="70px 1fr 120px 120px"
                    alignItems="center"
                    columnGap="10px"
                  >
                    <Text textAlign="right" fontWeight="400" color="purple.400">
                      {month}
                    </Text>
                    <Bar
                      amount={monthAmount}
                      max={maxAmount}
                      color={
                        rawMonthAmount > 0
                          ? 'teal.400'
                          : rawMonthAmount < 0
                          ? 'pink.400'
                          : 'blue.400'
                      }
                    />
                    {transactionsTableProps ? (
                      <TransactionsButton
                        transactions={dates[year][month].transactions}
                        {...transactionsTableProps}
                      >
                        {dates[year][month].transactions?.length} transactions
                      </TransactionsButton>
                    ) : (
                      <Text>
                        {dates[year][month].transactions?.length} transactions
                      </Text>
                    )}
                    <MoneyText amount={monthAmount} />
                  </Grid>
                );
              })}
          </Flex>
        );
      })}
    </Flex>
  );
};

YearlyTimeline.propTypes = {
  dates: PropTypes.object.isRequired,
  transactionsTableProps: PropTypes.shape({
    account: PropTypes.shape({ id: PropTypes.string }),
    accounts: PropTypes.array,
    categories: PropTypes.array,
    payees: PropTypes.array
  })
};

YearlyTimeline.defaultProps = {
  transactionsTableProps: null
};

export default YearlyTimeline;
