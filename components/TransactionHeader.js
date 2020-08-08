import { Grid, Text } from '@chakra-ui/core';
import Link from 'components/Link';

const TransactionHeader = ({ account }) => (
  <Grid gridTemplateColumns="60px 1fr 1fr 1fr 1fr 1fr">
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
    <Link href={`/accounts/${account?.id}/categories`}>
      <Text p="10px" textAlign="center" borderRight="solid 1px #333">
        Category
      </Text>
    </Link>
    <Link href={`/accounts/${account?.id}/dates`}>
      <Text p="10px" textAlign="center">
        Date
      </Text>
    </Link>
  </Grid>
);

export default TransactionHeader;
