import PropTypes from 'prop-types';
import { Heading, Avatar, Tag, Flex } from '@chakra-ui/core';
import { query, SHAPES } from 'libs/query';
import Link from 'components/Link';
import MainLayout from 'layouts/MainLayout';

export const getServerSideProps = async () => {
  try {
    const { data } = await query('accounts', {
      shape: SHAPES.ARRAY
    });
    return {
      props: {
        accounts: data
      }
    };
  } catch {
    return {
      props: {
        accounts: []
      }
    };
  }
};

const Accounts = ({ accounts }) => {
  return (
    <MainLayout
      title="Accounts"
      accounts={accounts}
      alignItems="start"
      gridAutoRows="auto 1fr"
    >
      <Heading fontSize="20px" p="10px">
        All Accounts
      </Heading>
      <Flex wrap="wrap" alignItems="flex-start">
        {accounts?.map?.((account) => (
          <Link
            key={account.id}
            href={`/accounts/${account?.id}`}
            m="10px"
            d="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="start"
            borderRadius="5px"
            padding="10px 20px"
            boxShadow="0 3px 3px 0 rgba(0, 0, 0, 0.16)"
          >
            <Avatar name={account?.name} src={account?.image} />
            <Heading fontSize="20px" my="10px">
              {account?.name}
            </Heading>
            <Tag>{account?.type}</Tag>
          </Link>
        ))}
      </Flex>
    </MainLayout>
  );
};

Accounts.propTypes = {
  accounts: PropTypes.array
};

Accounts.defaultProps = {
  accounts: []
};

export default Accounts;
