import PropTypes from 'prop-types';
import { Text } from '@chakra-ui/core';

const EmptyText = ({ children }) => (
  <Text
    width="100%"
    height="100%"
    d="flex"
    justifyContent="center"
    alignItems="center"
    color="gray.500"
  >
    {children}
  </Text>
);

EmptyText.propTypes = {
  children: PropTypes.node.isRequired
};

export default EmptyText;
