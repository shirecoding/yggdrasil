use bevy::prelude::*;

mod player;
use player::{PlayerBundle, Player, Name, Gender};


#[derive(Resource)]
struct GreetTimer(Timer);

fn greet_players(
    time: Res<Time>,  // Time resource added as default by DefaultPlugins
    mut timer: ResMut<GreetTimer>,
    query: Query<(&Name, &Player)>
) {

    if timer.0.tick(time.delta()).just_finished() {
        for (name, player) in &query {
            debug!("hello {:?} {:?}!", player, name.0);
        }
    }
}

fn start_up(mut commands: Commands) {
    // Spawn some random players
    for _ in 1..=3 {
        commands.spawn(
            PlayerBundle {
                player: Player::Npc,
                name: Name::default(),
                gender: Gender::Male
            }
        );
    }
}

pub fn begin () {

    App::new()
        // Minimal plugins for a headless server
        .add_plugins(MinimalPlugins)
        // Startup systems are just like normal systems, but they run exactly once, before all other systems
        .add_startup_system(start_up)
        // Initialize resources
        .insert_resource(GreetTimer(Timer::from_seconds(2.0, TimerMode::Repeating)))
        // Run systems in parallel
        .add_system(greet_players)
        .run();
}