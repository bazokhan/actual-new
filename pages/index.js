import Head from "next/head";
import {
  List,
  ListItem,
  Heading,
  Avatar,
  Tag,
  ThemeProvider,
  theme,
} from "@chakra-ui/core";

export const getServerSideProps = async () => {
  try {
    const { error, table, data } = await query("accounts");
    return {
      props: {
        accounts: data,
      },
    };
  } catch {
    return {
      props: {
        accounts: [],
      },
    };
  }
};

const query = async (url) => {
  try {
    const res = await fetch(`http://localhost:8001/db/${url}.json`);
    const resData = await res?.json?.();
    const { table, columns, rows, next, next_url } = resData;
    const data = rows.reduce((prev, row) => {
      const record = columns.reduce((record, key, index) => {
        record[key] = row[index];
        return record;
      }, {});
      return [...prev, record];
    }, []);
    return { table, data, next, next_url, error: null };
  } catch (error) {
    return { error };
  }
};

export default function Home({ accounts }) {
  return (
    <div>
      <Head>
        <title>Actual</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <List>
          {accounts.map((account) => (
            <ListItem key={account.id}>
              <Avatar name={account?.name} src={account?.image} />
              <Heading>{account?.name}</Heading>
              <Tag>{account?.type}</Tag>
            </ListItem>
          ))}
        </List>
      </ThemeProvider>
    </div>
  );
}
