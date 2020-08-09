import PropTypes from 'prop-types';
import { Grid, Text } from '@chakra-ui/core';

const DateText = ({ date }) => {
  if (!date) return <Text justifySelf="end">Undated</Text>;
  const dateString = date.toString();
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);
  return (
    <Grid
      justifySelf="end"
      gridTemplateColumns="1fr 1fr 2fr"
      columnGap="5px"
      width="fit-content"
    >
      <Text fontSize="10px" color="gray.400">
        DD
      </Text>
      <Text fontSize="10px" color="gray.400">
        MM
      </Text>
      <Text fontSize="10px" color="gray.400">
        YYYY
      </Text>
      <Text>{day}</Text>
      <Text>{month}</Text>
      <Text>{year}</Text>
    </Grid>
  );
};

DateText.propTypes = {
  date: PropTypes.number.isRequired
};

export default DateText;
