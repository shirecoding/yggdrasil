use bolt_lang::*;
use creature::Creature;
use std::str::FromStr;

declare_id!("42Pm1FeYouSPvTmHsJKkqZcQbhhxhGZCQSnvJQM9TkiE");

#[system]
#[program]
pub mod modify_creature {
    use super::*;

    pub fn execute(ctx: Context<Component>, args: Vec<u8>) -> Result<Creature> {
        let parsed_args = parse_args::<Args>(&args);
        match parsed_args.modification {
            Modification::Initialize => {
                assert!(
                    ctx.accounts.creature.is_initialized == false,
                    "Create has already been intialized"
                );

                let authority = Pubkey::from_str(parsed_args.authority.as_str())
                    .map_err(|err| ProgramError::Custom(err as u32))?;

                // set name if provided
                if !parsed_args.name.is_empty() {
                    ctx.accounts.creature.name = parsed_args.name;
                }

                // status
                ctx.accounts.creature.authority = authority;
                ctx.accounts.creature.logged_in = true;
                ctx.accounts.creature.is_initialized = true;
                ctx.accounts.creature.category = 0; // 0: player 1: npc

                // location
                ctx.accounts.creature.x = 0;
                ctx.accounts.creature.y = 0;
                ctx.accounts.creature.z = 0;

                // current state
                ctx.accounts.creature.hp = 10;
                ctx.accounts.creature.max_hp = 10;
                ctx.accounts.creature.mp = 10;
                ctx.accounts.creature.max_mp = 10;
                ctx.accounts.creature.state = 0; // 0: alive 1: dead

                // stats
                ctx.accounts.creature.level = 1;
                ctx.accounts.creature.base_proficiency_die = 4;
                ctx.accounts.creature.num_proficiency_dice = 1;
            }
        }

        Ok(ctx.accounts.creature)
    }
}

// Define the Account to parse from the component
#[derive(Accounts)]
pub struct Component<'info> {
    #[account()]
    pub creature: Account<'info, Creature>,
}

#[derive(BoltSerialize, BoltDeserialize)]
struct Args {
    modification: Modification,
    authority: String,
    name: String,
}

#[derive(BoltSerialize, BoltDeserialize)]
pub enum Modification {
    Initialize,
}
