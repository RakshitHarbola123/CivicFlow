const {Groq}=require('groq-sdk');
const groq=new Groq({apiKey:process.env.GROQ_API_KEY});
exports.analyzeComplaintImage=async(imageUrl,userDescription)=>{
    const systemPrompt=`
    You are an expert Municipal AI Triage Assistant. Analyze the provided image and user's short description.
    You must respond with a strictly valid JSON object containing exactly these four keys:
    1. "category": Must be exactly one of these: "Pothole", "Garbage Overflow", "Water Leakage", "Broken Street Light", "Road Damage", or "Other".
    2. "priority": Must be exactly one of these: "Low", "Medium", "High", or "Urgent".
    3. "analysis": A highly professional, objective technical description of the issue in English for database records.
    4. "emailBody": A formal, complete, professional official email draft in English addressed to the municipal department head reporting this issue. Include placeholders like [Location] and [Complaint ID] where appropriate. Do not include subject line inside the body.
    
    CRITICAL: The entire response must be in English. Do not include any conversational text outside the JSON block.
    `
    const response= await groq.chat.completions.create(({
        model: 'llama-3.2-11b-vision-preview',
        messages:[
            {role:'system',content:'systemPrompt'},
            {
                role:'user',
                content:[
                    {type:'text',text:`User's input description:${userDescription|| 'No description provided by user'}`},
                    {type:'image_url',image_url:{url:imageUrl}}
                ]
            }
        ],
        response_format:{type:'json_object'},
        temperature:0.2
    }));
    return JSON.parse(response.choices[0].message.content);
}