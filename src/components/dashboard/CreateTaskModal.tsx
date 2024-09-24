import { z } from "zod";
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { formatZodErrors } from "../../utils/zodError";
import { useRef } from "react";
import { create } from "../../service/todo-service";
import { createTaskValidation } from "../../validation/task-validation";
import { useSearchParams } from "react-router-dom";

export default function CreateTaskModal() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const queryClient = useQueryClient();
  const modalAddRef = useRef<HTMLDialogElement | null>(null);

  const openModal = () => {
    if (modalAddRef.current) {
      modalAddRef.current.showModal();
    }
  };

  const closeModal = () => {
    reset();
    if (modalAddRef.current) {
      modalAddRef.current.close();
    }
  };

  type createTaskType = z.infer<typeof createTaskValidation>;

  const createTaskMutation = useMutation({
    mutationFn: create,
    onSuccess: (data) => {
      toast.success(data.message);
      if (status == "DOING") {
        queryClient.invalidateQueries({ queryKey: ["tasks", "DOING"] });
      } else if (status == "") {
        queryClient.invalidateQueries({ queryKey: ["tasks", ""] });
      }
      reset();
      closeModal();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          const formattedErrors = formatZodErrors(error.response?.data);
          setError("nama", formattedErrors.nama);
          setError("description", formattedErrors.description);
          setError("date", formattedErrors.date);
          setError("kelompok", formattedErrors.kelompok);
        } else {
          const errorMessage = error.response?.data?.message || "An unknown error occurred";
          toast.error(errorMessage);
        }
      } else {
        console.log(error.message);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<createTaskType>({
    resolver: zodResolver(createTaskValidation),
  });

  const onSubmit: SubmitHandler<createTaskType> = (data) => {
    createTaskMutation.mutate(data);
  };

  return (
    <>
      <button
        className="btn btn-sm btn-circle btn-ghost ml-auto border-gray-700 flex items-center justify-center my-5"
        onClick={openModal}
      >
        <FaPlus />
      </button>

      {/* create task modal */}
      <dialog ref={modalAddRef} id="modal_add_task" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-2xl font-semibold mx-auto text-center">Create Task</p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className={`input input-bordered ${errors.nama?.message && "input-bordered input-error"}`}
                disabled={createTaskMutation.isPending ? true : false}
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
                className={`input input-bordered ${errors.description?.message && "input-bordered input-error"}`}
                disabled={createTaskMutation.isPending ? true : false}
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
                className={`input input-bordered ${errors.date?.message && "input-bordered input-error"}`}
                disabled={createTaskMutation.isPending ? true : false}
                {...register("date")}
              />
              <div className="label">
                <span className="label-text-alt text-red-500">{errors?.date?.message}</span>
              </div>
            </div>
            <div className="form-control ">
              <label className="label">
                <span className="label-text">Group</span>
              </label>
              <select
                {...register("kelompok")}
                className={`select select-bordered w-full ${errors.kelompok?.message && "input-bordered input-error"}`}
                disabled={createTaskMutation.isPending ? true : false}
              >
                <option>Group</option>
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
              <button className={`btn btn-primary ${createTaskMutation.isPending && "btn-disabled"}`}>
                {createTaskMutation.isPending && <span className="loading loading-spinner"></span>}
                Submit
              </button>{" "}
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
