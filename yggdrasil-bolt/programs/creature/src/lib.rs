use bolt_lang::*;

declare_id!("3nt8wnuNGQKG57UgSDsM1HL86kQZcwjbv95V9ZUexW2a");

#[component(Creature)]
#[program]
pub mod creature {
    use super::*;
}

#[account]
#[bolt_account(component_id = "creature")]
#[derive(Copy)]
pub struct Creature {
    pub category: u8, // 0: player, 1: npc
    // location
    pub x: i16,
    pub y: i16,
    pub z: i16,
    pub logged_in: bool,
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

// impl Default for Creature {
//     fn default() -> Self {
//         Creature {
//             category: 0,
//             x: 0,
//             y: 0,
//             z: 0,
//             logged_in: true,
//             hp: 0,
//             max_hp: 0,
//             mp: 0,
//             max_mp: 0,
//             state: 0,
//             level: 0,
//             base_proficiency_die: 0,
//             num_proficiency_dice: 0,
//         }
//     }
// }
