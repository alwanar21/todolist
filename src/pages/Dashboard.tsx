import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { getAll } from "../service/todo";
import Header from "../components/dashboard/Header";
import { useSearchParams } from "react-router-dom";
import Empty from "../components/dashboard/Empty";
import Loading from "../components/Loading";
import moment from "moment";
import "moment/locale/id";
import Task from "../components/dashboard/Task";
import { useState } from "react";

export interface Task {
  id: number;
  nama: string;
  description: string;
  date: string;
  status: string;
  kelompok: string;
}

export default function Home() {
  const [idUser, setIdUser] = useState(0);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  moment.locale("id");
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", status],
    queryFn: () => getAll(status),
    enabled: true,
  });
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Header />
        {isLoading && <Loading />}
        {tasks && tasks.data.length < 1 ? (
          <Empty message={tasks?.message} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks?.data.map((task: Task) => (
              <Task task={task} key={task.id} idUser={idUser} setIdUser={setIdUser} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
