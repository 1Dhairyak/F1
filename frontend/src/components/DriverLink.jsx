import { useRef } from "react";
import { Link } from "react-router-dom";
import driverData from "../data/driverData";

export default function DriverLink({ driverId, fullName }) {
  const linkRef = useRef(null);

  const handleClick = (e) => {
    const el = linkRef.current;
    if (!el) return;

    el.classList.remove("clicked");
    void el.offsetWidth;
    el.classList.add("clicked");

    const ripple = document.createElement("span");
    ripple.className = "vg-ripple";
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  };

  return (
    <Link
      ref={linkRef}
      to={`/driver/${driverId}`}
      className="vg-driver-link"
      onClick={handleClick}
    >
      <span className="vg-avatar">
        <span className="vg-avatar-inner">
          {driverData[driverId]?.image && (
            <>
              <span className="vg-avatar-face front">
                <img src={driverData[driverId].image} alt={fullName} />
              </span>
              <span className="vg-avatar-face back">
                <img src={driverData[driverId].image} alt="" aria-hidden="true" />
              </span>
            </>
          )}
        </span>
      </span>
      <span className="vg-driver-name">{fullName}</span>
    </Link>
  );
}
