export default function SkeletonLoader() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
          <div>
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0 border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full bg-white rounded-xl border border-gray-200 animate-pulse overflow-hidden">
            <div className="h-12 border-b border-gray-200 bg-gray-50"></div>
            <div className="p-8 space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-80 flex-shrink-0 border-l border-gray-200 p-6">
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
