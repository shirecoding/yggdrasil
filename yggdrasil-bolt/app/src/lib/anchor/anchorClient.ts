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

import positionIdl from "./solana/idl/position.json";
import systemMovementIdl from "./solana/idl/system_movement.json";
import yggdrasilIdl from "./solana/idl/yggdrasil_bolt.json";
import { Position } from "./solana/types/position";
import { SystemMovement } from "./solana/types/system_movement";
import { YggdrasilBolt } from "./solana/types/yggdrasil_bolt";

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
