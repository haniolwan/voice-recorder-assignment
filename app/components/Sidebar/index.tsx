import Content from "./Content";

const Sidebar = () => {
  return (
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r-gray-600 shadow-lg"
      aria-label="Sidebar"
    >
      <Content />
    </aside>
  );
};

export default Sidebar;
