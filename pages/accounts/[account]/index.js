import PropTypes from 'prop-types';
import Head from 'next/head';
import { Grid, Heading } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query } from 'libs/query';
import prefetch from 'libs/prefetch';
import Link from 'components/Link';
import TransactionsTable from 'components/TransactionsTable';

export const getServerSideProps = async ({ params: { account } }) => {
  try {
    const { data, next, nextUrl, rowsCount } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 }
      ]
    });
    const { accounts, categories, payees } = await prefetch();
    return {
      props: {
        transactions: data,
        next,
        nextUrl,
        rowsCount,
        accounts,
        categories,
        payees
      }
    };
  } catch {
    return {
      props: {
        transactions: [],
        categories: []
      }
    };
  }
};

const Account = ({
  transactions,
  next,
  nextUrl,
  rowsCount,
  accounts,
  categories,
  payees
}) => {
  const {
    query: { account: accountid }
  } = useRouter();

  const account = accounts?.find((a) => a?.id === accountid);

  return (
    <Grid overflowY="hidden">
      <Head>
        <title>Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/">Home</Link>
      <Link href="/accounts">Accounts</Link>
      <Link href={`/accounts/${accountid}`}>
        <Heading>{account?.name || 'Unknown Account'}</Heading>
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
        linkCategory
      />
    </Grid>
  );
};

Account.propTypes = {
  transactions: PropTypes.array,
  next: PropTypes.string,
  nextUrl: PropTypes.string,
  rowsCount: PropTypes.number.isRequired,
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array
};

Account.defaultProps = {
  transactions: [],
  next: null,
  nextUrl: null,
  accounts: [],
  categories: [],
  payees: []
};

export default Account;
