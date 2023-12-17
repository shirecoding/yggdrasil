import { LitElement, html, css, PropertyValues, PropertyValueMap } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { Message, MessageBox } from "../components/message-box";
import { consume, provide, createContext } from "@lit/context";
import { playerInfoContext } from "./onboard-player-page";
import { PlayerInfo } from "../lib/anchor/anchorClient";
import { anchorClientContext } from "../layout/app-main";
import { AnchorClient, CreatureData, Player } from "../lib/anchor/anchorClient";
import { PublicKey } from "@solana/web3.js";

const regex = /attack(.*)/i;

@customElement("game-page")
export class GamePage extends LitElement {
  @consume({ context: anchorClientContext, subscribe: true })
  @state()
  accessor anchorClient: AnchorClient | null = null;

  @state()
  accessor playerInfo: PlayerInfo | null = null;

  @state()
  accessor allPlayerCreatures: [PublicKey, CreatureData][] | null = null;

  @query("#message-box")
  accessor messageBox!: MessageBox;

  async onMessage(e: CustomEvent<Message>) {
    const { author, body } = e.detail;
    this.messageBox.addMessage({
      body: body,
      author: author,
    });

    // HARD CODED ATTACK
    if (this.allPlayerCreatures) {
      const match = body.match(regex);

      if (match && match[1]) {
        const target = match[1].trim().toLowerCase();

        console.log(`You attacked ${target}`);

        // find the target
        this.allPlayerCreatures.forEach(async ([targetPda, creature]) => {
          if (
            this.anchorClient &&
            this.playerInfo &&
            creature.name.toLowerCase() === target
          ) {
            console.log(`FOUND TARGET ${targetPda}`);
            await this.anchorClient.attackCreature(
              this.playerInfo.creaturePda,
              targetPda
            );
          }
        });
      }
    }
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
    }
  }

  async willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("anchorClient")) {
      await this.fetchPlayer();
      await this.fetchAllPlayerCreatures();
    }
  }

  async fetchAllPlayerCreatures() {
    if (this.anchorClient) {
      this.allPlayerCreatures =
        await this.anchorClient.getAllPlayerCreaturesLoggedIn();
    }
  }

  getPlayerList() {
    if (this.allPlayerCreatures) {
      return html`
        <sl-menu class="menu-value" style="width: 300px;">
          ${this.allPlayerCreatures.map(([pda, creature]) => {
            return html`<sl-menu-item
              >${creature.name} (hp:
              ${creature.hp}/${creature.maxHp})</sl-menu-item
            >`;
          })}
        </sl-menu>
      `;
    } else {
      return html`
        <sl-menu class="menu-value" style="width: 300px;">
          <sl-menu-item value="opt-1">No one is here</sl-menu-item>
        </sl-menu>
      `;
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
        ${this.getPlayerList()}
      </div>
    `;
  }
}
