import React from "react";
import { Link } from "react-router-dom";
import { Card, Carousel } from "./apple-cards-carousel";
import { data } from "./Data";

export default function AllProjects() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} layout={true} />
  ));

  return (
    <div className="w-full h-full pt-4 pb-2 bg-white rounded-3xl mb-4 border border-gray-100 shadow-sm flex flex-col">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 w-full mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-sans">
          My Projects
        </h2>
        <Link 
          to="/experience"
          className="text-sm md:text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          See more in Selected Work →
        </Link>
      </div>
      <Carousel items={cards} />
    </div>
  );
}
