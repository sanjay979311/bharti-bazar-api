// const seoTextBank = {
//   "ac-repair-services": {
//     metaTitles: [
//       "Top {{totalListings}} Best {{displayCategory}} in {{displayLocation}} | Verified List",
//       "Best {{displayCategory}} {{displayLocation}} - Doorstep Service @₹{{minPrice}}",
//       "Verified {{displayCategory}} Experts Near {{displayLocation}} | Low Charges"
//     ],
//     metaDescriptions: [
//       "Find {{totalListings}} verified {{displayCategory}} in {{displayLocation}}. Get professional doorstep service for {{commonIssues}} with average {{avgRating}} user ratings. Call now!",
//       "Looking for trusted {{displayCategory}} near {{displayLocation}}? Compare rates starting from ₹{{minPrice}}, check actual reviews, and contact top experts instantly."
//     ],
//     headings: [
//       "Best {{displayCategory}} in {{displayLocation}} (Doorstep Service)",
//       "Top-Rated {{displayCategory}} Experts Near {{displayLocation}}",
//       "Verified {{displayCategory}} in {{displayLocation}} | Low Charges"
//     ],
//     introTemplates: [
//       [
//         "{Garmi ke mausam me|Summer season me|Is tez dhoop me} agar aapka air conditioner properly cool nahi kar raha hai, to {{displayLocation}} me is samay total {{totalListings}} verified technicians active hain.",
//         "{{displayLocation}} ke local market standards ke hisab se AC maintenance aur gas charging ki shuruaat ₹{{minPrice}} onwards se hoti hai.",
//         "Hamari directory par aapko wahi vendors milenge jinki average user rating {{avgRating}} Star hai."
//       ]
//     ],
//     deepSections: [
//       {
//         heading: "1. Understanding Local Repair Challenges in {{displayLocation}}",
//         templates: [
//           "{{displayLocation}} ke residential aur commercial zones me dust accumulation aur voltage fluctuations common hain.",
//           "{{topVendors}} specialized custom analytics ensure karte hain."
//         ]
//       }
//     ],
//     commonIssues: "Gas Leakage, Compressor repair aur Circuit Board (PCB) problems",
//     fallbackVendors: "local AC technicians",
//     faqHeading: "Frequently Asked Questions — {{displayCategory}} ({{displayLocation}})",
//     faqs: [
//       {
//         q: "{{displayLocation}} me AC service ke charges kya hain?",
//         a: "{{displayLocation}} me standard AC servicing aur repair ki shuruaat lagbhag ₹{{minPrice}} se ho jaati hai."
//       }
//     ]
//   },

//   default: {
//     metaTitles: [
//       "Best {{displayCategory}} in {{displayLocation}} - Verified Local Experts",
//       "Top {{displayCategory}} Services in {{displayLocation}} Near Me | Directory"
//     ],
//     metaDescriptions: [
//       "Find the best {{displayCategory}} in {{displayLocation}}. Check contact details, ratings, real customer reviews, and quotes from {{totalListings}} local businesses."
//     ],
//     headings: [
//       "Top-Rated {{displayCategory}} in {{displayLocation}} Near Me",
//       "Best {{displayCategory}} Services in {{displayLocation}} - Verified List"
//     ],
//     introTemplates: [
//       [
//         "Agar aap apne local area me reliable {{displayCategory}} search kar rahe hain, to {{displayLocation}} me {{totalListings}} se zyada options listed hain."
//       ]
//     ],
//     deepSections: [],
//     commonIssues: "professional support aur timely delivery",
//     fallbackVendors: "verified local businesses",
//     faqHeading: "Frequently Asked Questions About {{displayCategory}}",
//     faqs: [
//       {
//         q: "How to find best {{displayCategory}} in {{displayLocation}}?",
//         a: "Aap ratings aur reviews ke basis par compare karke best option select kar sakte hain."
//       }
//     ]
//   }
// };

// export default seoTextBank;


const seoTextBank = {
  "repairs-services": {
    metaTitles: {
      general: [
        "Best {{displayCategory}} in {{displayLocation}}",
        "Top {{displayCategory}} Services in {{displayLocation}}"
      ],
      trusted: [
        "Trusted {{displayCategory}} in {{displayLocation}} | Verified Experts"
      ],
      affordable: [
        "Affordable {{displayCategory}} in {{displayLocation}} | Low Cost Service"
      ],
      premium: [
        "Premium {{displayCategory}} in {{displayLocation}} | Top Rated Providers"
      ]
    },

    metaDescriptions: {
      general: [
        "Find verified {{displayCategory}} in {{displayLocation}} with ratings and reviews."
      ],
      trusted: [
        "Top rated trusted {{displayCategory}} available in {{displayLocation}}."
      ],
      affordable: [
        "Get budget friendly {{displayCategory}} starting from ₹{{minPrice}} in {{displayLocation}}."
      ],
      premium: [
        "Explore premium {{displayCategory}} services in {{displayLocation}} with best ratings."
      ]
    },

    headings: {
      general: ["Best {{displayCategory}} in {{displayLocation}}"],
      trusted: ["Trusted {{displayCategory}} Experts in {{displayLocation}}"],
      affordable: ["Affordable {{displayCategory}} in {{displayLocation}}"],
      premium: ["Premium {{displayCategory}} Providers in {{displayLocation}}"]
    },

    introTemplates: [
      "There are {{totalListings}} verified {{displayCategory}} in {{displayLocation}}.",
      "Users are actively searching for {{displayCategory}} services in {{displayLocation}}.",
      "{{displayLocation}} has growing demand for {{displayCategory}} with multiple providers."
    ],

    faq: [
      {
        q: "What is cost of {{displayCategory}} in {{displayLocation}}?",
        a: "It starts from ₹{{minPrice}} depending on service type."
      },
      {
        q: "How many {{displayCategory}} are available in {{displayLocation}}?",
        a: "There are {{totalListings}} verified listings available."
      }
    ]
  },

  default: {
    metaTitles: {
      general: ["Best {{displayCategory}} in {{displayLocation}}"]
    },
    metaDescriptions: {
      general: ["Find {{displayCategory}} in {{displayLocation}}"]
    },
    headings: {
      general: ["Top {{displayCategory}} in {{displayLocation}}"]
    },
    introTemplates: [
      "Find verified {{displayCategory}} in {{displayLocation}}"
    ],
    faq: []
  }
};

export default seoTextBank;