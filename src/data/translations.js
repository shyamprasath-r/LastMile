// LASTMILE Multilingual & SMS Notification System Templates

export const TRANSLATIONS = {
  English: {
    appTitle: "LASTMILE",
    tagline: "A warning can reach everyone. But can everyone reach safety?",
    nav: {
      dashboard: "Coordinator Dashboard",
      iere: "IERE Intelligence Centre",
      requests: "Assistance Requests",
      gapMap: "Assistance Gap Map",
      simulation: "Hazard Simulation",
      resources: "Resource Management",
      optimiser: "Allocation Optimiser",
      notifications: "Notifications Centre",
      analytics: "Analytics Dashboard",
      volunteer: "Volunteer Portal",
      household: "Household Portal",
      settings: "Settings & Privacy",
      logout: "Sign Out"
    },
    status: {
      Submitted: "Submitted",
      UnderVerification: "Under Verification",
      Approved: "Approved",
      Unassigned: "Unassigned",
      Assigned: "Assigned",
      AwaitingConfirmation: "Awaiting Confirmation",
      Confirmed: "Confirmed",
      Completed: "Completed"
    },
    smsTemplates: {
      requestReceived: "LASTMILE Alert: Your evacuation assistance request ({id}) has been received. Our coordination team is evaluating regional resources.",
      requestVerified: "LASTMILE Update: Request {id} is verified and prioritized for emergency transport coordination.",
      assignmentProposed: "LASTMILE Alert: Emergency vehicle {vehicle} has been allocated for household {id}. Pickup ETA: ~{eta} mins. Reply 1 to CONFIRM or 9 to CANCEL.",
      arrangementConfirmed: "LASTMILE Confirmed: Household {id} pickup confirmed for vehicle {vehicle}. Please keep essentials ready. Driver: {driver} ({phone}).",
      requestCompleted: "LASTMILE Notice: Evacuation assistance for {id} has been marked Completed at Krishnagiri Safe Camp. Stay safe.",
      vehicleUnavailable: "LASTMILE Priority Alert: Scheduled vehicle {vehicle} is currently unavailable due to road obstruction. Fallback re-matching initiated immediately."
    },
    ui: {
      confirmSmsPrompt: "Simulate SMS Reply (Enter 1 to Confirm):",
      smsDisclaimer: "Note: SMS notification and response are fully simulated for hackathon demonstration. No real carrier SMS is sent."
    }
  },
  Tamil: {
    appTitle: "லாஸ்ட்மைல் (LASTMILE)",
    tagline: "எச்சரிக்கை அனைவரையும் சென்றடையலாம். ஆனால் அனைவரும் பாதுகாப்பை அடைய முடியுமா?",
    nav: {
      dashboard: "ஒருங்கிணைப்பாளர் பலகை",
      iere: "IERE நுண்ணறிவு மையம்",
      requests: "உதவி கோரிக்கைகள்",
      gapMap: "உதவி இடைவெளி வரைபடம்",
      simulation: "ஆபத்து உருவகப்படுத்துதல்",
      resources: "வாகன வள மேலாண்மை",
      optimiser: "வாகன ஒதுக்கீடு உகப்பாக்கி",
      notifications: "அறிவிப்புகள் மையம்",
      analytics: "பகுப்பாய்வு பலகை",
      volunteer: "தன்னார்வலர் தளம்",
      household: "குடும்ப தளம்",
      settings: "அமைப்புகள் & தனியுரிமை",
      logout: "வெளியேறு"
    },
    status: {
      Submitted: "சமர்ப்பிக்கப்பட்டது",
      UnderVerification: "சரிபார்ப்பில் உள்ளது",
      Approved: "ஒப்புதல் அளிக்கப்பட்டது",
      Unassigned: "ஒதுக்கீடு செய்யப்படாதது",
      Assigned: "ஒதுக்கப்பட்டது",
      AwaitingConfirmation: "உறுதிப்படுத்த காத்திருக்கிறது",
      Confirmed: "உறுதிப்படுத்தப்பட்டது",
      Completed: "நிறைவடைந்தது"
    },
    smsTemplates: {
      requestReceived: "LASTMILE தகவல்: உங்கள் வெளியேற்ற உதவி கோரிக்கை ({id}) பெறப்பட்டது. ஒருங்கிணைப்புக் குழு ஆய்வு செய்கிறது.",
      requestVerified: "LASTMILE தகவல்: உங்கள் கோரிக்கை {id} சரிபார்க்கப்பட்டு முன்னுரிமைப் பட்டியலில் சேர்க்கப்பட்டுள்ளது.",
      assignmentProposed: "வணக்கம்! உங்கள் போக்குவரத்து உதவி ஏற்பாடு ({vehicle}) உறுதிப்படுத்துவதற்காக காத்திருக்கிறது. உறுதிப்படுத்த 1 என பதிலளிக்கவும்.",
      arrangementConfirmed: "LASTMILE உறுதிப்படுத்தல்: குடும்பம் {id} வாகனம் {vehicle} உறுதிசெய்யப்பட்டது. ஓட்டுநர்: {driver} ({phone}). தேவையான பொருட்களை தயாராக வைத்திருக்கவும்.",
      requestCompleted: "LASTMILE தகவல்: பாதுகாப்பான முகாமிற்கு நீங்கள் சென்றடைந்தது பதிவு செய்யப்பட்டது. நலமுடன் இருங்கள்.",
      vehicleUnavailable: "LASTMILE எச்சரிக்கை: ஒதுக்கப்பட்ட வாகனம் {vehicle} வெள்ளப் பாதை தடையால் வர இயலவில்லை. உடனடியாக மாற்று வாகனம் தேடப்படுகிறது."
    },
    ui: {
      confirmSmsPrompt: "SMS பதில் உருவகப்படுத்துதல் (உறுதிப்படுத்த 1 ஐ உள்ளிடவும்):",
      smsDisclaimer: "குறிப்பு: இது ஹேக்கத்தான் செயல்விளக்கத்திற்கான மாதிரி SMS ஆகும். கட்டண SMS ஏதும் அனுப்பப்படவில்லை."
    }
  },
  Hindi: {
    appTitle: "लास्टमिल (LASTMILE)",
    tagline: "चेतावनी हर किसी तक पहुंच सकती है। लेकिन क्या हर कोई सुरक्षित स्थान तक पहुंच सकता है?",
    nav: {
      dashboard: "समन्वयक डैशबोर्ड",
      iere: "IERE इंटेलिजेंस सेंटर",
      requests: "सहायता अनुरोध",
      gapMap: "सहायता गैप मानचित्र",
      simulation: "आपदा सिमुलेशन",
      resources: "संसाधन प्रबंधन",
      optimiser: "वाहन आवंटन अनुकूलक",
      notifications: "अधिसूचना केंद्र",
      analytics: "एनालिटिक्स डैशबोर्ड",
      volunteer: "स्वयंसेवक पोर्टल",
      household: "परिवार पोर्टल",
      settings: "सेटिंग्स और गोपनीयता",
      logout: "लॉगआउट"
    },
    status: {
      Submitted: "प्रस्तुत किया गया",
      UnderVerification: "सत्यापन अधीन",
      Approved: "स्वीकृत",
      Unassigned: "आवंटित नहीं",
      Assigned: "आवंटित",
      AwaitingConfirmation: "पुष्टि की प्रतीक्षा",
      Confirmed: "पुष्टि की गई",
      Completed: "पूर्ण"
    },
    smsTemplates: {
      requestReceived: "LASTMILE सूचना: आपकी निकासी सहायता अनुरोध ({id}) प्राप्त हुआ है। आपातकालीन समन्वय दल समीक्षा कर रहा है।",
      requestVerified: "LASTMILE अपडेट: अनुरोध {id} सत्यापित हो गया है और आपातकालीन परिवहन के लिए प्राथमिकता में है।",
      assignmentProposed: "नमस्ते! आपकी आपातकालीन परिवहन व्यवस्था ({vehicle}) पुष्टि के लिए प्रतीक्षारत है। पुष्टि करने के लिए 1 लिखकर उत्तर दें।",
      arrangementConfirmed: "LASTMILE पुष्टि: परिवार {id} के लिए वाहन {vehicle} पुष्ट किया गया। चालक: {driver} ({phone})। कृपया तैयार रहें।",
      requestCompleted: "LASTMILE सूचना: परिवार {id} की सुरक्षित निकासी पूर्ण हो गई है। सुरक्षित रहें।",
      vehicleUnavailable: "LASTMILE चेतावनी: मार्ग अवरोध के कारण वाहन {vehicle} अनुपलब्ध है। तत्काल वैकल्पिक वाहन खोजा जा रहा है।"
    },
    ui: {
      confirmSmsPrompt: "सिम्युलेटेड SMS उत्तर (पुष्टि के लिए 1 दर्ज करें):",
      smsDisclaimer: "ध्यान दें: यह केवल हैकाथॉन प्रदर्शन के लिए सिम्युलेटेड SMS है।"
    }
  }
};
