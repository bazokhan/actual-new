/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { Flex, Avatar, Text } from '@chakra-ui/core';
import Link from './Link';
import TransactionsButton from './TransactionsButton';
import MoneyText from './MoneyText';

const TransactionFieldCard = ({
  name,
  noAvatar,
  url,
  transactions,
  transactionsTableProps,
  ...props
}) => {
  const amount = transactions.reduce((prev, t) => prev + t.amount, 0);
  return (
    <Flex
      width="200px"
      margin="10px"
      p="20px"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      boxShadow="0 3px 3px 0 rgba(0, 0, 0, 0.16)"
      borderRadius="5px"
      bg={amount < 0 ? 'pink.50' : amount > 0 ? 'teal.50' : 'gray.50'}
      {...props}
    >
      {url ? (
        <Link
          d="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          href={url}
        >
          {noAvatar ? null : <Avatar name={name} src="" />}
          <Text my="10px">{name}</Text>
        </Link>
      ) : (
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          href={url}
        >
          {noAvatar ? null : <Avatar name={name} src="" />}
          <Text my="10px">{name}</Text>
        </Flex>
      )}

      {transactionsTableProps ? (
        <TransactionsButton
          transactions={transactions}
          {...transactionsTableProps}
        >
          {transactions.length} transactions
        </TransactionsButton>
      ) : (
        <Text>{transactions.length} transactions</Text>
      )}
      <MoneyText amount={amount} />
    </Flex>
  );
};

TransactionFieldCard.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
  transactions: PropTypes.array,
  transactionsTableProps: PropTypes.shape({
    account: PropTypes.shape({ id: PropTypes.string }),
    accounts: PropTypes.array,
    categories: PropTypes.array,
    payees: PropTypes.array
  }),
  noAvatar: PropTypes.bool
};

TransactionFieldCard.defaultProps = {
  url: null,
  transactions: [],
  transactionsTableProps: null,
  noAvatar: false
};

export default TransactionFieldCard;
