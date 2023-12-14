import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { YggdrasilBolt } from "../target/types/yggdrasil_bolt";
import { Position } from "../target/types/position";
import { SystemMovement } from "../target/types/system_movement";
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
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

describe("yggdrasil-bolt", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Program
  const program = anchor.workspace.YggdrasilBolt as Program<YggdrasilBolt>;

  // Component programs
  const positionComponent = anchor.workspace.Position as Program<Position>;

  // Constants used to test the program.
  const registryPda = FindWorldRegistryPda();
  const worldPda = FindWorldPda(new BN(0));

  let entity1: PublicKey;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("InitializeWorldsRegistry", async () => {
    const initializeRegistryIx = createInitializeRegistryInstruction({
      registry: registryPda,
      payer: provider.wallet.publicKey,
    });
    const tx = new anchor.web3.Transaction().add(initializeRegistryIx);
    await provider.sendAndConfirm(tx);
  });

  it("InitializeNewWorld", async () => {
    const initializeWorldIx = createInitializeNewWorldInstruction({
      world: worldPda,
      registry: registryPda,
      payer: provider.wallet.publicKey,
    });

    const tx = new anchor.web3.Transaction().add(initializeWorldIx);
    await provider.sendAndConfirm(tx);
  });

  it("Create a new entity1", async () => {
    entity1 = FindEntityPda(new BN(0), new BN(0));

    let createEntityIx = createAddEntityInstruction({
      world: worldPda,
      payer: provider.wallet.publicKey,
      entity: entity1,
    });

    const tx = new anchor.web3.Transaction().add(createEntityIx);
    await provider.sendAndConfirm(tx);
  });

  it("Attach a position component to the entity1", async () => {
    let positionDataPda = FindComponentPda(
      positionComponent.programId,
      entity1,
      "position"
    );

    let initComponentIx = createInitializeComponentInstruction({
      payer: provider.wallet.publicKey,
      entity: entity1,
      data: positionDataPda,
      componentProgram: positionComponent.programId,
    });

    const tx = new anchor.web3.Transaction().add(initComponentIx);
    await provider.sendAndConfirm(tx, [], { skipPreflight: true });
  });
});
