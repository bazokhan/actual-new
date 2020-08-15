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

const TransactionHeader = ({ account, skipList }) => (
  <Grid gridTemplateColumns={`60px repeat(${6 - skipList.length}, 1fr)`}>
    <TableText>#</TableText>
    {skipList.includes('account') ? null : (
      <Link href="/accounts">
        <TableText>Account</TableText>
      </Link>
    )}
    {skipList.includes('amount') ? null : <TableText>Amount</TableText>}
    {skipList.includes('payee') ? null : (
      <Link href={`/accounts/${account?.id}/payees`}>
        <TableText>Payee</TableText>
      </Link>
    )}
    {skipList.includes('category') ? null : (
      <Link href={`/accounts/${account?.id}/categories`}>
        <TableText>Category</TableText>
      </Link>
    )}
    {skipList.includes('notes') ? null : <TableText>Notes</TableText>}
    {skipList.includes('date') ? null : (
      <Link href={`/accounts/${account?.id}/dates`}>
        <TableText>Date</TableText>
      </Link>
    )}
  </Grid>
);

TransactionHeader.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  skipList: PropTypes.array.isRequired
};

export default TransactionHeader;
