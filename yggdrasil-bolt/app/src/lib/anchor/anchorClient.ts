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

import {
  createAddEntityInstruction,
  createInitializeComponentInstruction,
  createInitializeNewWorldInstruction,
  createInitializeRegistryInstruction,
  FindComponentPda,
  FindEntityPda,
  FindWorldPda,
  FindWorldRegistryPda,
} from "bolt-sdk";

import positionIdl from "./solana/idl/position.json";
import systemMovementIdl from "./solana/idl/system_movement.json";
import yggdrasilIdl from "./solana/idl/yggdrasil_bolt.json";
import { Position } from "./solana/types/position";
import { SystemMovement } from "./solana/types/system_movement";
import { YggdrasilBolt } from "./solana/types/yggdrasil_bolt";

import { BOLT_PROGRAM_ADDRESS } from "./constants";

// from bolt-sdk
// export declare const PROGRAM_ADDRESS = "WorLD15A7CrDwLcLy4fRqtaTb9fbd8o8iqiEMUDse2n";
// export declare const PROGRAM_ID: PublicKey;
// export declare function FindWorldRegistryPda(programId?: PublicKey): PublicKey;
// export declare function FindWorldPda(id: BN, programId?: PublicKey): PublicKey;
// export declare function FindEntityPda(worldId: BN, entityId: BN, programId?: PublicKey): PublicKey;
// export declare function FindComponentPda(componentProgramId: PublicKey, entity: PublicKey, componentId: string): PublicKey;

import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

import { Wallet, AnchorWallet } from "@solana/wallet-adapter-react";

declare global {
  interface Window {
    solana: any; // 👈️ turn off type checking
  }
}

export interface TransactionResult {
  result: SignatureResult;
  signature: TransactionSignature;
}

export class AnchorClient {
  programId: web3.PublicKey;
  cluster: string;
  connection: web3.Connection;
  provider: anchor.Provider;
  program: anchor.Program<YggdrasilBolt>;
  anchorWallet: AnchorWallet; // AnchorWallet from useAnchorWallet() to set up Anchor in the frontend
  wallet: Wallet; // The Wallet from useWallet has more functionality, but can't be used to set up the AnchorProvider

  constructor({
    programId,
    cluster,
    anchorWallet,
    wallet,
  }: {
    anchorWallet: AnchorWallet;
    wallet: Wallet;
    programId: web3.PublicKey;
    cluster?: string;
  }) {
    this.anchorWallet = anchorWallet;
    this.wallet = wallet;
    this.programId = programId;
    this.cluster = cluster || "http://127.0.0.1:8899";
    this.connection = new web3.Connection(this.cluster, "confirmed");

    console.log(
      `Connected to cluster: ${this.cluster} program: ${this.programId}`
    );

    this.provider = new anchor.AnchorProvider(
      this.connection,
      this.anchorWallet,
      anchor.AnchorProvider.defaultOptions()
    );
    this.program = new anchor.Program<YggdrasilBolt>(
      yggdrasilIdl as any,
      this.programId,
      this.provider
    );
  }

  /*
    Game Functions
  */

  async initializeNewWorld(worldId: number): Promise<TransactionResult> {
    // Only need to be called once to instantiate the world

    const registryPda = FindWorldRegistryPda();
    const worldPda = FindWorldPda(new BN(worldId));

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
    const res = await this.executeTransaction(
      new Transaction().add(initializeWorldIx)
    );

    console.log(`
      Created World: ${worldId}
      registryPda: ${registryPda}
      worldPda: ${worldPda}
    `);

    return res;
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
