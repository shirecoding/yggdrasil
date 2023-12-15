import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { consume, provide, createContext } from "@lit/context";
import { anchorClientContext } from "../layout/app-main";
import { AnchorClient, Player } from "../lib/anchor/anchorClient";
import { WORLD_ID } from "../lib/anchor/constants";

// playerContext
export const playerContext = createContext<Player | null>(Symbol("player"));

@customElement("onboard-player-page")
export class OnboardPlayerPage extends LitElement {
  @consume({ context: anchorClientContext, subscribe: true })
  @state()
  accessor anchorClient: AnchorClient | null = null;

  @provide({ context: playerContext })
  @state()
  accessor player: Player | null = null;

  async onCreateCharacter(e: CustomEvent<{ name: string }>) {
    const { name } = e.detail;

    if (this.anchorClient) {
      // // Try to create the world (might already be created and throw error)
      // try {
      //   await this.anchorClient.initializeWorld();
      // } catch (error) {
      //   console.log(`World already created: ${WORLD_ID}`);
      // }

      // Create & fetch player
      await this.anchorClient.createPlayer(name, "");
      await this.fetchPlayer();
    }
  }

  async fetchPlayer() {
    if (this.anchorClient) {
      const player = await this.anchorClient.getPlayer();
      if (player) {
        this.player = player;
      }
    }
  }

  async firstUpdated() {
    await this.fetchPlayer();
  }

  async willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("anchorClient")) {
      await this.fetchPlayer();
    }
  }

  getWelcomePlayer() {
    return html`
      <h1>Welcome ${this.player!.name}</h1>
      <sl-button type="submit" variant="primary">Enter Yggdrasil</sl-button>
    `;
  }

  getOnboardPlayer() {
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

  render() {
    return this.player ? this.getWelcomePlayer() : this.getOnboardPlayer();
  }
}
