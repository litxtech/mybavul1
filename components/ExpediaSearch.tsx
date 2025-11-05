import React, { useEffect, useRef } from "react";
import { useLanguage } from "../i18n";

const ExpediaSearch: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent script from being loaded multiple times
    const existingScript = document.querySelector<HTMLScriptElement>("script.eg-widgets-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js";
      script.async = true;
      script.defer = true;
      script.className = "eg-widgets-script"; // Use className to identify the script
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="mybavul-widget">
      <div
        ref={containerRef}
        className="eg-widget"
        data-widget="search"
        data-program="us-expedia"
        data-lobs="stays,flights"
        data-network="pz"
        data-camref={import.meta.env.VITE_CAMREF || "1110lq39m"}
        data-pubref={import.meta.env.VITE_PUBREF || "mybavul"}
      />
    </section>
  );
}

export default ExpediaSearch;