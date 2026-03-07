import React, { useEffect, useState } from "react";
import { Link } from "react-router";

type DockLabelProps = {
  label: string;
  isActive: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  link?: string; // new prop
};

function DockLabel({ label, isActive, onClick, icon, link }: DockLabelProps) {
  const content = (
    <button
      className={`flex items-center space-x-1 px-2 py-1 rounded ${
        isActive ? "dock-active" : ""
      }`}
      onClick={onClick}
    >
      {icon || (
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
            <polyline
              points="1 11 12 2 23 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeWidth="2"
            />
            <line
              x1="12"
              y1="22"
              x2="12"
              y2="18"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeWidth="2"
            />
          </g>
        </svg>
      )}
      <span className="dock-label">{label}</span>
    </button>
  );

  // If a link is provided, wrap button in <Link>, else just render button
  return link ? <Link to={link}>{content}</Link> : content;
}

export default function Dock() {
  const [activeTab, setActiveTab] = useState<string>("Home");

  // Load saved tab from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("activeTab");
      if (saved) setActiveTab(saved);
    }
  }, []);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  const mapIcon = (
    <svg
      className="size-[1.2em]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M20.5 3l-5.5 2-5-2-6 2v16l5.5-2 5 2 6-2V3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

  return (
    <div className="dock flex space-x-2">
      <DockLabel
        isActive={activeTab === "Home"}
        label="Home"
        onClick={() => setActiveTab("Home")}
        link="/"
      />
      <DockLabel
        isActive={activeTab === "Map"}
        label="Map"
        icon={mapIcon}
        onClick={() => setActiveTab("Map")}
        link="/mmap"
      />
    </div>
  );
}