import PropTypes from 'prop-types';
import Head from 'next/head';
import { Heading, Button } from '@chakra-ui/core';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { TYPES, query, rawQuery } from '../../libs/query';

import { Table, TBody, TBodyTR, TBodyTD } from '../../components/Table/Table';
import Link from '../../components/Link';

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

const usePagination = ({ data, initialNext, initialUrl, rowsCount }) => {
  const [index, setIndex] = useState(0);
  const [dataState, setDataState] = useState(data);
  const [next, setNext] = useState(initialNext);
  const [nextUrl, setNextUrl] = useState(initialUrl);
  const [activePageData, setActivePageData] = useState(data);

  const fetchMore = useCallback(async () => {
    try {
      const {
        data: fetchMoreData,
        next: newNext,
        nextUrl: newUrl
      } = await rawQuery(nextUrl);
      if (fetchMoreData) {
        setDataState([...dataState, ...fetchMoreData]);
      }
      setNext(newNext);
      setNextUrl(newUrl);
    } catch (err) {
      console.log(err);
    }
  }, [dataState, nextUrl]);

  const getNextPage = useCallback(async () => {
    const newIndex = index + 1;
    const targetDataLength = newIndex * 100 + 100;
    if (next && dataState.length <= targetDataLength) {
      await fetchMore();
    }
    setIndex(newIndex);
  }, [index, next, dataState.length, fetchMore]);

  const getPrevPage = useCallback(async () => {
    setIndex(index - 1);
  }, [index]);

  const getFirstPage = async () => {
    setIndex(0);
  };

  const getLastPage = async () => {
    setIndex(Math.floor(rowsCount / 100));
  };
  const pageNumber = useMemo(() => index + 1, [index]);

  useEffect(() => {
    setActivePageData(
      dataState
        .map((t, originalIndex) => ({ ...t, index: originalIndex }))
        .slice(index * 100, (index + 1) * 100)
    );
  }, [index, dataState]);

  const disableNextPageButton = useMemo(() => index * 100 + 100 >= rowsCount, [
    index,
    rowsCount
  ]);
  const disablePrevPageButton = useMemo(() => index <= 0, [index]);
  const isFirstPage = useMemo(() => index === 0, [index]);
  const isLastPage = useMemo(() => index === Math.floor(rowsCount / 100), [
    index,
    rowsCount
  ]);

  return {
    activePageData,
    pageNumber,
    disableNextPageButton,
    disablePrevPageButton,
    isFirstPage,
    isLastPage,
    getLastPage,
    getFirstPage,
    getPrevPage,
    getNextPage
  };
};

const Home = ({ transactions, next, nextUrl, rowsCount }) => {
  const {
    activePageData,
    pageNumber,
    getLastPage,
    getFirstPage,
    getPrevPage,
    getNextPage,
    disableNextPageButton,
    disablePrevPageButton,
    isFirstPage,
    isLastPage
  } = usePagination({
    data: transactions,
    initialNext: next,
    initialUrl: nextUrl,
    rowsCount
  });

  return (
    <div>
      <Head>
        <title>Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/">Home</Link>
      <Heading as="h2">
        {activePageData?.length} transactions of {rowsCount} total transactions
      </Heading>
      <Heading as="h6">page number {pageNumber}</Heading>
      <Button isDisabled={disableNextPageButton} onClick={getNextPage}>
        Next
      </Button>
      <Button isDisabled={disablePrevPageButton} onClick={getPrevPage}>
        Previous
      </Button>
      <Button isDisabled={isFirstPage} onClick={getFirstPage}>
        First Page
      </Button>
      <Button isDisabled={isLastPage} onClick={getLastPage}>
        Last Page
      </Button>
      <Table>
        <TBody>
          {activePageData?.map?.((transaction) => (
            <TBodyTR key={transaction.id}>
              <TBodyTD>{(transaction.index + 1).toString()}</TBodyTD>
              <TBodyTD>{transaction.amount}</TBodyTD>
              <TBodyTD>{transaction.category || 'Uncategorized'}</TBodyTD>
            </TBodyTR>
          ))}
        </TBody>
      </Table>
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
