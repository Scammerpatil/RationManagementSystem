import Image from "next/image";
import logo from "@/app/assets/logo.png";
import Link from "next/link";

function Header() {
  return (
    <header className="relative flex justify-between items-center p-4 bg-blue-500 text-white shadow-md">
      <div className="flex items-center">
        <Image
          src={logo}
          height={100}
          width={100}
          alt="Government Logo"
          className="w-12 h-12 mr-2"
        />
        <div>
          <p className="text-lg font-semibold">Government of Maharashtra</p>
          <p className="text-sm">
            Food, Civil Supplies & Consumer Protection Department
          </p>
        </div>
      </div>
      <div
        className="dropdown dropdown-hover dropdown-left"
        data-theme="cupcake"
      >
        <div
          tabIndex={0}
          role="button"
          className="btn bg-white text-blue-500 px-4 py-1 rounded-full border-none hover:bg-white/80"
        >
          Login
        </div>

        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <Link href="/public-login">Public Login</Link>
          </li>
          <li>
            <Link href="/fps-login">Fair Price Shop Login</Link>
          </li>
          <li>
            <Link href="/tehsil-login">Tehsil Login</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
