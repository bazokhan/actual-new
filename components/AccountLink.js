import PropTypes from 'prop-types';
import { Avatar, Heading } from '@chakra-ui/core';
import Link from './Link';

const AccountLink = ({ account }) => (
  <Link href={`/accounts/${account?.id}`} d="flex">
    <Avatar
      size="sm"
      marginRight="10px"
      name={account?.name || 'Unknown Account'}
    />
    <Heading fontSize="24px" m="0" marginRight="10px">
      {account?.name || 'Unknown Account'}
    </Heading>
  </Link>
);

AccountLink.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }).isRequired
};

export default AccountLink;
