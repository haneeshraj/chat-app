import PropTypes from 'prop-types';

const Header = ({ users }) => {
  return (
    <header className="header">
      <p className="header__title">
        React And Socket Chat App {`(${users} Connected)`}
      </p>
    </header>
  );
};

Header.propTypes = {
  users: PropTypes.number.isRequired,
};

Header.defaultProps = {
  users: 0,
};

export default Header;
