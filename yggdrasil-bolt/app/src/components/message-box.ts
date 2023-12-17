import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

export interface Message {
  body: string;
  author: string;
}

@customElement("message-box")
export class MessageBox extends LitElement {
  @query("#message-list")
  accessor messageList!: HTMLElement;

  @query("#message-form")
  accessor messageForm: any;

  @query("#message-input")
  accessor messageInput: any;

  static styles = css`
    .message-list {
      overflow-y: auto;
      height: 150px;
      border: 1px solid #ccc; /* Add styling as needed */
    }
  `;

  addMessage(message: Message) {
    const item = document.createElement("chat-message");
    item.innerHTML = message.body + "<br/>";
    item.setAttribute(
      "msgType",
      message.author === "system" ? "msg-receive" : "msg-send"
    );
    this.appendChild(item);

    // Scroll to bottom
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messageList.scrollTop = this.messageList.scrollHeight;
  }

  onMessage(e: CustomEvent) {
    // Dispatch on-message
    this.dispatchEvent(
      new CustomEvent<Message>("on-message", {
        bubbles: true,
        composed: true,
        detail: {
          body: e.detail.message.toString(),
          author: "",
        },
      })
    );

    // Clear input
    this.messageInput.value = "";
  }

  render() {
    return html`
      <div class="message-list" id="message-list">
        <slot></slot>
      </div>
      <br />
      <form-event @on-submit=${this.onMessage}>
        <form action="submit" slot="form">
          <sl-input name="message" size="large" id="message-input">
            <sl-icon-button
              type="submit"
              name="chat"
              slot="suffix"
            ></sl-icon-button>
          </sl-input>
        </form>
      </form-event>
    `;
  }
}
