import { PrivateInstance } from "../utils/axios";

const getAll = async (status: string) => {
  const result = await PrivateInstance("/api/tasks", {
    params: {
      status,
    },
  });
  return result.data;
};
const remove = async (id: number) => {
  const result = await PrivateInstance(`/api/task/${id}`, {
    method: "delete",
  });
  return result.data;
};

export { getAll, remove };
