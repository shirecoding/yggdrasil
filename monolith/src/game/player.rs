use rand::Rng;
use serde::Serialize;
use std::str::FromStr;

use bevy::prelude::*;


#[derive(Bundle, Serialize)]  // Bundles are like "templates", to make it easy to create entities with a common set of components.
pub struct PlayerBundle {
    pub player: Player,
    pub name: Name,
    pub gender: Gender
}

#[derive(Component, Serialize, Clone, Debug)]
pub enum Player {
    Player,
    Npc
}

#[derive(Component, Serialize, Clone)]
pub struct Name(pub String);

impl Default for Name {
    fn default() -> Self {
        Self(random_name(Gender::Male))
    }
}

#[derive(Component, Serialize, Clone)]
pub enum Gender {
    Male,
    Female
}

impl FromStr for Gender {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_ref() {
            "male" => Ok(Self::Male),
            "female" => Ok(Self::Female),
            _ => Err(()),
        }
    }
}

static RANDOM_LAST_NAMES: [&str; 20] = [
    "Blackwood",
    "Shadowfire",
    "Grimwood",
    "Brightwing",
    "Stonefist",
    "Ironheart",
    "Ravenwood",
    "Starfall",
    "Nightshade",
    "Dragonbane",
    "Moonstone",
    "Stormborn",
    "Silverblade",
    "Wildflower",
    "Darkwater",
    "Windrider",
    "Ironwood",
    "Bloodmoon",
    "Frostbeard",
    "Emberheart",
];

static RANDOM_MALE_FIRST_NAMES: [&str; 12] = [
    "Alaric",
    "Thorne",
    "Gideon",
    "Emeric",
    "Darian",
    "Cedric",
    "Alistair",
    "Caelan",
    "Galen",
    "Lirien",
    "Thaddeus",
    "Leif",
];

static RANDOM_FEMALE_FIRST_NAMES: [&str; 8] = [
    "Elwynn",
    "Seraphina",
    "Rowena",
    "Lyris",
    "Isadora",
    "Evelina",
    "Althea",
    "Adalynne",
];

fn random_name(gender: Gender) -> String {
    let mut rng = rand::thread_rng();
    match &gender {
        Gender::Male => {
            let first_name = RANDOM_MALE_FIRST_NAMES[rng.gen_range(0..RANDOM_MALE_FIRST_NAMES.len())];
            let last_name = RANDOM_LAST_NAMES[rng.gen_range(0..RANDOM_LAST_NAMES.len())];
            first_name.to_owned() + " " + last_name
        },
        Gender::Female => {
            let first_name = RANDOM_FEMALE_FIRST_NAMES[rng.gen_range(0..RANDOM_MALE_FIRST_NAMES.len())];
            let last_name = RANDOM_LAST_NAMES[rng.gen_range(0..RANDOM_LAST_NAMES.len())];
            first_name.to_owned() +  " " + last_name
        }
    }
}
