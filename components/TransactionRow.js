/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import { Grid, Text } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import Link from './Link';
import MoneyText from './MoneyText';
import DateText from './DateText';

const TableText = ({ children, ...props }) => (
  <Text
    d="flex"
    justifyContent="flex-end"
    alignItems="center"
    p="5px 10px"
    borderRight="solid 1px #eee"
    textAlign="right"
    color="gray.700"
    fontSize="15px"
    {...props}
  >
    {children}
  </Text>
);

TableText.propTypes = {
  children: PropTypes.node.isRequired
};

const TransactionRow = ({
  index,
  transaction,
  account,
  category,
  payee,
  linkCategory,
  linkPayee,
  skipList,
  ...props
}) => (
  <Grid
    key={transaction.id}
    gridTemplateColumns={`60px repeat(${6 - skipList.length}, 1fr)`}
    alignItems="center"
    bg={index % 2 === 0 ? 'rgba(0, 0, 0, 0.04)' : '#fff'}
    {...props}
  >
    <TableText>
      {transaction.index + 1 ? (transaction.index + 1).toString() : '-'}
    </TableText>
    {skipList.includes('account') ? null : (
      <TableText>{account?.name || 'No Account'}</TableText>
    )}
    {skipList.includes('amount') ? null : (
      <MoneyText amount={transaction.amount || 0} />
    )}
    {skipList.includes('payee') ? null : linkPayee && account && payee ? (
      <Link href={`/accounts/${account.id}/payees/${payee.id}`}>
        <TableText>
          {/* Special for payee only */}
          {payee.name ||
            payee.transferAccount?.name ||
            transaction?.payeeName ||
            'Unknown Payee'}
        </TableText>
      </Link>
    ) : (
      <TableText>
        {/* Special for payee only */}
        {payee.name ||
          payee.transferAccount?.name ||
          transaction?.payeeName ||
          'Unknown Payee'}
      </TableText>
    )}
    {skipList.includes('category') ? null : linkCategory &&
      account &&
      category ? (
      <Link href={`/accounts/${account.id}/categories/${category.id}`}>
        <TableText>{category.name}</TableText>
      </Link>
    ) : (
      <TableText>{category?.name || 'Uncategorized'}</TableText>
    )}
    {skipList.includes('notes') ? null : (
      <Text textAlign="right">{transaction?.notes}</Text>
    )}
    {skipList.includes('date') ? null : <DateText date={transaction?.date} />}
  </Grid>
);

TransactionRow.propTypes = {
  index: PropTypes.number.isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.string,
    index: PropTypes.number,
    amount: PropTypes.number,
    date: PropTypes.number,
    notes: PropTypes.string,
    payeeName: PropTypes.string
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
    name: PropTypes.string,
    transferAccount: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  }),
  linkCategory: PropTypes.bool,
  linkPayee: PropTypes.bool,
  skipList: PropTypes.array.isRequired
};

TransactionRow.defaultProps = {
  account: null,
  category: null,
  payee: null,
  linkCategory: false,
  linkPayee: false
};

export default TransactionRow;
