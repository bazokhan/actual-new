/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Grid, Heading, Avatar, Text, Flex } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import Link from 'components/Link';

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

const Home = ({ accounts, categories }) => {
  const {
    query: { account: accountid, year, month }
  } = useRouter();

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
      <Link href={`/accounts/${accountid}/dates/${year}/${month}`}>
        Transactions Table
      </Link>
      <Flex wrap="wrap">
        {categories?.map((category) => (
          <Link
            d="flex"
            flexDirection="column"
            margin="10px"
            p="20px"
            justifyContent="center"
            alignItems="center"
            border="solid 1px #333"
            borderRadius="5px"
            key={category.id}
            href={`/accounts/${accountid}/dates/${year}/${month}/categories/${category.id}`}
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
