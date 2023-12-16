use bolt_lang::*;

declare_id!("3nt8wnuNGQKG57UgSDsM1HL86kQZcwjbv95V9ZUexW2a");

#[component(Creature)]
#[program]
pub mod creature {
    use super::*;
}

#[account]
#[bolt_account(component_id = "creature")]
pub struct Creature {
    // meta
    pub authority: Pubkey, // the player wallet
    pub logged_in: bool,
    // type
    pub category: u8, // 0: player, 1: npc
    // location
    pub x: i16,
    pub y: i16,
    pub z: i16,
    // state
    pub hp: u16,
    pub max_hp: u16,
    pub mp: u16,
    pub max_mp: u16,
    pub state: u8, // 0: alive, 1: dead
    // modifiers
    pub level: u8,
    pub base_proficiency_die: u8, // d4, d6, d10 etc...
    pub num_proficiency_dice: u8, // multply by `base_proficiency_die``
}
