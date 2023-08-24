import { ComponentChildren } from "preact";

const Lcars = ({
  children,
  systemName,
}: {
  children: ComponentChildren;
  systemName: string;
}) => {
  return (
    <div class="lcars">
      <div class="top">
        <div class="title">LEMON FARMER</div>
      </div>
      <div class="bottom">
        <div class="left">
          <ul>
            <li>{systemName.toUpperCase()}</li>
            <li class="spacer"></li>
            <li class="button">
              <a href="/systems">SYSTEMS</a>
            </li>
            <li class="button">
              <a href="/">AGENT HQ</a>
            </li>
          </ul>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Lcars;
