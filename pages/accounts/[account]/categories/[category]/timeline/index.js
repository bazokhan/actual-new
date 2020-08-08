/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import Head from 'next/head';
import {
  Grid,
  Heading,
  Text,
  Flex,
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { TYPES, query, loadAll } from 'libs/query';
import prefetch from 'libs/prefetch';
import Link from 'components/Link';
import { useState } from 'react';
import TransactionsTable from 'components/TransactionsTable';

export const getServerSideProps = async ({ params: { account, category } }) => {
  try {
    const { data, next, nextUrl } = await query('transactions', {
      where: [
        { column: 'acct', type: TYPES.EXACT, value: account },
        { column: 'category', type: TYPES.EXACT, value: category },
        { column: 'tombstone', type: TYPES.EXACT, value: 0 }
      ]
    });

    const { data: allTransactions } = await loadAll(data, next, nextUrl);

    const { accounts, categories, payees } = await prefetch();
    return {
      props: {
        accounts,
        transactions: data,
        categories,
        payees,
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
        transactions: [],
        accounts: [],
        categories: [],
        payees: []
      }
    };
  }
};

const Home = ({ accounts, dates, categories, payees }) => {
  const {
    query: { account: accountid, category: categoryid }
  } = useRouter();

  const scale = Math.max(
    ...Object.keys(dates).map((year) => {
      const yearAmount = dates[year].transactions?.reduce(
        (prev, t) => prev + t.amount,
        0
      );
      return Math.abs(yearAmount) / 1000;
    })
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTransactions, setActiveTransactions] = useState([]);
  return (
    <>
      <Modal
        size="full"
        isOpen={isOpen}
        onClose={() => {
          setActiveTransactions([]);
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <TransactionsTable
              account={accounts.find((a) => a.id === accountid)}
              accounts={accounts}
              categories={categories}
              payees={payees}
              rowsCount={activeTransactions.length}
              transactions={activeTransactions}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Grid overflowY="hidden">
        <Head>
          <title>Account</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Link href="/">Home</Link>
        <Link href={`/accounts/${accountid}`}>
          <Heading>
            {accounts?.find((a) => a.id === accountid)?.name ||
              'Unknown Account'}
            /
            {categories?.find((c) => c.id === categoryid)?.name ||
              'Unknown Category'}
          </Heading>
        </Link>
        <Flex flexDirection="column" overflowY="auto">
          {Object.keys(dates).map((year) => {
            const yearAmount = dates[year].transactions?.reduce(
              (prev, t) => prev + t.amount,
              0
            );
            return year === 'transactions' ? null : (
              <Flex flexDirection="column">
                <Grid gridTemplateColumns="70px 1fr 120px 120px">
                  <Text>{year}</Text>
                  <Box
                    width={`${Math.abs(yearAmount) / scale}px`}
                    height={5}
                    bg="teal.400"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    variantColor="teal"
                    onClick={() => {
                      setActiveTransactions(dates[year].transactions);
                      onOpen();
                    }}
                  >
                    {dates[year].transactions?.length} transactions
                  </Button>
                  <Text>{(yearAmount / 100).toFixed(2)} EGP</Text>
                </Grid>
                {Object.keys(dates[year])
                  .sort()
                  .map((month) => {
                    const monthAmount = dates[year][month].transactions?.reduce(
                      (prev, t) => prev + t.amount,
                      0
                    );
                    return month === 'transactions' ? null : (
                      <Grid gridTemplateColumns="70px 1fr 120px 120px">
                        <Text>{month}</Text>
                        <Box
                          width={`${Math.abs(monthAmount) / scale}px`}
                          height={5}
                          bg="purple.400"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          variantColor="purple"
                          onClick={() => {
                            setActiveTransactions(
                              dates[year][month].transactions
                            );
                            onOpen();
                          }}
                        >
                          {dates[year][month].transactions?.length} transactions
                        </Button>
                        <Text>{(monthAmount / 100).toFixed(2)} EGP</Text>
                      </Grid>
                    );
                  })}
              </Flex>
            );
          })}
        </Flex>
      </Grid>
    </>
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
