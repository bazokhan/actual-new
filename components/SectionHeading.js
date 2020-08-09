/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { Heading, Flex, Icon } from '@chakra-ui/core';

const SectionHeading = ({ children, ...props }) => (
  <Flex
    justifyContent="start"
    alignItems="center"
    my="10px"
    p="20px"
    boxShadow="md"
  >
    <Icon
      color="blue.600"
      marginRight="10px"
      name="info-outline"
      fontSize="22px"
    />
    <Heading fontSize="24px" color="blue.600" {...props}>
      {children}
    </Heading>
  </Flex>
);

SectionHeading.propTypes = {
  children: PropTypes.node.isRequired
};

export default SectionHeading;
