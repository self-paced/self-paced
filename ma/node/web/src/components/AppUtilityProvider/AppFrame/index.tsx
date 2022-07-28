import SideBar from './sidebar';
import Header from './header';

const AppFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main
      className="min-h-screen w-full bg-gray-100 text-gray-700"
      x-data="layout"
    >
      <Header />
      <div className="flex">
        <SideBar></SideBar>
        <div className="w-full p-4">{children}</div>
      </div>
    </main>
  );
};

export default AppFrame;
