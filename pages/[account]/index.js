import PropTypes from 'prop-types';
import Head from 'next/head';
import {
  Heading,
  ThemeProvider,
  theme,
  Button,
  CSSReset
} from '@chakra-ui/core';
import { useState, useEffect } from 'react';
import { TYPES, query, SHAPES, rawQuery } from '../../libs/query';

import { Table, TBody, TBodyTR, TBodyTD } from '../../components/Table/Table';

export const getServerSidePaths = async () => {
  const { accounts } = await query('accounts', {
    shape: SHAPES.ARRAY
  });
  return {
    paths: accounts?.map((account) => `/${account.id}`) || [],
    fallback: false
  };
};
export const getServerSideProps = async ({ params: { account } }) => {
  try {
    const { data, next, nextUrl, rowsCount } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 }
      ]
    });
    return {
      props: {
        transactions: data,
        next,
        nextUrl,
        rowsCount
      }
    };
  } catch {
    return {
      props: {
        transactions: []
      }
    };
  }
};

// const usePagination = () => {};

const Home = ({
  transactions: initialTransactions,
  next: initialNext,
  nextUrl: initialUrl,
  rowsCount
}) => {
  const [index, setIndex] = useState(0);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [next, setNext] = useState(initialNext);
  const [nextUrl, setNextUrl] = useState(initialUrl);
  const [activeTransactions, setActiveTransactions] = useState(
    initialTransactions
  );

  const fetchMore = async () => {
    try {
      const { data, next: newNext, next_url: newUrl } = await rawQuery(nextUrl);
      if (data) {
        setTransactions([...transactions, ...data]);
      }
      setNext(newNext);
      setNextUrl(newUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const getNextPage = async () => {
    const newIndex = index + 1;
    const targetDataLength = newIndex * 100 + 100;
    if (next && transactions.length <= targetDataLength) {
      await fetchMore();
    }
    setIndex(newIndex);
  };

  const getPrevPage = async () => {
    setIndex(index - 1);
  };

  const getFirstPage = async () => {
    setIndex(0);
  };

  const getLastPage = async () => {
    setIndex(Math.floor(rowsCount / 100));
  };

  useEffect(() => {
    setActiveTransactions(transactions.slice(index * 100, (index + 1) * 100));
  }, [index, transactions]);

  return (
    <div>
      <Head>
        <title>Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Heading as="h2">
          {activeTransactions?.length} transactions of {rowsCount} total
          transactions
        </Heading>
        <Heading as="h6">page number {index + 1}</Heading>
        <Button
          isDisabled={index * 100 + 100 >= rowsCount}
          onClick={getNextPage}
        >
          Next
        </Button>
        <Button isDisabled={index <= 0} onClick={getPrevPage}>
          Previous
        </Button>
        <Button isDisabled={index === 0} onClick={getFirstPage}>
          First Page
        </Button>
        <Button
          isDisabled={index === Math.floor(rowsCount / 100)}
          onClick={getLastPage}
        >
          Last Page
        </Button>
        <Table>
          <TBody>
            {activeTransactions?.map?.((transaction) => (
              <TBodyTR key={transaction.id}>
                <TBodyTD>{transaction?.amount}</TBodyTD>
                <TBodyTD>{transaction?.category || 'Uncategorized'}</TBodyTD>
              </TBodyTR>
            ))}
          </TBody>
        </Table>
      </ThemeProvider>
    </div>
  );
};

Home.propTypes = {
  transactions: PropTypes.array,
  next: PropTypes.string,
  nextUrl: PropTypes.string,
  rowsCount: PropTypes.number.isRequired
};

Home.defaultProps = {
  transactions: [],
  next: null,
  nextUrl: null
};

export default Home;
