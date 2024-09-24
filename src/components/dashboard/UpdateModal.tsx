import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { get, update } from "../../service/todo-service";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTaskValidation } from "../../validation/task-validation";
import { AxiosError } from "axios";
import { formatZodErrors } from "../../utils/zodError";
import { useEffect } from "react";

interface UpdateModalProps {
  userId: number;
  idUser: number;
  setIdUser: (id: number) => void;
}

export default function UpdateModal({ idUser, setIdUser, userId }: UpdateModalProps) {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const queryClient = useQueryClient();

  const modal = document.getElementById("modal_update") as HTMLDialogElement;
  const openModal = () => {
    setIdUser(userId);
    if (modal) {
      modal.showModal();
    }
    refetch();
  };

  const closeModal = () => {
    reset();
  };

  type updateTaskType = z.infer<typeof updateTaskValidation>;

  const mutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: updateTaskType }) => update(id, body),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["tasks", status] });
      reset();
      modal.close();
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
    data: task,
    isLoading,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ["task", userId],
    queryFn: () => get(userId),
    enabled: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm<updateTaskType>({
    resolver: zodResolver(updateTaskValidation),
  });
  const onSubmit: SubmitHandler<updateTaskType> = (data) => {
    mutation.mutate({ id: idUser, body: data });
    console.log(data);
  };

  if (isFetching) {
    console.log("fetching bro");
  }
  useEffect(() => {
    // setValue("nama", task.data.nama);
    console.log("hahahahhahahhahahhah", task);
  }, [isFetched]);

  //   if (task && isFetched) {
  //     setValue("nama", task.data.nama);
  //     setValue("description", task.data.description);
  //     // setValue("date", task.data.date);
  //     setValue("kelompok", task.data.kelompok);
  //     console.log(task.data.date);
  //   }

  return (
    <>
      {/* create task modal */}

      <button onClick={() => openModal()} className={"btn btn-sm btn-warning text-white"}>
        Update
      </button>
      <dialog id="modal_update" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-2xl font-semibold mx-auto text-center">Update Task </p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className={`input input-bordered ${errors.nama?.message && "input-bordered input-error"}`}
                disabled={isLoading || mutation.isPending}
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
                disabled={mutation.isPending ? true : false}
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
                disabled={mutation.isPending ? true : false}
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
                className={`select select-bordered w-full ${errors.kelompok?.message && "input-bordered input-error"}`}
                disabled={mutation.isPending ? true : false}
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
              <button className={`btn btn-primary ${isFetching ? "btn-disabled" : ""}`}>
                {/* {(isFetching || mutation.isPending) && (
                  <span className="loading loading-spinner"></span>
                )} */}
                Submit
              </button>{" "}
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
