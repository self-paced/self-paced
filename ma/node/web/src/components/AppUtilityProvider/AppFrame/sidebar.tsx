import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <aside
      className="flex w-72 h-full flex-col space-y-2 border-r-2 border-gray-200 bg-white p-2"
      style={{ height: '99vh' }}
    >
      <Link href="/messages">
        <a className="flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600">
          <span className="text-2xl">
            <i className="bx bx-home"></i>
          </span>
          <span>配信予約</span>
        </a>
      </Link>
      <Link href="/messages/events">
        <a className="flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600">
          <span className="text-2xl">
            <i className="bx bx-cart"></i>
          </span>
          <span>配信実績</span>
        </a>
      </Link>
    </aside>
  );
};

export default Sidebar;
