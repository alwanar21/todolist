import moment from "moment";
import { Task as TaskType } from "../../pages/Dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { remove } from "../../service/todo";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useSearchParams } from "react-router-dom";

interface TaskProps {
  task: TaskType;
  idUser: number;
  setIdUser: (id: number) => void;
}

export default function Task({ task, idUser, setIdUser }: TaskProps) {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const queryClient = useQueryClient();

  const modal = document.getElementById("modal_delete") as HTMLDialogElement;
  const openModal = (id: number) => {
    setIdUser(id);

    if (modal) {
      modal.showModal();
    }
  };

  const mutation = useMutation({
    mutationFn: (id: number) => remove(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", status] });
      modal.close();
      toast.success(data?.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      }
    },
  });

  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{task.nama}</h2>
          <p>{task.description}</p>
          <p>{moment(task.date).format("LL")}</p>
          <div className="flex flex-row gap-2">
            <div className="badge badge-neutral">{task.kelompok}</div>
            <div className="badge badge-neutral">{task.status}</div>
          </div>
          <div className="card-actions justify-end">
            <button
              onClick={() => openModal(task.id)}
              className={"btn btn-sm btn-error text-white"}
            >
              delete
            </button>
          </div>
        </div>
      </div>

      {/* modal delete */}
      <dialog id="modal_delete" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <p className="py-4 text-xl">Are you sure you want to delete this task?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className={`btn ${mutation.isPending && "btn-disabled"}`}>Close</button>
            </form>
            <button
              onClick={() => mutation.mutate(idUser)}
              className={`btn btn-error text-white ${mutation.isPending && "btn-disabled"}`}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
