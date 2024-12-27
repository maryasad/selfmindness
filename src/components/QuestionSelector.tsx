import React, { useState } from 'react';
import { CounselingCategory, Language } from '../types';

interface SubCategory {
  id: string;
  title: Record<Language, string>;
  questions: Array<Record<Language, string>>;
}

interface CategoryQuestions {
  [key: string]: SubCategory[];
}

const categoryQuestions: CategoryQuestions = {
  general: [
    {
      id: 'daily-challenges',
      title: {
        en: 'Daily Challenges',
        fa: 'چالش‌های روزمره',
        da: 'Daglige udfordringer',
        fr: 'Défis quotidiens',
        ar: 'التحديات اليومية'
      },
      questions: [
        {
          en: "How do you handle stress in your daily life?",
          fa: "چگونه با استرس روزمره خود کنار می‌آیید؟",
          da: "Hvordan håndterer du stress i din hverdag?",
          fr: "Comment gérez-vous le stress dans votre vie quotidienne?",
          ar: "كيف تتعامل مع التوتر في حياتك اليومية؟"
        },
        {
          en: "What daily habits would you like to change?",
          fa: "چه عادت‌های روزانه‌ای را می‌خواهید تغییر دهید؟",
          da: "Hvilke daglige vaner vil du gerne ændre?",
          fr: "Quelles habitudes quotidiennes souhaitez-vous changer?",
          ar: "ما هي العادات اليومية التي تود تغييرها؟"
        },
        {
          en: "How do you maintain work-life balance?",
          fa: "چگونه تعادل کار و زندگی را حفظ می‌کنید؟",
          da: "Hvordan opretholder du work-life balance?",
          fr: "Comment maintenez-vous l'équilibre travail-vie?",
          ar: "كيف تحافظ على التوازن بين العمل والحياة؟"
        }
      ]
    },
    {
      id: 'personal-growth',
      title: {
        en: 'Personal Growth',
        fa: 'رشد شخصی',
        da: 'Personlig udvikling',
        fr: 'Développement personnel',
        ar: 'النمو الشخصي'
      },
      questions: [
        {
          en: "What are your goals for personal development?",
          fa: "اهداف شما برای رشد شخصی چیست؟",
          da: "Hvad er dine mål for personlig udvikling?",
          fr: "Quels sont vos objectifs de développement personnel?",
          ar: "ما هي أهدافك للتطور الشخصي؟"
        },
        {
          en: "What new skills would you like to learn?",
          fa: "چه مهارت‌های جدیدی می‌خواهید یاد بگیرید؟",
          da: "Hvilke nye færdigheder vil du gerne lære?",
          fr: "Quelles nouvelles compétences aimeriez-vous acquérir?",
          ar: "ما هي المهارات الجديدة التي تود تعلمها؟"
        },
        {
          en: "How do you measure your personal progress?",
          fa: "چگونه پیشرفت شخصی خود را اندازه‌گیری می‌کنید؟",
          da: "Hvordan måler du din personlige fremgang?",
          fr: "Comment mesurez-vous vos progrès personnels?",
          ar: "كيف تقيس تقدمك الشخصي؟"
        }
      ]
    }
  ],
  'self-esteem': [
    {
      id: 'self-worth',
      title: {
        en: 'Self Worth',
        fa: 'ارزش شخصی',
        da: 'Selvværd',
        fr: 'Valeur personnelle',
        ar: 'قيمة الذات'
      },
      questions: [
        {
          en: "What makes you feel proud of yourself?",
          fa: "چه چیزی باعث می‌شود به خودتان افتخار کنید؟",
          da: "Hvad gør dig stolt af dig selv?",
          fr: "Qu'est-ce qui vous rend fier de vous?",
          ar: "ما الذي يجعلك فخوراً بنفسك؟"
        },
        {
          en: "How do you celebrate your achievements?",
          fa: "چگونه موفقیت‌های خود را جشن می‌گیرید؟",
          da: "Hvordan fejrer du dine præstationer?",
          fr: "Comment célébrez-vous vos réussites?",
          ar: "كيف تحتفل بإنجازاتك؟"
        },
        {
          en: "What qualities do you value most about yourself?",
          fa: "چه ویژگی‌هایی را در خود بیشتر ارزشمند می‌دانید؟",
          da: "Hvilke kvaliteter værdsætter du mest ved dig selv?",
          fr: "Quelles qualités appréciez-vous le plus chez vous?",
          ar: "ما هي الصفات التي تقدرها أكثر في نفسك؟"
        }
      ]
    },
    {
      id: 'confidence',
      title: {
        en: 'Building Confidence',
        fa: 'ساخت اعتماد به نفس',
        da: 'Opbygge selvtillid',
        fr: 'Développer la confiance',
        ar: 'بناء الثقة'
      },
      questions: [
        {
          en: "When do you feel most confident?",
          fa: "چه زمانی بیشترین اعتماد به نفس را دارید؟",
          da: "Hvornår føler du dig mest selvsikker?",
          fr: "Quand vous sentez-vous le plus confiant?",
          ar: "متى تشعر بأكبر قدر من الثقة؟"
        },
        {
          en: "What helps boost your confidence?",
          fa: "چه چیزی به افزایش اعتماد به نفس شما کمک می‌کند؟",
          da: "Hvad hjælper med at øge din selvtillid?",
          fr: "Qu'est-ce qui aide à renforcer votre confiance?",
          ar: "ما الذي يساعد في تعزيز ثقتك؟"
        },
        {
          en: "How do you handle self-doubt?",
          fa: "چگونه با تردید به خود کنار می‌آیید؟",
          da: "Hvordan håndterer du selvtvivl?",
          fr: "Comment gérez-vous le doute de soi?",
          ar: "كيف تتعامل مع الشك في النفس؟"
        }
      ]
    }
  ],
  relationships: [
    {
      id: 'communication',
      title: {
        en: 'Communication',
        fa: 'ارتباطات',
        da: 'Kommunikation',
        fr: 'Communication',
        ar: 'التواصل'
      },
      questions: [
        {
          en: "How do you express your needs in relationships?",
          fa: "چگونه نیازهای خود را در روابط بیان می‌کنید؟",
          da: "Hvordan udtrykker du dine behov i forhold?",
          fr: "Comment exprimez-vous vos besoins dans vos relations?",
          ar: "كيف تعبر عن احتياجاتك في العلاقات؟"
        },
        {
          en: "How do you handle conflicts in relationships?",
          fa: "چگونه با تعارضات در روابط برخورد می‌کنید؟",
          da: "Hvordan håndterer du konflikter i forhold?",
          fr: "Comment gérez-vous les conflits dans les relations?",
          ar: "كيف تتعامل مع النزاعات في العلاقات؟"
        },
        {
          en: "What role does active listening play in your relationships?",
          fa: "گوش دادن فعال چه نقشی در روابط شما دارد؟",
          da: "Hvilken rolle spiller aktiv lytning i dine forhold?",
          fr: "Quel rôle joue l'écoute active dans vos relations?",
          ar: "ما هو دور الإصغاء النشط في علاقاتك؟"
        }
      ]
    },
    {
      id: 'boundaries',
      title: {
        en: 'Setting Boundaries',
        fa: 'تعیین حد و مرز',
        da: 'Sætte grænser',
        fr: 'Établir des limites',
        ar: 'وضع الحدود'
      },
      questions: [
        {
          en: "How do you maintain healthy boundaries?",
          fa: "چگونه حد و مرزهای سالم را حفظ می‌کنید؟",
          da: "Hvordan opretholder du sunde grænser?",
          fr: "Comment maintenez-vous des limites saines?",
          ar: "كيف تحافظ على الحدود الصحية؟"
        },
        {
          en: "When do you find it difficult to say 'no'?",
          fa: "چه زمانی گفتن 'نه' برای شما سخت می‌شود؟",
          da: "Hvornår finder du det svært at sige 'nej'?",
          fr: "Quand trouvez-vous difficile de dire 'non'?",
          ar: "متى تجد صعوبة في قول 'لا'؟"
        },
        {
          en: "How do you communicate your boundaries to others?",
          fa: "چگونه حد و مرزهای خود را به دیگران منتقل می‌کنید؟",
          da: "Hvordan kommunikerer du dine grænser til andre?",
          fr: "Comment communiquez-vous vos limites aux autres?",
          ar: "كيف تبلغ حدودك للآخرين؟"
        }
      ]
    }
  ],
  anxiety: [
    {
      id: 'triggers',
      title: {
        en: 'Identifying Triggers',
        fa: 'شناسایی محرک‌ها',
        da: 'Identificere triggere',
        fr: 'Identifier les déclencheurs',
        ar: 'تحديد المحفزات'
      },
      questions: [
        {
          en: "What situations trigger your anxiety?",
          fa: "چه موقعیت‌هایی اضطراب شما را تحریک می‌کند؟",
          da: "Hvilke situationer udløser din angst?",
          fr: "Quelles situations déclenchent votre anxiété?",
          ar: "ما هي المواقف التي تثير قلقك؟"
        },
        {
          en: "How do you recognize early signs of anxiety?",
          fa: "چگونه علائم اولیه اضطراب را تشخیص می‌دهید؟",
          da: "Hvordan genkender du tidlige tegn på angst?",
          fr: "Comment reconnaissez-vous les premiers signes d'anxiété?",
          ar: "كيف تتعرف على العلامات المبكرة للقلق؟"
        },
        {
          en: "What patterns have you noticed in your anxiety triggers?",
          fa: "چه الگوهایی در محرک‌های اضطراب خود مشاهده کرده‌اید؟",
          da: "Hvilke mønstre har du bemærket i dine angsttriggere?",
          fr: "Quels schémas avez-vous remarqués dans vos déclencheurs d'anxiété?",
          ar: "ما هي الأنماط التي لاحظتها في محفزات القلق لديك؟"
        }
      ]
    },
    {
      id: 'coping-strategies',
      title: {
        en: 'Coping Strategies',
        fa: 'راهکارهای مقابله',
        da: 'Mestringsstrategier',
        fr: 'Stratégies d\'adaptation',
        ar: 'استراتيجيات التكيف'
      },
      questions: [
        {
          en: "What helps you calm down when anxious?",
          fa: "چه چیزی در هنگام اضطراب به آرام شدن شما کمک می‌کند؟",
          da: "Hvad hjælper dig med at falde til ro, når du er angst?",
          fr: "Qu'est-ce qui vous aide à vous calmer quand vous êtes anxieux?",
          ar: "ما الذي يساعدك على الهدوء عندما تكون قلقاً؟"
        },
        {
          en: "What coping strategies work best for you?",
          fa: "کدام راهکارهای مقابله برای شما بهتر جواب می‌دهد؟",
          da: "Hvilke mestringsstrategier virker bedst for dig?",
          fr: "Quelles stratégies d'adaptation fonctionnent le mieux pour vous?",
          ar: "ما هي استراتيجيات التكيف الأكثر فعالية بالنسبة لك؟"
        },
        {
          en: "How do you practice self-care during anxious times?",
          fa: "چگونه در زمان‌های اضطراب از خود مراقبت می‌کنید؟",
          da: "Hvordan praktiserer du selvpleje i perioder med angst?",
          fr: "Comment pratiquez-vous l'auto-soin pendant les périodes d'anxiété?",
          ar: "كيف تمارس العناية بالنفس خلال أوقات القلق؟"
        }
      ]
    }
  ],
  depression: [
    {
      id: 'mood-patterns',
      title: {
        en: 'Mood Patterns',
        fa: 'الگوهای خلقی',
        da: 'Humørmønstre',
        fr: 'Schémas d\'humeur',
        ar: 'أنماط المزاج'
      },
      questions: [
        {
          en: "Have you noticed any patterns in your mood changes?",
          fa: "آیا الگویی در تغییرات خلقی خود مشاهده کرده‌اید؟",
          da: "Har du bemærket mønstre i dine humørsvingninger?",
          fr: "Avez-vous remarqué des schémas dans vos changements d'humeur?",
          ar: "هل لاحظت أي أنماط في تغيرات مزاجك؟"
        },
        {
          en: "What time of day do you feel most energetic?",
          fa: "در چه زمانی از روز بیشترین انرژی را دارید؟",
          da: "Hvilken tid på dagen føler du dig mest energisk?",
          fr: "À quel moment de la journée vous sentez-vous le plus énergique?",
          ar: "في أي وقت من اليوم تشعر بأكبر قدر من النشاط؟"
        },
        {
          en: "How does your environment affect your mood?",
          fa: "محیط اطراف چگونه بر خلق و خوی شما تأثیر می‌گذارد؟",
          da: "Hvordan påvirker dine omgivelser dit humør?",
          fr: "Comment votre environnement affecte-t-il votre humeur?",
          ar: "كيف تؤثر بيئتك على مزاجك؟"
        }
      ]
    },
    {
      id: 'self-care',
      title: {
        en: 'Self Care',
        fa: 'مراقبت از خود',
        da: 'Egenomsorg',
        fr: 'Prendre soin de soi',
        ar: 'العناية بالنفس'
      },
      questions: [
        {
          en: "What self-care activities help you feel better?",
          fa: "چه فعالیت‌های مراقبت از خود به شما کمک می‌کند احساس بهتری داشته باشید؟",
          da: "Hvilke egenomsorg-aktiviteter hjælper dig med at få det bedre?",
          fr: "Quelles activités d'auto-soins vous aident à vous sentir mieux?",
          ar: "ما هي أنشطة العناية بالنفس التي تساعدك على الشعور بتحسن؟"
        },
        {
          en: "How do you prioritize self-care in your daily routine?",
          fa: "چگونه در برنامه روزانه خود به مراقبت از خود اولویت می‌دهید؟",
          da: "Hvordan prioriterer du selvpleje i din daglige rutine?",
          fr: "Comment priorisez-vous l'auto-soin dans votre routine quotidienne?",
          ar: "كيف تضع أولوية للعناية بالنفس في روتينك اليومي؟"
        },
        {
          en: "What self-care practices do you find most challenging to maintain?",
          fa: "چه فعالیت‌های مراقبت از خود را برای حفظ کردن چالش برانگیز می‌دانید؟",
          da: "Hvilke selvpleje-praksisser finder du mest udfordrende at opretholde?",
          fr: "Quelles pratiques d'auto-soin trouvez-vous les plus difficiles à maintenir?",
          ar: "ما هي ممارسات العناية بالنفس التي تجد صعوبة في الحفاظ عليها؟"
        }
      ]
    }
  ],
  trauma: [
    {
      id: 'healing',
      title: {
        en: 'Healing Journey',
        fa: 'مسیر التیام',
        da: 'Helbredelsesrejse',
        fr: 'Parcours de guérison',
        ar: 'رحلة الشفاء'
      },
      questions: [
        {
          en: "What has helped in your healing process?",
          fa: "چه چیزی در روند بهبودی شما کمک کرده است؟",
          da: "Hvad har hjulpet i din helbredelsesproces?",
          fr: "Qu'est-ce qui vous a aidé dans votre processus de guérison?",
          ar: "ما الذي ساعد في عملية شفائك؟"
        },
        {
          en: "How do you cope with difficult emotions related to trauma?",
          fa: "چگونه با احساسات سخت مرتبط با آسیب روبرو می‌شوید؟",
          da: "Hvordan håndterer du vanskelige følelser i forbindelse med traume?",
          fr: "Comment gérez-vous les émotions difficiles liées au traumatisme?",
          ar: "كيف تتعامل مع المشاعر الصعبة المرتبطة بالصدمة؟"
        },
        {
          en: "What self-care practices do you find helpful in managing trauma?",
          fa: "چه فعالیت‌های مراقبت از خود را برای مدیریت آسیب مفید می‌دانید؟",
          da: "Hvilke selvpleje-praksisser finder du nyttige til at håndtere traume?",
          fr: "Quelles pratiques d'auto-soin trouvez-vous utiles pour gérer le traumatisme?",
          ar: "ما هي ممارسات العناية بالنفس التي تجدها مفيدة في إدارة الصدمة؟"
        }
      ]
    },
    {
      id: 'safety',
      title: {
        en: 'Creating Safety',
        fa: 'ایجاد امنیت',
        da: 'Skabe tryghed',
        fr: 'Créer la sécurité',
        ar: 'خلق الأمان'
      },
      questions: [
        {
          en: "What helps you feel safe and grounded?",
          fa: "چه چیزی به شما کمک می‌کند احساس امنیت و ثبات کنید؟",
          da: "Hvad hjælper dig med at føle dig tryg og jordforbundet?",
          fr: "Qu'est-ce qui vous aide à vous sentir en sécurité et ancré?",
          ar: "ما الذي يساعدك على الشعور بالأمان والاستقرار؟"
        },
        {
          en: "How do you establish a sense of safety in your daily life?",
          fa: "چگونه حس امنیت را در زندگی روزمره خود ایجاد می‌کنید؟",
          da: "Hvordan etablerer du en fornemmelse af tryghed i din daglige tilværelse?",
          fr: "Comment établissez-vous un sentiment de sécurité dans votre vie quotidienne?",
          ar: "كيف تؤسس شعوراً بالأمان في حياتك اليومية؟"
        },
        {
          en: "What are some things that make you feel unsafe or uncomfortable?",
          fa: "چه چیزهایی باعث می‌شود احساس ناامنی یا ناراحتی کنید؟",
          da: "Hvad er nogle ting, der gør dig føler dig usikker eller ubehagelig?",
          fr: "Quelles sont certaines choses qui vous font vous sentir en insécurité ou mal à l'aise?",
          ar: "ما هي بعض الأشياء التي تجعلك تشعر بعدم الأمان أو عدم الراحة؟"
        }
      ]
    }
  ],
  grief: [
    {
      id: 'coping-with-loss',
      title: {
        en: 'Coping with Loss',
        fa: 'کنار آمدن با فقدان',
        da: 'Håndtering af tab',
        fr: 'Faire face à la perte',
        ar: 'التعامل مع الفقدان'
      },
      questions: [
        {
          en: "How are you handling your grief today?",
          fa: "امروز چگونه با سوگ خود کنار می‌آیید؟",
          da: "Hvordan håndterer du din sorg i dag?",
          fr: "Comment gérez-vous votre deuil aujourd'hui?",
          ar: "كيف تتعامل مع حزنك اليوم؟"
        },
        {
          en: "What are some things that trigger your grief?",
          fa: "چه چیزهایی باعث می‌شود سوگ شما تحریک شود؟",
          da: "Hvad er nogle ting, der udløser din sorg?",
          fr: "Quelles sont certaines choses qui déclenchent votre deuil?",
          ar: "ما هي بعض الأشياء التي تثير حزنك؟"
        },
        {
          en: "How do you honor the memory of your loved one?",
          fa: "چگونه به یاد عزیزانتان احترام می‌گذارید؟",
          da: "Hvordan ærer du mindet om din elskede?",
          fr: "Comment honorez-vous la mémoire de votre être cher?",
          ar: "كيف تحترم ذكرى أحبائك؟"
        }
      ]
    },
    {
      id: 'memories',
      title: {
        en: 'Honoring Memories',
        fa: 'گرامیداشت خاطرات',
        da: 'Ære minder',
        fr: 'Honorer les souvenirs',
        ar: 'تكريم الذكريات'
      },
      questions: [
        {
          en: "What special memories would you like to share?",
          fa: "چه خاطرات ویژه‌ای را دوست دارید به اشتراک بگذارید؟",
          da: "Hvilke særlige minder vil du gerne dele?",
          fr: "Quels souvenirs spéciaux aimeriez-vous partager?",
          ar: "ما هي الذكريات الخاصة التي تود مشاركتها؟"
        },
        {
          en: "How do you keep the memory of your loved one alive?",
          fa: "چگونه خاطره عزیزانتان را زنده می‌دارید؟",
          da: "Hvordan holder du mindet om din elskede i live?",
          fr: "Comment gardez-vous la mémoire de votre être cher vivante?",
          ar: "كيف تحافظ على ذكرى أحبائك حية؟"
        },
        {
          en: "What are some ways you celebrate the life of your loved one?",
          fa: "چه راه‌هایی برای گرامیداشت زندگی عزیزانتان دارید؟",
          da: "Hvad er nogle måder, du fejrer livet af din elskede på?",
          fr: "Quelles sont certaines façons dont vous célébrez la vie de votre être cher?",
          ar: "ما هي بعض الطرق التي تحتفل فيها بحياة أحبائك؟"
        }
      ]
    }
  ],
  addiction: [
    {
      id: 'recovery-journey',
      title: {
        en: 'Recovery Journey',
        fa: 'مسیر بهبودی',
        da: 'Helbredelsesrejse',
        fr: 'Parcours de rétablissement',
        ar: 'رحلة التعافي'
      },
      questions: [
        {
          en: "What motivates you in your recovery?",
          fa: "چه چیزی در بهبودی شما را انگیزه می‌دهد؟",
          da: "Hvad motiverer dig i din helbredelse?",
          fr: "Qu'est-ce qui vous motive dans votre rétablissement?",
          ar: "ما الذي يحفزك في تعافيك؟"
        },
        {
          en: "How do you cope with cravings and triggers?",
          fa: "چگونه با اشتیاق و محرک‌ها روبرو می‌شوید؟",
          da: "Hvordan håndterer du begær og udløsere?",
          fr: "Comment gérez-vous les envies et les déclencheurs?",
          ar: "كيف تتعامل مع الرغبة والمحفزات؟"
        },
        {
          en: "What self-care practices do you find helpful in your recovery?",
          fa: "چه فعالیت‌های مراقبت از خود را برای بهبودی مفید می‌دانید؟",
          da: "Hvilke selvpleje-praksisser finder du nyttige i din helbredelse?",
          fr: "Quelles pratiques d'auto-soin trouvez-vous utiles dans votre rétablissement?",
          ar: "ما هي ممارسات العناية بالنفس التي تجدها مفيدة في تعافيك؟"
        }
      ]
    },
    {
      id: 'support-system',
      title: {
        en: 'Support System',
        fa: 'سیستم حمایتی',
        da: 'Støttesystem',
        fr: 'Système de soutien',
        ar: 'نظام الدعم'
      },
      questions: [
        {
          en: "Who supports you in your recovery journey?",
          fa: "چه کسانی در مسیر بهبودی از شما حمایت می‌کنند؟",
          da: "Hvem støtter dig på din helbredelsesrejse?",
          fr: "Qui vous soutient dans votre parcours de rétablissement?",
          ar: "من يدعمك في رحلة تعافيك؟"
        },
        {
          en: "How do you communicate your needs to your support system?",
          fa: "چگونه نیازهای خود را به سیستم حمایتی خود منتقل می‌کنید؟",
          da: "Hvordan kommunikerer du dine behov til dit støttesystem?",
          fr: "Comment communiquez-vous vos besoins à votre système de soutien?",
          ar: "كيف تبلغ احتياجاتك لنظام دعمك؟"
        },
        {
          en: "What are some ways you show appreciation for your support system?",
          fa: "چه راه‌هایی برای قدردانی از سیستم حمایتی خود دارید؟",
          da: "Hvad er nogle måder, du viser taknemmelighed for dit støttesystem på?",
          fr: "Quelles sont certaines façons dont vous montrez votre appréciation pour votre système de soutien?",
          ar: "ما هي بعض الطرق التي تظهر فيها امتنانك لنظام دعمك؟"
        }
      ]
    }
  ]
};

interface QuestionSelectorProps {
  category: CounselingCategory;
  language: Language;
  onQuestionSelect: (question: string) => void;
}

export const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  category,
  language,
  onQuestionSelect
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const subCategories = categoryQuestions[category] || [];

  return (
    <div style={{
      marginTop: '15px',
      direction: language === 'fa' ? 'rtl' : 'ltr'
    }}>
      {/* Subcategories */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
        flexWrap: 'wrap'
      }}>
        {subCategories.map((subCat) => (
          <button
            key={subCat.id}
            onClick={() => setSelectedSubCategory(
              selectedSubCategory === subCat.id ? '' : subCat.id
            )}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: selectedSubCategory === subCat.id ? '#2196f3' : '#e3f2fd',
              color: selectedSubCategory === subCat.id ? 'white' : '#2196f3',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
              '&:hover': {
                background: selectedSubCategory === subCat.id ? '#1976d2' : '#bbdefb'
              }
            }}
          >
            {subCat.title[language]}
          </button>
        ))}
      </div>

      {/* Questions for selected subcategory */}
      {selectedSubCategory && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {subCategories
            .find(sc => sc.id === selectedSubCategory)
            ?.questions.map((q, index) => (
              <button
                key={index}
                onClick={() => onQuestionSelect(q[language])}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  background: 'white',
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: '#f5f5f5',
                    borderColor: '#2196f3'
                  }
                }}
              >
                {q[language]}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default QuestionSelector;
