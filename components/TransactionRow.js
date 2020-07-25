import { Grid, Text } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import Link from './Link';

const TransactionRow = ({
  index,
  transaction,
  account,
  category,
  payee,
  linkCategory
}) => (
  <Grid
    key={transaction.id}
    gridTemplateColumns="60px 1fr 1fr 1fr 1fr"
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
      {transaction.amount}
    </Text>
    <Text
      p="10px 20px 10px 10px"
      textAlign="right"
      borderRight="solid 1px #333"
    >
      {payee?.name || 'No Payee'}
    </Text>
    {linkCategory && account && category ? (
      <Link href={`/${account.id}/${category.id}`} textAlign="right">
        {category.name}
      </Link>
    ) : (
      <Text p="10px" textAlign="right">
        {category?.name || 'Uncategorized'}
      </Text>
    )}
  </Grid>
);

TransactionRow.propTypes = {
  index: PropTypes.number.isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.string,
    index: PropTypes.number,
    amount: PropTypes.number
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
  linkCategory: PropTypes.bool
};

TransactionRow.defaultProps = {
  account: null,
  category: null,
  payee: null,
  linkCategory: false
};

export default TransactionRow;