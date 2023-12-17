import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { consume, provide, createContext } from "@lit/context";
import {
  anchorClientContext,
  nftStorageClientContext,
} from "../layout/app-main";
import { AnchorClient, CreatureData, Player } from "../lib/anchor/anchorClient";
import { WORLD_ID } from "../lib/anchor/defs";
import { DEFAULT_PORTRAITS } from "../lib/defs";
import { NFTStorageClient } from "../lib/nftStorageClient";
import { nft_uri_to_url } from "../lib/utils";
import { PlayerInfo } from "../lib/anchor/anchorClient";

// playerInfoContext
export const playerInfoContext = createContext<PlayerInfo | null>(
  Symbol("player-info")
);

@customElement("onboard-player-page")
export class OnboardPlayerPage extends LitElement {
  @consume({ context: anchorClientContext, subscribe: true })
  @state()
  accessor anchorClient: AnchorClient | null = null;

  @consume({ context: nftStorageClientContext, subscribe: true })
  @state()
  accessor nftStorageClient: NFTStorageClient | null = null;

  @provide({ context: playerInfoContext })
  @state()
  accessor playerInfo: PlayerInfo | null = null;

  @state()
  accessor processing: string = "";

  async onCreateCharacter(e: CustomEvent<{ name: string; portrait: string }>) {
    const { name, portrait } = e.detail;

    if (this.anchorClient && this.nftStorageClient) {
      this.processing = "uploading portrait to IPFS ...";
      // Create NFT Storage for portrait
      const uri = await this.nftStorageClient.storeImageFromUrl({
        name,
        description: "",
        imageUrl: portrait,
      });

      console.log(`Stored portrait at ${uri}`);

      // Create & fetch player
      this.processing = `creating player ${name}, entity, creatures ...`;
      await this.anchorClient.createPlayer(name, uri);
      this.processing = `fetching player ${name} ...`;
      await this.fetchPlayer();

      // go to game on success created
      window.location.href = "/game";
    }
  }

  async fetchPlayer() {
    if (this.anchorClient) {
      const playerInfo = await this.anchorClient.getPlayerInfo();
      if (playerInfo) {
        this.playerInfo = playerInfo; // set context
      }
    }
  }

  async firstUpdated() {
    await this.fetchPlayer();
  }

  async willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("anchorClient")) {
      // Try to create the world (might already be created and throw error)
      if (this.anchorClient && WORLD_ID < 0) {
        await this.anchorClient.initializeWorld();
      }
      await this.fetchPlayer();
    }
  }

  static styles = css`
    .hidden {
      display: none;
    }
    .portrait {
      height: 150px;
      padding: 5px;
    }
    .portrait:hover {
      outline: 2px solid #3498db;
    }
    .portrait-input:checked + label img {
      outline: 2px solid #e74c3c;
    }
    .processing {
      color: red;
    }
  `;

  getWelcomePlayer() {
    const player = this.playerInfo!.player;
    const portrait = this.playerInfo!.portrait;
    return html`
      <h1>Welcome ${player.name}</h1>
      <img src="${portrait}" class="portrait" />
      <br />
      <a href="/game">
        <sl-button type="submit" variant="primary">Enter Yggdrasil</sl-button>
      </a>
    `;
  }

  getOnboardPlayer() {
    return html`
      <h1>Create your character</h1>
      <p class="processing">${this.processing}</p>
      <form-event @on-submit=${this.onCreateCharacter}>
        <form action="submit" slot="form">
          <!-- Name -->
          <sl-input
            label="Name"
            name="name"
            help-text="What is your character's name?"
            required
          ></sl-input>
          <br />
          <!-- Portrait -->
          ${Object.entries(DEFAULT_PORTRAITS).map(([imageId, imagePath]) => {
            return html`
              <input
                type="radio"
                name="portrait"
                id="${imageId}"
                class="hidden portrait-input"
                value="${imagePath}"
                required
              />
              <label for="${imageId}">
                <img src="${imagePath}" alt="${imageId}" class="portrait" />
              </label>
            `;
          })}
          <br />
          <sl-button type="submit" variant="primary">Enter Yggdrasil</sl-button>
        </form>
      </form-event>
    `;
  }

  render() {
    return this.playerInfo ? this.getWelcomePlayer() : this.getOnboardPlayer();
  }
}
