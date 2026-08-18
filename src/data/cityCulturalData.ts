import { FamousPerson, HistoricalEra, CityCultureProfile } from './attractionTypes';

export interface CityDeepHistoryAndCulture {
  cityGenesisAndHistory: string;
  cultureProfile: CityCultureProfile;
  famousFigures: FamousPerson[];
  historicalTimeline: HistoricalEra[];
}

export const CITY_CULTURAL_ARCHIVES: Record<string, CityDeepHistoryAndCulture> = {
  rawalpindi: {
    cityGenesisAndHistory:
      'Rawalpindi traces its human habitation back over 3,000 years to the ancient Soan Valley Paleolithic culture and the neighboring Gandharan civilization of Taxila. Founded by the indigenous Rawal tribe of Hindu Yogis and later revitalized by the chivalric Gakhar warrior chieftains in the 14th century, the city flourished as a strategic gateway on the Grand Trunk Road connecting the fertile plains of Punjab to the Khyber Pass and the Silk Route. In the 19th and early 20th centuries, it evolved into the primary military and administrative garrison of northern South Asia, developing a vibrant multi-cultural fabric of grand Victorian brick edifices, ornate Kashmiri cedarwood Havelis, Sikh Gurdwaras, Hindu temples, and bustling caravan bazaars that remain lively today.',
    cultureProfile: {
      culturalEssence:
        'A heartfelt fusion of Potohari hospitality, Kashmiri mercantile heritage, robust culinary traditions, and resilient civic pride. Rawalpindi is characterized by lively community baithaks (gatherings), a deep reverence for veteran civic elders, and vibrant night bazaars where tea and dialogue flow freely.',
      livingTraditions: [
        'Evening Baithaks & Chai Khana Dialogues across Raja Bazaar and Kartarpura',
        'Potohari Dhol & Sufi Dhamal during seasonal festivals and urs',
        'Pigeons flying and rooftop kite stewardship in Purana Qila and Bhabra Bazaar',
        'Seasonal winter gathering around Kashmiri Samovars for Noon Chai and Bakarkhani'
      ],
      folkCrafts: [
        'Potohari Brass & Copper Inlay Craftsmanship',
        'Kashmiri Cedarwood Carving & Jharokha Balcony woodwork',
        'Traditional Khussa (leather footwear) embroidery with tilla thread',
        'Hand-hammered ironware and antique brass restoration in Purana Qila'
      ],
      culinaryHeritage: [
        {
          dishName: 'Kartarpura Nihari & Siri Paye',
          localName: 'کرتار پورہ نہاری اور سری پائے',
          description: 'Slow-cooked spiced beef shank and knuckle stew simmered overnight in copper cauldrons with marrow bones and ginger garnish.',
          heritageStory: 'Originating from royal Mughal breakfast banquets and perfected over generations by legacy families in Kartarpura food street.',
          famousHub: 'Kartarpura Food Street, Old Rawalpindi'
        },
        {
          dishName: 'Kashmiri Pink Noon Chai with Kulcha',
          localName: 'کشمیری نمکین گلابی چائے',
          description: 'Velvety pink salted green tea brewed with bicarbonate soda, infused with cardamom, topped with crushed pistachios and almonds.',
          heritageStory: 'Brought to Rawalpindi by Kashmiri silk and dry fruit merchants who settled in Bhabra Bazaar during the 19th century.',
          famousHub: 'Bhabra Bazaar & Purana Qila Tea Stalls'
        },
        {
          dishName: 'Potohari Saag with Makki Roti & White Butter',
          localName: 'پوٹوہاری سرسوں کا ساگ اور مکئی کی روٹی',
          description: 'Earthy mustard greens harvested from Potohar farmland, tempered with green chilies, garlic, and fresh churned butter.',
          heritageStory: 'The quintessential agrarian staple of the Potohar plateau, celebrated as the seasonal symbol of hospitality.',
          famousHub: 'Saddar & Cantt Traditional Kitchens'
        }
      ],
      festivalsAndCivicRhythms: [
        'Potohar Spring Heritage & Flower Exhibition at Ayub Park',
        'Annual Urs Celebrations of Sufi Saints across Rawalpindi District',
        'Bazaar Milad & Chand Raat Illuminations across Raja Bazaar',
        'Inter-Ward Civic Sports Tournaments & Wrestling (Dangal) at Liaquat Bagh'
      ],
      literaryAndMusicalHeritage:
        'Home to renowned Urdu and Punjabi poets, lyricists, and intellectuals. The historic Gordon College and Rawalpindi Press Club have served as legendary incubators of South Asian literature, free press advocacy, and progressive cultural movements.',
      languagesAndDialects: ['Potohari (Indigenous regional dialect)', 'Urdu (National civic language)', 'Punjabi', 'Pashto', 'English']
    },
    famousFigures: [
      {
        id: 'pindi-fig-1',
        name: 'Sultan Sarang Khan Gakhar',
        localName: 'سلطان سارنگ خان گکھڑ',
        lifespanOrEra: '1480 – 1546 CE',
        role: 'Warrior Chieftain & Potohar Ruler',
        field: 'Heroic Heritage',
        biography:
          'The legendary paramount chief of the Gakhar tribe who ruled the Potohar plateau from Rawat Fort and Pharwala Fort. Known for his unwavering bravery, he fiercely defended the indigenous sovereignty of Potohar against the invading forces of Sher Shah Suri.',
        famousContributions: [
          'Fortified the Grand Trunk Road defense perimeter at Rawat Fort',
          'Established the administrative autonomy of the Potohar region',
          'Martyred in the epic 1546 Battle of Rawat, remaining an eternal symbol of local courage'
        ],
        civicLegacy: 'Remembered as the founding warrior icon of the Potohar plateau whose tomb at Rawat Fort is an eternal provincial heritage monument.',
        famousQuote: 'We yield our breath to honor and our soil to truth, but never our freedom to an invader.'
      },
      {
        id: 'pindi-fig-2',
        name: 'Jagan Nath Azad',
        localName: 'جگن ناتھ آزاد',
        lifespanOrEra: '1918 – 2004 CE',
        role: 'Eminent Urdu Poet, Scholar & Iqbaliat Authority',
        field: 'Literature & Poetry',
        biography:
          'A luminary poet and literary scholar educated at Gordon College Rawalpindi. Renowned for writing the first national anthem poem broadcast on Radio Pakistan on 14 August 1947 at the personal invitation of Quaid-e-Azam Muhammad Ali Jinnah.',
        famousContributions: [
          'Penned iconic patriotic and secular Urdu poetry bridging South Asian literary bonds',
          'Authored dozens of definitive scholarly treatises on the philosophical thought of Allama Iqbal',
          'Mentored generations of Rawalpindi and Pan-South Asian literary critics'
        ],
        civicLegacy: 'Celebrated as an intellectual beacon whose roots in Rawalpindi forged universal literary harmony across borders.'
      },
      {
        id: 'pindi-fig-3',
        name: 'Dr. Ruth Pfau (Civilian Medalist of Rawalpindi Service)',
        localName: 'ڈاکٹر روتھ فاؤ',
        lifespanOrEra: '1929 – 2017 CE',
        role: 'Humanitarian Physician & Public Health Hero',
        field: 'Civic Leadership & Governance',
        biography:
          'The revered German-Pakistani physician who dedicated over 55 years of her life to eradicating leprosy across Pakistan, including establishing major clinic and patient rehabilitation centers in Rawalpindi Cantonment and northern valleys.',
        famousContributions: [
          'Established the Marie Adelaide Leprosy Centre regional wing in Rawalpindi',
          'Successfully led Pakistan to be declared leprosy-controlled by the WHO in 1996',
          'Trained local Potohari paramedics and public health nurses in compassionate care'
        ],
        civicLegacy: 'Honored with a full state funeral and eternal public adoration for showing unconditional love and healing to the marginalized.'
      },
      {
        id: 'pindi-fig-4',
        name: 'Shoaib Akhtar',
        localName: 'شعیب اختر (راولپنڈی ایکسپریس)',
        lifespanOrEra: '1975 – Present',
        role: 'Record-Breaking International Cricketer',
        field: 'Heroic Heritage',
        biography:
          'Globally renowned as the "Rawalpindi Express", he rose from the neighborhood tape-ball pitches of Morgah and Muslim Town to become the fastest bowler in cricket history, officially clocking 161.3 km/h (100.2 mph).',
        famousContributions: [
          'Set the official world record for the fastest recorded delivery in international cricket history',
          'Put Rawalpindi on the global sporting map through relentless passion and athletic grit',
          'Active civic philanthropist supporting youth sports academies and hospital development in Rawalpindi'
        ],
        civicLegacy: 'An enduring youth inspiration proving that relentless dedication in neighborhood streets can conquer the world stage.'
      }
    ],
    historicalTimeline: [
      {
        eraTitle: 'Paleolithic & Gandharan Foundations',
        period: '500 BCE – 500 CE',
        summary: 'Early human settlements along the Soan River and flourishing Buddhist monasteries connected to the nearby University of Taxila.',
        civicMilestones: [
          'Stone tool production along the Soan River basin',
          'Gandharan monastic caravans establishing trade rest-points at modern Rawalpindi'
        ]
      },
      {
        eraTitle: 'Gakhar Warrior Chieftaincy',
        period: '1398 – 1765 CE',
        summary: 'Sultan Sarang Khan and the Gakhar chiefs establish fortified sarai fortresses at Rawat and Pharwala to govern the Potohar trade corridors.',
        civicMilestones: [
          'Construction of Rawat Fort (1480 CE) and Pharwala Citadel',
          'Alliance with Mughal Emperor Babur and heroic resistance against Suri forces'
        ]
      },
      {
        eraTitle: 'Colonial Expansion & Architectural Bloom',
        period: '1849 – 1947 CE',
        summary: 'Rawalpindi is established as the largest military cantonment in British India, triggering immense civic construction of clock towers, havelis, and rail terminals.',
        civicMilestones: [
          'Establishment of Rawalpindi Cantonment Board and Victorian Railway Station (1881)',
          'Erection of Raja Bazaar Clock Tower (1883) and Gordon College (1893)',
          'Bhabra Bazaar flourishing with intricate multi-story Kashmiri wood havelis'
        ]
      },
      {
        eraTitle: 'Interim National Capital & Modern Era',
        period: '1959 – Present',
        summary: 'Served as the interim capital of Pakistan (1959–1969) while Islamabad was planned and built, evolving into a thriving twin-city commercial metropolis.',
        civicMilestones: [
          'Establishment of Ayub National Park (1959) and Rawalpindi Medical University',
          'Expansion of the Grand Trunk Road corridor and Metro Bus transit linkage with Islamabad'
        ]
      }
    ]
  },

  islamabad: {
    cityGenesisAndHistory:
      'Master-planned in 1960 by celebrated Greek architect and city planner Constantinos Apostolou Doxiadis, Islamabad was carved into the serene green foothills of the Margalla mountain range. Designed as a forward-looking grid city organized into clean functional sectors, it replaced Rawalpindi as the federal capital of Pakistan. Despite its modern 20th-century blueprint, the land beneath Islamabad is rich with deep antiquities—including 2,400-year-old Buddhist caves at Shah Allah Ditta, the Mughal garden springs of Saidpur, and ancient trekking paths traversing into the Himalayas.',
    cultureProfile: {
      culturalEssence:
        'Cosmopolitan, tranquil, environmentally conscious, and diplomatic. Islamabad represents the synthesis of all Pakistani regional cultures alongside international diplomatic communities, marked by lush green boulevards, vibrant cafe culture, mountain hiking trails, and modern Islamic civic architecture.',
      livingTraditions: [
        'Weekend sunrise hiking along Margalla Trail 3 and Trail 5',
        'Artisan folk exhibitions and live craft demonstrations at Lok Virsa Heritage Museum',
        'Sunset tea gatherings overlooking the city skyline at Daman-e-Koh and Monal',
        'Cycling along scenic Constitution Avenue and Rawal Lake greenways'
      ],
      folkCrafts: [
        'National Lok Virsa artisan pottery and wooden truck-art miniatures',
        'Embroidery collections from Balochistan, Sindh, KPK, Punjab, and Gilgit-Baltistan',
        'Handwoven pashmina shawls and tribal jewelry showcased in Saidpur Village'
      ],
      culinaryHeritage: [
        {
          dishName: 'Saidpur Village Wood-Fired Shinwari Karahi',
          localName: 'شنواری مٹن کڑاہی',
          description: 'Tender lamb cooked in its own natural fat with fresh tomatoes, green chilies, and rock salt in a high-flame iron wok.',
          heritageStory: 'Reflecting the traditional culinary style of frontier pashtun pastoralists who traveled through the Margalla passes.',
          famousHub: 'Saidpur Heritage Village & Kohsar Market'
        },
        {
          dishName: 'Margalla Hill Wild Honey Infused Green Tea',
          localName: 'مارگلہ شہد قہوہ',
          description: 'Fragrant herbal green tea sweetened with organic raw honey harvested from wild acacia blossoms in the Margalla National Park.',
          heritageStory: 'A traditional restorative beverage favored by naturalists and mountain trekkers.',
          famousHub: 'Trail 3 Base & Pir Sohawa Viewpoints'
        }
      ],
      festivalsAndCivicRhythms: [
        'Lok Mela National Artisan & Folk Festival (Annual in Autumn)',
        'Islamabad Literary Festival & Open-Air Book Fairs',
        'Margalla Hills Biodiversity Clean-up & Spring Tree Planting Drives',
        'National Day Grand Military & Air Show Parade on Shakarparian'
      ],
      literaryAndMusicalHeritage:
        'Home to national academies of literature, the National Council of Arts (PNCA), and prestigious universities. A melting pot where classical South Asian sitar maestros, sufi qawwals, and contemporary writers convene.',
      languagesAndDialects: ['Urdu', 'English', 'Punjabi', 'Pashto', 'Potohari', 'Sindhi', 'Balochi']
    },
    famousFigures: [
      {
        id: 'isb-fig-1',
        name: 'Constantinos Apostolou Doxiadis',
        localName: 'کانسٹینٹینوس ڈوکسیڈس',
        lifespanOrEra: '1913 – 1975 CE',
        role: 'Master Urban Planner & Architect of Islamabad',
        field: 'Science & Education',
        biography:
          'The visionary Greek architect and town planner who conceived the master layout of Islamabad based on his science of "Ekistics" (the science of human settlements), organizing the city into self-contained hexagonal sector grids that expand linearly into the future.',
        famousContributions: [
          'Created the Master Plan of Islamabad (1960)',
          'Engineered the sector hierarchy (Administrative, Diplomatic, Commercial, Educational, Residential)',
          'Preserved the natural Margalla mountain topography as permanent green national parkland'
        ],
        civicLegacy: 'The structural father of modern Islamabad whose urban grid remains one of the cleanest capital designs in the world.'
      },
      {
        id: 'isb-fig-2',
        name: 'Vedat Dalokay',
        localName: 'ودات دالوکے',
        lifespanOrEra: '1927 – 1991 CE',
        role: 'Master Architect of the Faisal Mosque',
        field: 'Arts & Music',
        biography:
          'The internationally acclaimed Turkish architect and former Mayor of Ankara who won the international design competition to design the iconic Shah Faisal Mosque, brilliantly reimagining traditional domes into an 8-sided Bedouin tent silhouette with four soaring Ottoman-style minarets.',
        famousContributions: [
          'Designed the Shah Faisal Mosque (1976–1986), accommodating 300,000 worshippers',
          'Pioneered modern geometric structural engineering in Islamic sacred architecture',
          'Received the prestigious Aga Khan Award nomination for visionary civic architecture'
        ],
        civicLegacy: 'Gifted Islamabad its defining visual silhouette recognized across the entire world.'
      },
      {
        id: 'isb-fig-3',
        name: 'Uxi Mufti',
        localName: 'عکسی مفتی',
        lifespanOrEra: '1945 – Present',
        role: 'Cultural Anthropologist & Founder of Lok Virsa',
        field: 'Arts & Music',
        biography:
          'Eminent cultural anthropologist who founded the National Institute of Folk and Traditional Heritage (Lok Virsa) in Islamabad, preserving tens of thousands of indigenous folk songs, musical instruments, artisan crafts, and oral histories from extinction.',
        famousContributions: [
          'Established the Lok Virsa National Heritage Museum and Heritage Library',
          'Documented over 5,000 vanishing folk artisans across remote Pakistani valleys',
          'Inaugurated the annual Lok Mela festival uniting all provincial cultures'
        ],
        civicLegacy: 'The legendary custodian of Pakistani folk memory whose work transformed Islamabad into the beating heart of national cultural preservation.'
      }
    ],
    historicalTimeline: [
      {
        eraTitle: 'Ancient Margalla Caves & Trade Trails',
        period: '300 BCE – 1500 CE',
        summary: 'Shah Allah Ditta caves occupied by Buddhist monks and Hindu ascetics along the ancient caravan route to Taxila and Kashmir.',
        civicMilestones: [
          'Carving of meditation caves and fresh spring water channels at Shah Allah Ditta',
          'Saidpur spring village settled as a tranquil Mughal rest stop by Emperor Jahangir'
        ]
      },
      {
        eraTitle: 'Conception & Doxiadis Master Plan',
        period: '1959 – 1965 CE',
        summary: 'Commissioning of the Greek firm Doxiadis Associates and official ground-breaking for the new purpose-built federal capital.',
        civicMilestones: [
          'Approval of the dynamic grid sector plan (1960)',
          'Completion of Secretariat blocks and relocation of federal government offices from Rawalpindi'
        ]
      },
      {
        eraTitle: 'Monumental Golden Age',
        period: '1970 – 1990 CE',
        summary: 'Construction of monumental civic landmarks including Faisal Mosque, Pakistan National Monument, Lok Virsa, and the Supreme Court.',
        civicMilestones: [
          'Completion of the Shah Faisal Mosque (1986)',
          'Establishment of Rawal Lake Dam and Margalla Hills National Park'
        ]
      },
      {
        eraTitle: '21st Century Smart Eco-Capital',
        period: '2000 – Present',
        summary: 'Evolution into an eco-conscious digital hub with Metro transit, solar parks, cultural festivals, and global diplomatic summits.',
        civicMilestones: [
          'Inauguration of the Pakistan Monument & Museum at Shakarparian (2007)',
          'Implementation of citywide green energy corridors and eco-cycling tracks'
        ]
      }
    ]
  },

  lahore: {
    cityGenesisAndHistory:
      'Regarded as the cultural heart and soul of South Asia, Lahore boasts over a thousand years of documented imperial glory. Legend attributes its founding to Prince Lava (son of Rama), while historical chronicles celebrate its rise under the Ghaznavid, Delhi Sultanate, Mughal, Sikh, and British empires. As the imperial capital during the zenith of the Mughal Empire under Akbar, Jahangir, and Shah Jahan, Lahore was transformed into a paradise of walled gardens, red sandstone citadels, glazed tile mosques, and poetic salons. The city remains the intellectual, artistic, and culinary capital of Pakistan.',
    cultureProfile: {
      culturalEssence:
        'Celebrated by the famous saying "Jinne Lahore Nai Vekhya O Janmya Hi Nai" (He who has not seen Lahore has not been born). The culture is defined by boundless warmth (Zinda Dilan-e-Lahore), passionate love for food, grand architectural aesthetics, sufi mysticism, and vibrant literary discourse.',
      livingTraditions: [
        'Thursday night spiritual Sufi Qawwali and Dhamal at the Shrine of Data Ganj Bakhsh',
        'Midnight dining along Gawalmandi and Fort Road Food Street with views of the illuminated Badshahi Mosque',
        'Annual Lahore Literary Festival (LLF) at Alhamra Arts Council',
        'Walled City heritage walks through the 12 historic gates of Old Lahore'
      ],
      folkCrafts: [
        'Kashigari glazed ceramic tilework and fresco painting (Wazir Khan style)',
        'Brass and copper etching in Kasera Bazaar inside the Walled City',
        'Handcrafted Zari and Gota wedding embroidery in Anarkali Bazaar'
      ],
      culinaryHeritage: [
        {
          dishName: 'Lahori Chargha & Murgh Cholay',
          localName: 'لاہوری چرغہ اور مرغ چھولے',
          description: 'Whole chicken deeply scored, marinated in ginger-garlic yogurt masala, steam-roasted and crisp-fried, served with chickpeas.',
          heritageStory: 'Created in the vibrant spice markets of Anarkali and perfected by street food maestros over a century.',
          famousHub: 'Gawalmandi & Laxmi Chowk'
        },
        {
          dishName: 'Gawalmandi Malai Lassi & Kulfi Falooda',
          localName: 'گوالمنڈی پیڑا لسی اور فالودہ',
          description: 'Thick churned yogurt lassi topped with rich layers of clotted milk cream (malai) and dense sweet rabri falooda.',
          heritageStory: 'The legacy of dairy masters who established milk shops in Gawalmandi over 120 years ago.',
          famousHub: 'Gawalmandi Food Street'
        }
      ],
      festivalsAndCivicRhythms: [
        'Mela Chiraghan (Festival of Lights) at Shalimar Gardens',
        'National Horse & Cattle Show at Fortress Stadium',
        'Lahore Biennale International Contemporary Art Festival',
        'Spring Chrysanthemum & Rose Flower Shows at Lawrence Gardens (Bagh-e-Jinnah)'
      ],
      literaryAndMusicalHeritage:
        'The epic epicentre of Urdu, Punjabi, and Persian literature. Birthplace of the Pak Tea House intellectual movement where legends like Faiz Ahmed Faiz, Saadat Hasan Manto, and Ahmad Nadeem Qasmi debated literature and human freedom.',
      languagesAndDialects: ['Punjabi (Majhi dialect)', 'Urdu', 'English']
    },
    famousFigures: [
      {
        id: 'lhr-fig-1',
        name: 'Allama Dr. Muhammad Iqbal',
        localName: 'علامہ ڈاکٹر محمد اقبال (مفکرِ پاکستان)',
        lifespanOrEra: '1877 – 1938 CE',
        role: 'National Philosopher, Universal Poet & Visionary',
        field: 'Philosophy & Sufism',
        biography:
          'The celebrated "Poet of the East" whose philosophical treatises in Persian and Urdu awakened the political and spiritual consciousness of South Asian Muslims. He lived, wrote his masterworks, and was laid to rest beside the steps of the Badshahi Mosque in Lahore.',
        famousContributions: [
          'Authored masterworks including Bang-e-Dra, Bal-e-Jibril, Asrar-e-Khudi, and Zarb-e-Kaleem',
          'Delivered the historic 1930 Allahabad Address proposing the sovereign state of Pakistan',
          'Reconstructed Islamic religious and existential thought for the modern era'
        ],
        civicLegacy: 'The national intellectual symbol whose marble mausoleum beside Badshahi Mosque is guarded by an official military guard of honor.',
        famousQuote: 'Khudi ko kar buland itna ke har taqdeer se pehle, Khuda bande se khud pooche bata teri raza kya hai.'
      },
      {
        id: 'lhr-fig-2',
        name: 'Faiz Ahmed Faiz',
        localName: 'فیض احمد فیض',
        lifespanOrEra: '1911 – 1984 CE',
        role: 'Revolutionary Poet, Nobel Nominee & Lenin Peace Laureate',
        field: 'Literature & Poetry',
        biography:
          'One of the most celebrated and beloved poets in the history of the Urdu language. A leading voice of the Progressive Writers Movement who frequented Pak Tea House and served as the voice of human dignity, justice, and compassion worldwide.',
        famousContributions: [
          'Authored legendary poetry collections: Dast-e-Saba, Naqsh-e-Faryadi, and Zindan Nama',
          'Awarded the Lenin Peace Prize in 1962 for championing global human brotherhood',
          'Founded and led the Pakistan Arts Council (Alhamra) in Lahore'
        ],
        civicLegacy: 'His iconic verses on justice and freedom remain universal anthems of empathy recited across generations.'
      },
      {
        id: 'lhr-fig-3',
        name: 'Data Ganj Bakhsh (Ali Hujwiri)',
        localName: 'حضرت علی ہجویری داتا گنج بخش',
        lifespanOrEra: '1009 – 1077 CE',
        role: 'Patron Saint of Lahore & Master Sufi Scholar',
        field: 'Philosophy & Sufism',
        biography:
          'The 11th-century Persian Sufi mystic and theologian who settled in Lahore and authored Kashf al-Mahjub (Revelation of the Veiled), the earliest formal Persian treatise on Sufism. Known as Data Ganj Bakhsh (Bestower of Treasures), his shrine is the spiritual core of Lahore.',
        famousContributions: [
          'Authored Kashf al-Mahjub, the foundational textbook of classical Sufi ethics',
          'Established 24/7 free community kitchens (Langar) that have fed millions of people uninterrupted for nearly 1,000 years',
          'Spiritual mentor to Khwaja Moinuddin Chishti and countless luminaries'
        ],
        civicLegacy: 'His shrine is the spiritual compass of Lahore, exemplifying unconditional charity, spiritual solace, and communal unity.'
      },
      {
        id: 'lhr-fig-4',
        name: 'Ustad Nusrat Fateh Ali Khan',
        localName: 'استاد نصرت فتح علی خان',
        lifespanOrEra: '1948 – 1997 CE',
        role: 'King of Qawwali & World Music Icon',
        field: 'Arts & Music',
        biography:
          'The unmatched vocal powerhouse who elevated the 700-year-old devotional Sufi tradition of Qawwali from Lahore and Punjab to global concert halls and cinematic scores, celebrated as the greatest voice in recorded history.',
        famousContributions: [
          'Recorded over 125 albums, holding the Guinness World Record for the largest recorded output of a Qawwali artist',
          'Collaborated with Peter Gabriel, Eddie Vedder, and Michael Brook, introducing Eastern spiritual music to global audiences',
          'Preserved and popularized classic Sufi poetry of Baba Bulleh Shah and Amir Khusro'
        ],
        civicLegacy: 'The undisputed "Shahenshah-e-Qawwali" whose transcendent voice embodies the spiritual soul of Lahore.'
      }
    ],
    historicalTimeline: [
      {
        eraTitle: 'Ghaznavid & Early Medieval Capital',
        period: '1000 – 1526 CE',
        summary: 'Lahore becomes a major provincial capital of the Ghaznavid and Delhi Sultanate empires, flourishing as a center of Persian literature and Sufism.',
        civicMilestones: [
          'Arrival of Hazrat Data Ganj Bakhsh Ali Hujwiri (1039 CE)',
          'Establishment of the historic brick walled city and gateway bastions'
        ]
      },
      {
        eraTitle: 'Mughal Imperial Golden Age',
        period: '1526 – 1739 CE',
        summary: 'Akbar, Jahangir, and Shah Jahan transform Lahore into an imperial jewel with massive palaces, Shalimar Gardens, and Badshahi Mosque.',
        civicMilestones: [
          'Rebuilding of Lahore Fort with massive sandstone elephant gates and Sheesh Mahal by Akbar and Shah Jahan',
          'Construction of the Badshahi Mosque (1673 CE) and Wazir Khan Mosque (1634 CE)'
        ]
      },
      {
        eraTitle: 'Sikh Empire Capital',
        period: '1799 – 1849 CE',
        summary: 'Maharaja Ranjit Singh establishes Lahore as the sovereign capital of the Sikh Empire, restoring the fort and constructing royal samadhis.',
        civicMilestones: [
          'Coronation of Maharaja Ranjit Singh at Lahore Fort (1801 CE)',
          'Construction of the Samadhi of Ranjit Singh and Hazuri Bagh Baradari'
        ]
      },
      {
        eraTitle: 'Colonial & Modern Independence Era',
        period: '1849 – Present',
        summary: 'British Anglo-Saracenic civic architecture blends with ancient monuments. In 1940, the historic Pakistan Resolution is passed at Minto Park (Minar-e-Pakistan).',
        civicMilestones: [
          'Passing of the historic Lahore Resolution (23 March 1940) leading to the creation of Pakistan',
          'Establishment of the Lahore Orange Line Metro and UNESCO restoration of the Walled City'
        ]
      }
    ]
  },

  karachi: {
    cityGenesisAndHistory:
      'From a humble 18th-century Baloch and Sindhi fishing village named Kolachi-jo-Goth, Karachi experienced a meteoric rise to become the largest mega-city in Pakistan and one of the most populous urban economic engines in the world. Positioned on the natural deep-water Arabian Sea coast, it was developed by the British in the 1840s as a premier international seaport. Following 1947, it served as the inaugural federal capital of Pakistan and the welcoming haven for millions of Muhajir families who brought rich culinary, literary, and commercial traditions, creating an energetic 24/7 city of lights.',
    cultureProfile: {
      culturalEssence:
        'Dynamic, relentless, entrepreneurial, resilient, and famously known as the "City of Lights". Karachi never sleeps; its seaside promenades, aromatic food streets, bustling stock exchanges, and artistic galleries buzz day and night with unmatched energy.',
      livingTraditions: [
        'Evening sea-breeze walks and camel rides along Clifton Beach and Seaview',
        'Late-night debates and paratha rolls at Burns Road and Boat Basin food streets',
        'Watching sea turtles nest along the protected sands of Sandspit and Hawkesbay',
        'Exploring the grand heritage architecture of Saddar and Empress Market'
      ],
      folkCrafts: [
        'Traditional Sindhi Ajrak block-printing and mirror-work embroidery',
        'Seashell craftsmanship and boat building in Kemari harbor',
        'Handcrafted leather goods and textile printing in Saddar bazaars'
      ],
      culinaryHeritage: [
        {
          dishName: 'Burns Road Bun Kabab & Haleem',
          localName: 'برنس روڈ بن کباب اور حلیم',
          description: 'Pan-toasted soft buns filled with spicy lentil-beef patties, egg foam, and tamarind chutney, paired with slow-cooked shredded beef haleem.',
          heritageStory: 'The legendary street food invented by post-1947 immigrant masters on Burns Road.',
          famousHub: 'Burns Road Food Street, Saddar'
        },
        {
          dishName: 'Karachi Biryani with Potatoes & Prunes',
          localName: 'کراچی دم بریانی',
          description: 'Long-grain fragrant basmati rice layered with fiery spiced meat gravy, saffron, dried plums (aaloo bukhara), and tender steamed potatoes.',
          heritageStory: 'The undisputed national icon of Karachi celebration cuisine, fiercely defended by locals.',
          famousHub: 'Saddar, Burns Road & Clifton'
        }
      ],
      festivalsAndCivicRhythms: [
        'Karachi Literature Festival (KLF) at Beach Luxury Hotel',
        'Karachi Biennale (KB) International Art Exhibition',
        'Seaside Independence Day Boat Parades and Fireworks at Clifton',
        'Annual Urs of Abdullah Shah Ghazi at the hilltop shrine overlooking the Arabian Sea'
      ],
      literaryAndMusicalHeritage:
        'The center of Pakistani broadcast media, contemporary theater (NAPA), indie music, and pioneering modern journalism. Famed for literary mushairas and the fusion of Eastern classical ragas with contemporary rock.',
      languagesAndDialects: ['Urdu', 'Sindhi', 'Balochi', 'Punjabi', 'Pashto', 'Gujarati', 'English']
    },
    famousFigures: [
      {
        id: 'khi-fig-1',
        name: 'Quaid-e-Azam Muhammad Ali Jinnah',
        localName: 'قائدِ اعظم محمد علی جناح (بابائے قوم)',
        lifespanOrEra: '1876 – 1948 CE',
        role: 'Father of the Nation & Founder of Pakistan',
        field: 'Civic Leadership & Governance',
        biography:
          'Born at Wazir Mansion in Kharadar, Karachi, he was a brilliant constitutional lawyer, statesman, and the founding father of Pakistan who championed minority rights, constitutional rule of law, and democratic governance.',
        famousContributions: [
          'Led the Pakistan Movement to peaceful constitutional victory, creating Pakistan on 14 August 1947',
          'Served as the first Governor-General of Pakistan with Karachi as the federal capital',
          'Delivered his famous 11 August 1947 presidential address enshrining freedom of religion and civic equality'
        ],
        civicLegacy: 'His monumental white marble mausoleum (Mazar-e-Quaid) stands at the geographic and emotional heart of Karachi.',
        famousQuote: 'With faith, discipline, and selfless devotion to duty, there is nothing worthwhile that you cannot achieve.'
      },
      {
        id: 'khi-fig-2',
        name: 'Abdul Sattar Edhi',
        localName: 'عبد الستار ایدھی (بابائے خدمت)',
        lifespanOrEra: '1928 – 2016 CE',
        role: 'Humanitarian Legend & Founder of Edhi Foundation',
        field: 'Civic Leadership & Governance',
        biography:
          'The saint of Karachi who began with a single wooden van in Mithadar and built the world’s largest volunteer ambulance fleet, orphanages, women’s shelters, and disaster response foundations without regard to race, religion, or caste.',
        famousContributions: [
          'Built the Edhi Ambulance Service (Guinness World Record for largest volunteer ambulance fleet)',
          'Saved over 50,000 abandoned infants with the "Jhoola" (cradle) initiative placed outside Edhi centers',
          'Personally washed and buried over 20,000 unclaimed bodies with full human dignity'
        ],
        civicLegacy: 'Revered globally as the moral conscience of humanity, receiving an official state funeral in Karachi attended by hundreds of thousands.',
        famousQuote: 'My religion is humanitarianism, which is the basis of every religion in the world.'
      },
      {
        id: 'khi-fig-3',
        name: 'Fatima Jinnah (Madar-e-Millat)',
        localName: 'محترمہ فاطمہ جناح (مادرِ ملت)',
        lifespanOrEra: '1893 – 1967 CE',
        role: 'Mother of the Nation, Dental Surgeon & Stateswoman',
        field: 'Civic Leadership & Governance',
        biography:
          'Sister and closest confidante of Quaid-e-Azam, a pioneer dental surgeon who mobilized millions of South Asian women during the freedom movement and later stood as the courageous champion of democracy during the 1965 presidential campaign in Karachi.',
        famousContributions: [
          'Co-founded the All Pakistan Women’s Association (APWA) promoting women’s education and civil rights',
          'Established refugee settlement and medical relief committees in post-1947 Karachi',
          'Championed transparent democratic governance, civil liberties, and constitutional ethics'
        ],
        civicLegacy: 'Honored as the Mother of the Nation whose residence at Mohatta Palace and tomb at Mazar-e-Quaid are eternal civic monuments.'
      }
    ],
    historicalTimeline: [
      {
        eraTitle: 'Kolachi Fishing Village & Talpur Fort',
        period: '1729 – 1839 CE',
        summary: 'Sindhi and Baloch fishermen establish Kolachi settlement around Manora fort to engage in coastal trade with Oman and the Persian Gulf.',
        civicMilestones: [
          'Construction of Manora Fort by the Talpur Mirs of Sindh',
          'Development of coastal dhow trade with Muscat and Bombay'
        ]
      },
      {
        eraTitle: 'Victorian Seaport & Mercantile Boom',
        period: '1843 – 1947 CE',
        summary: 'Sir Charles Napier captures the port; construction of deep-water berths, Empress Market, Frere Hall, and Karachi Port Trust.',
        civicMilestones: [
          'Inauguration of Frere Hall (1865) and Empress Market (1889)',
          'Establishment of the Karachi Port Trust (1887) as the wheat capital port of Asia'
        ]
      },
      {
        eraTitle: 'First Federal Capital & Industrial Boom',
        period: '1947 – 1980 CE',
        summary: 'Karachi welcomes millions of refugees, serves as the federal capital of Pakistan, and becomes the national hub for commerce and finance.',
        civicMilestones: [
          'Founding of the State Bank of Pakistan and Karachi Stock Exchange (1948)',
          'Completion of Mazar-e-Quaid white marble monument (1970)'
        ]
      },
      {
        eraTitle: 'Global Megacity & Coastal Metropolis',
        period: '1980 – Present',
        summary: 'Grows into an economic colossus producing over 20% of national GDP, celebrated for its arts, media, and coastal culture.',
        civicMilestones: [
          'Establishment of Port Qasim and Clifton Seaview modern promenade',
          'Revitalization of historic Saddar heritage buildings and Karachi Biennale'
        ]
      }
    ]
  },

  peshawar: {
    cityGenesisAndHistory:
      'Peshawar is one of the oldest continuously inhabited cities in Asia, with verified archaeological records dating back over 2,500 years to the 6th century BCE. Originally known as Purushapura (City of Men/Flowers) when it served as the glorious winter capital of the Kushan Emperor Kanishka the Great, it was the site of the legendary Kanishka Stupa, once the tallest architectural structure in the ancient world. Nestled at the eastern foot of the legendary Khyber Pass, Peshawar has witnessed the marches of Alexander the Great, Chandragupta Maurya, Babur, and Marco Polo, anchoring Silk Road commerce through its famous Storytellers’ Bazaar (Qissa Khwani).',
    cultureProfile: {
      culturalEssence:
        'Defined by the chivalric Pashtunwali moral code of hospitality (Melmastia), courage (Ghayrat), and honor (Nang). Peshawar is legendary for its storytelling traditions, brass samovar green tea gatherings, and timeless historic bazaars.',
      livingTraditions: [
        'Green cardamom Kahwah tea sessions along Qissa Khwani Bazaar',
        'Storytelling and poetic recitals at traditional Hujra community spaces',
        'Traditional Attan folk dance accompanied by the Surnai and Dhol',
        'Handcrafting traditional Peshawari Chappals with pure leather and needlework'
      ],
      folkCrafts: [
        'Hand-stitched Peshawari Chappal (Kaptaan & Norozi styles)',
        'Copperware engraving and brass tea samovar crafting in Misgaran Bazaar',
        'Intricate Karakuli fur caps and traditional Pakol woolen caps'
      ],
      culinaryHeritage: [
        {
          dishName: 'Peshawari Charsi Tikka & Shinwari Karahi',
          localName: 'چرسی تکہ اور شنواری کڑاہی',
          description: 'Salt-cured mutton skewers char-grilled over acacia wood coals, and tender meat simmered solely in animal fat and ripe tomatoes.',
          heritageStory: 'The legendary campfire feast of frontier caravan riders along the Khyber route.',
          famousHub: 'Namak Mandi & Ring Road'
        },
        {
          dishName: 'Qissa Khwani Cardamom Kahwah with Peshawari Halwa',
          localName: 'قصہ خوانی قہوہ اور پشاوری حلوہ',
          description: 'Peshawari green tea steeped with whole green cardamom pods, served in delicate porcelain cups alongside sticky almond halwa.',
          heritageStory: 'Brewed for millennia to keep Silk Road merchants warm while exchanging traveler tales.',
          famousHub: 'Qissa Khwani Bazaar'
        }
      ],
      festivalsAndCivicRhythms: [
        'Jashn-e-Baharan Spring Festivals at Shahi Bagh',
        'Traditional Polo Matches and Equestrian Tent Pegging',
        'Peshawar Heritage Trail Walking Festivals through the Walled City'
      ],
      literaryAndMusicalHeritage:
        'The heart of classical Pashto literature, immortalized by the poetry of Rahman Baba and Khushal Khan Khattak. Celebrated for the soulful melodies of the Pashto Rubab instrument.',
      languagesAndDialects: ['Pashto', 'Hindko (Peshawar dialect)', 'Urdu', 'English']
    },
    famousFigures: [
      {
        id: 'psh-fig-1',
        name: 'Rahman Baba (Abdur Rahman Mohmand)',
        localName: 'رحمان بابا',
        lifespanOrEra: '1632 – 1706 CE',
        role: 'National Sufi Poet of Pashto Literature',
        field: 'Philosophy & Sufism',
        biography:
          'Revered as the Nightingale of Peshawar, his timeless mystical poetry in the Pashto language preaches universal love, humility, detachment from worldly greed, and peace. His shrine in Hazarkhwani, Peshawar, is a celebrated spiritual destination.',
        famousContributions: [
          'Authored the Diwan of Rahman Baba, the most cherished and memorized book of Pashto poetry',
          'Established the compassionate, spiritual ethos of Pashtun cultural philosophy',
          'His verses are consulted for spiritual guidance across Afghanistan and Pakistan'
        ],
        civicLegacy: 'The spiritual beacon of Peshawar whose poetry is celebrated as a universal message of human fraternity.'
      },
      {
        id: 'psh-fig-2',
        name: 'Dilip Kumar (Muhammad Yusuf Khan)',
        localName: 'دلیپ کمار (محمد یوسف خان)',
        lifespanOrEra: '1922 – 2021 CE',
        role: 'Legendary Cinematic Thespian',
        field: 'Arts & Music',
        biography:
          'Born at his ancestral haveli in Mohallah Khudadad near Qissa Khwani Bazaar, Peshawar, he pioneered method acting in South Asian cinema and remains celebrated as one of the greatest actors in world cinematic history.',
        famousContributions: [
          'Starred in iconic cinematic masterworks including Mughal-e-Azam, Devdas, and Ganga Jamuna',
          'Honored with Pakistan’s highest civilian award, Nishan-e-Imtiaz, in 1998 for cultural bridge-building',
          'His 100-year-old ancestral house in Peshawar is a protected National Heritage monument'
        ],
        civicLegacy: 'Peshawar’s most famous cinematic son who always retained passionate love and nostalgia for his hometown streets.'
      }
    ],
    historicalTimeline: [
      {
        eraTitle: 'Kushan Imperial Capital (Purushapura)',
        period: '500 BCE – 400 CE',
        summary: 'Emperor Kanishka makes Peshawar his imperial capital, erecting the monumental Kanishka Stupa and fostering the golden age of Gandhara art.',
        civicMilestones: [
          'Construction of Kanishka Stupa and massive Buddhist monasteries',
          'Flowering of Greco-Buddhist stone sculptures now housed in Peshawar Museum'
        ]
      },
      {
        eraTitle: 'Mughal Gateway to the Silk Road',
        period: '1526 – 1747 CE',
        summary: 'Babur uses Peshawar as his forward base; construction of the imperial Mahabat Khan Mosque and Bala Hissar Fort.',
        civicMilestones: [
          'Construction of the white marble Mahabat Khan Mosque (1630 CE)',
          'Rebuilding of Bala Hissar Fort by Mughal Emperor Humayun'
        ]
      },
      {
        eraTitle: 'Colonial Frontier Station & Modern Era',
        period: '1849 – Present',
        summary: 'Establishment of Islamia College Peshawar (1913) and evolution into a strategic modern regional gateway.',
        civicMilestones: [
          'Founding of Islamia College Peshawar (1913) by Sir Sahibzada Abdul Qayyum',
          'Restoration of the historic Peshawar Heritage Trail and Qissa Khwani Bazaar'
        ]
      }
    ]
  },

  multan: {
    cityGenesisAndHistory:
      'Multan, the legendary 5,000-year-old "City of Saints" (Madinat-ul-Auliya), is one of the oldest cities in the world. Mentioned in the ancient Sanskrit Mahabharata and besieged by Alexander the Great in 326 BCE, it rose to world renown in the medieval era as the radiant center of Islamic Sufi mysticism, scholarship, and Kashigari glazed tile architecture under the Suhrawardiyya order. Its skyline is defined by monumental 13th- and 14th-century octagonal brick mausoleums crowned with shimmering turquoise domes.',
    cultureProfile: {
      culturalEssence:
        'Deeply spiritual, poetic, warm, and artistic. Multan is famous for four historic gifts celebrated in Persian verse: Gard (dust), Garma (summer heat), Gada (ascetic dervishes), and Goristan (monumental tombs).',
      livingTraditions: [
        'Sufi Dhamal and devotional ceremonies at the Shrines of Bahauddin Zakariya and Shah Rukn-e-Alam',
        'Artisan handcrafting of blue glazed pottery in Kashigari workshops',
        'Wearing handcrafted Camel Leather lamps and embroidered Khussa shoes'
      ],
      folkCrafts: [
        'Kashigari Blue Glazed Cobalt Pottery & Ceramic Tilework',
        'Multani Camel Skin Lamps with delicate floral painting (Naqashi)',
        'Handcrafted Multani Chundri tie-dye silk and cotton textiles'
      ],
      culinaryHeritage: [
        {
          dishName: 'Multani Sohan Halwa',
          localName: 'ملتانی سوہن حلوہ',
          description: 'Dense, chewy golden-brown sweetmeat made from sprouted wheat (samnak), milk, ghee, saffron, and loaded with almonds, pistachios, and walnuts.',
          heritageStory: 'Crafted since the 18th century by legacy confectionery families as royal imperial gifts.',
          famousHub: 'Hussain Agahi Bazaar & Ghanta Ghar Chowk'
        }
      ],
      festivalsAndCivicRhythms: [
        'Annual Grand Urs of Hazrat Shah Rukn-e-Alam on Multan Fort Mound',
        'Multani Mango Festival celebrating the world-famous Chaunsa and Anwar Ratol mangoes'
      ],
      literaryAndMusicalHeritage:
        'A cradle of Seraiki and Punjabi mystical poetry, home to the sacred verses of Khwaja Ghulam Farid.',
      languagesAndDialects: ['Seraiki', 'Punjabi', 'Urdu', 'English']
    },
    famousFigures: [
      {
        id: 'mlt-fig-1',
        name: 'Hazrat Shah Rukn-e-Alam',
        localName: 'حضرت شاہ رکنِ عالم',
        lifespanOrEra: '1251 – 1335 CE',
        role: 'Master Sufi Saint & Spiritual Luminary',
        field: 'Philosophy & Sufism',
        biography:
          'The renowned Suhrawardi Sufi master whose monumental 14th-century octagonal mausoleum on the Multan Fort mound is recognized as the masterpiece of Tughlaq architecture and the premier symbol of Multan.',
        famousContributions: [
          'Preached universal interfaith tolerance, charity, and inner purification across South Asia',
          'His tomb is the first octagonal domed structure in South Asia, pre-dating the Taj Mahal by 300 years'
        ],
        civicLegacy: 'The eternal guardian saint of Multan whose tomb dome illuminates the city skyline.'
      }
    ],
    historicalTimeline: [
      {
        eraTitle: 'Ancient Indus & Mallian Citadel',
        period: '3000 BCE – 712 CE',
        summary: 'Ancient fortress settlement on the Chenab River; siege of Alexander the Great in 326 BCE.',
        civicMilestones: [
          'Famous historical Sun Temple of Multan visited by Xuanzang',
          'Capture of Multan by Muhammad bin Qasim in 712 CE'
        ]
      },
      {
        eraTitle: 'Sufi Golden Age & Imperial Tombs',
        period: '1200 – 1700 CE',
        summary: 'Bahauddin Zakariya and Shah Rukn-e-Alam establish the Suhrawardi Sufi order; construction of monumental blue-domed tombs.',
        civicMilestones: [
          'Construction of Shah Rukn-e-Alam Mausoleum (1324 CE)',
          'Flourishing of the world-famous Kashigari blue pottery industry'
        ]
      }
    ]
  },

  'new-york': {
    cityGenesisAndHistory:
      'Originally inhabited by the Lenape Native Americans and settled as New Amsterdam by Dutch merchants in 1624, New York City emerged into the financial, cultural, and media capital of the world. Built on the bedrock of Manhattan and expanded across five vibrant boroughs, it is the city of immigrants, towering Art Deco skyscrapers, Broadway theater, and iconic civic parks.',
    cultureProfile: {
      culturalEssence:
        'Fast-paced, fiercely ambitious, culturally diverse, artistic, and resilient. A 24/7 global stage where over 800 languages are spoken.',
      livingTraditions: [
        'Sunday afternoon walks and rowing in Central Park',
        'Strolling the High Line elevated greenway at sunset',
        'Attending Broadway theater productions and indie jazz clubs in Greenwich Village'
      ],
      folkCrafts: ['Indie theater design', 'Urban street photography', 'Artisan bagel baking'],
      culinaryHeritage: [
        {
          dishName: 'New York Style Bagel with Lox & Cream Cheese',
          localName: 'NYC Bagel & Lox',
          description: 'Boiled-and-baked malted dough bagel topped with smoked salmon, capers, and scallion cream cheese.',
          heritageStory: 'Perfected by Jewish immigrant bakers on the Lower East Side in the early 20th century.',
          famousHub: 'Lower East Side & Greenwich Village'
        }
      ],
      festivalsAndCivicRhythms: ['New York City Marathon', 'Tribeca Film Festival', 'Shakespeare in the Park'],
      literaryAndMusicalHeritage: 'Cradle of Hip Hop (Bronx), Harlem Renaissance literature, modern jazz, and abstract expressionist art.',
      languagesAndDialects: ['English', 'Spanish', 'Mandarin', 'Yiddish', 'Arabic', 'Urdu']
    },
    famousFigures: [
      {
        id: 'nyc-fig-1',
        name: 'Frederick Law Olmsted',
        localName: 'Frederick Law Olmsted',
        lifespanOrEra: '1822 – 1903 CE',
        role: 'Father of American Landscape Architecture',
        field: 'Civic Leadership & Governance',
        biography:
          'Co-designer of Central Park and Prospect Park, he pioneered public urban parks as essential democratic spaces for mental health, social cohesion, and nature access for all citizens.',
        famousContributions: [
          'Designed Central Park (1858) and Prospect Park',
          'Pioneered modern urban environmental conservation and public greenway design'
        ],
        civicLegacy: 'His green masterpieces remain the breathing lungs and democratic backyards of all New Yorkers.'
      }
    ],
    historicalTimeline: [
      {
        eraTitle: 'Dutch New Amsterdam to British Rule',
        period: '1624 – 1783 CE',
        summary: 'Founded as a fur trading post; serves as the first capital of the United States in 1789.',
        civicMilestones: ['George Washington inaugurated at Federal Hall (1789)', 'Commissioners’ Plan of 1811 creating the Manhattan street grid']
      }
    ]
  },

  london: {
    cityGenesisAndHistory:
      'Founded by the Romans as Londinium around 47 CE along the River Thames, London has stood as a global center of commerce, literature, constitutional democracy, and scientific discovery for two millennia. Surviving the Great Fire of 1666 and the Blitz, it was rebuilt with Sir Christopher Wren’s Portland stone baroque cathedrals and expansive royal parks.',
    cultureProfile: {
      culturalEssence:
        'Polite, witty, cosmopolitan, historic, and theatrical. A tapestry of historic pubs, world-class free public museums, West End theater, and royal ceremonies.',
      livingTraditions: ['Sunday roast at historic Thames-side pubs', 'Exploring the British Museum and Tate Modern', 'Afternoon tea ceremonies'],
      folkCrafts: ['Savile Row bespoke tailoring', 'Bookbinding in Bloomsbury', 'Traditional Thames boat-building'],
      culinaryHeritage: [
        {
          dishName: 'Traditional London Fish & Chips with Mushy Peas',
          localName: 'Fish & Chips',
          description: 'Beer-battered fresh cod or haddock served with thick hand-cut chips, tartar sauce, and malt vinegar.',
          heritageStory: 'Created in the East End in the 1860s as a hearty staple for working-class dockers.',
          famousHub: 'Borough Market & Covent Garden'
        }
      ],
      festivalsAndCivicRhythms: ['Notting Hill Carnival', 'Proms Classical Music Festival at Royal Albert Hall', 'Thames River Festival'],
      literaryAndMusicalHeritage: 'Home of William Shakespeare, Charles Dickens, Virginia Woolf, the Beatles (Abbey Road), and punk rock.',
      languagesAndDialects: ['English (RP & Cockney)', 'Bengali', 'Polish', 'Urdu', 'Spanish']
    },
    famousFigures: [
      {
        id: 'ldn-fig-1',
        name: 'Sir Christopher Wren',
        localName: 'Sir Christopher Wren',
        lifespanOrEra: '1632 – 1723 CE',
        role: 'Master Baroque Architect & Astronomer',
        field: 'Arts & Music',
        biography:
          'The architectural genius who rebuilt London following the Great Fire of 1666, designing 52 parish churches and the monumental dome of St Paul’s Cathedral.',
        famousContributions: [
          'Designed St Paul’s Cathedral (1675–1710)',
          'Pioneered English Baroque architecture and Royal Observatory Greenwich'
        ],
        civicLegacy: 'His Portland stone monuments defined the skyline of London for centuries.'
      }
    ],
    historicalTimeline: [
      {
        eraTitle: 'Roman Londinium & Medieval City',
        period: '47 – 1500 CE',
        summary: 'Roman settlement evolves into the walled medieval merchant capital with the Tower of London and Old London Bridge.',
        civicMilestones: ['Construction of the Tower of London by William the Conqueror (1078)', 'Founding of Westminster Abbey (1065)']
      }
    ]
  },

  paris: {
    cityGenesisAndHistory:
      'Emerging from the Iron Age Celtic Parisii tribe settlement on the Île de la Cité along the River Seine, Paris blossomed into the global "City of Light" (Ville Lumière). Famed for Enlightenment philosophy, grand Haussmannian tree-lined boulevards, Gothic cathedrals, and revolutionary arts, Paris is a living museum of elegance and human expression.',
    cultureProfile: {
      culturalEssence:
        'Sophisticated, artistic, philosophical, culinary, and proud. Defined by sidewalk café culture, flâneur strolling along the Seine, haute couture, and deep respect for literature.',
      livingTraditions: ['Morning espresso and fresh croissants at sidewalk bistros', 'Browsing the vintage Bouquinistes book stalls along the Seine', 'Sunset picnics on the Champ de Mars'],
      folkCrafts: ['Haute couture fashion embroidery', 'Artisan sourdough baking', 'Classical perfume blending'],
      culinaryHeritage: [
        {
          dishName: 'Traditional French Baguette with Artisanal Cheese',
          localName: 'Baguette Tradition & Fromage',
          description: 'Crispy stone-baked sourdough baguette paired with creamy Camembert and aged Comté cheese.',
          heritageStory: 'UNESCO-inscribed intangible cultural heritage of French daily life.',
          famousHub: 'Saint-Germain-des-Prés & Montmartre'
        }
      ],
      festivalsAndCivicRhythms: ['Nuit Blanche Arts Festival', 'Fête de la Musique (Make Music Day)', 'Bastille Day on Champs-Élysées'],
      literaryAndMusicalHeritage: 'Cradle of Voltaire, Victor Hugo, Marcel Proust, Impressionism (Monet), and French Chanson.',
      languagesAndDialects: ['French', 'English', 'Arabic']
    },
    famousFigures: [
      {
        id: 'prs-fig-1',
        name: 'Gustave Eiffel',
        localName: 'Gustave Eiffel',
        lifespanOrEra: '1832 – 1923 CE',
        role: 'Master Civil Engineer & Architect',
        field: 'Science & Education',
        biography:
          'The visionary structural engineer who built the iconic 330-meter Eiffel Tower for the 1889 World’s Fair and engineered the interior iron armature of the Statue of Liberty.',
        famousContributions: [
          'Engineered the Eiffel Tower (1889)',
          'Pioneered aerodynamic bridge engineering and metallic lattice structures'
        ],
        civicLegacy: 'Created the universal symbol of France and modern structural daring.'
      }
    ],
    historicalTimeline: [
      {
        eraTitle: 'Medieval Kingdom & Haussmann Transformation',
        period: '1100 – 1900 CE',
        summary: 'Construction of Notre-Dame Cathedral followed by Baron Haussmann’s 19th-century modernization creating the iconic Parisian boulevards.',
        civicMilestones: ['Construction of Notre-Dame de Paris (1163–1345)', 'Haussmann’s renovation of Paris (1853–1870)', 'Erection of the Eiffel Tower (1889)']
      }
    ]
  },

  tokyo: {
    cityGenesisAndHistory:
      'From a small 12th-century fishing village named Edo, Tokyo was transformed in 1603 when Tokugawa Ieyasu established the Tokugawa Shogunate, making it the de facto political capital of Japan. Renamed Tokyo ("Eastern Capital") during the Meiji Restoration in 1868 when Emperor Meiji moved the imperial court, it rebuilt itself after the 1923 Great Kanto earthquake and WWII into the safest, most hyper-efficient and technologically advanced mega-metropolis on earth while meticulously preserving ancient Shinto shrines and Zen Buddhist gardens.',
    cultureProfile: {
      culturalEssence:
        'A mesmerizing harmony of ancient spiritual reverence (Omotenashi hospitality, Zen minimalism) and futuristic high-tech innovation. Tokyo is known for pristine cleanliness, quiet neighborhood safety, and exquisite attention to culinary and visual detail.',
      livingTraditions: [
        'Spring Hanami (Cherry blossom viewing) picnics in Ueno Park and Shinjuku Gyoen',
        'Morning prayer and purifying with water at Sensō-ji Temple in Asakusa',
        'Exploring traditional izakaya alleys under railway arches in Yurakucho and Shinjuku Omoide Yokocho'
      ],
      folkCrafts: [
        'Edo Kiriko cut crystal glasswork',
        'Traditional Japanese Washi paper making',
        'Hand-forged Chef Knives and Lacquerware'
      ],
      culinaryHeritage: [
        {
          dishName: 'Authentic Tokyo Edomae Nigiri Sushi',
          localName: '江戸前寿司',
          description: 'Fresh Pacific sea fish delicately sliced, cured, and placed atop warm seasoned vinegared rice with fresh wasabi.',
          heritageStory: 'Created in Edo in the 1820s as quick, elegant street food for merchants.',
          famousHub: 'Tsukiji Outer Market & Ginza'
        }
      ],
      festivalsAndCivicRhythms: [
        'Sanja Matsuri Grand Shinto Festival in Asakusa',
        'Sumida River Fireworks Festival (Oldest in Japan)',
        'Kanda Matsuri Festival with portable Mikoshi shrines'
      ],
      literaryAndMusicalHeritage:
        'Cradle of Matsuo Bashō haiku poetry, Haruki Murakami contemporary novels, Studio Ghibli animation, and J-Pop.',
      languagesAndDialects: ['Japanese (Tokyo Standard)', 'English']
    },
    famousFigures: [
      {
        id: 'tko-fig-1',
        name: 'Tokugawa Ieyasu',
        localName: '徳川 家康',
        lifespanOrEra: '1543 – 1616 CE',
        role: 'First Shogun of Tokugawa Shogunate & Founder of Edo (Tokyo)',
        field: 'Civic Leadership & Governance',
        biography:
          'The legendary samurai warlord who unified Japan after centuries of civil war and established Edo (modern Tokyo) as the seat of peace, governance, and rapid civic development for 265 years.',
        famousContributions: [
          'Founded the city of Edo (Tokyo) as the political capital in 1603',
          'Engineered the moat system, canals, and roads connecting Tokyo to all Japanese provinces'
        ],
        civicLegacy: 'The founding father of Tokyo who laid the infrastructure groundwork for the modern metropolis.'
      }
    ],
    historicalTimeline: [
      {
        eraTitle: 'Edo Castle & Shogunate Golden Age',
        period: '1603 – 1868 CE',
        summary: 'Edo grows into the world’s most populous city with 1 million residents, celebrated for Kabuki theater, Ukiyo-e woodblock prints, and merchant culture.',
        civicMilestones: ['Founding of Edo Shogunate (1603)', 'Construction of Sensō-ji Temple and Edo Castle']
      },
      {
        eraTitle: 'Meiji Modernization to 21st Century Mega-Metropolis',
        period: '1868 – Present',
        summary: 'Renamed Tokyo, it leads the Asian industrial revolution, hosts the 1964 and 2020 Olympic Games, and builds the world’s most advanced transit network.',
        civicMilestones: ['Meiji Restoration and renaming to Tokyo (1868)', 'Opening of Tokyo Skytree (2012) and Shinjuku High-Speed Hub']
      }
    ]
  }
};
