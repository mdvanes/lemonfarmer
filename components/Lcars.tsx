import { ComponentChildren } from "preact";
import NavLink from "../islands/NavLink.tsx";

export const APP_TITLE_FANCY = "🍋 Lemon 👨‍🌾 Farmer";
export const APP_TITLE = "Lemon Farmer";

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
        <div class="title">{APP_TITLE.toUpperCase()}</div>
      </div>
      <div class="bottom">
        <div class="left">
          <ul>
            <li>{systemName.toUpperCase()}</li>
            <li class="spacer"></li>
            <li class="button">
              <NavLink title="go to systems overview" href="/systems">
                SYSTEMS
              </NavLink>
            </li>
            <li class="button">
              <NavLink title="go to agent hq system" href="/">
                AGENT HQ
              </NavLink>
            </li>
          </ul>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Lcars;
