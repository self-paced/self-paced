const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        border: '2px solid black',
        margin: '20px',
      }}
    >
      {children}
    </div>
  );
};

export default DialogProvider;
