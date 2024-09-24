import { z } from "zod";
import { createTaskValidation, updateStatusTaskValidation, updateTaskValidation } from "../validation/task-validation";
import { PrivateInstance } from "./service";

type CreateTaskType = z.infer<typeof createTaskValidation>;
type UpdateTaskType = z.infer<typeof updateTaskValidation>;
type UpdateStatusTaskType = z.infer<typeof updateStatusTaskValidation>;

const getAll = async (status: string) => {
  const result = await PrivateInstance("/api/tasks", {
    params: {
      status,
    },
  });
  return result.data;
};

const get = async (id: number) => {
  const result = await PrivateInstance(`/api/task/${id}`);
  return result.data;
};

const create = async (body: CreateTaskType) => {
  const result = await PrivateInstance("/api/task", {
    method: "post",
    data: body,
  });
  return result.data;
};

const update = async (id: number, body: UpdateTaskType) => {
  const result = await PrivateInstance(`/api/task/${id}`, {
    method: "patch",
    data: body,
  });
  return result.data;
};

const updateStatus = async (id: number, body: UpdateStatusTaskType) => {
  const result = await PrivateInstance(`/api/task/${id}/status`, {
    method: "patch",
    data: body,
  });
  return result.data;
};

const remove = async (id: number) => {
  const result = await PrivateInstance(`/api/task/${id}`, {
    method: "delete",
  });
  return result.data;
};

export { getAll, get, create, update, updateStatus, remove };
