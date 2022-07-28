const Sidebar: React.FC = () => {
  return (
    <aside
      className="flex w-72 h-full flex-col space-y-2 border-r-2 border-gray-200 bg-white p-2"
      style={{ height: '99vh' }}
    >
      <a
        href="#dashboard"
        className="flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600"
      >
        <span className="text-2xl">
          <i className="bx bx-home"></i>
        </span>
        <span>Dashboard</span>
      </a>

      <a
        href="#segment"
        className="flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600"
      >
        <span className="text-2xl">
          <i className="bx bx-cart"></i>
        </span>
        <span>Segment</span>
      </a>
    </aside>
  );
};

export default Sidebar;
