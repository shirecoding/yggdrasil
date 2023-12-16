import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { YggdrasilBolt } from "../target/types/yggdrasil_bolt";
import { Creature } from "../target/types/creature";
import { SourcePerformActionOnTargetUsing } from "../target/types/source_perform_action_on_target_using";
import { ModifyCreature } from "../target/types/modify_creature";
import {
  createAddEntityInstruction,
  createInitializeComponentInstruction,
  createInitializeNewWorldInstruction,
  createInitializeRegistryInstruction,
  createApplyInstruction,
  FindComponentPda,
  FindEntityPda,
  FindWorldPda,
  FindWorldRegistryPda,
  World,
} from "bolt-sdk";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { expect } from "chai";

import worldIdl from "./fixtures/world.json";

enum Modification {
  Initialize = "Initialize",
}

function serializeArgs(args: any = {}) {
  const jsonString = JSON.stringify(args);
  const encoder = new TextEncoder();
  const binaryData = encoder.encode(jsonString);
  return Buffer.from(
    binaryData.buffer,
    binaryData.byteOffset,
    binaryData.byteLength
  );
}

describe("yggdrasil-bolt", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // do this or use World.fromAccountAddress
  const worldProgram = new Program(
    worldIdl as any,
    "WorLD15A7CrDwLcLy4fRqtaTb9fbd8o8iqiEMUDse2n",
    provider
  );

  // Programs
  const programs = {
    world: worldProgram,
    yggdrasil: anchor.workspace.YggdrasilBolt as Program<YggdrasilBolt>,
    creature: anchor.workspace.Creature as Program<Creature>,
    modifyCreature: anchor.workspace.ModifyCreature as Program<ModifyCreature>,
    sourcePerformActionOnTargetUsing: anchor.workspace
      .SourcePerformActionOnTargetUsing as Program<SourcePerformActionOnTargetUsing>,
  };

  // Constants used to test the program.
  const worldId = new BN(0);
  const registryPda = FindWorldRegistryPda();
  const worldPda = FindWorldPda(worldId);

  let sourceCreature: PublicKey;
  let targetCreature: PublicKey;
  let usingCreature: PublicKey;

  let sourceCreatureComponentPda: PublicKey;
  let targetCreatureComponentPda: PublicKey;
  let usingCreatureComponentPda: PublicKey;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await programs.yggdrasil.methods.initialize().rpc();
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

  it("Create entities and corresponding components", async () => {
    // get world entity counter
    let entityCount = (
      await World.fromAccountAddress(provider.connection, worldPda)
    ).entities as BN;

    // create creature entities
    sourceCreature = FindEntityPda(worldId, entityCount);
    targetCreature = FindEntityPda(worldId, entityCount.add(new BN(1)));
    usingCreature = FindEntityPda(worldId, entityCount.add(new BN(2)));

    const tx = new anchor.web3.Transaction();

    tx.add(
      createAddEntityInstruction({
        world: worldPda,
        payer: provider.wallet.publicKey,
        entity: sourceCreature,
      })
    );
    tx.add(
      createAddEntityInstruction({
        world: worldPda,
        payer: provider.wallet.publicKey,
        entity: targetCreature,
      })
    );
    tx.add(
      createAddEntityInstruction({
        world: worldPda,
        payer: provider.wallet.publicKey,
        entity: usingCreature,
      })
    );

    await provider.sendAndConfirm(tx);
  });

  it("Attach components to entities", async () => {
    sourceCreatureComponentPda = FindComponentPda(
      programs.creature.programId,
      sourceCreature,
      "creature"
    );
    targetCreatureComponentPda = FindComponentPda(
      programs.creature.programId,
      targetCreature,
      "creature"
    );

    usingCreatureComponentPda = FindComponentPda(
      programs.creature.programId,
      usingCreature,
      "creature"
    );

    const tx = new anchor.web3.Transaction();
    tx.add(
      createInitializeComponentInstruction({
        payer: provider.wallet.publicKey,
        entity: sourceCreature,
        data: sourceCreatureComponentPda,
        componentProgram: programs.creature.programId,
      })
    );
    tx.add(
      createInitializeComponentInstruction({
        payer: provider.wallet.publicKey,
        entity: targetCreature,
        data: targetCreatureComponentPda,
        componentProgram: programs.creature.programId,
      })
    );
    tx.add(
      createInitializeComponentInstruction({
        payer: provider.wallet.publicKey,
        entity: usingCreature,
        data: usingCreatureComponentPda,
        componentProgram: programs.creature.programId,
      })
    );
    await provider.sendAndConfirm(tx);
  });

  it("Modify component", async () => {
    const args = {
      modification: Modification.Initialize,
    };

    let ix = createApplyInstruction(
      {
        componentProgram: programs.creature.programId,
        boltComponent: sourceCreatureComponentPda,
        boltSystem: programs.modifyCreature.programId,
      },
      { args: serializeArgs(args) }
    );

    const tx = new anchor.web3.Transaction().add(ix);
    await provider.sendAndConfirm(tx, [], { skipPreflight: true });

    const sourceCreateData = await programs.creature.account.creature.fetch(
      sourceCreatureComponentPda
    );

    expect(sourceCreateData.maxHp).to.equal(10);
    expect(sourceCreateData.hp).to.equal(10);
    expect(sourceCreateData.level).to.equal(1);
    expect(sourceCreateData.maxHp).to.equal(10);
    expect(sourceCreateData.loggedIn).to.equal(true);
    expect(sourceCreateData.category).to.equal(0);
  });
});
