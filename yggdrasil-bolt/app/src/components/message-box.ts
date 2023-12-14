import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

@customElement("message-box")
export class MessageBox extends LitElement {
  @query("#message-list")
  accessor messageList!: HTMLElement;

  static styles = css`
    .message-list {
      overflow-y: auto;
      max-height: 300px; /* Set a maximum height for the chat window, adjust as needed */
      border: 1px solid #ccc; /* Add styling as needed */
    }
  `;

  scrollToBottom() {
    this.messageList.scrollTop = this.messageList.scrollHeight;
  }

  protected firstUpdated() {
    this.messageList.addEventListener("sl-mutation", (event) => {
      console.log(event);
      this.scrollToBottom();
    });
  }

  render() {
    return html`
      <div class="message-list" id="message-list">
        <sl-mutation-observer child-list>
          <slot></slot>
        </sl-mutation-observer>
      </div>
    `;
  }
}
