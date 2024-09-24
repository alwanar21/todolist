import { useSearchParams } from "react-router-dom";
import CreateTaskModal from "./CreateTaskModal";
export default function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "";

  const setStatusParams = (status: string) => {
    setSearchParams({ status });
  };

  return (
    <>
      {/* filter status */}
      <div className="flex justify-between items-center">
        <div className="filter mt-6 mb-8 flex flex-row gap-2">
          <button
            className={`btn btn-ghost btn-sm ${status == "" ? "btn-neutral btn-disabled " : ""} `}
            onClick={() => setStatusParams("")}
          >
            All
          </button>
          <button
            className={`btn btn-ghost btn-sm ${status == "PENDING" ? "btn-neutral btn-disabled" : ""} `}
            onClick={() => setStatusParams("PENDING")}
          >
            Pending
          </button>
          <button
            className={`btn btn-ghost btn-sm ${status == "DOING" ? "btn-neutral btn-disabled" : ""} `}
            onClick={() => setStatusParams("DOING")}
          >
            Doing
          </button>
          <button
            className={`btn btn-ghost btn-sm ${status == "DONE" ? "btn-neutral btn-disabled" : ""} `}
            onClick={() => setStatusParams("DONE")}
          >
            Done
          </button>
        </div>

        <CreateTaskModal />
      </div>
    </>
  );
}
