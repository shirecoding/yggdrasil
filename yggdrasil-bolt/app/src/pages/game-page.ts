import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { Message, MessageBox } from "../components/message-box";

@customElement("game-page")
export class GamePage extends LitElement {
  @query("#message-box")
  accessor messageBox!: MessageBox;

  onMessage(e: CustomEvent<Message>) {
    const { author, body } = e.detail;
    this.messageBox.addMessage({
      body: body,
      author: author,
    });
  }

  static styles = css`
    .container {
      display: flex;
      height: 100vh;
    }

    .main-content {
      flex: 1;
      padding: 10px;
    }

    .right-menu {
      width: 200px;
      padding: 10px;
    }
  `;

  render() {
    return html`
      <h1>Game Page</h1>
      <div class="container">
        <div class="main-content">
          <message-box
            @on-message="${this.onMessage}"
            id="message-box"
          ></message-box>
        </div>
        <div class="right-menu">
          <sl-menu class="menu-value" style="max-width: 200px;">
            <sl-menu-item value="opt-1">Option 1</sl-menu-item>
            <sl-menu-item value="opt-2">Option 2</sl-menu-item>
            <sl-menu-item value="opt-3">Option 3</sl-menu-item>
            <sl-divider></sl-divider>
            <sl-menu-item type="checkbox" value="opt-4"
              >Checkbox 4</sl-menu-item
            >
            <sl-menu-item type="checkbox" value="opt-5"
              >Checkbox 5</sl-menu-item
            >
            <sl-menu-item type="checkbox" value="opt-6"
              >Checkbox 6</sl-menu-item
            >
          </sl-menu>
        </div>
      </div>
    `;
  }
}
