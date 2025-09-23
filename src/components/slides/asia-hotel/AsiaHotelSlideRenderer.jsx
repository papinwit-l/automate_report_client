import React from "react";
import SectionSlide from "../SectionSlide";

function AsiaHotelSlideRenderer({
  checkSlideDetected,
  slideTypes,
  sectionData = { title: "", id: "" },
}) {
  // Check if any Google slides are detected
  const hasGoogleSlides = Object.keys(slideTypes).some((slideKey) =>
    checkSlideDetected(slideKey)
  );

  // Render nothing if no Google slides are detected
  if (!hasGoogleSlides) return null;

  return (
    <>
      <SectionSlide title={sectionData.title} componentID={sectionData.id} />
      {Object.entries(slideTypes).map(
        ([slideKey, slides]) =>
          checkSlideDetected(slideKey) &&
          slides.map((SlideComponent, index) => (
            <SlideComponent key={`${slideKey}-${index}`} />
          ))
      )}
    </>
  );
}

export default AsiaHotelSlideRenderer;
