/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { Flex, Text } from '@chakra-ui/core';

const MoneyText = ({ title, amount, unitColor, ...props }) => {
  const amountString = (amount / 100).toFixed(2).toString();
  const [pounds, pennies] = amountString.split('.');
  return (
    <Flex
      justifyContent={title ? 'space-between' : 'flex-end'}
      justifySelf="end"
      alignItems="center"
      {...props}
    >
      {title ? (
        <Text
          marginRight="15px"
          fontWeight="100"
          color={unitColor || 'gray.600'}
        >
          {title}:
        </Text>
      ) : null}
      <Text
        fontWeight="500"
        color={amount > 0 ? 'teal.500' : amount < 0 ? 'pink.500' : 'gray.500'}
      >
        {pounds.slice(0, -3).length
          ? pounds.slice(0, -3) === '-'
            ? `${pounds}.${pennies}`
            : `${pounds.slice(0, -3)},${pounds.slice(-3)}.${pennies}`
          : `${pounds.slice(-3)}.${pennies}`}
      </Text>
      <Text
        marginLeft="5px"
        fontWeight="100"
        fontSize="12px"
        color={unitColor || 'gray.600'}
      >
        EGP
      </Text>
    </Flex>
  );
};

MoneyText.propTypes = {
  title: PropTypes.string,
  amount: PropTypes.number.isRequired,
  unitColor: PropTypes.string
};

MoneyText.defaultProps = {
  title: null,
  unitColor: null
};

export default MoneyText;
