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

    const { accounts, payees } = await prefetch();
    return {
      props: {
        accounts,
        payees: (
          allTransactions?.reduce((prev, t) => {
            const payee = payees?.find((p) => t.description === p.id) || null;
            if (!payee || prev?.find((p) => p?.id === payee?.id)) {
              return prev;
            }
            return [...prev, payee];
          }, []) || []
        ).map((p) => ({
          ...p,
          transactions:
            allTransactions?.filter((t) => t.description === p.id) || []
        }))
      }
    };
  } catch {
    return {
      props: {
        payees: [],
        accounts: []
      }
    };
  }
};

const Home = ({ accounts, payees }) => {
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
      <Flex wrap="wrap" overflowY="auto">
        {payees?.map((payee) => (
          <Link
            margin="10px"
            p="20px"
            d="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            border="solid 1px #333"
            borderRadius="5px"
            key={payee.id}
            href={`/accounts/${accountid}/payees/${payee.id}`}
          >
            <Avatar name={payee?.name} src={payee?.image} />
            <Text>{payee.name}</Text>
            <Text>{payee.transactions.length} transactions</Text>
            <Text>
              {(
                payee.transactions.reduce((prev, t) => prev + t.amount, 0) / 100
              ).toFixed(2)}{' '}
              EGP
            </Text>
          </Link>
        ))}
      </Flex>
    </Grid>
  );
};

Home.propTypes = {
  accounts: PropTypes.array,
  payees: PropTypes.array
};

Home.defaultProps = {
  accounts: [],
  payees: []
};

export default Home;
