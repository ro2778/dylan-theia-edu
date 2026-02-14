// ============ THEIA'S READING STORIES ============
// Each story has pages with text, emoji illustrations, and
// some words highlighted as "hard" (need parent help) vs
// decodable words she can sound out herself.

const STORIES = [
  // ===== STORY 1: SNORKELLING =====
  {
    title: "Theia and the Red Sea Fish",
    theme: "ocean",
    emoji: "🤿",
    pages: [
      {
        illustration: "🌊☀️🏖️",
        text: "It was a hot, hot day. Theia put on her mask and fins.",
        hard: ["was"]
      },
      {
        illustration: "🤿💦🐠",
        text: "She ran to the sea and jumped in with a big splash!",
        hard: ["the", "she", "with"]
      },
      {
        illustration: "🐠🐠🐟",
        text: "Under the water, she could see lots of fish. Red fish, blue fish, and a fat pufferfish!",
        hard: ["under", "water", "could", "pufferfish"]
      },
      {
        illustration: "🐢✨🌊",
        text: "Then she saw a big green sea turtle swim past her. It was so slow and calm.",
        hard: ["then", "saw", "turtle", "past"]
      },
      {
        illustration: "🐙🪨👀",
        text: "An octopus hid in a gap in the rocks. It had eight long arms!",
        hard: ["octopus", "eight"]
      },
      {
        illustration: "😊🏖️🌅",
        text: "Theia swam back to the sand. \"That was the best swim ever!\" she said to Mum and Dad.",
        hard: ["swam", "ever", "said"]
      }
    ]
  },

  // ===== STORY 2: CAMEL RIDE =====
  {
    title: "The Camel Ride",
    theme: "desert",
    emoji: "🐪",
    pages: [
      {
        illustration: "🐪🐪🏜️",
        text: "Theia and Dylan went to see the camels. The camels were very tall!",
        hard: ["were", "very", "camels"]
      },
      {
        illustration: "😮🐪⬆️",
        text: "A man helped Theia get up on a big camel. It stood up and she went up, up, up!",
        hard: ["helped"]
      },
      {
        illustration: "🐪🏛️☀️",
        text: "The camel began to walk. Step, step, step. They went past the sand dunes and the hot sun.",
        hard: ["began", "walk", "past", "dunes"]
      },
      {
        illustration: "🏛️✨👀",
        text: "Then she could see the pyramids! They were so big and made of stone.",
        hard: ["then", "could", "pyramids", "stone"]
      },
      {
        illustration: "🐪😂🤣",
        text: "The camel made a funny sound. It went \"Brrrrr!\" Theia and Dylan had a big giggle.",
        hard: ["funny", "sound", "giggle"]
      },
      {
        illustration: "🌅🐪❤️",
        text: "At the end, the camel sat down and Theia slid off. \"Can we do it again?\" she asked.",
        hard: ["again", "asked"]
      }
    ]
  },

  // ===== STORY 3: KIDS CLUB POOL =====
  {
    title: "Splash at the Kids Club",
    theme: "desert",
    emoji: "🏊",
    pages: [
      {
        illustration: "🏨🌴🏊",
        text: "The hotel had a big kids club with a swimming pool. Theia and Dylan ran to get in!",
        hard: ["hotel", "swimming", "their"]
      },
      {
        illustration: "💦😆🏊",
        text: "Theia did a big jump into the pool. Splash! The water went all over Dylan!",
        hard: ["water", "over"]
      },
      {
        illustration: "🏊‍♀️🔵💨",
        text: "She swam from one end to the other. Kick, kick, kick went her legs.",
        hard: ["swam", "from", "other"]
      },
      {
        illustration: "🛝💦😂",
        text: "There was a water slide too! Dylan went down it ten times. \"Again! Again!\" he said.",
        hard: ["there", "slide", "times", "again"]
      },
      {
        illustration: "🍦😋🌴",
        text: "After the pool, they had ice cream. Theia had a mango one and Dylan had a red one.",
        hard: ["after", "cream", "mango"]
      },
      {
        illustration: "⭐😴🛏️",
        text: "That night, Theia fell asleep very fast. She had such a fun day!",
        hard: ["night", "asleep", "very", "such"]
      }
    ]
  },

  // ===== STORY 4: PYRAMID ADVENTURE =====
  {
    title: "Inside the Pyramid",
    theme: "desert",
    emoji: "🏛️",
    pages: [
      {
        illustration: "🏛️👨‍👩‍👧‍👦☀️",
        text: "Today, Theia and her family went to see a real pyramid. It was huge!",
        hard: ["today", "family", "pyramid", "huge"]
      },
      {
        illustration: "🚪🔦👀",
        text: "They went inside. It was dark, so Dad got a torch. The walls had pictures on them!",
        hard: ["inside", "dark", "torch", "walls", "pictures"]
      },
      {
        illustration: "🐱👑🎨",
        text: "Theia saw a picture of a cat with a gold crown. \"The Egyptians loved cats!\" said Mum.",
        hard: ["picture", "crown", "Egyptians", "loved"]
      },
      {
        illustration: "📦✨💎",
        text: "Deep in the pyramid, they found a room with a big stone box. It was very old.",
        hard: ["deep", "found", "room", "stone", "very"]
      },
      {
        illustration: "🦇😱😂",
        text: "A bat flew past them! Dylan hid behind Mum. Theia just giggled.",
        hard: ["behind", "giggled"]
      },
      {
        illustration: "🏛️🌅📸",
        text: "Back outside, the sun was going down. Dad took a photo of them all in front of the pyramid.",
        hard: ["outside", "going", "photo", "front"]
      }
    ]
  },

  // ===== STORY 5: BEACH TREASURE =====
  {
    title: "The Beach Treasure Hunt",
    theme: "ocean",
    emoji: "🗺️",
    pages: [
      {
        illustration: "🗺️🏖️🔍",
        text: "Mum made a treasure map for Theia and Dylan. \"Find all the things on the list!\" she said.",
        hard: ["treasure", "things"]
      },
      {
        illustration: "🐚✅👧",
        text: "First, they had to find a shell. Theia dug in the sand and found a pink one!",
        hard: ["first", "shell", "found"]
      },
      {
        illustration: "🦀😮👦",
        text: "Next, a crab! Dylan saw one under a rock. It ran sideways — so funny!",
        hard: ["next", "under", "sideways", "funny"]
      },
      {
        illustration: "🪸🌊✨",
        text: "Then they had to find some coral. They went to a rock pool and saw red and white bits.",
        hard: ["then", "coral", "some", "pool", "white"]
      },
      {
        illustration: "⭐🏖️😊",
        text: "Last on the list was a starfish. They looked and looked... and Theia found one hiding in the wet sand!",
        hard: ["starfish", "looked", "hiding"]
      },
      {
        illustration: "🏆🍦❤️",
        text: "\"You did it!\" said Mum. The prize was an ice cream each. What a perfect day!",
        hard: ["prize", "cream", "perfect"]
      }
    ]
  },

  // ===== STORY 6: SUNSET BOAT =====
  {
    title: "The Sunset Boat Trip",
    theme: "ocean",
    emoji: "⛵",
    pages: [
      {
        illustration: "⛵🌅🌊",
        text: "One evening, they all got on a boat to watch the sunset.",
        hard: ["evening", "watch", "sunset"]
      },
      {
        illustration: "💨⛵😄",
        text: "The wind blew and the boat rocked from side to side. Theia held on tight!",
        hard: ["wind", "blew", "rocked", "side", "tight"]
      },
      {
        illustration: "🐬🐬💦",
        text: "Then — two dolphins jumped out of the water! They were so fast and sleek.",
        hard: ["dolphins", "jumped", "water", "sleek"]
      },
      {
        illustration: "🌅🟠🟡",
        text: "The sun went down, and the sky turned orange and gold. It was so pretty.",
        hard: ["turned", "orange", "pretty"]
      },
      {
        illustration: "⭐🌙⛵",
        text: "Stars came out one by one. Dylan fell asleep on Dad's lap.",
        hard: ["stars", "came", "asleep"]
      },
      {
        illustration: "🏨😴💤",
        text: "Back at the hotel, Mum carried Dylan and Theia walked holding Dad's hand. The best trip ever!",
        hard: ["hotel", "carried", "walked", "holding"]
      }
    ]
  }
];
