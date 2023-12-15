use anchor_lang::prelude::*;

use crate::defs::*;

#[derive(Accounts)]
pub struct CreatePlayer<'info> {
    #[account(
        init_if_needed,
        payer = signer,
        seeds = [b"player", signer.key().as_ref()],
        bump,
        space = Player::len(),
    )]
    pub player: Account<'info, Player>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Player {
    pub bump: u8,
    pub name: String,
    pub uri: String,
}

impl Player {
    pub fn len() -> usize {
        DISCRIMINATOR_SIZE + BUMP_SIZE + PLAYER_NAME_SIZE + PLAYER_URI_SIZE
    }
}
