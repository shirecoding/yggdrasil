import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { YggdrasilBolt } from "../target/types/yggdrasil_bolt";
import { Entity } from "../target/types/entity";
import { Position } from "../target/types/position";
import { SourcePerformActionOnTargetUsing } from "../target/types/source_perform_action_on_target_using";
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

  // Programs
  const programs = {
    yggdrasil: anchor.workspace.YggdrasilBolt as Program<YggdrasilBolt>,
    position: anchor.workspace.Position as Program<Position>,
    entity: anchor.workspace.Entity as Program<Entity>,
    sourcePerformActionOnTargetUsing: anchor.workspace
      .SourcePerformActionOnTargetUsing as Program<SourcePerformActionOnTargetUsing>,
  };

  // Constants used to test the program.
  const worldId = new BN(0);
  const registryPda = FindWorldRegistryPda();
  const worldPda = FindWorldPda(worldId);

  let sourceEntity: PublicKey;
  let targetEntity: PublicKey;
  let usingEntity: PublicKey;

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
    sourceEntity = FindEntityPda(worldId, new BN(0));
    targetEntity = FindEntityPda(worldId, new BN(1));
    usingEntity = FindEntityPda(worldId, new BN(2));
    const tx = new anchor.web3.Transaction();
    tx.add(
      createAddEntityInstruction({
        world: worldPda,
        payer: provider.wallet.publicKey,
        entity: sourceEntity,
      })
    );
    tx.add(
      createAddEntityInstruction({
        world: worldPda,
        payer: provider.wallet.publicKey,
        entity: targetEntity,
      })
    );
    tx.add(
      createAddEntityInstruction({
        world: worldPda,
        payer: provider.wallet.publicKey,
        entity: usingEntity,
      })
    );
    await provider.sendAndConfirm(tx);
  });

  it("Attach components to entities", async () => {
    let sourceEntityComponentPda = FindComponentPda(
      programs.entity.programId,
      sourceEntity,
      "position"
    );
    // let targetEntityComponentPda = FindComponentPda(
    //   programs.entity.programId,
    //   targetEntity,
    //   "entity"
    // );

    // let usingEntityComponentPda = FindComponentPda(
    //   programs.entity.programId,
    //   usingEntity,
    //   "entity"
    // );

    // console.log({
    //   payer: provider.wallet.publicKey,
    //   entity: sourceEntity,
    //   data: sourceEntityComponentPda,
    //   componentProgram: programs.entity.programId,
    // });

    const tx = new anchor.web3.Transaction();
    tx.add(
      createInitializeComponentInstruction({
        payer: provider.wallet.publicKey,
        entity: sourceEntity,
        data: sourceEntityComponentPda,
        componentProgram: programs.position.programId,
      })
    );
    // tx.add(
    //   createInitializeComponentInstruction({
    //     payer: provider.wallet.publicKey,
    //     entity: targetEntity,
    //     data: targetEntityComponentPda,
    //     componentProgram: programs.entity.programId,
    //   })
    // );
    // tx.add(
    //   createInitializeComponentInstruction({
    //     payer: provider.wallet.publicKey,
    //     entity: usingEntity,
    //     data: usingEntityComponentPda,
    //     componentProgram: programs.entity.programId,
    //   })
    // );
    await provider.sendAndConfirm(tx, [], { skipPreflight: true });
  });
});
