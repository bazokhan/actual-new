import { Grid, Text } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import Link from './Link';

const TransactionRow = ({
  index,
  transaction,
  account,
  category,
  payee,
  linkCategory,
  linkPayee
}) => (
  <Grid
    key={transaction.id}
    gridTemplateColumns="60px 1fr 1fr 1fr 1fr 1fr"
    bg={index % 2 === 0 ? '#eee' : '#fff'}
  >
    <Text p="10px" borderRight="solid 1px #333" textAlign="center">
      {transaction.index + 1 ? (transaction.index + 1).toString() : '-'}
    </Text>
    <Text
      p="10px 20px 10px 10px"
      textAlign="right"
      borderRight="solid 1px #333"
    >
      {account?.name || 'No Account'}
    </Text>
    <Text
      p="10px 20px 10px 10px"
      textAlign="right"
      borderRight="solid 1px #333"
    >
      {`${(transaction.amount / 100).toFixed(2)} EGP`}
    </Text>
    {linkPayee && account && payee ? (
      <Link
        href={`/accounts/${account.id}/payees/${payee.id}`}
        textAlign="right"
        borderRight="solid 1px #333"
      >
        {payee.name}
      </Link>
    ) : (
      <Text
        p="10px 20px 10px 10px"
        textAlign="right"
        borderRight="solid 1px #333"
      >
        {payee?.name || 'No Payee'}
      </Text>
    )}
    {linkCategory && account && category ? (
      <Link
        href={`/accounts/${account.id}/categories/${category.id}`}
        textAlign="right"
        borderRight="solid 1px #333"
      >
        {category.name}
      </Link>
    ) : (
      <Text p="10px" textAlign="right" borderRight="solid 1px #333">
        {category?.name || 'Uncategorized'}
      </Text>
    )}
    <Text p="10px" textAlign="right">
      {transaction?.date || 'undated'}
    </Text>
  </Grid>
);

TransactionRow.propTypes = {
  index: PropTypes.number.isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.string,
    index: PropTypes.number,
    amount: PropTypes.number,
    date: PropTypes.number
  }).isRequired,
  account: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  category: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  payee: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  linkCategory: PropTypes.bool,
  linkPayee: PropTypes.bool
};

TransactionRow.defaultProps = {
  account: null,
  category: null,
  payee: null,
  linkCategory: false,
  linkPayee: false
};

export default TransactionRow;
