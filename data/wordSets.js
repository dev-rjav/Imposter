/**
 * Word-guessing category sets.
 *
 * Every entry pairs a "majority" word (seen by everyone except the imposter)
 * with an "imposter" word that is close enough to be bluffable but distinct
 * enough to eventually give the imposter away.
 *
 * Shape:
 *   {
 *     type: 'word',
 *     category: string,   // display label, also used to group sets in the UI
 *     majority: string,   // word shown to the majority of players
 *     imposter: string,   // word shown to the imposter
 *   }
 *
 * To add your own words: append an object with the same shape to WORD_SETS
 * below, or create a new category — no other file needs to change.
 */

const WORD_SETS = [
  { type: "word", category: "Stationery", majority: "Pencil", imposter: "Pen" },
  { type: "word", category: "Stationery", majority: "Whiteboard", imposter: "Blackboard" },
  { type: "word", category: "Stationery", majority: "Notebook", imposter: "Diary" },
  { type: "word", category: "Stationery", majority: "Ruler", imposter: "Compass" },
  { type: "word", category: "Stationery", majority: "Highlighter", imposter: "Marker" },
  { type: "word", category: "Books & Reading", majority: "Novel", imposter: "Textbook" },
  { type: "word", category: "Books & Reading", majority: "Hardcover", imposter: "Paperback" },
  { type: "word", category: "Books & Reading", majority: "Bookmark", imposter: "Dog-ear" },
  { type: "word", category: "Accommodation", majority: "Hotel", imposter: "Hostel" },
  { type: "word", category: "Accommodation", majority: "Resort", imposter: "Motel" },
  { type: "word", category: "Accommodation", majority: "Tent", imposter: "Caravan" },
  { type: "word", category: "Accommodation", majority: "Apartment", imposter: "Dormitory" },
  { type: "word", category: "Transport", majority: "Bicycle", imposter: "Motorcycle" },
  { type: "word", category: "Transport", majority: "Train", imposter: "Metro" },
  { type: "word", category: "Transport", majority: "Aeroplane", imposter: "Helicopter" },
  { type: "word", category: "Transport", majority: "Ship", imposter: "Ferry" },
  { type: "word", category: "Transport", majority: "Tram", imposter: "Bus" },
  { type: "word", category: "Music", majority: "Guitar", imposter: "Ukulele" },
  { type: "word", category: "Music", majority: "Piano", imposter: "Keyboard" },
  { type: "word", category: "Music", majority: "Drums", imposter: "Bongos" },
  { type: "word", category: "Music", majority: "Violin", imposter: "Cello" },
  { type: "word", category: "Music", majority: "Flute", imposter: "Recorder" },
  { type: "word", category: "Education", majority: "School", imposter: "College" },
  { type: "word", category: "Education", majority: "Exam", imposter: "Quiz" },
  { type: "word", category: "Education", majority: "Library", imposter: "Study Hall" },
  { type: "word", category: "Education", majority: "Classroom", imposter: "Lecture Hall" },
  { type: "word", category: "Food & Drinks", majority: "Pizza", imposter: "Flatbread" },
  { type: "word", category: "Food & Drinks", majority: "Burger", imposter: "Sandwich" },
  { type: "word", category: "Food & Drinks", majority: "Sushi", imposter: "Sashimi" },
  { type: "word", category: "Food & Drinks", majority: "Espresso", imposter: "Coffee" },
  { type: "word", category: "Food & Drinks", majority: "Doughnut", imposter: "Bagel" },
  { type: "word", category: "Food & Drinks", majority: "Pancake", imposter: "Waffle" },
  { type: "word", category: "Food & Drinks", majority: "Ice Cream", imposter: "Frozen Yogurt" },
  { type: "word", category: "Food & Drinks", majority: "Cake", imposter: "Pastry" },
  { type: "word", category: "Food & Drinks", majority: "Taco", imposter: "Burrito" },
  { type: "word", category: "Food & Drinks", majority: "Hot Dog", imposter: "Sausage" },
  { type: "word", category: "Animals", majority: "Dolphin", imposter: "Shark" },
  { type: "word", category: "Animals", majority: "Eagle", imposter: "Hawk" },
  { type: "word", category: "Animals", majority: "Cheetah", imposter: "Leopard" },
  { type: "word", category: "Animals", majority: "Rabbit", imposter: "Hare" },
  { type: "word", category: "Animals", majority: "Frog", imposter: "Toad" },
  { type: "word", category: "Animals", majority: "Swan", imposter: "Goose" },
  { type: "word", category: "Animals", majority: "Crocodile", imposter: "Alligator" },
  { type: "word", category: "Animals", majority: "Seal", imposter: "Sea Lion" },
  { type: "word", category: "Animals", majority: "Dog", imposter: "Cat" },
  { type: "word", category: "Animals", majority: "Gorilla", imposter: "Chimpanzee" },
  { type: "word", category: "Sports", majority: "Cricket", imposter: "Baseball" },
  { type: "word", category: "Sports", majority: "Swimming", imposter: "Diving" },
  { type: "word", category: "Sports", majority: "Basketball", imposter: "Volleyball" },
  { type: "word", category: "Sports", majority: "Tennis", imposter: "Badminton" },
  { type: "word", category: "Sports", majority: "Boxing", imposter: "Wrestling" },
  { type: "word", category: "Sports", majority: "Skiing", imposter: "Snowboarding" },
  { type: "word", category: "Sports", majority: "Golf", imposter: "Disc Golf" },
  { type: "word", category: "Sports", majority: "Football", imposter: "Rugby" },
  { type: "word", category: "Technology", majority: "Smartphone", imposter: "Tablet" },
  { type: "word", category: "Technology", majority: "Laptop", imposter: "Desktop PC" },
  { type: "word", category: "Technology", majority: "WiFi", imposter: "Bluetooth" },
  { type: "word", category: "Technology", majority: "VR Headset", imposter: "AR Glasses" },
  { type: "word", category: "Technology", majority: "Hard Drive", imposter: "USB Drive" },
  { type: "word", category: "Technology", majority: "Keyboard", imposter: "Typewriter" },
  { type: "word", category: "Technology", majority: "Podcast", imposter: "Radio Show" },
  { type: "word", category: "Places", majority: "Hospital", imposter: "Clinic" },
  { type: "word", category: "Places", majority: "Airport", imposter: "Train Station" },
  { type: "word", category: "Places", majority: "Museum", imposter: "Art Gallery" },
  { type: "word", category: "Places", majority: "Stadium", imposter: "Arena" },
  { type: "word", category: "Places", majority: "Supermarket", imposter: "Corner Store" },
  { type: "word", category: "Places", majority: "Hotel", imposter: "Hostel" },
  { type: "word", category: "Places", majority: "Library", imposter: "Bookstore" },
  { type: "word", category: "Nature", majority: "Volcano", imposter: "Mountain" },
  { type: "word", category: "Nature", majority: "Glacier", imposter: "Iceberg" },
  { type: "word", category: "Nature", majority: "Rainforest", imposter: "Jungle" },
  { type: "word", category: "Nature", majority: "Canyon", imposter: "Gorge" },
  { type: "word", category: "Nature", majority: "Tornado", imposter: "Hurricane" },
  { type: "word", category: "Professions", majority: "Surgeon", imposter: "Dentist" },
  { type: "word", category: "Professions", majority: "Chef", imposter: "Pastry Chef" },
  { type: "word", category: "Professions", majority: "Teacher", imposter: "Professor" },
  { type: "word", category: "Professions", majority: "Lawyer", imposter: "Judge" },
  { type: "word", category: "Professions", majority: "Firefighter", imposter: "Paramedic" },
  { type: "word", category: "Professions", majority: "Journalist", imposter: "Blogger" },
  { type: "word", category: "Professions", majority: "Architect", imposter: "Interior Designer" },
  { type: "word", category: "Professions", majority: "Astronaut", imposter: "Fighter Pilot" },
];

module.exports = WORD_SETS;
