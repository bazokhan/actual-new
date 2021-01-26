import PropTypes from 'prop-types';
import { Flex, Grid, Button } from '@chakra-ui/core';
import SectionHeading from 'components/SectionHeading';
import { useState } from 'react';
import TransactionsTable from 'components/TransactionsTable';
import MoneyText from 'components/MoneyText';

const BalanceSheet = ({ account, transactions, categories }) => {
  const depositTransactions =
    transactions?.filter((t) => t.isDeposit && !t.isTransfer) || [];
  const depositCategories =
    categories?.filter((c) =>
      depositTransactions.some((t) => t.category === c.id)
    ) || [];
  const paymentTransactions =
    transactions?.filter((t) => t.isPayment && !t.isTransfer) || [];
  const paymentCategories =
    categories?.filter((c) =>
      paymentTransactions.some((t) => t.category === c.id)
    ) || [];

  const [selectedDepositCategories, setSelectedDepositCategories] = useState(
    depositCategories.map((c) => c.id)
  );
  const [selectedPaymentCategories, setSelectedPaymentCategories] = useState(
    paymentCategories.map((c) => c.id)
  );

  const deposits = depositTransactions
    .filter((t) => selectedDepositCategories.includes(t.category))
    .reduce((prev, t) => prev + t.amount, 0);
  const payments = paymentTransactions
    .filter((t) => selectedPaymentCategories.includes(t.category))
    .reduce((prev, t) => prev + t.amount, 0);

  return (
    <Grid gridTemplateColumns="auto 1fr 1fr auto" overflowY="hidden">
      <SectionHeading containerProps={{ gridColumn: '1 / 3' }}>
        Deposit
      </SectionHeading>
      <SectionHeading containerProps={{ gridColumn: '3 / 5' }}>
        Payments
      </SectionHeading>
      <Flex direction="column">
        <Button
          variantColor="teal"
          leftIcon="up-down"
          onClick={() =>
            setSelectedDepositCategories(
              selectedDepositCategories.length
                ? []
                : depositCategories.map((c) => c.id)
            )
          }
        >
          {selectedDepositCategories.length ? 'Deselect all' : 'Select all'}
        </Button>
        {depositCategories.map((category) => (
          <Button
            key={category.id}
            d="flex"
            justifyContent="flex-start"
            variantColor="teal"
            variant={
              selectedDepositCategories.includes(category.id)
                ? 'outline'
                : 'ghost'
            }
            leftIcon={
              selectedDepositCategories.includes(category.id)
                ? 'check-circle'
                : null
            }
            onClick={() =>
              setSelectedDepositCategories(
                selectedDepositCategories.includes(category.id)
                  ? selectedDepositCategories.filter((id) => id !== category.id)
                  : [...selectedDepositCategories, category.id]
              )
            }
          >
            {category.name}
          </Button>
        ))}
      </Flex>
      <TransactionsTable
        transactions={depositTransactions.filter((t) =>
          selectedDepositCategories.includes(t.category)
        )}
        rowsCount={
          depositTransactions.filter((t) =>
            selectedDepositCategories.includes(t.category)
          ).length
        }
        skipList={['account', 'payee', 'date']}
        categories={categories}
        account={account}
      />
      <TransactionsTable
        transactions={paymentTransactions.filter((t) =>
          selectedPaymentCategories.includes(t.category)
        )}
        rowsCount={
          paymentTransactions.filter((t) =>
            selectedPaymentCategories.includes(t.category)
          ).length
        }
        skipList={['account', 'payee', 'date']}
        categories={categories}
        account={account}
      />
      <Flex direction="column">
        <Button
          variantColor="pink"
          leftIcon="up-down"
          onClick={() =>
            setSelectedPaymentCategories(
              selectedPaymentCategories.length
                ? []
                : paymentCategories.map((c) => c.id)
            )
          }
        >
          {selectedPaymentCategories.length ? 'Deselect all' : 'Select all'}
        </Button>
        {paymentCategories.map((category) => (
          <Button
            key={category.id}
            d="flex"
            justifyContent="flex-start"
            variantColor="pink"
            variant={
              selectedPaymentCategories.includes(category.id)
                ? 'outline'
                : 'ghost'
            }
            leftIcon={
              selectedPaymentCategories.includes(category.id)
                ? 'check-circle'
                : null
            }
            onClick={() =>
              setSelectedPaymentCategories(
                selectedPaymentCategories.includes(category.id)
                  ? selectedPaymentCategories.filter((id) => id !== category.id)
                  : [...selectedPaymentCategories, category.id]
              )
            }
          >
            {category.name}
          </Button>
        ))}
      </Flex>
      <MoneyText
        gridColumn="1 / 3"
        width="100%"
        justifyContent="center"
        fontSize="20px"
        title="Total Deposit"
        amount={deposits}
      />
      <MoneyText
        gridColumn="3 / 5"
        width="100%"
        justifyContent="center"
        fontSize="20px"
        title="Total Payment"
        amount={payments}
      />
      <MoneyText
        gridColumn="1 /5"
        width="100%"
        justifyContent="center"
        fontSize="20px"
        title="Net"
        amount={deposits + payments}
      />
    </Grid>
  );
};

BalanceSheet.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  transactions: PropTypes.array,
  categories: PropTypes.array
};

BalanceSheet.defaultProps = {
  transactions: [],
  categories: []
};

export default BalanceSheet;
