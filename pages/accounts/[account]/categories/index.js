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

    const { accounts, categories } = await prefetch();
    return {
      props: {
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
        }))
      }
    };
  } catch {
    return {
      props: {
        categories: [],
        accounts: []
      }
    };
  }
};

const Home = ({ accounts, categories }) => {
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
      <Flex wrap="wrap">
        {categories?.map((category) => (
          <Link
            margin="10px"
            p="20px"
            d="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            border="solid 1px #333"
            borderRadius="5px"
            key={category.id}
            href={`/accounts/${accountid}/categories/${category.id}`}
          >
            <Avatar name={category?.name} src={category?.image} />
            <Text>{category.name}</Text>
            <Text>{category.transactions.length} transactions</Text>
            <Text>
              {(
                category.transactions.reduce((prev, t) => prev + t.amount, 0) /
                100
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
  categories: PropTypes.array
};

Home.defaultProps = {
  accounts: [],
  categories: []
};

export default Home;
