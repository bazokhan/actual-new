import PropTypes from 'prop-types';
import { Grid, Text } from '@chakra-ui/core';
import AccountLink from './AccountLink';
import AccountSectionLink from './AccountSectionLink';

const Navbar = ({ account, title, sections }) => (
  <Grid
    gridTemplateColumns={`auto repeat(${sections.length}, auto) 1fr`}
    boxShadow="0 3px 3px 0 rgba(0, 0, 0, 0.16)"
    columnGap="10px"
    p="5px 10px"
    alignItems="end"
  >
    <AccountLink account={account} />
    {title ? (
      <Text fontWeight="500" fontSize="16px">
        ({title})
      </Text>
    ) : null}
    {sections.map((section) => (
      <AccountSectionLink
        key={section.url}
        account={account}
        section={section}
      />
    ))}
    <div />
  </Grid>
);

Navbar.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  title: PropTypes.string,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string
    })
  )
};

Navbar.defaultProps = {
  title: null,
  sections: []
};

export default Navbar;
