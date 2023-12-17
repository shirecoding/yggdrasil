import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  Transaction,
  Signer,
  PublicKey,
  SignatureResult,
  TransactionSignature,
  ParsedAccountData,
} from "@solana/web3.js";
import BN from "bn.js";
import { serializeArgs } from "./utils";

import {
  createAddEntityInstruction,
  createApplyInstruction,
  createInitializeComponentInstruction,
  createInitializeNewWorldInstruction,
  createInitializeRegistryInstruction,
  FindComponentPda,
  FindEntityPda,
  FindWorldPda,
  FindWorldRegistryPda,
  World,
} from "bolt-sdk";

import yggdrasilIdl from "./target/idl/yggdrasil_bolt.json";
import creatureIdl from "./target/idl/creature.json";
import modifyCreatureIdl from "./target/idl/modify_creature.json";
import sourcePerformActionOnTargetUsingIdl from "./target/idl/source_perform_action_on_target_using.json";

import { YggdrasilBolt } from "./target/types/yggdrasil_bolt";
import { Creature } from "./target/types/creature";
import { ModifyCreature } from "./target/types/modify_creature";
import { SourcePerformActionOnTargetUsing } from "./target/types/source_perform_action_on_target_using";

import { WORLD_ID, PROGRAM_IDS } from "./defs";
import { nft_uri_to_url } from "../utils";

import { Wallet, AnchorWallet } from "@solana/wallet-adapter-react";

declare global {
  interface Window {
    solana: any; // 👈️ turn off type checking
  }
}

export interface Player {
  name: string;
  uri: string;
  bump: number;
  entity: PublicKey;
}

export interface CreatureData {
  logged_in: boolean;
  // state
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  state: number; // 0: alive, 1: dead
  // modifiers
  level: number;
}

export interface PlayerInfo {
  player: Player;
  portrait: string;
  creature: CreatureData;
}

enum Modification {
  Initialize = "Initialize",
}

enum Action {
  Damage = "Damage",
}

export interface TransactionResult {
  result: SignatureResult;
  signature: TransactionSignature;
}

export interface Programs {
  yggdrasil: anchor.Program<YggdrasilBolt>;
  creature: anchor.Program<Creature>;
  modifyCreature: anchor.Program<ModifyCreature>;
  sourcePerformActionOnTargetUsing: anchor.Program<SourcePerformActionOnTargetUsing>;
}

export class AnchorClient {
  cluster: string;
  connection: web3.Connection;
  provider: anchor.Provider;
  programs: Programs;
  anchorWallet: AnchorWallet; // AnchorWallet from useAnchorWallet() to set up Anchor in the frontend
  wallet: Wallet; // The Wallet from useWallet has more functionality, but can't be used to set up the AnchorProvider

  constructor({
    cluster,
    anchorWallet,
    wallet,
  }: {
    anchorWallet: AnchorWallet;
    wallet: Wallet;
    cluster?: string;
  }) {
    this.anchorWallet = anchorWallet;
    this.wallet = wallet;

    if (process.env.ENVIRONMENT === "devnet") {
      this.cluster = "https://api.devnet.solana.com";
    } else if (process.env.ENVIRONMENT === "localnet") {
      this.cluster = "http://127.0.0.1:8899";
    } else if (process.env.ENVIRONMENT === "mainnet") {
      this.cluster = "https://api.mainnet-beta.solana.com";
    } else {
      throw new Error(`Invalid ENVIRONMENT=${process.env.ENVIRONMENT}`);
    }
    this.connection = new web3.Connection(this.cluster, "confirmed");
    console.log(`Connected to cluster: ${this.cluster}`);

    this.provider = new anchor.AnchorProvider(
      this.connection,
      this.anchorWallet,
      anchor.AnchorProvider.defaultOptions()
    );

    this.programs = {
      yggdrasil: new anchor.Program<YggdrasilBolt>(
        yggdrasilIdl as any,
        PROGRAM_IDS[process.env.ENVIRONMENT].yggdrasil,
        this.provider
      ),
      creature: new anchor.Program<Creature>(
        creatureIdl as any,
        PROGRAM_IDS[process.env.ENVIRONMENT].creature,
        this.provider
      ),
      modifyCreature: new anchor.Program<ModifyCreature>(
        modifyCreatureIdl as any,
        PROGRAM_IDS[process.env.ENVIRONMENT].modifyCreature,
        this.provider
      ),
      sourcePerformActionOnTargetUsing:
        new anchor.Program<SourcePerformActionOnTargetUsing>(
          sourcePerformActionOnTargetUsingIdl as any,
          PROGRAM_IDS[process.env.ENVIRONMENT].sourcePerformActionOnTargetUsing,
          this.provider
        ),
    };
  }

  /*
    Game Functions
  */

  async initializeWorld(): Promise<TransactionResult> {
    // Only need to be called once to instantiate the world

    const registryPda = FindWorldRegistryPda();
    const worldPda = FindWorldPda(new BN(WORLD_ID));

    const initializeRegistryIx = createInitializeRegistryInstruction({
      registry: registryPda,
      payer: this.anchorWallet.publicKey,
    });
    await this.executeTransaction(new Transaction().add(initializeRegistryIx));

    const initializeWorldIx = createInitializeNewWorldInstruction({
      world: worldPda,
      registry: registryPda,
      payer: this.anchorWallet.publicKey,
    });

    console.log(`
      Creating World: ${WORLD_ID}
      registryPda: ${registryPda}
      worldPda: ${worldPda}
    `);

    return await this.executeTransaction(
      new Transaction().add(initializeWorldIx)
    );
  }

  getPlayerPda(wallet?: web3.PublicKey): [web3.PublicKey, number] {
    return web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("player"),
        wallet !== undefined
          ? wallet.toBuffer()
          : this.anchorWallet.publicKey.toBuffer(),
      ],
      this.programs.yggdrasil.programId
    );
  }

  async getPlayer(): Promise<Player | null> {
    const [pda, _] = this.getPlayerPda();
    try {
      return await this.programs.yggdrasil.account.player.fetch(pda);
    } catch (error) {
      return null;
    }
  }

  async getPlayerInfo(): Promise<PlayerInfo | null> {
    // get player
    const player = await this.getPlayer();
    if (player) {
      // get creature
      const creature = await this.getCreature(player.entity);
      // get portrait
      const playerMetadata = await (
        await fetch(nft_uri_to_url(player.uri))
      ).json();
      const portrait = nft_uri_to_url(playerMetadata.image);
      return {
        player,
        portrait,
        creature,
      };
    }
    return null;
  }

  async getCreature(entity: PublicKey): Promise<CreatureData> {
    const creature = FindComponentPda(
      this.programs.creature.programId,
      entity,
      "creature"
    );
    let res: any =
      await this.programs.creature.account.creature.fetch(creature);
    return res as CreatureData;
  }

  async createPlayer(name: string, uri: string): Promise<TransactionResult> {
    // create creature entity
    const [entity, creature] = await this.createCreature(
      this.anchorWallet.publicKey
    );

    const [player, _] = this.getPlayerPda();

    const ix = await this.programs.yggdrasil.methods
      .createPlayer(entity, name, uri)
      .accounts({
        player: player,
        signer: this.anchorWallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();

    const tx = new Transaction();
    tx.add(ix);

    console.log(`
      wallet: ${this.anchorWallet.publicKey}
      player: ${player}
      entity: ${entity}
      creature: ${creature}
    `);

    return await this.executeTransaction(tx);
  }

  async createCreature(authority: PublicKey): Promise<[PublicKey, PublicKey]> {
    // create entity and creature for player
    const worldId = new BN(WORLD_ID);
    const world = FindWorldPda(worldId);
    const entityId = (await World.fromAccountAddress(this.connection, world))
      .entities as BN;

    // get next entity id
    const entity = FindEntityPda(worldId, entityId);

    // create entity
    await this.executeTransaction(
      new Transaction().add(
        createAddEntityInstruction({
          world: world,
          payer: authority,
          entity: entity,
        })
      )
    );

    // create creature
    const creature = FindComponentPda(
      this.programs.creature.programId,
      entity,
      "creature"
    );
    await this.executeTransaction(
      new Transaction().add(
        createInitializeComponentInstruction({
          payer: authority,
          entity: entity,
          data: creature,
          componentProgram: this.programs.creature.programId,
        })
      )
    );

    // initialize creature
    await this.executeTransaction(
      new Transaction().add(
        createApplyInstruction(
          {
            componentProgram: this.programs.creature.programId,
            boltComponent: creature,
            boltSystem: this.programs.modifyCreature.programId,
          },
          {
            args: serializeArgs({
              modification: Modification.Initialize,
              authority: authority.toString(),
            }),
          }
        )
      )
    );
    return [entity, creature];
  }

  /*
    Utils
  */
  async confirmTransaction(
    signature: string,
    commitment?: web3.Commitment
  ): Promise<TransactionResult> {
    const bh = await this.connection.getLatestBlockhash();
    const result = (
      await this.connection.confirmTransaction(
        {
          blockhash: bh.blockhash,
          lastValidBlockHeight: bh.lastValidBlockHeight,
          signature: signature,
        },
        commitment
      )
    ).value;

    console.log(`Transaction: ${signature} Result: ${result}`);

    return { result, signature };
  }

  async executeTransaction(
    tx: Transaction,
    signers?: Array<Signer>
  ): Promise<TransactionResult> {
    // set latest blockhash
    tx.recentBlockhash = (
      await this.connection.getLatestBlockhash("confirmed")
    ).blockhash;

    // set payer
    tx.feePayer = this.anchorWallet.publicKey;

    // additional signers if required
    if (signers) {
      tx.partialSign(...signers);
    }

    // sign and send
    const signature = await this.connection.sendRawTransaction(
      (await this.anchorWallet.signTransaction(tx)).serialize()
    );

    // confirm transaction
    return await this.confirmTransaction(signature);
  }

  async requestAirdrop(amount: number): Promise<TransactionResult> {
    const signature = await this.connection.requestAirdrop(
      this.anchorWallet.publicKey,
      amount
    );
    // confirm transaction
    return await this.confirmTransaction(signature);
  }
}
