import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { List, ListItem, Heading, Avatar, Tag, Link } from '@chakra-ui/core';
import { query, SHAPES } from '../libs/query';

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

const Home = ({ accounts }) => {
  return (
    <List>
      {accounts?.map?.((account) => (
        <ListItem key={account.id}>
          <NextLink href={`/${account.id}`}>
            <Link as="a">
              <Avatar name={account?.name} src={account?.image} />
              <Heading>{account?.name}</Heading>
              <Tag>{account?.type}</Tag>
            </Link>
          </NextLink>
        </ListItem>
      ))}
    </List>
  );
};

Home.propTypes = {
  accounts: PropTypes.array
};

Home.defaultProps = {
  accounts: []
};

export default Home;
