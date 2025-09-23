import { TEMPLATE_COMPONENTS } from "@/configs/overallTemplateConfig";
import { useData } from "@/contexts/DataContext";
import React, { useMemo } from "react";

function Overall() {
  const { template } = useData();

  const OverallComponent = useMemo(() => {
    return TEMPLATE_COMPONENTS[template] || TEMPLATE_COMPONENTS.default;
  }, [template]);
  return <OverallComponent />;
}

export default Overall;
