const logo = "/assets/icons/slay-queen-logo-nobg-notext.svg";
const facebookIcon = "/assets/icons/facebook-f-brands-solid-full.svg";
const whatsappIcon = "/assets/icons/whatsapp-brands-solid-full.svg";
import { Link } from "react-router";
export function Footer() {
  return (
    <footer className="min-w-[402px] w-full bg-white text-[#2B2520] py-5 px-3 md:px-6 flex items-center justify-between">
      <div id="nav-logo" className="flex items-center">
        <img src={logo} alt="Slay Queen Logo" className="h-10 w-auto" />
        <h1 className="text-[14px] text-[#3D2645] font-bold">Slay Queen</h1>
      </div>
      <div className="flex flex-col items-end gap-4">
        <div className="flex gap-2 items-center">
          <Link
            to="https://www.facebook.com/share/1ZKMvwzpWC/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="w-5" src={facebookIcon} alt="facebook" />
          </Link>
          <Link
            to="https://wa.me/971559367466"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="w-6" src={whatsappIcon} alt="whatsapp" />
          </Link>
        </div>
        <p className="font-lato font-medium text-[12px] text-[#2B2520]">
          {" "}
          © 2025 Slay Queen. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
