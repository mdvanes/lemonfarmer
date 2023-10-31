import { useState } from "preact/hooks";
import { ComponentChildren, FunctionComponent } from "preact";

const TabsGroup: FunctionComponent = () => {
  const [openId, setOpenId] = useState(1);

  const handleToggle = (id: number) => (ev: any) => {
    ev.preventDefault();
    if ((ev.target as any).open) {
      setOpenId(id);
    }
  };

  return (
    <div class="tabs-group">
      <details
        open={openId === 1}
        name="foo1"
        id="d1"
        onToggle={handleToggle(1)}
      >
        <summary>Details 1</summary>
        <p>Longer content</p>
      </details>
      <details
        name="foo1"
        id="d2"
        open={openId === 2}
        onToggle={handleToggle(2)}
      >
        <summary>Details 2</summary>
        <p>The other Longer content</p>
      </details>
      <details
        name="foo1"
        id="d3"
        open={openId === 3}
        onToggle={handleToggle(3)}
      >
        <summary>Details 3</summary>
        <p>And another Longer content</p>
      </details>
    </div>
  );
};

export default TabsGroup;
