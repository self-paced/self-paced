const Header: React.FC = () => {
  return (
    <header className="flex w-full items-center justify-between border-b-2 border-gray-200 bg-white p-2">
      <div className="flex items-center space-x-2">
        <button type="button" className="text-3xl">
          <i className="bx bx-menu"></i>
        </button>
        <div>Logo</div>
      </div>
    </header>
  );
};

export default Header;
