import { Handlers, PageProps, Status } from "$fresh/server.ts";
import FormValidations from "../../islands/soh/FormValidations.tsx";
import ShowPicker from "../../islands/soh/ShowPicker.tsx";
import TabsGroup from "../../islands/soh/TabsGroup.tsx";

interface Props {
  foo: string;
}

export const handler: Handlers<Props> = {
  async GET(_, ctx) {
    try {
      return ctx.render({ foo: "hoi " });
    } catch (err) {
      return new Response("Can't retrieve waypoints", {
        status: Status.NotFound,
      });
    }
  },
};

export default function Home({ data: { foo } }: PageProps<Props>) {
  return (
    <div class="soh">
      state of html
      <div>
        datalist:
        <label for="ice-cream-choice">Choose a flavor:</label>
        <input
          list="ice-cream-flavors"
          id="ice-cream-choice"
          name="ice-cream-choice"
        />
        <datalist id="ice-cream-flavors">
          <option value="Chocolate"></option>
          <option value="Coconut"></option>
          <option value="Mint"></option>
          <option value="Strawberry"></option>
          <option value="Vanilla"></option>
        </datalist>
      </div>
      {/*  */}
      <div>
        capture video:
        <br />
        <input type="file" accept="video/*" capture />
      </div>
      {/*  */}
      <ShowPicker />
      {/*  */}
      <div>
        FormData()
        <br />
        <form id="form">
          <input type="text" name="text1" value="foo" />
          <input type="text" name="text2" value="bar" />
          <input type="text" name="text2" value="baz" />
          <input type="checkbox" name="check" checked disabled />
          <button name="intent" value="save">
            Save
          </button>
          <button name="intent" value="saveAsCopy">
            Save As Copy
          </button>
        </form>
        <output id="output"></output>
        {/* const form = document.getElementById("form");
const submitter = document.querySelector("button[value=save]");
const formData = new FormData(form, submitter);

const output = document.getElementById("output");

for (const [key, value] of formData) {
  output.textContent += `${key}: ${value}\n`;
} */}
      </div>
      {/* ******************************************************************** */}
      <div>
        selectlist (not yet implemented)
        {/* <selectlist>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </selectlist> */}
      </div>
      {/* ******************************************************************** */}
      <FormValidations />
      {/* ******************************************************************** */}
      <div>
        expand/collapse (details disclosure) works. exclusive accordion is NYI
        <div class="details-group">
          <details open name="foo1" id="d1">
            <summary>Details 1</summary>
            <p>Longer content</p>
          </details>
          <details name="foo1" id="d2">
            <summary>Details 2</summary>
            <p>Longer content</p>
          </details>
          <details name="foo1" id="d3">
            <summary>Details 3</summary>
            <p>Longer content</p>
          </details>
        </div>
        <TabsGroup />
      </div>
    </div>
  );
}
