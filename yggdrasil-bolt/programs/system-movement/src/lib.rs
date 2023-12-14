use bolt_lang::*;

declare_id!("2wqzKNVghP29CWiXyiZ2ms6iz1KjdKHNUhpMNfAatfCn");

#[system]
#[program]
pub mod system_movement {
    use super::*;

    pub fn execute(ctx: Context<Component>, args: Vec<u8>) -> Result<Position> {
        let mut position = Position::from_account_info(&ctx.accounts.position)?;
        position.x += 1;

        Ok(position)
    }
}

// Define the Account to parse from the component
#[derive(Accounts)]
pub struct Component<'info> {
    /// CHECK: check that the component is the expected account
    pub position: AccountInfo<'info>,
}

#[component_deserialize]
pub struct Position {
    pub x: i64,
    pub y: i64,
    pub z: i64,
}
