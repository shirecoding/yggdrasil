import { LitElement, html, css, PropertyValues, PropertyValueMap } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { Message, MessageBox } from "../components/message-box";
import { consume, provide, createContext } from "@lit/context";
import { playerInfoContext } from "./onboard-player-page";
import { PlayerInfo } from "../lib/anchor/anchorClient";
import { anchorClientContext } from "../layout/app-main";
import { AnchorClient, CreatureData, Player } from "../lib/anchor/anchorClient";

@customElement("game-page")
export class GamePage extends LitElement {
  @consume({ context: anchorClientContext, subscribe: true })
  @state()
  accessor anchorClient: AnchorClient | null = null;

  @state()
  accessor playerInfo: PlayerInfo | null = null;

  @state()
  accessor allPlayerCreatures: PlayerInfo[] | null = null;

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
    .portrait {
      height: 150px;
      padding: 5px;
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

  async fetchPlayer() {
    if (this.anchorClient) {
      this.playerInfo = await this.anchorClient.getPlayerInfo();
      await this.firstAllPlayers();
    }
  }

  async willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("anchorClient")) {
      await this.fetchPlayer();
    }
  }

  async firstAllPlayers() {
    if (this.anchorClient) {
      const creatures = await this.anchorClient.getAllPlayers();
      console.log(creatures);
    }
  }

  render() {
    return html`
      <h1>Game Page</h1>

      <img src="${this.playerInfo?.portrait}" class="portrait" />
      <p>
        hp: ${this.playerInfo?.creature.hp}/${this.playerInfo?.creature.maxHp}
      </p>
      <p>
        mp: ${this.playerInfo?.creature.mp}/${this.playerInfo?.creature.maxMp}
      </p>

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
