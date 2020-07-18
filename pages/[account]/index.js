import Head from "next/head";
import {
  List,
  ListItem,
  Heading,
  Tag,
  ThemeProvider,
  theme,
} from "@chakra-ui/core";
import { TYPES, query, SHAPES } from "../../libs/query";

export const getServerSidePaths = async () => {
  const { accounts } = await query("accounts", {
    shape: SHAPES.ARRAY,
  });
  return {
    paths: accounts?.map((account) => `/${account.id}`) || [],
    fallback: false,
  };
};
export const getServerSideProps = async ({ params: { account } }) => {
  try {
    const { data } = await query("transactions", {
      shape: SHAPES.ARRAY,
      where: [
        { column: "acct", type: TYPES.EXACT, value: account },
        { column: "tombstone", type: TYPES.EXACT, value: 0 },
      ],
      labels: ["acct"],
    });
    return {
      props: {
        transactions: data,
      },
    };
  } catch {
    return {
      props: {
        transactions: [],
      },
    };
  }
};

const Home = ({ transactions }) => {
  return (
    <div>
      <Head>
        <title>Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <Heading>{transactions?.length} transactions</Heading>
        <List>
          {transactions?.map?.((transaction) => (
            <ListItem key={transaction.id}>
              <Heading>{transaction?.amount}</Heading>
              <Tag>{transaction?.category || "Uncategorized"}</Tag>
            </ListItem>
          ))}
        </List>
      </ThemeProvider>
    </div>
  );
};

export default Home;
