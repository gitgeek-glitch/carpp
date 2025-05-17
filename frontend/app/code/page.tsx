"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Timeline } from "@/components/ui/timeline";

const TimelineDemo = () => {
  const [isOpen, setIsOpen] = useState(false); // Modal open state
  const [currentImage, setCurrentImage] = useState(""); // Image to display in full screen

  const sections = [
    {
      title: "Data Cleaning & Pre-Processing",
      steps: [
        {
          caption: "1. Importing Necessary Libraries",
          imageUrl: "/assets/code/1.jpg",
        },
        {
          caption: "2. Reading the Dataset",
          imageUrl: "/assets/code/2.jpg",
        },
        {
          caption: "3. Separating Categorical and Numerical Data",
          imageUrl: "/assets/code/3.jpg",
        },
        {
          caption: "4. Checking for Missing Values",
          imageUrl: "/assets/code/4.jpg",
        },
        {
          caption: "5. Number of Unique Values in Each Column",
          imageUrl: "/assets/code/5.jpg",
        },
        {
          caption: "6. Handling Rare Instances in 'Transmission'",
          imageUrl: "/assets/code/6.jpg",
        },
        {
          caption: "7. Handling Rare Instances in 'Fuel Type'",
          imageUrl: "/assets/code/7.jpg",
        },
        {
          caption: "8. Range of the Label (Price)",
          imageUrl: "/assets/code/8.jpg",
        },
        {
          caption: "9. Label Encoding and One-Hot Encoding",
          imageUrl: "/assets/code/9.jpg",
        },
        {
          caption: "10. Train Test Split",
          imageUrl: "/assets/code/10.jpg",
        },
        {
          caption: "11. Feature Scaling",
          imageUrl: "/assets/code/11.jpg",
        },
      ],
    },
    {
      title: "PCA",
      steps: [
        {
          caption: "12. Principal Component Analysis (PCA)",
          imageUrl: "/assets/code/12.jpg",
        },
        {
          caption: "13. Explained Variance",
          imageUrl: "/assets/code/13.jpg",
        },
      ],
    },
    {
      title: "Simple Models",
      steps: [
        {
          caption: "14. Importing Simple Models",
          imageUrl: "/assets/code/14.jpg",
        },
        {
          caption: "15. Training and Performance Evaluation",
          imageUrl: "/assets/code/15.jpg",
        },
        {
          caption: "16. Comparison Between Different Simple Models",
          imageUrl: "/assets/code/16.jpg",
        },
      ],
    },
    {
      title: "Ensemble Models",
      steps: [
        {
          caption: "17. Importing Ensemble Models",
          imageUrl: "/assets/code/17.jpg",
        },
        {
          caption: "18. Training Ensemble Models",
          imageUrl: "/assets/code/18.jpg",
        },
        {
          caption: "19. Comparison Between Different Ensemble Models",
          imageUrl: "/assets/code/19.jpg",
        },
      ],
    },
    {
      title: "Testing the Models",
      steps: [
        {
          caption: "20. Creating a New Instance and Preprocessing",
          imageUrl: "/assets/code/20.jpg",
        },
        {
          caption: "21. Prediction by Simple Models",
          imageUrl: "/assets/code/21.jpg",
        },
        {
          caption: "22. Prediction by Ensemble Models",
          imageUrl: "/assets/code/22.jpg",
        },
        {
          caption: "23. Saving the Models for Future Use",
          imageUrl: "/assets/code/23.jpg",
        },
      ],
    },
  ];

  const handleImageClick = (imageUrl: React.SetStateAction<string>) => {
    setCurrentImage(imageUrl); // Set clicked image URL
    setIsOpen(true); // Open the image modal
  };

  const handleCloseModal = () => {
    setIsOpen(false); // Close the modal
  };

  const data = sections.map((section) => ({
    title: section.title,
    content: (
      <>
        {section.steps.map((step, index) => (
          <div key={index} className="grid grid-cols-1 gap-4">
            <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
              {step.caption}
            </p>
            <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
              <div className="md:w-1/2 lg:w-2/3 xl:w-3/4">
                <Image
                  src={step.imageUrl}
                  alt={step.caption}
                  width={500}
                  height={500}
                  className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl cursor-pointer"
                  onClick={() => handleImageClick(step.imageUrl)} // Open the clicked image
                />
              </div>
            </div>
          </div>
        ))}
      </>
    ),
  }));

  return (
    <div>
      <Timeline data={data} />

      {/* Modal for full screen image */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative">
            <button
              className="absolute top-0 right-0 text-white text-3xl bg-red-500 p-2 rounded-full border-none cursor-pointer"
              onClick={handleCloseModal} // Close the modal when clicked
            >
              &times;
            </button>
            <Image
              src={currentImage}
              alt="Full Screen View"
              width={1000}
              height={1000}
              className="object-contain max-h-full max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineDemo;
