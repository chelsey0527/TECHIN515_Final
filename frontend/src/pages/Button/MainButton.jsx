import PropTypes from "prop-types";

const MainButton = ({ onClick, children, className, ...props }) => (
  <button
    onClick={onClick}
    className="inline-block w-full md:w-auto mt-10 px-6 p-3 font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded transition duration-200"
    {...props}
  >
    {children}
  </button>
);

MainButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default MainButton;
