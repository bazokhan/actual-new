import { Grid, Text } from '@chakra-ui/core';

const TransactionHeader = () => (
  <Grid gridTemplateColumns="60px 1fr 1fr 1fr 1fr">
    <Text p="10px" borderRight="solid 1px #333" textAlign="center">
      #
    </Text>
    <Text
      p="10px 20px 10px 10px"
      borderRight="solid 1px #333"
      textAlign="center"
    >
      Account
    </Text>
    <Text p="10px" borderRight="solid 1px #333" textAlign="center">
      Amount
    </Text>
    <Text
      p="10px 20px 10px 10px"
      borderRight="solid 1px #333"
      textAlign="center"
    >
      Payee
    </Text>
    <Text p="10px" textAlign="center">
      Category
    </Text>
  </Grid>
);

export default TransactionHeader;
