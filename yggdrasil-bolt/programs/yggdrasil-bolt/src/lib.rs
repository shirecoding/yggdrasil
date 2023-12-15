use anchor_lang::prelude::ErrorCode;
use anchor_lang::prelude::*;
use session_keys::{session_auth_or, Session, SessionError, SessionToken};
mod defs;
mod player;
mod utils;
use defs::*;
use player::*;
use utils::*;

declare_id!("9JBtwqvWsuEKUpswiR6vERUXnmcSGVXWUfsr7N8RQQTk");

#[program]
pub mod yggdrasil_bolt {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn create_player(ctx: Context<CreatePlayer>, name: String, uri: String) -> Result<()> {
        ctx.accounts.player.bump = ctx.bumps.player;
        ctx.accounts.player.name = pad_string(&name, PLAYER_NAME_SIZE - STRING_PREFIX_SIZE);
        ctx.accounts.player.uri = pad_string(&uri, PLAYER_URI_SIZE - STRING_PREFIX_SIZE);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
