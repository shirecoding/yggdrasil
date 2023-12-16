use bolt_lang::*;
use creature::Creature;

declare_id!("9NEta1kQAHsxSBnfjEpC9wfaDwpAVgt3pdnnDWhwAird");

#[system]
#[program]
pub mod source_perform_action_on_target_using {
    use super::*;

    pub fn execute(
        ctx: Context<Component>,
        args: Vec<u8>,
    ) -> Result<(Creature, Creature, Creature)> {
        let target = &mut ctx.accounts.target;
        let using = &ctx.accounts.using;

        match parse_args::<Args>(&args).action {
            Action::Damage => {
                let damage = using.base_proficiency_die * using.num_proficiency_dice;
                target.hp -= damage as u16;
                if target.hp <= 0 {
                    target.hp = 0;
                    target.state = 1;
                }
            }
        }

        Ok((*ctx.accounts.source, *target, *ctx.accounts.using))
    }
}

// Define the Account to parse from the component
#[derive(Accounts)]
pub struct Component<'info> {
    /// CHECK: check that the component is the expected account
    pub source: Account<'info, Creature>,
    pub target: Account<'info, Creature>,
    pub using: Account<'info, Creature>,
}

#[derive(BoltSerialize, BoltDeserialize)]
struct Args {
    action: Action,
}

#[derive(BoltSerialize, BoltDeserialize)]
pub enum Action {
    Damage,
}
