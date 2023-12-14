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

  static styles = css`
    .message-list {
      overflow-y: auto;
      min-height: 200px;
      max-height: 300px; /* Set a maximum height for the chat window, adjust as needed */
      border: 1px solid #ccc; /* Add styling as needed */
    }
  `;

  addMessage(message: Message) {
    const item = document.createElement("chat-message");
    item.innerHTML = message.body;
    item.setAttribute(
      "msgType",
      message.author === "system" ? "msg-receive" : "msg-send"
    );
    // Add it to the light DOM
    this.appendChild(item);
  }

  scrollToBottom() {
    this.messageList.scrollTop = this.messageList.scrollHeight;
  }

  protected firstUpdated() {
    // Scroll to bottom on mutation
    this.messageList.addEventListener("sl-mutation", (event) => {
      console.log("scroll to bottom");
      this.scrollToBottom();
    });

    this.messageForm.addEventListener("submit", (e: FormDataEvent) => {
      e.preventDefault(); // prevent refresh browser
      new FormData(this.messageForm); // construct a FormData object, which fires the formdata event
    });

    this.messageForm.addEventListener("formdata", (e: FormDataEvent) => {
      const parsed = Object.fromEntries(Array.from(e.formData.entries()));
      // Dispatch on-create event
      this.dispatchEvent(
        new CustomEvent<Message>("on-message", {
          bubbles: true,
          composed: true,
          detail: {
            body: parsed.message.toString(),
            author: "",
          },
        })
      );
    });
  }

  render() {
    return html`
      <div class="message-list" id="message-list">
        <sl-mutation-observer child-list>
          <slot></slot>
        </sl-mutation-observer>
      </div>
      <br />
      <form action="submit" id="message-form">
        <sl-input name="message" size="large">
          <sl-icon-button
            type="submit"
            name="chat"
            slot="suffix"
          ></sl-icon-button>
        </sl-input>
      </form>
    `;
  }
}
