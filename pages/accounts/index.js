import PropTypes from 'prop-types';
import { List, ListItem, Heading, Avatar, Tag } from '@chakra-ui/core';
import { query, SHAPES } from 'libs/query';
import Link from 'components/Link';

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
    <List>
      {accounts?.map?.((account) => (
        <ListItem key={account?.id}>
          <Link href={`/accounts/${account?.id}`}>
            <Avatar name={account?.name} src={account?.image} />
            <Heading>{account?.name}</Heading>
            <Tag>{account?.type}</Tag>
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

Accounts.propTypes = {
  accounts: PropTypes.array
};

Accounts.defaultProps = {
  accounts: []
};

export default Accounts;