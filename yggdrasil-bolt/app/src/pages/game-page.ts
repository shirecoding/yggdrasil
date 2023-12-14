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

  render() {
    return html`
      <onboard-player-page></onboard-player-page>
      <!-- <h1>Game Page</h1>
      <message-box
        @on-message="${this.onMessage}"
        id="message-box"
      ></message-box> -->
    `;
  }
}
