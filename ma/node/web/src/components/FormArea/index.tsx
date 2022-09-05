const FormArea: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="w-full max-w-md">{children}</div>;
};

export default FormArea;
