import { MouseEventHandler } from 'react';

const CustomButton: React.FC<{
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}> = ({ onClick, type, children }) => {
  return (
    <button
      className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default CustomButton;
