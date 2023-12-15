use bolt_lang::*;

declare_id!("FYUZaYADeoXV5MeMmro1jzJg7LMs7ruG3PtBwgT5V5Fx");

#[component(Entity)]
#[program]
pub mod entity {
    use super::*;
}

#[account]
#[bolt_account(component_id = "entity")]
pub struct Entity {
    pub entity_type: u8, // 0: player, 1: item
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
    pub entity_state: u8, // 0: alive, 1: dead
    // modifiers
    pub level: u8,
    pub base_proficiency_die: u8, // d4, d6, d10 etc...
    pub num_proficiency_dice: u8, // multply by `base_proficiency_die``
}
