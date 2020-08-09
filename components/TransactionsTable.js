import PropTypes from 'prop-types';
import { Grid, Button, Text, Select, FormLabel, Flex } from '@chakra-ui/core';
import { useEffect, useState } from 'react';
import TransactionHeader from './TransactionHeader';
import TransactionRow from './TransactionRow';
import usePagination from '../hooks/usePagination';
import { loadAll } from '../libs/query';

const TransactionsTable = ({
  transactions,
  next,
  nextUrl,
  accounts,
  categories,
  payees,
  rowsCount,
  linkCategory,
  linkPayee,
  account
}) => {
  const [tableSize, setTableSize] = useState(50);

  const {
    activePageData,
    pageNumber,
    totalPagesNumber,
    getLastPage,
    getFirstPage,
    getPrevPage,
    getNextPage,
    disableNextPageButton,
    disablePrevPageButton,
    isFirstPage,
    isLastPage,
    setDataState,
    setLoadedAll
  } = usePagination({
    data: transactions,
    initialNext: next,
    initialUrl: nextUrl,
    rowsCount,
    tableSize
  });

  useEffect(() => {
    const load = async () => {
      const { data: allTransactions } = await loadAll(
        transactions,
        next,
        nextUrl
      );
      setDataState(allTransactions);
      setLoadedAll(true);
    };
    load();
  }, [next, nextUrl, setDataState, setLoadedAll, transactions]);

  return (
    <Grid
      border="solid 1px #eee"
      borderRadius="5px"
      overflowY="hidden"
      gridTemplateRows="auto 1fr"
    >
      <TransactionHeader account={account} />
      <Grid overflowY="auto">
        {activePageData?.map?.((transaction, index) => {
          const acc = accounts?.find((a) => a?.id === transaction.acct);
          const payee = payees?.find((p) => p?.id === transaction.description);
          const category = categories?.find(
            (c) => c?.id === transaction.category
          );

          return (
            <TransactionRow
              key={transaction?.id}
              index={index}
              transaction={transaction}
              account={acc}
              category={category}
              // Special for payee only
              payee={{
                ...payee,
                transferAccount: accounts?.find(
                  (a) => a.id === payee.transfer_acct
                )
              }}
              linkCategory={linkCategory}
              linkPayee={linkPayee}
            />
          );
        })}
      </Grid>
      <Flex
        direction="column"
        borderTop="solid 1px #eee"
        paddingTop="5px"
        alignItems="center"
      >
        <Grid
          gridTemplateColumns="repeat(7, auto)"
          alignItems="center"
          width="fit-content"
          margin="0 auto"
        >
          <Button
            variant="ghost"
            variantColor="blue"
            isDisabled={isFirstPage}
            onClick={getFirstPage}
          >
            First Page
          </Button>
          <Button
            variant="ghost"
            variantColor="blue"
            isDisabled={disablePrevPageButton}
            onClick={getPrevPage}
          >
            Previous
          </Button>
          <Text p="5px 20px">
            {pageNumber} / {totalPagesNumber}
          </Text>
          <Button
            variant="ghost"
            variantColor="blue"
            isDisabled={disableNextPageButton}
            onClick={getNextPage}
          >
            Next
          </Button>
          <Button
            variant="ghost"
            variantColor="blue"
            isDisabled={isLastPage}
            onClick={getLastPage}
          >
            Last Page
          </Button>
          <FormLabel
            paddingBottom="0"
            htmlFor="items"
            fontWeight="100"
            fontSize="12px"
          >
            Show:
          </FormLabel>
          <Select
            name="items"
            value={tableSize}
            onChange={(e) => {
              setTableSize(e.target.value);
              getFirstPage();
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </Select>
        </Grid>
        <Text margin="0 auto 5px" fontSize="14px" color="gray.700">
          transactions from {activePageData?.[0]?.index + 1} to{' '}
          {activePageData?.[activePageData.length - 1]?.index + 1} out of total{' '}
          {rowsCount} transactions
        </Text>
      </Flex>
    </Grid>
  );
};

TransactionsTable.propTypes = {
  transactions: PropTypes.array,
  next: PropTypes.string,
  nextUrl: PropTypes.string,
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array,
  rowsCount: PropTypes.number,
  linkCategory: PropTypes.bool,
  linkPayee: PropTypes.bool,
  account: PropTypes.shape({
    id: PropTypes.string
  }).isRequired
};

TransactionsTable.defaultProps = {
  transactions: [],
  next: null,
  nextUrl: null,
  accounts: [],
  categories: [],
  payees: [],
  rowsCount: 0,
  linkCategory: false,
  linkPayee: false
};

export default TransactionsTable;
