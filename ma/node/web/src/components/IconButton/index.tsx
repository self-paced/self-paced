const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLElement>> = ({
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`${disabled ? 'text-gray-300' : 'text-gray-600'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
