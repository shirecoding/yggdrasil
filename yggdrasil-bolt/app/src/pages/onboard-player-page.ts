import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { consume } from "@lit/context";
import { anchorClientContext } from "../layout/app-main";
import { AnchorClient } from "../lib/anchor/anchorClient";
import { WORLD_ID } from "../lib/anchor/constants";

export interface CreateCharacter {
  name: string;
}

@customElement("onboard-player-page")
export class OnboardPlayerPage extends LitElement {
  @consume({ context: anchorClientContext, subscribe: true })
  @state()
  accessor anchorClient: AnchorClient | null = null;

  async onCreateCharacter(e: CustomEvent<CreateCharacter>) {
    const { name } = e.detail;

    if (this.anchorClient) {
      // Try to create the world (might already be created and throw error)
      try {
        await this.anchorClient.initializeWorld();
      } catch (error) {
        console.log(`World already created: ${WORLD_ID}`);
      }
      // Create player
      await this.anchorClient.createPlayer();
    }
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
