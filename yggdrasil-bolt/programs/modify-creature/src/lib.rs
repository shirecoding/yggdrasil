use bolt_lang::*;
use creature::Creature;

declare_id!("42Pm1FeYouSPvTmHsJKkqZcQbhhxhGZCQSnvJQM9TkiE");

#[system]
#[program]
pub mod modify_creature {
    use super::*;

    pub fn execute(ctx: Context<Component>, args: Vec<u8>) -> Result<Creature> {
        match parse_args::<Args>(&args).modification {
            Modification::Initialize => {
                // status
                // creature.authority = '';
                ctx.accounts.creature.logged_in = true;
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
}

#[derive(BoltSerialize, BoltDeserialize)]
pub enum Modification {
    Initialize,
}
