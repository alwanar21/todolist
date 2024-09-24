import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { Link, useNavigate } from "react-router-dom";

interface AuthUser {
  username: string;
}

export default function Navbar() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const auth = useAuthUser<AuthUser>();

  const Out = () => {
    signOut();
    navigate("/");
  };

  const openModalQuit = () => {
    const modal = document.getElementById("modal_quit") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  function getInitial(username: string = "") {
    const words = username.split(" ");
    const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
    return initials;
  }

  return (
    <>
      <div className="navbar bg-base-100 px-4 sticky top-0 shadow-sm">
        <div className="navbar-start">
          <Link to={"/dashboard"} className="font-bold text-xl">
            todolist
          </Link>
        </div>
        <div className="navbar-end flex gap-2">
          <div className="hidden sm:flex flex-row gap-2 justify-center items-center">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xl">{getInitial(auth?.username)}</span>
              </div>
            </div>
            <p className="text-base ">{auth?.username}</p>
          </div>
          <button onClick={openModalQuit} className="btn btn-error btn-sm text-white">
            Logout
          </button>
        </div>
      </div>

      {/* modal logout */}
      <dialog id="modal_quit" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <p className="py-4 text-xl">Are you sure you want to log out?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
            <button onClick={Out} className="btn btn-error text-white">
              Logout
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
