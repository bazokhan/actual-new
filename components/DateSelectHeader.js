import PropTypes from 'prop-types';
import { Flex, Button, Text } from '@chakra-ui/core';

const DateSelectHeader = ({
  dates,
  activeYear,
  activeMonth,
  setActiveYear,
  setActiveMonth
}) => (
  <Flex justifyContent="center" alignItems="center">
    <Text marginRight="20px">Select a year:</Text>
    {Object.keys(dates).map((year) => (
      <Button
        variant={activeYear === year ? 'solid' : 'outline'}
        variantColor={activeYear === year ? 'blue' : 'gray'}
        width="auto"
        key={year}
        onClick={() => {
          setActiveMonth(null);
          setActiveYear(activeYear === year ? null : year);
        }}
      >
        {year}
      </Button>
    ))}
    {activeYear ? (
      <>
        <Text mx="20px">Select a month</Text>
        {Object.keys(dates[activeYear])
          .sort()
          .map((month) =>
            month === 'transactions' ||
            month === 'categories' ||
            month === 'payees' ? null : (
              <Button
                variant={activeMonth === month ? 'solid' : 'outline'}
                variantColor={activeMonth === month ? 'blue' : 'gray'}
                width="auto"
                key={month}
                onClick={() =>
                  setActiveMonth(activeMonth === month ? null : month)
                }
              >
                {month}
              </Button>
            )
          )}
      </>
    ) : null}
  </Flex>
);

DateSelectHeader.propTypes = {
  dates: PropTypes.object.isRequired,
  activeYear: PropTypes.string,
  activeMonth: PropTypes.string,
  setActiveYear: PropTypes.func.isRequired,
  setActiveMonth: PropTypes.func.isRequired
};

DateSelectHeader.defaultProps = {
  activeYear: null,
  activeMonth: null
};

export default DateSelectHeader;
