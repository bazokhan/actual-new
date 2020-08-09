import PropTypes from 'prop-types';
import { useRef } from 'react';
import { Flex, Box } from '@chakra-ui/core';

const Bar = ({ amount, max, color }) => {
  const fullWidthRef = useRef();
  const scale = 600;
  return (
    <Flex
      width="100%"
      ref={fullWidthRef}
      bg="gray.200"
      borderRadius="30px"
      overflow="hidden"
    >
      <Box
        width={`${(amount / max) * scale}px`}
        height={5}
        bg={color}
        borderRadius="30px"
      />
    </Flex>
  );
};

Bar.propTypes = {
  amount: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  color: PropTypes.string
};

Bar.defaultProps = {
  color: 'blue.400'
};

export default Bar;
