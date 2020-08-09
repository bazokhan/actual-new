import PropTypes from 'prop-types';
import { Flex } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import { getDates } from 'libs/transactions';
import MainLayout from 'layouts/MainLayout';
import Navbar from 'components/Navbar';
import TransactionFieldCard from 'components/TransactionsFieldCard';
import YearlyTimeline from 'components/YearlyTimeline';
import SectionHeading from 'components/SectionHeading';

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
        dates: getDates(allTransactions)
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

const Home = ({ accounts, dates, categories, payees }) => {
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
        title="By Date"
        sections={[
          { url: '', name: 'Transactions' },
          { url: 'categories', name: 'Categories' },
          { url: 'payees', name: 'Payees' },
          { url: 'revision', name: 'Revision' }
        ]}
      />
      <Flex flexDirection="column" overflowY="auto">
        <SectionHeading>Overview</SectionHeading>
        {Object.keys(dates).map((year) =>
          year === 'transactions' ? null : (
            <Flex flexDirection="column" alignItems="center" p="20px">
              <TransactionFieldCard
                noAvatar
                my="10px"
                width="100%"
                name={`Year: ${year}`}
                url={`/accounts/${accountid}/dates/${year}`}
                transactions={dates[year].transactions}
              />
              <Flex
                wrap="wrap"
                justifyContent="center"
                rounded="lg"
                bg="gray.50"
              >
                {Object.keys(dates[year])
                  .sort()
                  .map((month) =>
                    month === 'transactions' ? null : (
                      <TransactionFieldCard
                        noAvatar
                        name={`Month: ${month}`}
                        url={`/accounts/${accountid}/dates/${year}/${month}`}
                        transactions={dates[year][month].transactions}
                        transactionsTableProps={{
                          account,
                          accounts,
                          categories,
                          payees
                        }}
                      />
                    )
                  )}
              </Flex>
            </Flex>
          )
        )}
        <SectionHeading>Timeline</SectionHeading>
        <YearlyTimeline
          dates={dates}
          transactionsTableProps={{ account, accounts, categories, payees }}
          overflowY="initial"
          p="20px"
          maxWidth="100%"
        />
      </Flex>
    </MainLayout>
  );
};

Home.propTypes = {
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array,
  dates: PropTypes.object
};

Home.defaultProps = {
  accounts: [],
  categories: [],
  payees: [],
  dates: {}
};

export default Home;
