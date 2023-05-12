use uuid::Uuid;
use rand::Rng;
use serde::Serialize;
use std::str::FromStr;

#[derive(Serialize)]
pub struct Coordinates {
    x: i32,
    y: i32,
    z: i32
}

#[derive(Serialize)]
pub struct Location {
    map_id: i32,
    coordinates: Coordinates
}

#[derive(Serialize)]
pub enum State {
    Dead,
    Alive(i32)  // hitpoints
}

#[derive(Clone, Serialize)]
pub enum Gender {
    male,
    female
}

impl FromStr for Gender {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_ref() {
            "male" => Ok(Self::male),
            "female" => Ok(Self::female),
            _ => Err(()),
        }
    }
}


#[derive(Serialize)]
pub struct Player {
    id: String,
    name: String,
    gender: Gender,
    location: Location,
    state: State
}

static random_last_names: [&str; 20] = [
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

static random_male_first_names: [&str; 12] = [
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

static random_female_first_names: [&str; 8] = [
    "Elwynn",
    "Seraphina",
    "Rowena",
    "Lyris",
    "Isadora",
    "Evelina",
    "Althea",
    "Adalynne",
];


impl Player {
    pub fn random(gender: Gender) -> Self {        
        let mut rng = rand::thread_rng();

        Self {
            id: Uuid::new_v4().to_string(),
            gender: gender.clone(),
            name: match &gender {
                Gender::male => {
                    let first_name = random_male_first_names[rng.gen_range(0..random_male_first_names.len())];
                    let last_name = random_last_names[rng.gen_range(0..random_last_names.len())];
                    first_name.to_owned() + " " + last_name
                },
                Gender::female => {
                    let first_name = random_male_first_names[rng.gen_range(0..random_male_first_names.len())];
                    let last_name = random_last_names[rng.gen_range(0..random_last_names.len())];
                    first_name.to_owned() +  " " + last_name
                },
            },
            state: State::Alive(100),
            location: Location { map_id: 0, coordinates: Coordinates { x: 0, y: 0, z: 0 } }
        }
    }
}