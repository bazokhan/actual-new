import PropTypes from 'prop-types';
import { Text } from '@chakra-ui/core';
import Link from './Link';

const AccountSectionLink = ({ account, section }) => (
  <Link href={`/accounts/${account.id}/${section.url}`}>
    <Text m="0" color="blue.400">
      {section.name}
    </Text>
  </Link>
);

AccountSectionLink.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  section: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string
  }).isRequired
};

export default AccountSectionLink;
