/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Grid, Heading } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import Link from 'components/Link';
import TransactionsTable from 'components/TransactionsTable';

export const getServerSideProps = async ({
  params: { account, year, month }
}) => {
  try {
    const { data, next, nextUrl, rowsCount } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        {
          column: 'date',
          type: TYPES.GTE,
          value: Number(year) * 10000 + Number(month) * 100
        },
        {
          column: 'date',
          type: TYPES.LT,
          value: Number(year) * 10000 + (Number(month) + 1) * 100
        },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 }
      ]
    });
    const { accounts, categories, payees } = await prefetch();
    const { data: allTransactions } = await loadAll(data, next, nextUrl);
    return {
      props: {
        transactions: data,
        next,
        nextUrl,
        rowsCount,
        accounts,
        categories: (
          allTransactions?.reduce((prev, t) => {
            const category =
              categories?.find((c) => t.category === c.id) || null;
            if (!category || prev?.find((c) => c?.id === category?.id)) {
              return prev;
            }
            return [...prev, category];
          }, []) || []
        ).map((c) => ({
          ...c,
          transactions:
            allTransactions?.filter((t) => t.category === c.id) || []
        })),
        payees,
        year,
        month
      }
    };
  } catch {
    return {
      props: {
        transactions: [],
        categories: [],
        year,
        month
      }
    };
  }
};

const Home = ({
  transactions,
  next,
  nextUrl,
  rowsCount,
  accounts,
  categories,
  payees
}) => {
  const {
    query: { account: accountid, year, month }
  } = useRouter();

  const account = accounts.find((a) => a.id === accountid);

  return (
    <Grid overflowY="hidden">
      <Head>
        <title>Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/">Home</Link>
      <Heading>
        {accounts?.find((a) => a.id === accountid)?.name || 'Unknown Account'}/
        {year}/{month}
      </Heading>
      <Link href={`/accounts/${accountid}/dates/${year}/${month}/categories`}>
        By Category
      </Link>
      <TransactionsTable
        account={account}
        accounts={accounts}
        categories={categories}
        payees={payees}
        rowsCount={rowsCount}
        transactions={transactions}
        next={next}
        nextUrl={nextUrl}
      />
    </Grid>
  );
};

Home.propTypes = {
  transactions: PropTypes.array,
  next: PropTypes.string,
  nextUrl: PropTypes.string,
  rowsCount: PropTypes.number.isRequired,
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array
};

Home.defaultProps = {
  transactions: [],
  next: null,
  nextUrl: null,
  accounts: [],
  categories: [],
  payees: []
};

export default Home;
