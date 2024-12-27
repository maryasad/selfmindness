import axios from 'axios';
import { Response, Language, TherapeuticContext, VoiceGender, VoiceSettings } from '../types';

// Therapeutic frameworks and techniques
const therapeuticFrameworks = {
  en: {
    cbt: {
      thoughtRecord: {
        prompt: "Let's examine this thought more carefully. Could you tell me:\n1. What's the situation?\n2. What thoughts came up?\n3. What emotions did you feel (0-100%)?\n4. What evidence supports this thought?\n5. What evidence doesn't support it?",
        followUp: "Based on all evidence, what could be a more balanced perspective?"
      },
      behavioralActivation: {
        prompt: "Let's create an activity schedule that can help lift your mood. What activities used to give you a sense of:\n1. Achievement?\n2. Connection with others?\n3. Enjoyment?",
        followUp: "Could we start with one small activity this week? When would be a good time to try it?"
      },
      exposureHierarchy: {
        prompt: "Let's build a ladder of situations that cause anxiety, from least challenging (0) to most challenging (100). What would be on your ladder?",
        followUp: "We can start with the easiest step. What would help you feel ready to try it?"
      }
    },
    motivationalInterviewing: {
      readinessRuler: {
        prompt: "On a scale of 0-10, how important is making this change to you? And on the same scale, how confident are you about making this change?",
        followUp: "What makes you choose that number? What would help move it up by one point?"
      },
      changeExploration: {
        prompt: "What would be the benefits of making this change? And what concerns do you have about making this change?",
        followUp: "Of these benefits, which one matters most to you personally?"
      }
    },
    solutionFocused: {
      miracleQuestion: {
        prompt: "Imagine you wake up tomorrow and this problem is solved. What's the first small sign you'd notice that things are different?",
        followUp: "Have there been any times recently when you've seen even a tiny bit of this miracle happening?"
      },
      exceptionFinding: {
        prompt: "Tell me about times when this problem is less intense or doesn't happen. What's different about those times?",
        followUp: "What do these exceptions tell us about your strengths and resources?"
      }
    },
    mindfulness: {
      bodyAwareness: {
        prompt: "Let's take a moment to notice what's happening in your body right now. Where do you feel tension or ease?",
        followUp: "As you notice these sensations, can you observe them with curiosity, without trying to change them?"
      },
      emotionalAwareness: {
        prompt: "Can you describe the emotion you're feeling, not just its name, but its quality? Is it moving or still? Heavy or light?",
        followUp: "How does this emotion want to be acknowledged right now?"
      }
    },
    valuesBased: {
      exploration: {
        prompt: "What matters most to you in life? If you were living fully according to your values, what would that look like?",
        followUp: "How could you take one small step toward these values today?"
      },
      lifeCompass: {
        prompt: "Let's explore different life areas: relationships, work, personal growth, and health. Which area feels most important to focus on right now?",
        followUp: "In this area, what would 'living well' mean to you?"
      }
    }
  },
  da: {
    cbt: {
      thoughtRecord: {
        prompt: "Lad os undersøge denne tanke nærmere. Kan du fortælle mig:\n1. Hvad er situationen?\n2. Hvilke tanker dukkede op?\n3. Hvilke følelser mærkede du (0-100%)?\n4. Hvilke beviser understøtter denne tanke?\n5. Hvilke beviser understøtter ikke denne tanke?",
        followUp: "Baseret på alle beviser, hvad kunne være et mere balanceret perspektiv?"
      },
      behavioralActivation: {
        prompt: "Lad os lave en aktivitetsplan, der kan hjælpe med at løfte dit humør. Hvilke aktiviteter gav dig tidligere en følelse af:\n1. Præstation?\n2. Forbindelse med andre?\n3. Nydelse?",
        followUp: "Kunne vi starte med én lille aktivitet denne uge? Hvornår ville være et godt tidspunkt at prøve det?"
      }
    },
    mindfulness: {
      bodyAwareness: {
        prompt: "Lad os tage et øjeblik til at bemærke, hvad der sker i din krop lige nu. Hvor føler du spænding eller lethed?",
        followUp: "Når du bemærker disse fornemmelser, kan du observere dem med nysgerrighed, uden at prøve at ændre dem?"
      },
      emotionalAwareness: {
        prompt: "Kan du beskrive den følelse, du har, ikke kun dens navn, men dens kvalitet? Er den i bevægelse eller stille? Tung eller let?",
        followUp: "Hvordan ønsker denne følelse at blive anerkendt lige nu?"
      }
    }
  },
  fa: {
    cbt: {
      thoughtRecord: {
        prompt: "بیایید این فکر را با دقت بیشتری بررسی کنیم. می‌توانید به من بگویید:\n1. موقعیت چیست؟\n2. چه افکاری به ذهنتان آمد؟\n3. چه احساساتی داشتید (0-100%)؟\n4. چه شواهدی این فکر را تأیید می‌کند؟\n5. چه شواهدی آن را تأیید نمی‌کند؟",
        followUp: "با توجه به همه شواهد، چه دیدگاه متعادل‌تری می‌تواند وجود داشته باشد؟"
      },
      behavioralActivation: {
        prompt: "بیایید یک برنامه فعالیت ایجاد کنیم که به بهبود خلق‌وخوی شما کمک کند. چه فعالیت‌هایی قبلاً به شما احساس:\n1. موفقیت می‌داد؟\n2. ارتباط با دیگران؟\n3. لذت؟",
        followUp: "می‌توانیم این هفته با یک فعالیت کوچک شروع کنیم؟ چه زمانی برای امتحان کردن آن مناسب است؟"
      },
      exposureHierarchy: {
        prompt: "بیایید نردبانی از موقعیت‌هایی که باعث اضطراب می‌شوند بسازیم، از کم‌چالش‌ترین (0) تا پرچالش‌ترین (100). چه چیزهایی در نردبان شما قرار می‌گیرد؟",
        followUp: "می‌توانیم با ساده‌ترین قدم شروع کنیم. چه چیزی به شما کمک می‌کند احساس آمادگی برای امتحان آن داشته باشید؟"
      }
    },
    motivationalInterviewing: {
      readinessRuler: {
        prompt: "در مقیاس 0 تا 10، این تغییر چقدر برای شما مهم است؟ و در همین مقیاس، چقدر به توانایی خود برای ایجاد این تغییر اطمینان دارید؟",
        followUp: "چرا این عدد را انتخاب کردید؟ چه چیزی می‌تواند آن را یک نمره بالاتر ببرد؟"
      },
      changeExploration: {
        prompt: "مزایای ایجاد این تغییر چیست؟ و چه نگرانی‌هایی درباره ایجاد این تغییر دارید؟",
        followUp: "از بین این مزایا، کدام یک برای شما شخصاً مهم‌تر است؟"
      }
    },
    solutionFocused: {
      miracleQuestion: {
        prompt: "تصور کنید فردا صبح که بیدار می‌شوید این مشکل حل شده است. اولین نشانه کوچکی که متوجه می‌شوید اوضاع متفاوت شده چیست؟",
        followUp: "آیا اخیراً زمان‌هایی بوده که حتی بخش کوچکی از این معجزه اتفاق افتاده باشد؟"
      },
      exceptionFinding: {
        prompt: "درباره زمان‌هایی به من بگویید که این مشکل کمتر شدید است یا اتفاق نمی‌افتد. در آن زمان‌ها چه چیزی متفاوت است؟",
        followUp: "این استثناها درباره توانایی‌ها و منابع شما چه می‌گویند؟"
      }
    },
    mindfulness: {
      bodyAwareness: {
        prompt: "بیایید لحظه‌ای به آنچه الان در بدنتان اتفاق می‌افتد توجه کنیم. کجا احساس تنش یا راحتی می‌کنید؟",
        followUp: "همانطور که این احساسات را متوجه می‌شوید، می‌توانید آنها را با کنجکاوی و بدون تلاش برای تغییر مشاهده کنید؟"
      },
      emotionalAwareness: {
        prompt: "می‌توانید احساسی که دارید را توصیف کنید، نه فقط نامش را، بلکه کیفیتش را؟ آیا در حرکت است یا ساکن؟ سنگین است یا سبک؟",
        followUp: "این احساس چگونه می‌خواهد در حال حاضر شناخته شود؟"
      }
    },
    valuesBased: {
      exploration: {
        prompt: "چه چیزی در زندگی برایتان مهم‌ترین است؟ اگر کاملاً مطابق با ارزش‌هایتان زندگی می‌کردید، چگونه به نظر می‌رسید؟",
        followUp: "چگونه می‌توانید امروز یک قدم کوچک به سمت این ارزش‌ها بردارید؟"
      },
      lifeCompass: {
        prompt: "بیایید حوزه‌های مختلف زندگی را بررسی کنیم: روابط، کار، رشد شخصی و سلامتی. کدام حوزه در حال حاضر برای تمرکز مهم‌تر است؟",
        followUp: "در این حوزه، 'خوب زندگی کردن' برای شما به چه معناست؟"
      }
    }
  }
};

// Enhanced conversation context with therapeutic tracking
interface TherapeuticContext {
  currentPhase: 'assessment' | 'intervention' | 'maintenance';
  sessionNumber: number;
  primaryConcern: string;
  treatmentGoals: string[];
  interventionsUsed: string[];
  progressMarkers: {
    date: string;
    metric: string;
    value: number;
  }[];
  homeworkAssigned: {
    date: string;
    task: string;
    completed: boolean;
  }[];
  copingStrategies: {
    strategy: string;
    effectiveness: number;
    frequency: number;
  }[];
}

let therapeuticContext: TherapeuticContext = {
  currentPhase: 'assessment',
  sessionNumber: 1,
  primaryConcern: '',
  treatmentGoals: [],
  interventionsUsed: [],
  progressMarkers: [],
  homeworkAssigned: [],
  copingStrategies: []
};

// Response templates for different emotional states and categories
const responseTemplates = {
  en: {
    loneliness: [
      "I hear how lonely you're feeling. Sometimes loneliness can feel overwhelming. Would you like to talk about what's making you feel this way?",
      "Being lonely is such a difficult feeling. I'm here to listen and support you. What has been happening lately?",
      "It takes courage to share these feelings of loneliness. Let's explore this together - what does your loneliness feel like?",
      "When you're feeling lonely, it's important to know you're not alone in this. Can you tell me more about when these feelings started?"
    ],
    sadness: [
      "I can hear the sadness in your words. It's okay to feel this way. Would you like to share more about what's troubling you?",
      "When sadness feels heavy, sometimes just having someone to talk to can help. What's weighing on your mind right now?",
      "Thank you for sharing your feelings with me. Sadness is a natural emotion, though it can be overwhelming. What do you think triggered these feelings?",
      "I'm here with you in this difficult moment. Sometimes sadness needs time and understanding. Can you tell me more about what you're experiencing?"
    ],
    anxiety: [
      "It sounds like you're dealing with a lot of anxiety. Let's take a moment to breathe together. What's causing you to feel anxious?",
      "Anxiety can feel really overwhelming. I'm here to help you work through this. What's your biggest concern right now?",
      "When anxiety takes over, it can be hard to see clearly. Let's break this down together - what's the main thing worrying you?",
      "I notice you're feeling anxious. Sometimes naming our fears can help reduce their power. Would you like to talk about what's making you feel this way?"
    ],
    confusion: [
      "It's perfectly normal to feel uncertain sometimes. Let's work through this together. What's the main thing you're unsure about?",
      "When things feel unclear, it can be helpful to take small steps. What's the first thing you'd like to figure out?",
      "I hear that you're feeling lost. Sometimes talking it through can help bring clarity. Where would you like to start?",
      "Feeling confused can be frustrating. Let's try to break this down into smaller pieces. What's the most pressing question on your mind?"
    ],
    hope: [
      "I can sense a spark of hope in your words. That's really wonderful. What's giving you this positive feeling?",
      "It's great that you're feeling hopeful. Sometimes hope can be the first step toward positive change. What's making you feel this way?",
      "That sounds really encouraging! Hope can be very powerful. Would you like to explore what's making you feel hopeful?",
      "I'm glad you're feeling hopeful. Let's build on that positive energy. What possibilities are you seeing?"
    ]
  },
  da: {
    stress: [
      "Det lyder som om du oplever en del stress i hverdagen. Lad os tale om, hvordan vi kan håndtere det sammen.",
      "Stress kan være overvældende. Lad os undersøge, hvilke strategier der kunne hjælpe dig med at håndtere det bedre.",
      "Det er helt normalt at føle sig stresset. Lad os finde nogle måder at reducere stressniveauet på."
    ],
    anxiety: [
      "Jeg kan høre, at du føler dig ængstelig. Lad os tale om, hvad der trigger denne følelse.",
      "Angst kan være meget udfordrende. Skal vi udforske nogle teknikker, der kan hjælpe dig med at føle dig mere rolig?"
    ],
    general: [
      "Fortæl mig mere om, hvordan du har det.",
      "Hvordan påvirker dette din hverdag?",
      "Hvad tror du kunne hjælpe i denne situation?"
    ]
  },
  fa: {
    loneliness: [
      "می‌فهمم که احساس تنهایی می‌کنی. گاهی تنهایی می‌تونه خیلی سخت باشه. دوست داری در مورد دلیلش صحبت کنیم؟",
      "تنهایی احساس سختیه. من اینجام که بشنوم و کمکت کنم. اخیراً چه اتفاقی افتاده؟",
      "اینکه این احساس تنهایی رو به اشتراک میذاری شجاعت میخواد. بیا با هم بررسیش کنیم - تنهاییت چه شکلیه؟",
      "وقتی احساس تنهایی می‌کنی، مهمه که بدونی تنها نیستی. میتونی بگی این احساس از کی شروع شد؟"
    ],
    sadness: [
      "غم رو توی حرفات میشنوم. اشکالی نداره که این احساس رو داری. دوست داری بیشتر در موردش حرف بزنی؟",
      "وقتی غم سنگینه، گاهی فقط صحبت کردن با یک نفر میتونه کمک کنه. الان چی ذهنت رو مشغول کرده؟",
      "ممنون که احساساتت رو با من در میون گذاشتی. غم یک احساس طبیعیه، هرچند میتونه سخت باشه. فکر میکنی چی باعث این احساس شده؟",
      "من در این لحظه سخت کنارت هستم. گاهی غم نیاز به زمان و درک داره. میتونی بیشتر از تجربه‌ات بگی؟"
    ],
    anxiety: [
      "به نظر میاد با اضطراب زیادی روبرو هستی. بیایید یه لحظه با هم نفس عمیق بکشیم. چی باعث اضطرابت شده؟",
      "اضطراب میتونه خیلی سخت باشه. من اینجام که کمکت کنم از این شرایط عبور کنی. الان بزرگترین نگرانیت چیه؟",
      "وقتی اضطراب غلبه میکنه، دیدن واضح مسائل سخت میشه. بیا با هم بررسیش کنیم - اصلی‌ترین چیزی که نگرانت کرده چیه؟",
      "من متوجه شدم که مضطربی. گاهی اسم بردن از ترس‌هامون میتونه قدرتشون رو کم کنه. دوست داری در مورد دلیلش صحبت کنیم؟"
    ],
    confusion: [
      "کاملاً طبیعیه که گاهی احساس عدم اطمینان کنی. بیایید با هم حلش کنیم. اصلی‌ترین چیزی که در موردش مطمئن نیستی چیه؟",
      "وقتی همه چیز مبهمه، برداشتن قدم‌های کوچک میتونه کمک کنه. اول دوست داری چی رو مشخص کنیم؟",
      "می‌شنوم که احساس سردرگمی داری. گاهی صحبت کردن میتونه به وضوح بیشتر کمک کنه. از کجا دوست داری شروع کنیم؟",
      "سردرگمی میتونه ناامیدکننده باشه. بیایید مسئله رو به بخش‌های کوچکتر تقسیم کنیم. مهمترین سؤالی که ذهنت رو درگیر کرده چیه؟"
    ],
    hope: [
      "جرقه‌ای از امید رو توی حرفات می‌بینم. این خیلی عالیه. چی باعث این احساس مثبت شده؟",
      "خیلی خوبه که احساس امیدواری داری. گاهی امید میتونه اولین قدم برای تغییر مثبت باشه. چی باعث این حس شده؟",
      "این خیلی امیدوارکننده‌ست! امید میتونه خیلی قدرتمند باشه. دوست داری بیشتر در مورد دلیل امیدواریت صحبت کنیم؟",
      "خوشحالم که احساس امیدواری داری. بیایید روی این انرژی مثبت بیشتر کار کنیم. چه امکاناتی رو می‌بینی؟"
    ]
  }
};

// Emotion detection patterns
const emotionalPatterns = {
  en: {
    loneliness: /\b(lonely|alone|isolated|no.*friends|no.*one|disconnected)\b/i,
    sadness: /\b(sad|down|depressed|unhappy|miserable|heartbroken)\b/i,
    anxiety: /\b(anxious|worried|nervous|stress|panic|fear|scared)\b/i,
    confusion: /\b(confused|unsure|lost|don't know|uncertain|unclear)\b/i,
    hope: /\b(hope|better|improve|positive|looking forward|optimistic)\b/i
  },
  da: {
    stress: /\b(stress|presset|overvældet)\b/i,
    anxiety: /\b(ængstelig|angst|frygt)\b/i,
    general: /\b(hvordan|hvad|hvornår)\b/i
  },
  fa: {
    loneliness: /\b(تنها|تنهایی|بی‌کس|دوست ندارم|کسی نیست|جدا افتاده)\b/i,
    sadness: /\b(غمگین|ناراحت|افسرده|غم|دلتنگ|شکسته)\b/i,
    anxiety: /\b(مضطرب|نگران|عصبی|استرس|ترس|وحشت)\b/i,
    confusion: /\b(گیج|نامطمئن|سردرگم|نمی‌دونم|مبهم|نامشخص)\b/i,
    hope: /\b(امید|بهتر|پیشرفت|مثبت|خوش‌بین|منتظر)\b/i
  }
};

// Context tracking
let conversationContext = {
  lastEmotion: null as string | null,
  lastResponse: null as string | null,
  responseCount: 0
};

// Main response generation function
export async function generateResponse(userMessage: string, voiceSettings: VoiceSettings): Promise<Response> {
  try {
    console.log('Generating response with settings:', voiceSettings);
    
    // Get appropriate templates based on language
    const templates = responseTemplates[voiceSettings.language];
    if (!templates) {
      console.error('No templates found for language:', voiceSettings.language);
      throw new Error(`Unsupported language: ${voiceSettings.language}`);
    }

    // For now, use a simple response based on language
    let response: string;
    
    if (voiceSettings.language === 'da') {
      // Danish stress-related keywords
      if (userMessage.toLowerCase().includes('stress') || 
          userMessage.toLowerCase().includes('presset') ||
          userMessage.toLowerCase().includes('overvældet')) {
        response = templates.stress[Math.floor(Math.random() * templates.stress.length)];
      } else {
        response = templates.general[Math.floor(Math.random() * templates.general.length)];
      }
    } else {
      // Call external API for other languages
      const apiResponse = await axios.post('http://localhost:3001/api/chat', {
        message: userMessage,
        voiceSettings
      });
      response = apiResponse.data.response;
    }

    return {
      text: response,
      followUp: null
    };
  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw error;
  }
}

// Voice settings with default values
let currentVoiceSettings: VoiceSettings = {
  gender: 'female',
  language: 'en',
  category: 'general'
};

// Function to update voice settings
export function setVoiceSettings(settings: VoiceSettings) {
  currentVoiceSettings = settings;
}

// Gender-specific conversation markers
const conversationalMarkers = {
  en: {
    male: {
      acknowledgments: ["I see", "I understand", "Right", "Got it", "I hear you"],
      transitions: ["Listen", "You know what", "Here's the thing", "Well", "Let me tell you"],
      empathy: ["I get that", "That must be tough", "I understand how you feel", "That's not easy"]
    },
    female: {
      acknowledgments: ["I see", "I understand", "I hear you", "Of course", "You're right"],
      transitions: ["You know", "I'm thinking", "Perhaps", "Well", "I wonder"],
      empathy: ["I can imagine", "That sounds difficult", "I understand", "It's okay to feel this way"]
    }
  },
  da: {
    male: {
      acknowledgments: ["Jeg forstår", "Det kan jeg godt se", "Ja", "Det giver mening", "Jeg hører dig"],
      transitions: ["Hør her", "Ved du hvad", "Sagen er den", "Altså", "Lad mig fortælle dig"],
      empathy: ["Det forstår jeg godt", "Det må være svært", "Jeg forstår, hvordan du har det", "Det er ikke let"]
    },
    female: {
      acknowledgments: ["Jeg forstår", "Det kan jeg godt se", "Jeg hører dig", "Selvfølgelig", "Du har ret"],
      transitions: ["Ved du", "Jeg tænker", "Måske", "Altså", "Jeg undrer mig"],
      empathy: ["Jeg kan forestille mig det", "Det lyder svært", "Jeg forstår", "Det er okay at have det sådan"]
    }
  },
  fa: {
    male: {
      acknowledgments: ["می‌بینم", "متوجهم", "درسته", "فهمیدم", "می‌شنوم"],
      transitions: ["ببین", "میدونی چیه", "موضوع اینه", "خب", "بذار بگم"],
      empathy: ["درک می‌کنم", "باید سخت باشه", "می‌فهمم چه حسی داری", "آسون نیست"]
    },
    female: {
      acknowledgments: ["می‌بینم", "متوجهم", "می‌شنوم", "البته", "درست میگی"],
      transitions: ["میدونی", "فکر می‌کنم", "شاید", "خب", "به نظرم"],
      empathy: ["می‌تونم تصور کنم", "به نظر سخت میاد", "درک می‌کنم", "طبیعیه این حس"]
    }
  }
};

// Gender-specific response styles
const responseStyles = {
  en: {
    male: {
      direct: true,
      usesMetaphors: false,
      problemSolvingFocus: true,
      emotionalExpression: "moderate"
    },
    female: {
      direct: false,
      usesMetaphors: true,
      problemSolvingFocus: false,
      emotionalExpression: "high"
    }
  },
  da: {
    male: {
      direct: true,
      usesMetaphors: false,
      problemSolvingFocus: true,
      emotionalExpression: "moderate"
    },
    female: {
      direct: false,
      usesMetaphors: true,
      problemSolvingFocus: false,
      emotionalExpression: "high"
    }
  },
  fa: {
    male: {
      direct: true,
      usesMetaphors: false,
      problemSolvingFocus: true,
      emotionalExpression: "moderate"
    },
    female: {
      direct: false,
      usesMetaphors: true,
      problemSolvingFocus: false,
      emotionalExpression: "high"
    }
  }
};
