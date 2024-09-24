import Navbar from "../components/Navbar";
import Header from "../components/dashboard/Header";
import Tasks from "../components/dashboard/Tasks";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Header />
        <Tasks />
      </div>
    </>
  );
}
