import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { Message, MessageBox } from "../components/message-box";

@customElement("game-page")
export class GamePage extends LitElement {
  @query("#message-box")
  accessor messageBox!: MessageBox;

  onMessage(e: CustomEvent<Message>) {
    const { author, body } = e.detail;
    console.log(body, author);
    this.messageBox.addMessage({
      body: body,
      author: author,
    });
  }

  render() {
    return html`
      <h1>Game Page</h1>

      <message-box
        @on-message="${this.onMessage}"
        id="message-box"
      ></message-box>

      <!-- <sl-menu style="max-width: 200px;">
        <sl-menu-label>Fruits</sl-menu-label>
        <sl-menu-item value="apple">Apple</sl-menu-item>
        <sl-menu-item value="banana">Banana</sl-menu-item>
        <sl-menu-item value="orange">Orange</sl-menu-item>
        <sl-divider></sl-divider>
        <sl-menu-label>Vegetables</sl-menu-label>
        <sl-menu-item value="broccoli">Broccoli</sl-menu-item>
        <sl-menu-item value="carrot">Carrot</sl-menu-item>
        <sl-menu-item value="zucchini">Zucchini</sl-menu-item>
      </sl-menu> -->
    `;
  }
}
