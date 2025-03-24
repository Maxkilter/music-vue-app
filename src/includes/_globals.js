import upperFirst from "lodash/upperFirst.js";
import camelCase from "lodash/camelCase.js";

export default {
  install(app) {
    const baseComponents = import.meta.glob("../components/base/*.vue", {
      eager: true,
    });
    Object.entries(baseComponents).forEach(([path, module]) => {
      const componentName = upperFirst(
        camelCase(path.replace(/^.*[\\/]/, "").replace(/\.\w+$/, "")),
      );
      app.component(`Base${componentName}`, module.default);
    });
  },
};
