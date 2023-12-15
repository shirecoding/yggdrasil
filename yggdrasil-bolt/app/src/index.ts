// shoelace
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/rating/rating.js";
import "@shoelace-style/shoelace/dist/components/card/card.js";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
import "@shoelace-style/shoelace/dist/components/carousel/carousel.js";
import "@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import "@shoelace-style/shoelace/dist/components/spinner/spinner.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/qr-code/qr-code.js";
import "@shoelace-style/shoelace/dist/components/divider/divider.js";

import "@shoelace-style/shoelace/dist/components/menu-label/menu-label.js";
import "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js";
import "@shoelace-style/shoelace/dist/components/menu/menu.js";

import "@shoelace-style/shoelace/dist/components/mutation-observer/mutation-observer.js";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
setBasePath("shoelace");

// some libraries like BN.js require this
window.Buffer = window.Buffer || require("buffer").Buffer;

// app-layout
import "@polymer/app-layout/app-layout.js";

// custom
import "./layout/app-main";
import "./pages/onboard-wallet-page";
import "./pages/onboard-player-page";
import "./pages/game-page";
import "./components/form-event";
import "./components/solana-wallet";
import "./components/message-box";
