const AppLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center z-50">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-ping"></div>
        </div>

        <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default AppLoader;
