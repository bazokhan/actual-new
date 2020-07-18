import PropTypes from 'prop-types';
import { useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Text, useColorMode } from '@chakra-ui/core';

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

const Wrapper = styled('table')`
  width: 100%;
  max-width: 100%;
`;

const TRWrapper = styled('tr')`
  &:nth-of-type(odd) {
    background-color: #333;
  }
`;

export const Table = ({ children }) => <Wrapper>{children}</Wrapper>;
export const TBody = ({ children }) => <tbody>{children}</tbody>;
export const TBodyTR = ({ children }) => <TRWrapper>{children}</TRWrapper>;

Table.propTypes = { children: PropTypes.node.isRequired };
TBody.propTypes = { children: PropTypes.node.isRequired };
TBodyTR.propTypes = { children: PropTypes.node.isRequired };

const TDWrapper = styled('td')`
  ${cell};
  font-size: 16px;
  padding-top: 3px;
  padding-bottom: 3px;
  border-top-width: 1px;
`;

export const TBodyTD = ({ children }) => {
  const { colorMode } = useColorMode();

  const color = useMemo(
    () => (colorMode === 'dark' ? 'gray.300' : 'gray.600'),
    [colorMode]
  );

  return (
    <TDWrapper>
      <Text color={color}>{children}</Text>
    </TDWrapper>
  );
};

TBodyTD.propTypes = { children: PropTypes.node.isRequired };
