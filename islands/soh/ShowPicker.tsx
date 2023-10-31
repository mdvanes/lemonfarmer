import { useState } from "preact/hooks";
import { ComponentChildren, FunctionComponent } from "preact";

const ShowPicker: FunctionComponent = () => {
  return (
    <div>
        showPicker()
        <br />
        <input id="dateInput" type="date" />
        <br />
        <button
          onClick={() =>
            (
              document.getElementById("dateInput") as HTMLInputElement
            ).showPicker()
          }
        >
          Select date
        </button>
      </div>
  );
};

export default ShowPicker;