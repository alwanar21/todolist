export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
      {[...Array(5)].map((_, index) => (
        <div className="card bg-base-100 shadow-xl" key={index}>
          <div className="card-body">
            <h2 className="card-title">
              <div className="skeleton h-6 w-3/6"></div>
            </h2>
            <div className="mb-2">
              <p className="skeleton h-5 w-full mt-2"></p>
              <p className="skeleton h-5 w-3/5 mt-2"></p>
            </div>
            <p className="skeleton h-5 w-2/5 mt-2"></p>
            <div className="card-actions justify-end mt-3">
              <p className="skeleton h-6 max-w-20"></p>
              <p className="skeleton h-6 max-w-20"></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
