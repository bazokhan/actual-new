import Head from "next/head";
import { Heading, Tag, ThemeProvider, theme, Button } from "@chakra-ui/core";
import { useMemo } from "react";
import { TYPES, query, SHAPES, rawQuery } from "../../libs/query";
import { useState } from "react";
import { useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Text, useColorMode, CSSReset } from "@chakra-ui/core";

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
    const { data, next, next_url, filtered_table_rows_count } = await query(
      "transactions",
      {
        where: [
          { column: "acct", type: TYPES.EXACT, value: account },
          { column: "tombstone", type: TYPES.EXACT, value: 0 },
        ],
      }
    );
    return {
      props: {
        transactions: data,
        next,
        next_url,
        filtered_table_rows_count,
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

const cell = () => css`
  text-align: left;
  font-weight: 400;
  vertical-align: middle;
  padding: 5px;

  &:first-child {
    padding-left: 5px;
  }
  &:last-child {
    padding-right: 5px;
  }
`;

const Wrapper = styled("table")`
  width: 100%;
  max-width: 100%;
`;

const TRWrapper = styled("tr")`
  &:nth-of-type(odd) {
    background-color: #333;
  }
`;

const Table = ({ children }) => <Wrapper>{children}</Wrapper>;
const TBody = ({ children }) => <tbody>{children}</tbody>;
const TBodyTR = ({ children }) => <TRWrapper>{children}</TRWrapper>;

const TDWrapper = styled("td")`
  ${cell};
  font-size: 16px;
  padding-top: 3px;
  padding-bottom: 3px;
  border-top-width: 1px;
`;

const TBodyTD = ({ children }) => {
  const { colorMode } = useColorMode();

  const color = useMemo(
    () => (colorMode === "dark" ? "gray.300" : "gray.600"),
    [colorMode]
  );

  return (
    <TDWrapper>
      <Text color={color}>{children}</Text>
    </TDWrapper>
  );
};

const Home = ({
  transactions: initialTransactions,
  next: initialNext,
  next_url: initialUrl,
  filtered_table_rows_count,
}) => {
  const [index, setIndex] = useState(0);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [next, setNext] = useState(initialNext);
  const [nextUrl, setNextUrl] = useState(initialUrl);
  const [activeTransactions, setActiveTransactions] = useState(
    initialTransactions
  );

  const fetchMore = async () => {
    try {
      const { data, next: newNext, next_url: newUrl } = await rawQuery(nextUrl);
      setTransactions([...transactions, ...data]);
      setNext(newNext);
      setNextUrl(newUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const getNextPage = async () => {
    const newIndex = index + 1;
    const targetDataLength = newIndex * 100 + 100;
    if (next && transactions.length < targetDataLength) {
      await fetchMore();
    }
    setIndex(newIndex);
  };

  const getPrevPage = async () => {
    setIndex(index - 1);
  };

  const getFirstPage = async () => {
    setIndex(0);
  };

  const getLastPage = async () => {
    setIndex(Math.floor(filtered_table_rows_count / 100));
  };

  useEffect(() => {
    setActiveTransactions(
      transactions.slice(index * 100, (index + 1) * 100)
    );
  }, [index, transactions]);

  return (
    <div>
      <Head>
        <title>Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Heading>{activeTransactions?.length} transactions</Heading>
        <Button
          isDisabled={index * 100 + 100 >= filtered_table_rows_count}
          onClick={getNextPage}
        >
          Next
        </Button>
        <Button isDisabled={index <= 0} onClick={getPrevPage}>
          Previous
        </Button>
        <Button isDisabled={index === 0} onClick={getFirstPage}>
          First Page
        </Button>
        <Button
          isDisabled={index === Math.floor(filtered_table_rows_count / 100)}
          onClick={getLastPage}
        >
          Last Page
        </Button>
        <Table>
          <TBody>
            {activeTransactions?.map?.((transaction) => (
              <TBodyTR key={transaction.id}>
                <TBodyTD>{transaction?.amount}</TBodyTD>
                <TBodyTD>{transaction?.category || "Uncategorized"}</TBodyTD>
              </TBodyTR>
            ))}
          </TBody>
        </Table>
      </ThemeProvider>
    </div>
  );
};

export default Home;
