import React from "react";

function TemplateContent({ slides = [] }) {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-8 items-center py-4">
        {slides.map((slide, index) => {
          const id = `slide-${index}`;
          const Component = slide.Component;
          if (!Component) return null;
          return <Component key={index} id={id} title={slide.title} />;
        })}
      </div>
    </main>
  );
}

export default TemplateContent;
