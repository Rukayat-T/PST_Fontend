import React, { useState } from "react";

import CreatableSelect from "react-select/creatable";
// import { colourOptions } from './docs/data';

// export default () => <CreatableSelect isClearable options={colourOptions} />;

function CreatableSelectComp() {
  const [values, setValues] = useState<any>([]);

  const opts = [
    { label: "potato", value: "potato" },
    { label: "tomtato", value: "tomtato" },
  ];
  return <CreatableSelect isClearable isMulti options={opts} value={values} onChange={setValues} />;
}

export default CreatableSelectComp;
