use anchor_lang::prelude::*;

declare_id!("HDJXRRzmN54gT8mUNw5wdj4YHpb8NmVudSttH5xFxFHf");

#[program]
pub mod yggdrasil_bolt {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
