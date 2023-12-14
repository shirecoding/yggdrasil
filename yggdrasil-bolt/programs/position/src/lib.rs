use bolt_lang::*;

declare_id!("88zwmz5tVV1TNtHEKJzDgALKU3kyFCPAsP2RdRJ4pqzZ");

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
