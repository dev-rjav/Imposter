/**
 * Question-mode category sets.
 *
 * Instead of a describable word, everyone answers a question. The imposter
 * secretly gets a *different but similarly-shaped* question, so their answer
 * still sounds plausible in the room.
 *
 * Shape:
 *   {
 *     type: 'question',
 *     category: string,    // display label
 *     majority: string,    // topic label shown to the majority (may include an emoji)
 *     imposter: string,    // topic label shown to the imposter
 *     majorityQ: string,   // question the majority answers
 *     imposterQ: string,   // question the imposter answers
 *   }
 *
 * To add your own: append an object with the same shape to QUESTION_SETS.
 */

const QUESTION_SETS = [
  {
    type: "question",
    category: "Growing Up",
    majority: "Bicycle 🚲",
    imposter: "Car 🚗",
    majorityQ: "At what age did you learn to ride a bicycle?",
    imposterQ: "At what age did you learn to drive a car?",
  },
  {
    type: "question",
    category: "Learning",
    majority: "Swimming 🏊",
    imposter: "Cycling 🚴",
    majorityQ: "At what age did you first learn to swim?",
    imposterQ: "At what age did you first learn to ride a bicycle?",
  },
  {
    type: "question",
    category: "Daily Life",
    majority: "School 🏫",
    imposter: "Office 🏢",
    majorityQ: "What was your favourite subject in school?",
    imposterQ: "What is your favourite part of your job?",
  },
  {
    type: "question",
    category: "Pets",
    majority: "Dog 🐕",
    imposter: "Cat 🐈",
    majorityQ: "How often do you take it for walks?",
    imposterQ: "How often does it climb onto furniture?",
  },
  {
    type: "question",
    category: "Food",
    majority: "Pizza 🍕",
    imposter: "Burger 🍔",
    majorityQ: "What is your favourite topping to add?",
    imposterQ: "What is your favourite filling to choose?",
  },
  {
    type: "question",
    category: "Entertainment",
    majority: "Book 📖",
    imposter: "Movie 🎬",
    majorityQ: "How long does it usually take you to finish one?",
    imposterQ: "How long does it usually take you to watch one?",
  },
  {
    type: "question",
    category: "Technology",
    majority: "Mobile Phone 📱",
    imposter: "Laptop 💻",
    majorityQ: "What is the first app you open in the morning?",
    imposterQ: "What is the first program you open when you sit down?",
  },
  {
    type: "question",
    category: "Sport",
    majority: "Cricket 🏏",
    imposter: "Football ⚽",
    majorityQ: "Which cricketer would you most want on your team?",
    imposterQ: "Which footballer would you most want on your team?",
  },
  {
    type: "question",
    category: "Travel",
    majority: "Train 🚆",
    imposter: "Aeroplane ✈️",
    majorityQ: "Which station do you use or pass through most often?",
    imposterQ: "Which airport do you use or pass through most often?",
  },
  {
    type: "question",
    category: "Celebrations",
    majority: "Cake 🎂",
    imposter: "Ice Cream 🍦",
    majorityQ: "What flavour do you always request on your birthday?",
    imposterQ: "What flavour is your automatic go-to order?",
  },
  {
    type: "question",
    category: "Stationery",
    majority: "Pencil ✏️",
    imposter: "Pen 🖊️",
    majorityQ: "When did you first learn to write with one properly?",
    imposterQ: "When did you first start writing neatly with one?",
  },
  {
    type: "question",
    category: "Music",
    majority: "Guitar 🎸",
    imposter: "Piano 🎹",
    majorityQ: "What is the first song you would want to learn on it?",
    imposterQ: "What is the first piece you would practise on it?",
  },
  {
    type: "question",
    category: "Education",
    majority: "Teacher 👩‍🏫",
    imposter: "Student 👨‍🎓",
    majorityQ: "What homework would you assign to challenge your class?",
    imposterQ: "What type of homework do you dread the most?",
  },
  {
    type: "question",
    category: "Stays",
    majority: "Hotel 🏨",
    imposter: "Hospital 🏥",
    majorityQ: "What single amenity makes a stay truly comfortable for you?",
    imposterQ: "What is the one thing that makes a stay feel less stressful?",
  },
  {
    type: "question",
    category: "Professions",
    majority: "Teacher 👩‍🏫",
    imposter: "Doctor 👨‍⚕️",
    majorityQ: "Which subject would you most want to teach and why?",
    imposterQ: "Which medical speciality would you choose and why?",
  },
  {
    type: "question",
    category: "Morning Routine",
    majority: "Tea ☕",
    imposter: "Coffee ☕",
    majorityQ: "How do you like it prepared — with milk, sugar, or plain?",
    imposterQ: "How do you take it — black, with milk, or a shot?",
  },
  {
    type: "question",
    category: "Weather",
    majority: "Rain 🌧️",
    imposter: "Snow ❄️",
    majorityQ: "What is your favourite thing to do when it is pouring outside?",
    imposterQ: "What is your favourite activity when everything is covered in it?",
  },
  {
    type: "question",
    category: "Social Media",
    majority: "Instagram 📸",
    imposter: "YouTube 🎥",
    majorityQ: "What kind of content do you post or scroll through most?",
    imposterQ: "What kind of videos do you watch or create most?",
  },
  {
    type: "question",
    category: "Shopping",
    majority: "Mall 🏬",
    imposter: "Online Store 🛒",
    majorityQ: "What is the first section or shop you head to?",
    imposterQ: "What is the first category you search or browse?",
  },
  {
    type: "question",
    category: "Sleep",
    majority: "Pillow 🛏️",
    imposter: "Blanket 🛌",
    majorityQ: "How many do you need to sleep comfortably?",
    imposterQ: "How many layers do you need to feel comfortable?",
  },
  {
    type: "question",
    category: "Cooking",
    majority: "Chef 👨‍🍳",
    imposter: "Baker 🧁",
    majorityQ: "What dish would you cook to impress someone?",
    imposterQ: "What would you bake to impress someone?",
  },
  {
    type: "question",
    category: "Fitness",
    majority: "Gym 🏋️",
    imposter: "Yoga 🧘",
    majorityQ: "What is the first exercise you do when you arrive?",
    imposterQ: "What is the first pose or stretch you do when you begin?",
  },
  {
    type: "question",
    category: "Gaming",
    majority: "Console 🎮",
    imposter: "PC Gaming 🖥️",
    majorityQ: "What genre of game do you always return to?",
    imposterQ: "What type of game do you spend the most hours on?",
  },
  {
    type: "question",
    category: "Reading",
    majority: "Fiction 📚",
    imposter: "Non-Fiction 📖",
    majorityQ: "What genre of story pulls you in every time?",
    imposterQ: "What subject or topic do you always end up reading about?",
  },
  {
    type: "question",
    category: "Hobbies",
    majority: "Photography 📷",
    imposter: "Painting 🎨",
    majorityQ: "What subject do you most love to capture?",
    imposterQ: "What do you most love to recreate on canvas?",
  },
  {
    type: "question",
    category: "Nature",
    majority: "Beach 🏖️",
    imposter: "Mountains 🏔️",
    majorityQ: "What is the first thing you do when you reach the shore?",
    imposterQ: "What is the first thing you do when you reach the summit?",
  },
  {
    type: "question",
    category: "Childhood",
    majority: "Cartoon 📺",
    imposter: "Comic Book 📕",
    majorityQ: "Which show did you never miss as a child?",
    imposterQ: "Which series did you collect or read as a child?",
  },
  {
    type: "question",
    category: "Transport",
    majority: "Taxi 🚕",
    imposter: "Rickshaw 🛺",
    majorityQ: "How do you decide which one to hail?",
    imposterQ: "How do you decide which one to flag down?",
  },
  {
    type: "question",
    category: "Celebrations",
    majority: "New Year 🎆",
    imposter: "Diwali 🪔",
    majorityQ: "What is the one tradition you always follow?",
    imposterQ: "What is the one ritual you never skip?",
  },
  {
    type: "question",
    category: "Animals",
    majority: "Dog 🐕",
    imposter: "Cat 🐈",
    majorityQ: "What trick or command would you teach it first?",
    imposterQ: "What is the strangest spot it would find to sleep?",
  },
];

module.exports = QUESTION_SETS;
