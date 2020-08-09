/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { Grid, Icon, Flex, Avatar } from '@chakra-ui/core';
import Link from 'components/Link';
import { Fragment } from 'react';
import Head from 'next/head';

const Sidebar = ({ accounts }) => (
  <Flex
    direction="column"
    justifyContent="flex-start"
    alignItems="center"
    bg="blue.900"
    p="10px"
    overflowY="auto"
    boxShadow="0 3px"
  >
    <Link my="10px" href="/accounts">
      <Icon name="sun" size="30px" color="white" />
    </Link>
    {accounts.map((account) => (
      <Fragment key={account.id}>
        <Link my="10px" href={`/accounts/${account.id}`}>
          <Avatar size="md" name={account.name} />
        </Link>
        {/* <Link my="10px" href={`/accounts/${account.id}/categories`}>
          <Icon name="copy" size="30px" color="white" />
        </Link>
        <Link my="10px" href={`/accounts/${account.id}/dates`}>
          <Icon name="calender" size="30px" color="white" />
        </Link>
        <Link my="10px" href={`/accounts/${account.id}/payees`}>
          <Icon name="lock" size="30px" color="white" />
        </Link>
        <Link my="10px" href={`/accounts/${account.id}/revision`}>
          <Icon name="check-circle" size="30px" color="white" />
        </Link> */}
      </Fragment>
    ))}
  </Flex>
);

Sidebar.propTypes = {
  accounts: PropTypes.array.isRequired
};

const MainLayout = ({ accounts, title, children, ...props }) => (
  <>
    <Head>
      <title>{title || 'Actual'}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Grid
      gridTemplateColumns="auto 1fr"
      height="100vh"
      overflowY="hidden"
      alignItems="stretch"
    >
      <Sidebar accounts={accounts} />
      <Grid overflowY="hidden" {...props}>
        {children}
      </Grid>
    </Grid>
  </>
);

MainLayout.propTypes = {
  accounts: PropTypes.array,
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

MainLayout.defaultProps = {
  accounts: [],
  title: null
};

export default MainLayout;
