use bolt_lang::*;

declare_id!("B6ZpMqEYFiBfUc98Z6FsA87RCrVhTEGEbzcAfVzZuffP");

#[component(Position)]
#[program]
pub mod position {
    use super::*;
}

#[account]
#[bolt_account(component_id = "position")]
#[derive(Copy)]
pub struct Position {
    pub x: i64,
    pub y: i64,
    pub z: i64,
}
