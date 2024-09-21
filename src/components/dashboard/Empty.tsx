import { BiTaskX } from "react-icons/bi";

interface EmptyProps {
  message?: string;
}

export default function Empty({ message = "Data Not found" }: EmptyProps) {
  return (
    <div className="w-full flex flex-col gap-4 items-center py-16">
      <BiTaskX className="text-7xl sm:text-9xl" />
      <p className="text-2xl sm:text-4xl font-semibold text-center">{message}</p>
    </div>
  );
}
