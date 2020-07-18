/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/core';

const Link = ({ href, children, ...props }) => (
  <NextLink href={href}>
    <ChakraLink as="a" {...props}>
      {children}
    </ChakraLink>
  </NextLink>
);

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default Link;
