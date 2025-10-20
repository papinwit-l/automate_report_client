import BlankMediaPlan from "@/components/custom-templates/BlankMediaPlan";
import EndSlideCustom from "@/components/custom-templates/EndSlideCustom";
import TitleSlideCustom from "@/components/custom-templates/TitleSlideCustom";

export const START_TEMPLATES = [
  {
    title: "Title",
    Component: TitleSlideCustom,
  },
  {
    title: "Media Plan",
    Component: BlankMediaPlan,
  },
  {
    title: "End Slide",
    Component: EndSlideCustom,
  },
];
