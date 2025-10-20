import TemplateContent from "@/components/template-manager/TemplateContent";
import TemplateManagerHeader from "@/components/template-manager/TemplateManagerHeader";
import TemplateManagerToolbar from "@/components/template-manager/TemplateManagerToolbar";
import { START_TEMPLATES } from "@/configs/templateManagerConfig";
import React, { useState } from "react";

function TemplateManager() {
  const [slideTemplates, setSlideTemplates] = useState(START_TEMPLATES);

  return (
    <div className="w-screen h-screen flex flex-col">
      <TemplateManagerHeader />
      <div className="flex-1 flex min-h-0">
        <TemplateManagerToolbar
          slideTemplates={slideTemplates}
          setSlideTemplates={setSlideTemplates}
        />
        <TemplateContent slides={slideTemplates} />
      </div>
    </div>
  );
}

export default TemplateManager;
