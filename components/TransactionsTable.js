import { Grid, Button, Text, Select, FormLabel } from '@chakra-ui/core';
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
  linkCategory
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
      p="20px"
      border="solid 1px #333"
      borderRadius="15px"
      m="10px 40px"
      overflowY="hidden"
    >
      <TransactionHeader />
      <Grid overflowY="auto">
        {activePageData?.map?.((transaction, index) => {
          const account = accounts?.find((a) => a?.id === transaction.acct);
          const payee = payees?.find((p) => p?.id === transaction.description);
          const category = categories?.find(
            (c) => c?.id === transaction.category
          );

          return (
            <TransactionRow
              key={transaction?.id}
              index={index}
              transaction={transaction}
              account={account}
              category={category}
              payee={payee}
              linkCategory={linkCategory}
            />
          );
        })}
      </Grid>
      <Grid
        gridTemplateColumns="repeat(7, auto)"
        alignItems="center"
        width="fit-content"
        margin="0 auto"
      >
        <Button isDisabled={isFirstPage} onClick={getFirstPage}>
          First Page
        </Button>
        <Button isDisabled={disablePrevPageButton} onClick={getPrevPage}>
          Previous
        </Button>
        <Text p="5px 20px">
          {pageNumber} / {totalPagesNumber}
        </Text>
        <Button isDisabled={disableNextPageButton} onClick={getNextPage}>
          Next
        </Button>
        <Button isDisabled={isLastPage} onClick={getLastPage}>
          Last Page
        </Button>
        <FormLabel htmlFor="items">Show: </FormLabel>
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
      <Text margin="0 auto">
        transactions from {activePageData?.[0]?.index + 1} to{' '}
        {activePageData?.[activePageData.length - 1]?.index + 1} out of total{' '}
        {rowsCount} transactions
      </Text>
    </Grid>
  );
};

export default TransactionsTable;
