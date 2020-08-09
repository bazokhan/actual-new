/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button
} from '@chakra-ui/core';
import TransactionsTable from './TransactionsTable';

const TransactionsButton = ({
  transactions,
  account,
  accounts,
  categories,
  payees,
  children,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <TransactionsTable
              account={account}
              accounts={accounts}
              categories={categories}
              payees={payees}
              rowsCount={transactions.length}
              transactions={transactions}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button
        variant="ghost"
        disabled={transactions.length <= 0}
        onClick={onOpen}
        {...props}
      >
        {children}
      </Button>
    </>
  );
};

TransactionsButton.propTypes = {
  transactions: PropTypes.array,
  account: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  accounts: PropTypes.array,
  categories: PropTypes.array,
  payees: PropTypes.array,
  children: PropTypes.node.isRequired
};

TransactionsButton.defaultProps = {
  transactions: [],
  accounts: [],
  categories: [],
  payees: []
};

export default TransactionsButton;
