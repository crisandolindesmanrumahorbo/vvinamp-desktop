import React, { useState } from "react";

interface TabComponentProps {
  tab1: React.ReactNode;
  tab2: React.ReactNode;
  tab1Label?: string;
  tab2Label?: string;
}

const TabComponent: React.FC<TabComponentProps> = ({
  tab1,
  tab2,
  tab1Label = "Tab 1",
  tab2Label = "Tab 2",
}) => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 1
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab(1)}
        >
          {tab1Label}
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 2
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab(2)}
        >
          {tab2Label}
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 1 && tab1}
        {activeTab === 2 && tab2}
      </div>
    </div>
  );
};

export default TabComponent;
