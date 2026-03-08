
import Searchbar from "./ClassSearchbar";


export default function Navbar() {
    
    return (
    <>
        <div className="navbar w-full bg-base-100 shadow-sm sticky top-0 z-50">

        <div className="flex-1">
            <div className="w-20">
                <img
                    alt="UVIC"
                    src="/uvic_logo.png" />
            </div>
        </div>

        <div className="flex gap-2">

            <Searchbar />


            <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Profile Pic"
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />
                </div>
            </div>
            <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li>
                <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                </a>
                </li>
                <li><a>Settings</a></li>
                <li><a>Logout</a></li>
            </ul>
            </div>
        </div>
        </div>
    </>
    );
}

