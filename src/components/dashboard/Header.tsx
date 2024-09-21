import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { createTaskValidation } from "../../validation/taskValidation";
import { z } from "zod";

export default function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "";

  const modal = document.getElementById("modal_add") as HTMLDialogElement;
  const openModal = () => {
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    reset();
  };

  const setStatusParams = (status: string) => {
    setSearchParams({ status });
  };

  type createTaskType = z.infer<typeof createTaskValidation>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<createTaskType>({
    resolver: zodResolver(createTaskValidation),
  });
  const onSubmit: SubmitHandler<createTaskType> = (data) => {
    console.log(data);
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
            className={`btn btn-ghost btn-sm ${
              status == "PENDING" ? "btn-neutral btn-disabled" : ""
            } `}
            onClick={() => setStatusParams("PENDING")}
          >
            Pending
          </button>
          <button
            className={`btn btn-ghost btn-sm ${
              status == "DOING" ? "btn-neutral btn-disabled" : ""
            } `}
            onClick={() => setStatusParams("DOING")}
          >
            Doing
          </button>
          <button
            className={`btn btn-ghost btn-sm ${
              status == "DONE" ? "btn-neutral btn-disabled" : ""
            } `}
            onClick={() => setStatusParams("DONE")}
          >
            Done
          </button>
        </div>

        <button className="btn btn-sm btn-primary" onClick={openModal}>
          <FaPlus />
          Add
        </button>
      </div>

      <dialog id="modal_add" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className={`input input-bordered ${
                  errors.nama?.message && "input-bordered input-error"
                }`}
                {...register("nama")}
              />
              <div className="label">
                <span className="label-text-alt text-red-500">{errors?.nama?.message}</span>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Desription</span>
              </label>
              <input
                type="text"
                placeholder="description"
                className={`input input-bordered ${
                  errors.description?.message && "input-bordered input-error"
                }`}
                {...register("description")}
              />
              <div className="label">
                <span className="label-text-alt text-red-500">{errors?.description?.message}</span>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                placeholder="Date"
                className={`input input-bordered ${
                  errors.date?.message && "input-bordered input-error"
                }`}
                {...register("date")}
              />
              <div className="label">
                <span className="label-text-alt text-red-500">{errors?.date?.message}</span>
              </div>
            </div>
            <div className="form-control ">
              <label className="label">
                <span className="label-text">Desription</span>
              </label>
              <select
                {...register("kelompok")}
                className={`select select-bordered w-full ${
                  errors.kelompok?.message && "input-bordered input-error"
                }`}
              >
                <option selected>Kelompok</option>
                <option value="WORK">Work</option>
                <option value="PERSONAL">Personal</option>
                <option value="SHOPPING">Shopping</option>
                <option value="OTHERS">Others</option>
              </select>
              <div className="label">
                <span className="label-text-alt text-red-500">{errors?.kelompok?.message}</span>
              </div>
            </div>
            <div className="form-control mt-6">
              <button className={`btn btn-primary }`}>
                {/* {mutation.isPending && <span className="loading loading-spinner"></span>} */}
                Submit
              </button>{" "}
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
