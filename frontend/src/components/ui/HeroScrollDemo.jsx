"use client";
import React from "react";
import { ContainerScroll } from "./container-scroll-animation";
import LazyImage from "../LazyImage";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Experience the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none gradient-text">
                AutoMaxLib
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
              Transform your GitHub presence with intelligent automation, beautiful analytics, and professional README generation.
            </p>
          </>
        }
      >
        {/* Desktop Image */}
        <LazyImage
          src="/images/Frameweb.png"
          alt="AutoMaxLib dashboard showing GitHub analytics, commit automation, and README generation tools"
          className="mx-auto rounded-2xl object-contain h-full w-full hidden md:block"
          draggable={false}
        />
        {/* Mobile Image */}
        <LazyImage
          src="/images/Framemobile.png"
          alt="AutoMaxLib mobile dashboard"
          className="mx-auto rounded-2xl object-contain h-full w-full block md:hidden"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
