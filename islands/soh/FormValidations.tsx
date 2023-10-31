import { useState } from "preact/hooks";
import { ComponentChildren, FunctionComponent } from "preact";

const FormValidations: FunctionComponent = () => {
  return (
    <div>
      custom validations
      <br />
      <p>required, pattern 2-5 digits, </p>
      <form
        action=""
        onSubmit={(ev) => {
          ev.preventDefault();
          const elem =  document.getElementById("customValidations") as HTMLInputElement;
          console.log(elem.checkValidity(), elem.reportValidity());
        }}
      >
        <input id="customValidations" type="text" required pattern="\d{2,5}" />
        <br />
        <br />
        <input id="customValidations1" type="text" required />
        <br />
        <button type='button' onClick={() => {
          const elem =  document.getElementById("customValidations") as HTMLInputElement;
          console.log(elem.checkValidity(), elem.reportValidity());
        }}>report</button>
        <br />
        <button onClick={() => console.log("submitting")}>submit</button>
      </form>
    </div>
  );
};

export default FormValidations;
