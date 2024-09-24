import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { get, getAll, remove, update, updateStatus } from "../../service/todo-service";
import { useEffect, useState } from "react";
import moment from "moment";
import Loading from "../Loading";
import Empty from "./Empty";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { updateStatusTaskValidation, updateTaskValidation } from "../../validation/task-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { formatZodErrors } from "../../utils/zodError";

export interface Task {
  id: number;
  nama: string;
  description: string;
  date: string;
  status: string;
  kelompok: string;
}

export default function Tasks() {
  const [taskId, setTaskId] = useState(0);
  const [taskIdForDelete, setTaskIdForDelete] = useState(0);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const status = searchParams.get("status") || "";
  moment.locale("id");

  type updateTaskType = z.infer<typeof updateTaskValidation>;
  type UpdateStatusTaskType = z.infer<typeof updateStatusTaskValidation>;

  const updateModal = document.getElementById("modal_update_task") as HTMLDialogElement;
  const deleteModal = document.getElementById("modal_delete") as HTMLDialogElement;

  const openModalDelete = (id: number) => {
    setTaskIdForDelete(id);
    if (deleteModal) {
      deleteModal.showModal();
    }
  };

  const openModalUpdate = (id: number) => {
    setTaskId(id);
    if (updateModal) {
      updateModal.showModal();
      if (taskId !== id) {
        reset();
      }
      // reset();
    }
  };

  const closeModalUpdate = () => {
    deleteModal.close();
  };

  const deleteTaskMutation = useMutation({
    mutationFn: remove,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", status] });
      toast.success(data?.message);
      deleteModal.close();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      }
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: updateTaskType }) => update(id, body),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["tasks", status] });
      updateModal.close();
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
          updateModal.close();
          reset();
        }
      }
    },
  });

  const updateStatusTaskMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateStatusTaskType }) => updateStatus(id, body),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["tasks", status] });
      reset();
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
          updateModal.close();
          reset();
        }
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<updateTaskType>({
    resolver: zodResolver(updateTaskValidation),
  });
  const onSubmit: SubmitHandler<updateTaskType> = (data) => {
    updateTaskMutation.mutate({ id: taskId ?? 0, body: data });
  };

  const getTaskQuery = useQuery({
    queryKey: ["url"],
    queryFn: () => get(taskId ?? 0),
    gcTime: 0,
    enabled: false,
    retry: false,
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", status],
    queryFn: () => getAll(status),
    enabled: true,
  });

  useEffect(() => {
    if (taskId) {
      getTaskQuery.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  useEffect(() => {
    if (getTaskQuery.isSuccess && getTaskQuery.data) {
      setValue("nama", getTaskQuery.data.data.nama);
      setValue("description", getTaskQuery.data.data.description);
      setValue("date", moment(getTaskQuery.data.data.date).format("YYYY-MM-DD"));
      setValue("kelompok", getTaskQuery.data.data.kelompok);
    }
  }, [getTaskQuery.data, getTaskQuery.isSuccess, setValue]);

  const handleSelectChange = (id: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as "PENDING" | "DOING" | "DONE";
    updateStatusTaskMutation.mutate({ id: id, body: { status: selectedValue } });
  };

  return (
    <>
      {isLoading && <Loading />}
      {tasks && tasks.data.length < 1 ? (
        <Empty message={tasks?.message} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tasks?.data.map((task: Task) => (
            <div className="card bg-base-100 shadow-xl relative" key={task.id}>
              <div className="card-body">
                <h2 className="card-title">{task.nama}</h2>
                <p>{task.description}</p>
                <p>{moment(task.date).format("LL")}</p>
                <p className="badge absolute top-3 right-3 badge-neutral">{task.kelompok}</p>
                <div className="card-actions justify-end mt-3 ">
                  <div className="tooltip" data-tip="change status">
                    <select
                      className="select select-bordered select-sm w-24 max-w-xs border-none"
                      onChange={(event) => handleSelectChange(task.id, event)}
                      disabled={updateStatusTaskMutation.isPending ? true : false}
                      value={task.status}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="DOING">Doing</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <button className={"btn btn-sm btn-warning text-white"} onClick={() => openModalUpdate(task.id)}>
                    update
                  </button>
                  <button className={"btn btn-sm btn-error text-white"} onClick={() => openModalDelete(task.id)}>
                    delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* update url modal */}
      <dialog id="modal_update_task" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button onClick={closeModalUpdate} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-2xl font-semibold mx-auto text-center">Update Task</p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className={`input input-bordered ${errors.nama?.message && "input-bordered input-error"}`}
                disabled={updateTaskMutation.isPending || getTaskQuery.isFetching ? true : false}
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
                disabled={updateTaskMutation.isPending || getTaskQuery.isFetching ? true : false}
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
                disabled={updateTaskMutation.isPending || getTaskQuery.isFetching ? true : false}
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
                disabled={updateTaskMutation.isPending || getTaskQuery.isFetching ? true : false}
                defaultValue={""}
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
              <button
                className={`btn btn-primary ${
                  (updateTaskMutation.isPending || getTaskQuery.isFetching) && "btn-disabled"
                }`}
              >
                {(updateTaskMutation.isPending || getTaskQuery.isFetching) && (
                  <span className="loading loading-spinner"></span>
                )}
                Submit
              </button>{" "}
            </div>
          </form>
        </div>
      </dialog>

      {/* modal delete */}
      <dialog id="modal_delete" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <p className="py-4 text-xl">Are you sure you want to delete this data?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className={`btn ${deleteTaskMutation.isPending && "btn-disabled"}`}>Close</button>
            </form>
            <button
              onClick={() => deleteTaskMutation.mutate(taskIdForDelete ?? 0)}
              className={`btn btn-error text-white ${deleteTaskMutation.isPending && "btn-disabled"}`}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
