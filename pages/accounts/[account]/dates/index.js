/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Grid, Heading, Text, Avatar, Flex } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import Link from 'components/Link';

export const getServerSideProps = async ({ params: { account } }) => {
  try {
    const { data, next, nextUrl } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 }
      ]
    });

    const { data: allTransactions } = await loadAll(data, next, nextUrl);

    const { accounts } = await prefetch();
    return {
      props: {
        accounts,
        dates:
          allTransactions?.reduce((prev, t) => {
            const dateString = t.date.toString();
            const year = dateString.slice(0, 4);
            const month = dateString.slice(4, 6);
            const day = dateString.slice(6, 8);
            prev[year] = prev[year] || {};
            prev[year].transactions = prev[year].transactions || [];
            prev[year].transactions.push(t);
            prev[year][month] = prev[year][month] || {};
            prev[year][month].transactions =
              prev[year][month].transactions || [];
            prev[year][month].transactions.push(t);
            prev[year][month][day] = prev[year][month][day] || {};
            prev[year][month][day].transactions =
              prev[year][month][day].transactions || [];
            prev[year][month][day].transactions.push(t);
            return prev;
          }, {}) || {}
      }
    };
  } catch {
    return {
      props: {
        dates: {},
        accounts: []
      }
    };
  }
};

const Home = ({ accounts, dates }) => {
  const {
    query: { account: accountid }
  } = useRouter();

  return (
    <Grid overflowY="hidden">
      <Head>
        <title>Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/">Home</Link>
      <Link href={`/accounts/${accountid}`}>
        <Heading>
          {accounts?.find((a) => a.id === accountid)?.name || 'Unknown Account'}
          /
        </Heading>
      </Link>
      <Flex flexDirection="column" overflowY="auto">
        {Object.keys(dates).map((year) =>
          year === 'transactions' ? null : (
            <Flex flexDirection="column">
              <Link
                margin="10px"
                p="20px"
                d="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                border="solid 1px #333"
                borderRadius="5px"
                key={year}
                href={`/accounts/${accountid}/dates/${year}`}
              >
                <Avatar name={`${year.slice(2)} ${year.slice(3)}`} src={year} />
                <Text>{dates[year].transactions.length} transactions</Text>
                <Text>
                  {(
                    dates[year].transactions?.reduce(
                      (prev, t) => prev + t.amount,
                      0
                    ) / 100
                  ).toFixed(2)}{' '}
                  EGP
                </Text>
              </Link>
              <Flex wrap="wrap">
                {Object.keys(dates[year])
                  .sort()
                  .map((month) =>
                    month === 'transactions' ? null : (
                      <Link
                        margin="10px"
                        p="20px"
                        d="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        border="solid 1px #333"
                        borderRadius="5px"
                        key={month}
                        href={`/accounts/${accountid}/dates/${year}/${month}`}
                      >
                        <Avatar
                          name={`${month.slice(0)} ${month.slice(1)}`}
                          src={month}
                        />
                        <Text>
                          {dates[year][month].transactions.length} transactions
                        </Text>
                        <Text>
                          {(
                            dates[year][month].transactions.reduce(
                              (prev, t) => prev + t.amount,
                              0
                            ) / 100
                          ).toFixed(2)}{' '}
                          EGP
                        </Text>
                      </Link>
                    )
                  )}
              </Flex>
            </Flex>
          )
        )}
      </Flex>
    </Grid>
  );
};

Home.propTypes = {
  accounts: PropTypes.array,
  dates: PropTypes.object
};

Home.defaultProps = {
  accounts: [],
  dates: {}
};

export default Home;
