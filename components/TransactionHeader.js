import PropTypes from 'prop-types';
import { Grid, Text } from '@chakra-ui/core';
import Link from 'components/Link';

const TableText = ({ children }) => (
  <Text
    p="5px"
    borderRight="solid 1px #eee"
    textAlign="center"
    color="gray.400"
  >
    {children}
  </Text>
);

TableText.propTypes = {
  children: PropTypes.node.isRequired
};

const TransactionHeader = ({ account }) => (
  <Grid gridTemplateColumns="60px 1fr 1fr 1fr 1fr 1fr">
    <TableText>#</TableText>
    <Link href="/accounts">
      <TableText>Account</TableText>
    </Link>
    <TableText>Amount</TableText>
    <Link href={`/accounts/${account?.id}/payees`}>
      <TableText>Payee</TableText>
    </Link>
    <Link href={`/accounts/${account?.id}/categories`}>
      <TableText>Category</TableText>
    </Link>
    <Link href={`/accounts/${account?.id}/dates`}>
      <TableText>Date</TableText>
    </Link>
  </Grid>
);

TransactionHeader.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string
  }).isRequired
};

export default TransactionHeader;
