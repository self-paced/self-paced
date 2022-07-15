const AppFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        border: '2px solid black',
        margin: '20px',
        padding: '10px',
      }}
    >
      {children}
    </div>
  );
};

export default AppFrame;
