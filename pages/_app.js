/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import NProgress from 'nprogress'; // nprogress module
import Router, { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import 'nprogress/nprogress.css'; // styles of nprogress
import {
  ThemeProvider,
  theme,
  CSSReset,
  Grid,
  Spinner,
  Flex
} from '@chakra-ui/core';
import MainLayout from 'layouts/MainLayout';

// Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => url !== router.pathname && setLoading(true);
    const handleComplete = (url) =>
      url !== router.pathname && setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });
  return (
    <Grid
      overflowY="hidden"
      height="100vh"
      alignContent="start"
      columnGap="10px"
    >
      <Head>
        <title>Actual</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CSSReset />
        {loading ? (
          <MainLayout justifyContent="stretch" alignItems="stretch">
            <Flex justifyContent="center" alignItems="center">
              <Spinner size="lg" color="blue.900" />
            </Flex>
          </MainLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </ThemeProvider>
    </Grid>
  );
};

App.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
    PropTypes.string
  ]).isRequired,
  pageProps: PropTypes.object
};

App.defaultProps = {
  pageProps: {}
};

export default App;
