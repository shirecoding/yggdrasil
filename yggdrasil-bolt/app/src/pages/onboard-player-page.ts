import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

export interface CreateCharacter {
  name: string;
}

@customElement("onboard-player-page")
export class OnboardPlayerPage extends LitElement {
  onCreateCharacter(e: CustomEvent<CreateCharacter>) {
    const { name } = e.detail;
  }

  render() {
    return html`
      <h1>Create your character</h1>

      <form-event @on-submit=${this.onCreateCharacter}>
        <form action="submit" slot="form">
          <sl-input
            label="Name"
            name="name"
            help-text="What is your character's name?"
            required
          ></sl-input>
          <br />
          <sl-button type="submit" variant="primary">Enter world</sl-button>
        </form>
      </form-event>
    `;
  }
}
