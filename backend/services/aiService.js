import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

class AIService {
  constructor() {
    this.genAI = null
    this.model = null
    this.isConfigured = null
    this.initialized = false
    this.openRouterClient = null
    this.openRouterConfigured = false
  }

  // Initialize AI services (called lazily)
  initialize() {
    if (this.initialized) return

    // Initialize Gemini AI
    if (process.env.GEMINI_API_KEY) {
      try {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        // Don't initialize model here, do it during generation with error handling
        this.isConfigured = true
        console.log('✅ Gemini AI configured for README generation')
      } catch (error) {
        console.error('❌ Error initializing Gemini AI:', error.message)
        this.genAI = null
        this.model = null
        this.isConfigured = false
      }
    } else {
      console.warn('⚠️ Gemini API key not configured. AI features will be disabled.')
      this.genAI = null
      this.model = null
      this.isConfigured = false
    }

    // Initialize OpenRouter AI
    if (process.env.OPENROUTER_API_KEY) {
      try {
        this.openRouterClient = new OpenAI({
          apiKey: process.env.OPENROUTER_API_KEY,
          baseURL: 'https://openrouter.ai/api/v1',
          defaultHeaders: {
            'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
            'X-Title': 'AutoGitPilot Repository README Generator'
          }
        })
        this.openRouterConfigured = true
        console.log('✅ OpenRouter AI configured for repository README generation')
      } catch (error) {
        console.error('❌ Error initializing OpenRouter AI:', error.message)
        this.openRouterClient = null
        this.openRouterConfigured = false
      }
    } else {
      console.warn('⚠️ OpenRouter API key not configured. Using Gemini as primary provider.')
      this.openRouterClient = null
      this.openRouterConfigured = false
    }

    this.initialized = true
  }

  // Check if AI service is configured
  isAvailable() {
    this.initialize()
    return this.isConfigured || this.openRouterConfigured
  }

  // Check if OpenRouter is available
  isOpenRouterAvailable() {
    this.initialize()
    return this.openRouterConfigured
  }

  // Generate README content using Gemini AI
  async generateReadmeContent(userProfile, template = 'professional', customSections = {}) {
    this.initialize()
    if (!this.isConfigured) {
      throw new Error('Gemini AI is not configured. Please set GEMINI_API_KEY.')
    }

    const prompt = this.buildReadmePrompt(userProfile, template, customSections)

    // Try different model names in order of preference
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-pro']

    for (const modelName of modelNames) {
      try {
        console.log(`🤖 Trying to generate README with model: ${modelName}`)
        const model = this.genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(prompt)
        const response = await result.response
        const readmeContent = response.text()

        console.log(`✅ Successfully generated README with model: ${modelName}`)

        // Clean up any HTML tags that might have slipped through
        const cleanContent = this.cleanupReadmeContent(readmeContent)

        return {
          success: true,
          content: cleanContent,
          template: template,
          generatedAt: new Date(),
          wordCount: cleanContent.split(' ').length,
          modelUsed: modelName
        }
      } catch (error) {
        console.warn(`⚠️ Model ${modelName} failed:`, error.message)

        // If this is the last model, throw the error
        if (modelName === modelNames[modelNames.length - 1]) {
          console.error('❌ All Gemini models failed')
          throw new Error(`Failed to generate README with any available model. Last error: ${error.message}`)
        }
        // Otherwise, continue to the next model
        continue
      }
    }
  }

  // Clean up README content to ensure proper Markdown
  cleanupReadmeContent(content) {
    // Remove common HTML tags that might slip through
    let cleaned = content
      .replace(/<\/?div[^>]*>/gi, '')
      .replace(/<\/?center[^>]*>/gi, '')
      .replace(/<\/?p[^>]*>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?span[^>]*>/gi, '')
      .replace(/<\/?strong>/gi, '**')
      .replace(/<\/?em>/gi, '*')
      .replace(/<\/?h([1-6])[^>]*>/gi, (match, level) => '#'.repeat(parseInt(level)) + ' ')
      .replace(/align\s*=\s*["']center["']/gi, '')
      .replace(/style\s*=\s*["'][^"']*["']/gi, '')

    // Clean up extra whitespace
    cleaned = cleaned
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')

    return cleaned
  }

  // Build comprehensive prompt for README generation
  buildReadmePrompt(userProfile, template, customSections) {
    const {
      firstName,
      lastName,
      email,
      githubUsername,
      skills = [],
      experience = [],
      projects = [],
      socialLinks = {},
      bio = '',
      location = '',
      currentRole = '',
      company = ''
    } = userProfile

    const fullName = `${firstName} ${lastName}`.trim()
    
    let prompt = `Create a modern, visually stunning GitHub profile README.md that rivals the best developer profiles on GitHub. Generate for ${fullName} (@${githubUsername}).

TEMPLATE STYLE: ${template}

PERSONAL INFORMATION:
- Full Name: ${fullName}
- GitHub Username: ${githubUsername}
- Professional Title: ${currentRole || 'Software Developer'}
- Company: ${company || 'Independent Developer'}
- Location: ${location || 'Earth 🌍'}
- Email: ${email}
- Bio/Description: ${bio || 'Passionate developer who loves creating innovative solutions'}

TECHNICAL PROFILE:
- Core Skills: ${skills.length > 0 ? skills.join(', ') : 'JavaScript, Python, React, Node.js, TypeScript, MongoDB'}
- Experience: ${experience.length > 0 ? experience.map(exp => `${exp.role} at ${exp.company} (${exp.duration})`).join(', ') : 'Full-stack development, API design, Database management'}
- Notable Projects: ${projects.length > 0 ? projects.map(proj => `${proj.name} - ${proj.description}`).join(', ') : 'Web applications, Mobile apps, Open source contributions'}

SOCIAL PRESENCE:
- LinkedIn: ${socialLinks.linkedin || ''}
- Twitter: ${socialLinks.twitter || ''}
- Portfolio Website: ${socialLinks.website || ''}
- Other Social: ${socialLinks.instagram || socialLinks.youtube || ''}

TEMPLATE REQUIREMENTS:
`

    // Add template-specific requirements
    switch (template) {
      case 'modern-visual':
        prompt += `
EXAMPLE STRUCTURE (use this as a guide, adapt content to user's profile):

# Hi 👋, I'm [Name]
[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=36BCF7&width=435&lines=Software+Developer;Full+Stack+Engineer;Always+learning+new+things)](https://git.io/typing-svg)

## 🚀 About Me
- 🔭 I'm currently working on **[current projects]**
- 🌱 I'm currently learning **[technologies]**
- 👯 I'm looking to collaborate on **[interests]**
- 💬 Ask me about **[expertise areas]**
- 📫 How to reach me: **[email]**
- ⚡ Fun fact: **[fun fact]**

## 🛠️ Languages and Tools
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## 📊 GitHub Stats
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=tokyonight&hide_border=true&count_private=true)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=tokyonight&hide_border=true)

![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=tokyonight&hide_border=true)

## 🌐 Connect with me
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](linkedin_url)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](twitter_url)

![Profile Views](https://komarev.com/ghpvc/?username=${githubUsername}&color=blueviolet&style=flat-square&label=Profile+Views)

REQUIREMENTS:
- Use ONLY this Markdown structure
- NO HTML tags at all
- Replace [placeholders] with actual user data
- Add appropriate technology badges for user's skills
- Include real social media links if provided
- Keep the same visual structure and formatting`
        break

      case 'professional':
        prompt += `
EXAMPLE STRUCTURE (use this as a guide, adapt content to user's profile):

# ${fullName}
**${currentRole || 'Software Developer'}** ${company ? `at ${company}` : ''}

## Professional Summary
${bio || 'Experienced software developer with a passion for creating efficient, scalable solutions. Proven track record in full-stack development and team collaboration.'}

## 🛠️ Technical Skills
**Languages:** ${skills.length > 0 ? skills.slice(0, 6).join(' • ') : 'JavaScript • Python • TypeScript • Java • C# • SQL'}

**Frameworks & Libraries:** React • Node.js • Express • Django • .NET • Spring Boot

**Tools & Technologies:** Git • Docker • AWS • MongoDB • PostgreSQL • Redis

## 💼 Professional Experience
${experience.length > 0 ? experience.map(exp => `**${exp.role}** - ${exp.company} (${exp.duration})\n- ${exp.description || 'Key responsibilities and achievements'}`).join('\n\n') : `**Senior Software Developer** - Tech Company (2022-Present)
- Led development of scalable web applications serving 10k+ users
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored junior developers and conducted code reviews`}

## 📊 GitHub Statistics
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=default&hide_border=true)

## 📫 Contact Information
- **Email:** ${email}
- **LinkedIn:** ${socialLinks.linkedin || 'linkedin.com/in/yourprofile'}
- **Portfolio:** ${socialLinks.website || 'yourportfolio.com'}

REQUIREMENTS:
- Use ONLY this Markdown structure
- NO HTML tags at all
- Replace [placeholders] with actual user data
- Maintain professional, corporate tone
- Focus on achievements and experience
- Keep design clean and readable`
        break

      case 'creative':
        prompt += `
EXAMPLE STRUCTURE (use this as a guide, adapt content to user's profile):

<div align="center">

# 🌟 Hey there! I'm ${fullName} 🌟
### 🚀 ${currentRole || 'Creative Developer'} | 💡 Problem Solver | 🎨 Digital Artist

![Coding GIF](https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif)

</div>

## 🎭 About Me
🔥 ${bio || 'Passionate creator who loves turning ideas into reality through code! Always exploring new technologies and pushing creative boundaries.'}

🌍 **Location:** ${location || 'Planet Earth 🌎'}
💼 **Currently:** ${currentRole || 'Building awesome stuff'} ${company ? `@ ${company}` : ''}
🎯 **Mission:** Creating digital experiences that make people smile!

## 🛠️ My Creative Toolkit
<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

</div>

## 🎨 What I Love Creating
${projects.length > 0 ? projects.map(proj => `🚀 **${proj.name}** - ${proj.description}`).join('\n') : `🚀 **Interactive Web Apps** - Beautiful, responsive user experiences
🎮 **Fun Side Projects** - Creative experiments and learning adventures
🌈 **Open Source Magic** - Contributing to the community`}

## 📊 My GitHub Adventure
<div align="center">

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=radical&hide_border=true)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=radical&hide_border=true)

</div>

## 🌈 Let's Connect!
<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](${socialLinks.linkedin || '#'})
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](${socialLinks.twitter || '#'})
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](${socialLinks.website || '#'})

📧 **Email:** ${email}

![Profile Views](https://komarev.com/ghpvc/?username=${githubUsername}&color=brightgreen&style=flat-square&label=Profile+Views)

</div>

---
<div align="center">
💫 "Code is poetry, and I'm here to write beautiful verses!" 💫
</div>

REQUIREMENTS:
- Use ONLY this Markdown structure with HTML div tags for alignment
- Include colorful badges and emojis throughout
- Maintain fun, creative, and engaging tone
- Use center alignment for visual impact
- Include animated elements and creative formatting`
        break

      case 'minimalist':
        prompt += `
EXAMPLE STRUCTURE (use this as a guide, adapt content to user's profile):

# ${fullName}

${currentRole || 'Software Developer'} ${company ? `at ${company}` : ''}

## About
${bio || 'Software developer focused on writing clean, efficient code.'}

## Skills
${skills.length > 0 ? skills.join(' • ') : 'JavaScript • Python • React • Node.js'}

## Experience
${experience.length > 0 ? experience.map(exp => `**${exp.role}** at ${exp.company} (${exp.duration})`).join('\n') : `**Software Developer** at Tech Company (2022-Present)`}

## Projects
${projects.length > 0 ? projects.map(proj => `**${proj.name}** - ${proj.description}`).join('\n') : `**Web Application** - Full-stack application built with modern technologies`}

## Contact
Email: ${email}
${socialLinks.linkedin ? `LinkedIn: ${socialLinks.linkedin}` : ''}
${socialLinks.website ? `Website: ${socialLinks.website}` : ''}

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=default&hide_border=true&count_private=true)

REQUIREMENTS:
- Use ONLY this Markdown structure
- NO HTML tags at all
- Keep design minimal and clean
- Essential information only
- No excessive graphics or emojis
- Simple, readable formatting
- Focus on content clarity`
        break

      case 'developer-focused':
        prompt += `
EXAMPLE STRUCTURE (use this as a guide, adapt content to user's profile):

# ${fullName} - Full Stack Developer

\`\`\`javascript
const developer = {
  name: "${fullName}",
  role: "${currentRole || 'Software Engineer'}",
  company: "${company || 'Tech Innovator'}",
  location: "${location || 'Global'}",
  languages: [${skills.length > 0 ? skills.slice(0, 5).map(s => `"${s}"`).join(', ') : '"JavaScript", "Python", "TypeScript", "Java", "Go"'}],
  currentFocus: "Building scalable applications",
  openToWork: true
};
\`\`\`

## 🔧 Technology Stack

### Languages
\`\`\`
${skills.length > 0 ? skills.slice(0, 8).join('  •  ') : 'JavaScript  •  Python  •  TypeScript  •  Java  •  C#  •  Go  •  Rust  •  SQL'}
\`\`\`

### Frameworks & Libraries
- **Frontend:** React, Vue.js, Angular, Next.js, Svelte
- **Backend:** Node.js, Express, Django, FastAPI, Spring Boot
- **Database:** PostgreSQL, MongoDB, Redis, MySQL
- **Cloud:** AWS, Google Cloud, Azure, Docker, Kubernetes

### Development Environment
\`\`\`bash
# My daily tools
OS: ${location?.includes('Mac') ? 'macOS' : location?.includes('Windows') ? 'Windows 11' : 'Linux (Ubuntu)'}
Editor: VS Code / Neovim
Terminal: Zsh with Oh My Zsh
Version Control: Git + GitHub
Package Managers: npm, yarn, pip, cargo
\`\`\`

## 💻 Code Examples

### Recent Algorithm Solution
\`\`\`javascript
// Binary search implementation
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    arr[mid] < target ? left = mid + 1 : right = mid - 1;
  }
  return -1;
}
\`\`\`

## 📊 Development Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=dark&hide_border=true&include_all_commits=true&count_private=true)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=dark&hide_border=true&langs_count=8)

![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=dark&hide_border=true)

## 🚀 Current Projects
${projects.length > 0 ? projects.map(proj => `### ${proj.name}\n${proj.description}\n**Tech Stack:** ${proj.technologies || 'Modern web technologies'}`).join('\n\n') : `### Microservices Architecture
Building scalable backend services with Node.js and Docker
**Tech Stack:** Node.js, Express, PostgreSQL, Redis, Docker

### React Dashboard
Modern admin dashboard with real-time data visualization
**Tech Stack:** React, TypeScript, Chart.js, Material-UI`}

## 📫 Connect & Collaborate
- 💼 **LinkedIn:** ${socialLinks.linkedin || 'linkedin.com/in/yourprofile'}
- 🌐 **Portfolio:** ${socialLinks.website || 'yourportfolio.dev'}
- 📧 **Email:** ${email}
- 💬 **Open to:** Collaboration, mentoring, technical discussions

\`\`\`
git clone https://github.com/${githubUsername}
cd ${githubUsername}
npm install
npm start
// Let's build something amazing together! 🚀
\`\`\`

REQUIREMENTS:
- Use ONLY this Markdown structure
- Include code blocks and technical examples
- Focus on development skills and workflow
- Show technical depth and expertise
- Use developer-friendly formatting
- Include actual code snippets`
        break

      default:
        prompt += `
- Balanced professional approach
- Include relevant badges
- GitHub statistics
- Clear structure and sections`
    }

    // Add custom sections if provided
    if (Object.keys(customSections).length > 0) {
      prompt += `\n\nCUSTOM SECTIONS TO INCLUDE:`
      Object.entries(customSections).forEach(([section, content]) => {
        if (content && content.enabled) {
          prompt += `\n- ${section}: ${content.content || 'Include this section'}`
        }
      })
    }

    prompt += `

CRITICAL FORMATTING REQUIREMENTS:
1. **MARKDOWN ONLY** - Do NOT use HTML tags. Use pure Markdown syntax only.
2. **NO HTML ELEMENTS** - No <div>, <p>, <center>, <align>, <br>, or any HTML tags.
3. **Use Markdown alignment** - Use standard Markdown formatting for all content.

CONTENT STRUCTURE:
1. **Header Section:**
   - Use # for main heading with name
   - Add typing animation with proper Markdown link syntax
   - Include location and current role as plain text

2. **Technology Badges (Markdown format only):**
   - JavaScript: ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
   - React: ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
   - Node.js: ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
   - Python: ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
   - TypeScript: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

3. **GitHub Statistics (Markdown format only):**
   - ![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=tokyonight&hide_border=true&count_private=true)
   - ![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=tokyonight&hide_border=true)
   - ![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=tokyonight&hide_border=true)

4. **Additional Elements:**
   - Profile views: ![Profile Views](https://komarev.com/ghpvc/?username=${githubUsername}&color=blueviolet&style=flat-square&label=Profile+Views)
   - Typing animation: [![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=36BCF7&width=435&lines=Software+Developer;Full+Stack+Engineer;Always+learning+new+things)](https://git.io/typing-svg)

5. **Social Media Links (Markdown format only):**
   - [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](linkedin_url)
   - [![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](twitter_url)

6. **Section Headers:**
   - Use ## for section headers
   - Use ### for subsections
   - Include appropriate emojis: 👋 🚀 💻 📫 ⚡

7. **Lists and Content:**
   - Use - for bullet points
   - Use proper Markdown syntax for all formatting
   - No HTML tables - use Markdown tables if needed

STRICT RULES:
- ❌ NO HTML tags whatsoever
- ❌ NO <center>, <div>, <p>, <br> tags
- ❌ NO inline styles or HTML attributes
- ✅ ONLY pure Markdown syntax
- ✅ Use standard Markdown formatting
- ✅ Ensure GitHub renders it properly

OUTPUT: Return ONLY pure Markdown content. No HTML. No explanations. Just clean, beautiful Markdown that GitHub will render perfectly.`

    return prompt
  }

  // Generate commit message using AI
  async generateCommitMessage(context = {}) {
    this.initialize()
    if (!this.isConfigured) {
      // Fallback to simple messages if AI not configured
      const messages = [
        'feat: update project files',
        'docs: update documentation',
        'fix: resolve minor issues',
        'style: improve code formatting',
        'refactor: optimize code structure'
      ]
      return messages[Math.floor(Math.random() * messages.length)]
    }

    try {
      const prompt = `Generate a concise, professional git commit message for the following context:

Context: ${JSON.stringify(context)}

Requirements:
- Follow conventional commit format (type: description)
- Keep it under 50 characters
- Be specific and descriptive
- Use present tense

Return only the commit message, nothing else.`

      // Try different models for commit message generation
      const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-pro']

      for (const modelName of modelNames) {
        try {
          const model = this.genAI.getGenerativeModel({ model: modelName })
          const result = await model.generateContent(prompt)
          const response = await result.response
          return response.text().trim()
        } catch (modelError) {
          if (modelName === modelNames[modelNames.length - 1]) {
            throw modelError
          }
          continue
        }
      }
    } catch (error) {
      console.error('Error generating commit message:', error)
      return 'feat: update project files'
    }
  }

  // Validate and enhance user profile data
  validateProfileData(profileData) {
    const errors = []
    const warnings = []

    // Required fields - but be flexible for demo/sample data
    if (!profileData.firstName && !profileData.bio) {
      errors.push('Either first name or bio is required for README generation')
    }
    if (!profileData.githubUsername) {
      warnings.push('GitHub username is recommended for better README features')
    }
    if (!profileData.email) {
      warnings.push('Email is recommended for contact information')
    }

    // Recommendations
    if (!profileData.bio || profileData.bio.length < 10) {
      warnings.push('Consider adding a longer bio for better README content')
    }
    if (!profileData.skills || profileData.skills.length === 0) {
      warnings.push('Add skills to showcase your expertise')
    }
    if (!profileData.projects || profileData.projects.length === 0) {
      warnings.push('Add projects to highlight your work')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completeness: this.calculateProfileCompleteness(profileData)
    }
  }

  // Calculate profile completeness percentage
  calculateProfileCompleteness(profileData) {
    const fields = [
      'firstName', 'lastName', 'email', 'githubUsername', 'bio',
      'currentRole', 'company', 'location', 'skills', 'experience',
      'projects', 'socialLinks'
    ]

    let completedFields = 0
    fields.forEach(field => {
      const value = profileData[field]
      if (value && (
        (typeof value === 'string' && value.trim().length > 0) ||
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'object' && Object.keys(value).length > 0)
      )) {
        completedFields++
      }
    })

    return Math.round((completedFields / fields.length) * 100)
  }

  // Get available README templates
  getAvailableTemplates() {
    return [
      {
        id: 'modern-visual',
        name: 'Modern Visual',
        description: 'Stunning visual profile with animations, badges, and modern design elements',
        preview: 'Eye-catching design with typing animations, activity graphs, and professional illustrations',
        features: ['Typing animations', 'Activity graphs', 'Modern badges', 'Visual elements', 'Social media integration']
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Clean, business-focused layout perfect for job applications',
        preview: 'Emphasizes experience, skills, and achievements',
        features: ['Technology badges', 'GitHub stats', 'Professional tone', 'Contact section']
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Visually appealing design with animations and graphics',
        preview: 'Fun, engaging layout with emojis and visual elements',
        features: ['Animated GIFs', 'Creative formatting', 'Colorful badges', 'Visual elements']
      },
      {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Clean, simple design focusing on essential information',
        preview: 'Simple, elegant layout without excessive graphics',
        features: ['Clean design', 'Essential info only', 'Simple badges', 'Minimal emojis']
      },
      {
        id: 'developer-focused',
        name: 'Developer-Focused',
        description: 'Technical layout highlighting coding skills and projects',
        preview: 'Detailed technical information and development workflow',
        features: ['Code examples', 'Technical stack', 'Development tools', 'Programming stats']
      }
    ]
  }

  // Repository README Generation Methods

  // Get available repository README templates
  getAvailableRepositoryTemplates() {
    return [
      {
        id: 'web-application',
        name: 'Web Application',
        description: 'Perfect for web apps, websites, and frontend projects',
        preview: 'Includes setup instructions, features, tech stack, and deployment info',
        features: ['Live demo links', 'Installation guide', 'Tech stack badges', 'Screenshots', 'API documentation']
      },
      {
        id: 'library-package',
        name: 'Library/Package',
        description: 'Ideal for npm packages, Python libraries, and reusable code',
        preview: 'Focuses on installation, usage examples, and API reference',
        features: ['Installation commands', 'Usage examples', 'API reference', 'Contributing guidelines', 'Version badges']
      },
      {
        id: 'cli-tool',
        name: 'CLI Tool',
        description: 'Great for command-line applications and utilities',
        preview: 'Emphasizes installation, commands, and usage examples',
        features: ['Installation methods', 'Command examples', 'Options reference', 'Usage scenarios']
      },
      {
        id: 'api-service',
        name: 'API/Backend Service',
        description: 'Perfect for REST APIs, GraphQL services, and backend projects',
        preview: 'Includes endpoint documentation, authentication, and deployment',
        features: ['Endpoint documentation', 'Authentication guide', 'Request/response examples', 'Deployment instructions']
      },
      {
        id: 'mobile-app',
        name: 'Mobile Application',
        description: 'Designed for mobile apps (React Native, Flutter, native)',
        preview: 'Showcases app features, screenshots, and store links',
        features: ['App screenshots', 'Feature highlights', 'Download links', 'Platform support']
      },
      {
        id: 'data-science',
        name: 'Data Science Project',
        description: 'Tailored for ML models, data analysis, and research projects',
        preview: 'Includes dataset info, methodology, results, and reproducibility',
        features: ['Dataset description', 'Methodology', 'Results visualization', 'Reproducibility guide']
      },
      {
        id: 'game-entertainment',
        name: 'Game/Entertainment',
        description: 'Perfect for games, interactive media, and entertainment projects',
        preview: 'Highlights gameplay, controls, and visual elements',
        features: ['Gameplay description', 'Controls guide', 'Screenshots/GIFs', 'System requirements']
      },
      {
        id: 'educational',
        name: 'Educational/Tutorial',
        description: 'Great for learning resources, tutorials, and educational content',
        preview: 'Structured for learning objectives, prerequisites, and progression',
        features: ['Learning objectives', 'Prerequisites', 'Step-by-step guide', 'Additional resources']
      }
    ]
  }

  // Analyze repository structure and content
  async analyzeRepository(githubToken, owner, repo) {
    this.initialize()
    if (!this.isConfigured) {
      throw new Error('Gemini AI is not configured. Please set GEMINI_API_KEY.')
    }

    try {
      // Import githubService here to avoid circular dependency
      const githubService = (await import('./githubService.js')).default

      // Get repository information
      const repoInfo = await githubService.getRepositoryInfo(githubToken, owner, repo)
      if (!repoInfo.success) {
        throw new Error(`Failed to fetch repository info: ${repoInfo.message}`)
      }

      // Get repository file structure
      const fileStructure = await githubService.getRepositoryFileStructure(githubToken, owner, repo)
      if (!fileStructure.success) {
        throw new Error(`Failed to fetch repository structure: ${fileStructure.message}`)
      }

      // Get key files content for analysis
      const keyFiles = await githubService.getKeyRepositoryFiles(githubToken, owner, repo)

      // Get source code files for deep analysis
      const sourceCodeFiles = await githubService.getSourceCodeFiles(githubToken, owner, repo, fileStructure.data)

      // Get repository languages
      const languagesResult = await githubService.getRepositoryLanguages(githubToken, owner, repo)
      if (languagesResult.success) {
        repoInfo.data.languages = languagesResult.data
      }

      // Analyze API endpoints
      const apiEndpoints = githubService.analyzeAPIEndpoints(sourceCodeFiles)

      // Analyze environment variables
      const environmentVariables = githubService.analyzeEnvironmentVariables(keyFiles, sourceCodeFiles)

      // Analyze with AI
      const analysisPrompt = this.buildRepositoryAnalysisPrompt(
        repoInfo.data,
        fileStructure.data,
        keyFiles,
        sourceCodeFiles,
        apiEndpoints,
        environmentVariables
      )

      const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-pro']

      for (const modelName of modelNames) {
        try {
          console.log(`🤖 Analyzing repository with model: ${modelName}`)
          const model = this.genAI.getGenerativeModel({ model: modelName })
          const result = await model.generateContent(analysisPrompt)
          const response = await result.response
          const analysisText = response.text()

          // Parse the AI response to extract structured data
          const analysisData = this.parseRepositoryAnalysis(analysisText, repoInfo.data, fileStructure.data)

          console.log(`✅ Repository analysis completed with model: ${modelName}`)

          return {
            success: true,
            repositoryData: repoInfo.data,
            analysisData,
            modelUsed: modelName
          }
        } catch (error) {
          console.warn(`⚠️ Model ${modelName} failed:`, error.message)
          if (modelName === modelNames[modelNames.length - 1]) {
            throw error
          }
        }
      }
    } catch (error) {
      console.error('Repository analysis failed:', error)
      throw new Error(`Repository analysis failed: ${error.message}`)
    }
  }

  // Generate repository README content using OpenRouter AI
  async generateRepositoryReadmeWithOpenRouter(repositoryData, analysisData, template = 'web-application', customSections = {}) {
    if (!this.openRouterConfigured) {
      throw new Error('OpenRouter AI is not configured.')
    }

    const prompt = this.buildRepositoryReadmePrompt(repositoryData, analysisData, template, customSections)

    // Use high-quality models for repository README generation
    const models = [
      'anthropic/claude-3-sonnet',
      'openai/gpt-4-turbo',
      'openai/gpt-4'
    ]

    let lastError = null

    for (const modelName of models) {
      try {
        console.log(`🤖 Generating repository README with OpenRouter model: ${modelName}`)

        const completion = await this.openRouterClient.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: 'system',
              content: 'You are an expert technical writer specializing in creating comprehensive, professional README files for software repositories. Generate high-quality, detailed README content that follows best practices and provides real value to developers.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 8192,
          top_p: 0.95
        })

        const readmeContent = completion.choices[0]?.message?.content

        if (!readmeContent || readmeContent.trim().length < 100) {
          throw new Error('Generated content is too short or empty')
        }

        console.log(`✅ Repository README generated successfully with OpenRouter model: ${modelName}`)
        console.log(`📊 Generated ${readmeContent.length} characters`)

        // Clean up and enhance the content
        const cleanContent = this.cleanupAndEnhanceReadmeContent(readmeContent, repositoryData, analysisData)

        return {
          success: true,
          content: cleanContent,
          template: template,
          generatedAt: new Date(),
          wordCount: cleanContent.split(' ').length,
          characterCount: cleanContent.length,
          modelUsed: `OpenRouter:${modelName}`,
          provider: 'openrouter',
          quality: this.assessReadmeQuality(cleanContent)
        }
      } catch (error) {
        lastError = error
        console.warn(`⚠️ OpenRouter model ${modelName} failed:`, error.message)

        // If it's the last model, don't continue
        if (modelName === models[models.length - 1]) {
          break
        }

        // Wait a bit before trying the next model
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // If all OpenRouter models failed, throw the last error
    throw new Error(`All OpenRouter models failed to generate repository README. Last error: ${lastError?.message || 'Unknown error'}`)
  }

  // Generate repository README content using AI (with OpenRouter primary, Gemini fallback)
  async generateRepositoryReadmeContent(repositoryData, analysisData, template = 'web-application', customSections = {}) {
    this.initialize()

    // Try OpenRouter first if available
    if (this.openRouterConfigured) {
      try {
        console.log('🚀 Attempting repository README generation with OpenRouter (primary provider)')
        const result = await this.generateRepositoryReadmeWithOpenRouter(repositoryData, analysisData, template, customSections)
        console.log('✅ Successfully generated repository README with OpenRouter')
        return result
      } catch (error) {
        console.warn('⚠️ OpenRouter failed, falling back to Gemini:', error.message)
      }
    }

    // Fallback to Gemini
    if (!this.isConfigured) {
      throw new Error('No AI providers are configured. Please set OPENROUTER_API_KEY or GEMINI_API_KEY.')
    }

    console.log('🔄 Using Gemini as fallback provider for repository README generation')

    const prompt = this.buildRepositoryReadmePrompt(repositoryData, analysisData, template, customSections)

    // Use the best models first for highest quality README generation
    const modelNames = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro', 'gemini-pro']

    let lastError = null

    for (const modelName of modelNames) {
      try {
        console.log(`🤖 Generating repository README with model: ${modelName}`)

        // Configure model with optimal settings for README generation
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7, // Balanced creativity and consistency
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192, // Allow for comprehensive READMEs
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        })

        const result = await model.generateContent(prompt)
        const response = await result.response
        const readmeContent = response.text()

        if (!readmeContent || readmeContent.trim().length < 100) {
          throw new Error('Generated content is too short or empty')
        }

        console.log(`✅ Repository README generated successfully with model: ${modelName}`)
        console.log(`📊 Generated ${readmeContent.length} characters`)

        // Clean up and enhance the content
        const cleanContent = this.cleanupAndEnhanceReadmeContent(readmeContent, repositoryData, analysisData)

        return {
          success: true,
          content: cleanContent,
          template: template,
          generatedAt: new Date(),
          wordCount: cleanContent.split(' ').length,
          characterCount: cleanContent.length,
          modelUsed: `Gemini:${modelName}`,
          provider: 'gemini',
          quality: this.assessReadmeQuality(cleanContent)
        }
      } catch (error) {
        lastError = error
        console.warn(`⚠️ Model ${modelName} failed:`, error.message)

        // If it's the last model, don't continue
        if (modelName === modelNames[modelNames.length - 1]) {
          break
        }

        // Wait a bit before trying the next model
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // If all models failed, throw the last error
    throw new Error(`All AI models failed to generate repository README. Last error: ${lastError?.message || 'Unknown error'}`)
  }

  // Build repository analysis prompt
  buildRepositoryAnalysisPrompt(repoInfo, fileStructure, keyFiles, sourceCodeFiles = {}, apiEndpoints = [], environmentVariables = []) {
    const { name, description, language, languages, topics, license, homepage, size, stargazersCount, forksCount } = repoInfo

    let prompt = `You are an expert software architect analyzing a GitHub repository. Provide a comprehensive, accurate technical analysis that will be used to generate an excellent README.

REPOSITORY INFORMATION:
📦 Name: ${name}
📝 Description: ${description || 'No description provided'}
💻 Primary Language: ${language || 'Not specified'}
🌐 Languages: ${languages ? languages.join(', ') : 'Not available'}
🏷️ Topics: ${topics ? topics.join(', ') : 'None'}
📄 License: ${license || 'Not specified'}
🌐 Homepage: ${homepage || 'None'}
📊 Size: ${size} KB
⭐ Stars: ${stargazersCount}
🍴 Forks: ${forksCount}

FILE STRUCTURE:
${JSON.stringify(fileStructure, null, 2)}

KEY FILES CONTENT:
${keyFiles ? JSON.stringify(keyFiles, null, 2) : 'No key files analyzed'}

SOURCE CODE ANALYSIS:
${Object.keys(sourceCodeFiles).length > 0 ? JSON.stringify(sourceCodeFiles, null, 2) : 'No source code files analyzed'}

API ENDPOINTS DETECTED:
${apiEndpoints.length > 0 ? JSON.stringify(apiEndpoints, null, 2) : 'No API endpoints detected'}

ENVIRONMENT VARIABLES:
${environmentVariables.length > 0 ? environmentVariables.join(', ') : 'No environment variables detected'}

ANALYSIS REQUIREMENTS:
Analyze this repository thoroughly and provide detailed, accurate information in JSON format. Focus on REAL project details, not generic placeholders. This analysis will be used to create a professional, project-specific README.

DEEP ANALYSIS INSTRUCTIONS:
1. **Project Understanding**: Examine the actual code to understand what this project REALLY does
2. **Feature Detection**: Identify actual implemented features from the source code
3. **Architecture Analysis**: Understand the real code structure and patterns used
4. **Technology Stack**: Identify all technologies, frameworks, and tools actually used
5. **API Documentation**: Extract real API endpoints and their purposes
6. **Setup Requirements**: Determine actual installation and setup steps from package files
7. **Usage Examples**: Identify how the project is actually used based on code patterns
8. **Configuration**: Find real configuration requirements and environment variables

Required JSON Response Format:
{
  "projectType": "web-application|library-package|cli-tool|api-service|mobile-app|data-science|game-entertainment|educational",
  "realProjectDescription": "Accurate description based on actual code analysis, not the GitHub description",
  "technologies": ["specific technologies actually used - be comprehensive and accurate"],
  "frameworks": ["frameworks and libraries actually used in the code"],
  "buildTools": ["actual build tools detected from config files"],
  "packageManagers": ["package managers actually used"],
  "databases": ["databases actually used - detected from code/config"],
  "deploymentPlatforms": ["deployment platforms detected from config files"],
  "mainFiles": ["actual main entry point files found"],
  "configFiles": ["actual configuration files found"],
  "hasTests": true/false,
  "testingFrameworks": ["testing frameworks actually used"],
  "hasDocumentation": true/false,
  "hasCI": true/false,
  "ciPlatforms": ["CI platforms detected from .github/workflows or other CI configs"],
  "estimatedComplexity": "simple|moderate|complex",
  "actualFeatures": ["real features implemented - extracted from code analysis"],
  "codeArchitecture": "detailed description of actual code architecture and patterns",
  "realSetupInstructions": ["step-by-step setup instructions based on actual requirements"],
  "actualUseCases": ["real use cases based on code functionality"],
  "prerequisites": ["actual required software/tools based on dependencies"],
  "realAPIEndpoints": ["actual API endpoints with methods and descriptions"],
  "actualEnvironmentVariables": ["real environment variables found in code"],
  "deploymentInstructions": ["actual deployment steps based on config files"],
  "codeExamples": ["real code usage examples extracted from the repository"],
  "projectStructure": "explanation of the actual project structure and organization",
  "keyDependencies": ["most important dependencies and their purposes"],
  "performanceConsiderations": ["performance-related aspects found in the code"],
  "securityFeatures": ["security measures implemented in the code"]
}

ANALYSIS GUIDELINES:
1. Be thorough and accurate - examine file extensions, package files, and structure
2. Identify the primary purpose and target audience
3. Look for testing frameworks, CI/CD configurations, and documentation
4. Determine complexity based on file count, dependencies, and architecture
5. Provide actionable setup instructions
6. Focus on what makes this project unique and valuable

Provide ONLY the JSON response - no additional text or explanations.`

    return prompt
  }

  // Parse repository analysis response
  parseRepositoryAnalysis(analysisText, repoInfo, fileStructure) {
    console.log('🔍 Raw AI Analysis Response:', analysisText.substring(0, 500) + '...')

    try {
      // Try to extract JSON from the response - look for both single and multiple JSON blocks
      let jsonMatch = analysisText.match(/\{[\s\S]*\}/)

      // If no match, try to find JSON between code blocks
      if (!jsonMatch) {
        jsonMatch = analysisText.match(/```json\s*(\{[\s\S]*?\})\s*```/)
        if (jsonMatch) {
          jsonMatch[0] = jsonMatch[1]
        }
      }

      // If still no match, try to find any JSON-like structure
      if (!jsonMatch) {
        jsonMatch = analysisText.match(/(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/)
      }

      if (jsonMatch) {
        console.log('📝 Extracted JSON:', jsonMatch[0].substring(0, 200) + '...')

        // Clean up the JSON string
        let jsonString = jsonMatch[0]
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .replace(/^\s*[\r\n]/gm, '')
          .trim()

        const analysisData = JSON.parse(jsonString)
        console.log('✅ Successfully parsed AI analysis:', Object.keys(analysisData))

        // Add additional computed data
        analysisData.codeStructure = {
          totalFiles: this.countFiles(fileStructure),
          directories: this.extractDirectories(fileStructure),
          fileTypes: this.analyzeFileTypes(fileStructure)
        }

        return analysisData
      } else {
        console.warn('⚠️ No JSON found in AI response, using fallback analysis')
      }
    } catch (error) {
      console.error('❌ Failed to parse AI analysis as JSON:', error.message)
      console.log('🔍 Problematic JSON string:', jsonMatch ? jsonMatch[0] : 'No JSON match found')
    }

    // Fallback analysis based on file structure
    console.log('🔄 Using fallback analysis based on file structure')
    return this.createFallbackAnalysis(repoInfo, fileStructure)
  }

  // Build repository README prompt
  buildRepositoryReadmePrompt(repositoryData, analysisData, template, customSections) {
    const { name, description, language, topics, license, homepage, stargazersCount, forksCount } = repositoryData

    // Extract comprehensive analysis data
    const {
      projectType, technologies, frameworks, keyFeatures, architecture, setupInstructions, hasTests, hasCI,
      buildTools, packageManagers, realProjectDescription, actualFeatures, codeArchitecture,
      realSetupInstructions, actualUseCases, prerequisites, realAPIEndpoints, actualEnvironmentVariables,
      deploymentInstructions, codeExamples, projectStructure, keyDependencies, performanceConsiderations,
      securityFeatures, testingFrameworks, ciPlatforms, mainFiles, configFiles
    } = analysisData

    // Generate technology badges
    const techBadges = this.generateTechnologyBadges(technologies, frameworks, language)

    let prompt = `You are an expert technical writer creating a world-class README.md file. Create a comprehensive, professional, and project-specific README that accurately reflects the actual repository content.

🎯 CRITICAL REQUIREMENT: Generate REAL, PROJECT-SPECIFIC content based on the actual code analysis. NO generic placeholders or template content.

REPOSITORY ANALYSIS DATA:
📦 Project: ${name}
📝 GitHub Description: ${description || 'No description provided'}
🔍 Real Project Description: ${realProjectDescription || 'Analyze the code to determine actual purpose'}
🏷️ Project Type: ${projectType}
💻 Primary Language: ${language || 'Multiple'}
🛠️ Technologies: ${technologies ? technologies.join(', ') : 'Not detected'}
🚀 Frameworks: ${frameworks ? frameworks.join(', ') : 'None detected'}
🏷️ Topics: ${topics ? topics.join(', ') : 'None'}
📄 License: ${license || 'Not specified'}
🌐 Homepage: ${homepage || 'None'}
⭐ Stars: ${stargazersCount || 0}
🍴 Forks: ${forksCount || 0}

TECHNICAL DETAILS:
✅ Has Tests: ${hasTests ? 'Yes' : 'No'}
🧪 Testing Frameworks: ${testingFrameworks ? testingFrameworks.join(', ') : 'None detected'}
🔄 Has CI/CD: ${hasCI ? 'Yes' : 'No'}
🏗️ CI Platforms: ${ciPlatforms ? ciPlatforms.join(', ') : 'None detected'}
🔧 Build Tools: ${buildTools ? buildTools.join(', ') : 'None detected'}
📦 Package Managers: ${packageManagers ? packageManagers.join(', ') : 'None detected'}
📁 Main Files: ${mainFiles ? mainFiles.join(', ') : 'None detected'}
⚙️ Config Files: ${configFiles ? configFiles.join(', ') : 'None detected'}

ACTUAL PROJECT ANALYSIS:
🎯 Real Features: ${actualFeatures ? actualFeatures.join(', ') : 'Analyze code to identify features'}
🏗️ Code Architecture: ${codeArchitecture || 'Analyze code structure and patterns'}
📋 Setup Instructions: ${realSetupInstructions ? realSetupInstructions.join(' → ') : 'Derive from package files'}
🎪 Use Cases: ${actualUseCases ? actualUseCases.join(', ') : 'Determine from code functionality'}
📚 Prerequisites: ${prerequisites ? prerequisites.join(', ') : 'Analyze dependencies'}
🔗 API Endpoints: ${realAPIEndpoints ? realAPIEndpoints.map(ep => `${ep.method} ${ep.path}`).join(', ') : 'None detected'}
🌍 Environment Variables: ${actualEnvironmentVariables ? actualEnvironmentVariables.join(', ') : 'None detected'}
🚀 Deployment: ${deploymentInstructions ? deploymentInstructions.join(' → ') : 'Standard deployment'}
📦 Key Dependencies: ${keyDependencies ? keyDependencies.join(', ') : 'Analyze package files'}
⚡ Performance: ${performanceConsiderations ? performanceConsiderations.join(', ') : 'Standard considerations'}
🔒 Security: ${securityFeatures ? securityFeatures.join(', ') : 'Standard security'}
🏗️ Project Structure: ${projectStructure || 'Analyze directory structure'}

TEMPLATE STYLE: ${template}

🎯 CRITICAL INSTRUCTIONS:
Generate a README that is SPECIFIC to this actual repository. Use the real analysis data provided above. NO generic content or placeholders.

CONTENT REQUIREMENTS:
✨ Professional, visually appealing with strategic emoji usage
📚 Clear and accessible for developers of all skill levels
🎯 Focused on practical implementation and real usage
🔧 Contains ACTUAL working examples from the repository
📖 Well-structured with logical flow and clear sections
🚀 Motivates developers to use and contribute to the project
🔍 Uses REAL file names, directory structures, and code patterns
📝 Reflects the ACTUAL technology stack and architecture
⚡ Includes performance considerations and best practices
🔒 Documents security features and considerations
🧪 Covers testing strategies and CI/CD processes

MANDATORY SECTIONS TO INCLUDE:

1. **HEADER SECTION**
   - Project title with relevant emoji based on project type
   - Compelling tagline based on ACTUAL project functionality
   - Technology badges for REAL technologies used: ${techBadges}
   - Repository stats (stars: ${stargazersCount}, forks: ${forksCount})
   - License badge: ${license || 'Not specified'}
   - Live demo link if homepage exists: ${homepage || 'None'}

2. **TABLE OF CONTENTS**
   - Comprehensive navigation to all sections
   - Clickable links for easy navigation

3. **PROJECT OVERVIEW**
   - What this project ACTUALLY does (based on real analysis)
   - Real-world problem it solves
   - Target audience and use cases from actual analysis
   - Why it's useful/unique based on the technologies and architecture found
   - Who should use it based on the project type and complexity

4. **KEY FEATURES**
   - List ACTUAL features implemented in the codebase
   - Use emojis and focus on real user benefits
   - Highlight unique aspects of the technology stack
   - Include performance, security, or scalability features if detected

5. **TECHNOLOGY STACK**
   - Comprehensive list of technologies actually used
   - Brief explanation of why each technology was chosen
   - Architecture diagram or description if complex
   - Dependencies and their purposes

6. **QUICK START**
   - Prerequisites based on ACTUAL dependencies: ${prerequisites ? prerequisites.join(', ') : 'Analyze package files'}
   - Step-by-step installation using REAL package managers: ${packageManagers ? packageManagers.join(' or ') : 'detected managers'}
   - Basic usage example with REAL file names and commands
   - Expected output or result

7. **INSTALLATION & SETUP**
   - Detailed installation for different environments
   - Environment variable setup: ${actualEnvironmentVariables ? actualEnvironmentVariables.join(', ') : 'None required'}
   - Configuration file setup if needed
   - Database setup if applicable
   - Troubleshooting common installation issues

8. **USAGE EXAMPLES**
   - Real, working code examples using ACTUAL technologies: ${technologies ? technologies.join(', ') : 'detected technologies'}
   - Multiple use cases based on project type: ${projectType}
   - Code snippets from actual repository files
   - Expected outputs and results
   - Progressive examples (basic → intermediate → advanced)

9. **API DOCUMENTATION** (if API endpoints detected)
   - Document REAL endpoints: ${realAPIEndpoints ? realAPIEndpoints.map(ep => `${ep.method} ${ep.path}`).join(', ') : 'None detected'}
   - Request/response examples with actual data structures
   - Authentication methods if implemented
   - Error handling and status codes
   - Rate limiting information if applicable

10. **PROJECT STRUCTURE**
    - Explain the ACTUAL directory structure
    - Key files and their purposes: ${mainFiles ? mainFiles.join(', ') : 'Main files'}
    - Configuration files: ${configFiles ? configFiles.join(', ') : 'Config files'}
    - Code organization patterns

11. **CONFIGURATION**
    - Environment variables with descriptions: ${actualEnvironmentVariables ? actualEnvironmentVariables.join(', ') : 'None detected'}
    - Configuration file examples with real settings
    - Development vs production configurations
    - Security considerations for configuration

12. **TESTING** (if tests detected)
    - Testing frameworks used: ${testingFrameworks ? testingFrameworks.join(', ') : 'None detected'}
    - How to run tests
    - Test coverage information
    - Writing new tests

13. **DEPLOYMENT**
    - Deployment instructions based on detected platforms
    - CI/CD setup: ${ciPlatforms ? ciPlatforms.join(', ') : 'None detected'}
    - Environment-specific considerations
    - Performance optimization tips

15. **PERFORMANCE & OPTIMIZATION**
    - Performance considerations: ${performanceConsiderations ? performanceConsiderations.join(', ') : 'Standard performance'}
    - Optimization tips based on technology stack
    - Monitoring and profiling guidance

16. **SECURITY**
    - Security features implemented: ${securityFeatures ? securityFeatures.join(', ') : 'Standard security'}
    - Best practices for secure usage
    - Vulnerability reporting process

17. **TROUBLESHOOTING**
    - Common issues and solutions
    - Debug mode instructions
    - Log file locations and analysis

18. **LICENSE & ACKNOWLEDGMENTS**
    - License: ${license || 'Not specified'}
    - Credits and acknowledgments
    - Third-party dependencies and licenses

19. **SUPPORT & COMMUNITY**
    - How to get help and support
    - Community guidelines and links
    - Maintainer contact information

FINAL REQUIREMENTS:
- Use REAL data from the repository analysis throughout
- Include actual code snippets and file references
- Provide working examples that users can copy and run
- Make it comprehensive but easy to navigate
- Ensure all links and references are accurate
- Use professional tone with appropriate technical depth
- Include visual elements (badges, emojis) strategically
- Make it actionable - users should be able to get started immediately

Generate a complete, professional README.md that accurately represents this specific repository.

FORMATTING GUIDELINES:
- Use appropriate emojis (but don't overuse)
- Include technology badges using shields.io
- Use code blocks with proper syntax highlighting
- Include screenshots/GIFs where helpful (use placeholder text)
- Use tables for structured data
- Use collapsible sections for long content
- Ensure mobile-friendly formatting

TONE & STYLE:
- Professional yet friendly
- Clear and concise
- Encouraging and welcoming
- Assume readers have basic technical knowledge
- Explain complex concepts simply
- Use active voice

${Object.keys(customSections).length > 0 ? `
CUSTOM SECTIONS TO INCLUDE:
${JSON.stringify(customSections, null, 2)}
` : ''}

TECHNOLOGY BADGES TO USE:
${techBadges}

Generate ONLY the README.md content in markdown format. Make it exceptional - this should be a README that other developers bookmark as an example of excellence. Focus on clarity, usefulness, and visual appeal.`

    return prompt
  }

  // Generate technology badges for README
  generateTechnologyBadges(technologies = [], frameworks = [], primaryLanguage = '') {
    const badgeMap = {
      // Languages
      'javascript': '![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)',
      'typescript': '![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)',
      'python': '![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)',
      'java': '![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)',
      'go': '![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)',
      'rust': '![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)',
      'php': '![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)',
      'ruby': '![Ruby](https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white)',
      'c++': '![C++](https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)',
      'c#': '![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)',
      'swift': '![Swift](https://img.shields.io/badge/Swift-FA7343?style=for-the-badge&logo=swift&logoColor=white)',
      'kotlin': '![Kotlin](https://img.shields.io/badge/Kotlin-0095D5?style=for-the-badge&logo=kotlin&logoColor=white)',

      // Frameworks
      'react': '![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)',
      'vue': '![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)',
      'angular': '![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)',
      'nodejs': '![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)',
      'express': '![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)',
      'django': '![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)',
      'flask': '![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)',
      'spring': '![Spring](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)',
      'laravel': '![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)',
      'rails': '![Rails](https://img.shields.io/badge/Rails-CC0000?style=for-the-badge&logo=ruby-on-rails&logoColor=white)',
      'nextjs': '![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)',
      'nuxtjs': '![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00C58E?style=for-the-badge&logo=nuxt.js&logoColor=white)',

      // Databases
      'mongodb': '![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)',
      'postgresql': '![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)',
      'mysql': '![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)',
      'redis': '![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)',
      'sqlite': '![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)',

      // Tools & Platforms
      'docker': '![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)',
      'kubernetes': '![Kubernetes](https://img.shields.io/badge/Kubernetes-326ce5?style=for-the-badge&logo=kubernetes&logoColor=white)',
      'aws': '![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)',
      'gcp': '![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)',
      'azure': '![Azure](https://img.shields.io/badge/Microsoft_Azure-0089D0?style=for-the-badge&logo=microsoft-azure&logoColor=white)',
      'vercel': '![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)',
      'netlify': '![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)',
      'git': '![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)',
      'github': '![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)',
      'vscode': '![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)'
    }

    const allTechs = [...(technologies || []), ...(frameworks || []), primaryLanguage].filter(Boolean)
    const badges = []

    allTechs.forEach(tech => {
      const normalizedTech = tech.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (badgeMap[normalizedTech]) {
        badges.push(badgeMap[normalizedTech])
      } else {
        // Create a generic badge for unknown technologies
        badges.push(`![${tech}](https://img.shields.io/badge/${encodeURIComponent(tech)}-blue?style=for-the-badge)`)
      }
    })

    return badges.join('\n')
  }

  // Enhanced cleanup and enhancement for README content
  cleanupAndEnhanceReadmeContent(content, repositoryData, analysisData) {
    let cleanContent = content

    // Remove any HTML tags
    cleanContent = cleanContent.replace(/<[^>]*>/g, '')

    // Fix common markdown issues
    cleanContent = cleanContent.replace(/\*\*\*([^*]+)\*\*\*/g, '**$1**') // Fix triple asterisks
    cleanContent = cleanContent.replace(/```([^`\n]*)\n```/g, '```$1\n// Add your code here\n```') // Fix empty code blocks

    // Ensure proper spacing
    cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    cleanContent = cleanContent.replace(/^[\s\n]+|[\s\n]+$/g, '') // Trim whitespace

    // Add repository-specific information if missing
    if (!cleanContent.includes(repositoryData.name)) {
      cleanContent = `# ${repositoryData.name}\n\n${cleanContent}`
    }

    // Ensure badges are properly formatted
    if (!cleanContent.includes('![') && !cleanContent.includes('https://img.shields.io')) {
      const badges = this.generateTechnologyBadges(
        analysisData.technologies,
        analysisData.frameworks,
        repositoryData.language
      )
      if (badges) {
        cleanContent = cleanContent.replace(
          /^(# [^\n]+\n\n)/,
          `$1${badges}\n\n`
        )
      }
    }

    // Add table of contents if missing and content is long enough
    if (cleanContent.length > 2000 && !cleanContent.includes('## Table of Contents')) {
      const sections = this.extractSections(cleanContent)
      if (sections.length > 3) {
        const toc = this.generateTableOfContents(sections)
        cleanContent = cleanContent.replace(
          /^(# [^\n]+\n\n(?:.*\n\n)?)/,
          `$1## Table of Contents\n\n${toc}\n\n`
        )
      }
    }

    return cleanContent
  }

  // Assess README quality
  assessReadmeQuality(content) {
    const score = {
      total: 0,
      breakdown: {
        length: 0,
        structure: 0,
        examples: 0,
        badges: 0,
        formatting: 0
      }
    }

    // Length check (20 points)
    if (content.length > 1000) score.breakdown.length = 20
    else if (content.length > 500) score.breakdown.length = 15
    else if (content.length > 200) score.breakdown.length = 10
    else score.breakdown.length = 5

    // Structure check (30 points)
    const hasTitle = /^#\s/.test(content)
    const hasInstallation = /install|setup|getting started/i.test(content)
    const hasUsage = /usage|example|how to/i.test(content)
    const hasContributing = /contribut/i.test(content)
    const hasLicense = /license/i.test(content)

    score.breakdown.structure = [hasTitle, hasInstallation, hasUsage, hasContributing, hasLicense]
      .filter(Boolean).length * 6

    // Examples check (20 points)
    const codeBlocks = (content.match(/```/g) || []).length / 2
    if (codeBlocks >= 3) score.breakdown.examples = 20
    else if (codeBlocks >= 2) score.breakdown.examples = 15
    else if (codeBlocks >= 1) score.breakdown.examples = 10
    else score.breakdown.examples = 0

    // Badges check (15 points)
    const badges = (content.match(/!\[.*?\]\(.*?shields\.io.*?\)/g) || []).length
    if (badges >= 5) score.breakdown.badges = 15
    else if (badges >= 3) score.breakdown.badges = 10
    else if (badges >= 1) score.breakdown.badges = 5
    else score.breakdown.badges = 0

    // Formatting check (15 points)
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(content)
    const hasLists = /^\s*[-*+]\s/m.test(content)
    const hasHeaders = (content.match(/^#{2,6}\s/gm) || []).length >= 3

    score.breakdown.formatting = [hasEmojis, hasLists, hasHeaders].filter(Boolean).length * 5

    score.total = Object.values(score.breakdown).reduce((sum, val) => sum + val, 0)

    return {
      score: score.total,
      grade: score.total >= 80 ? 'A' : score.total >= 60 ? 'B' : score.total >= 40 ? 'C' : 'D',
      breakdown: score.breakdown
    }
  }

  // Extract sections from README content
  extractSections(content) {
    const sections = []
    const lines = content.split('\n')

    lines.forEach(line => {
      const match = line.match(/^(#{2,6})\s+(.+)/)
      if (match) {
        const level = match[1].length
        const title = match[2].trim()
        sections.push({ level, title, anchor: title.toLowerCase().replace(/[^a-z0-9]+/g, '-') })
      }
    })

    return sections
  }

  // Generate table of contents
  generateTableOfContents(sections) {
    return sections
      .filter(section => section.level <= 3) // Only include up to h3
      .map(section => {
        const indent = '  '.repeat(section.level - 2)
        return `${indent}- [${section.title}](#${section.anchor})`
      })
      .join('\n')
  }

  // Utility methods for repository analysis

  countFiles(fileStructure) {
    let count = 0
    const traverse = (items) => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item.type === 'file') {
            count++
          } else if (item.children) {
            traverse(item.children)
          }
        })
      }
    }
    traverse(fileStructure)
    return count
  }

  extractDirectories(fileStructure) {
    const directories = []
    const traverse = (items, path = '') => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item.type === 'dir') {
            const dirPath = path ? `${path}/${item.name}` : item.name
            directories.push(dirPath)
            if (item.children) {
              traverse(item.children, dirPath)
            }
          }
        })
      }
    }
    traverse(fileStructure)
    return directories
  }

  analyzeFileTypes(fileStructure) {
    const fileTypes = {}
    const traverse = (items) => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item.type === 'file') {
            const extension = item.name.split('.').pop().toLowerCase()
            fileTypes[extension] = (fileTypes[extension] || 0) + 1
          } else if (item.children) {
            traverse(item.children)
          }
        })
      }
    }
    traverse(fileStructure)
    return fileTypes
  }

  createFallbackAnalysis(repoInfo, fileStructure) {
    console.log('🔄 Creating fallback analysis for repository:', repoInfo.name)
    const { name, description, language, languages, topics } = repoInfo
    const fileTypes = this.analyzeFileTypes(fileStructure)

    // Determine project type based on file extensions and structure
    let projectType = 'web-application'
    if (fileTypes.py || language === 'Python') {
      if (topics && topics.includes('machine-learning')) {
        projectType = 'data-science'
      } else if (fileTypes.py && !fileTypes.html && !fileTypes.js) {
        projectType = 'cli-tool'
      }
    } else if (fileTypes.js || fileTypes.ts || fileTypes.jsx || fileTypes.tsx) {
      if (fileTypes.json && (fileTypes.jsx || fileTypes.tsx)) {
        projectType = 'web-application'
      }
    } else if (fileTypes.java || fileTypes.kt) {
      projectType = 'mobile-app'
    }

    // Detect technologies more comprehensively
    const technologies = []
    if (language) technologies.push(language)
    if (languages) technologies.push(...languages.slice(0, 5))

    // Add technologies based on file types
    if (fileTypes.js) technologies.push('JavaScript')
    if (fileTypes.ts) technologies.push('TypeScript')
    if (fileTypes.py) technologies.push('Python')
    if (fileTypes.java) technologies.push('Java')
    if (fileTypes.cpp || fileTypes.cc) technologies.push('C++')
    if (fileTypes.cs) technologies.push('C#')
    if (fileTypes.go) technologies.push('Go')
    if (fileTypes.rs) technologies.push('Rust')
    if (fileTypes.php) technologies.push('PHP')
    if (fileTypes.rb) technologies.push('Ruby')

    // Detect frameworks more comprehensively
    const frameworks = []
    if (fileTypes.jsx || fileTypes.tsx) frameworks.push('React')
    if (fileTypes.vue) frameworks.push('Vue.js')
    if (fileTypes.py) {
      // Check for common Python frameworks in file structure
      const hasFlask = fileStructure.some(item => item.name.toLowerCase().includes('flask'))
      const hasDjango = fileStructure.some(item => item.name.toLowerCase().includes('django'))
      const hasFastAPI = fileStructure.some(item => item.name.toLowerCase().includes('fastapi'))

      if (hasFlask) frameworks.push('Flask')
      if (hasDjango) frameworks.push('Django')
      if (hasFastAPI) frameworks.push('FastAPI')
    }

    // Generate more meaningful features based on actual repository content
    const keyFeatures = []
    if (description) {
      keyFeatures.push(`${description.split('.')[0]}`)
    }
    if (fileTypes.js || fileTypes.ts) {
      keyFeatures.push('Modern JavaScript/TypeScript implementation')
    }
    if (fileTypes.py) {
      keyFeatures.push('Python-based solution')
    }
    if (fileTypes.md > 1) {
      keyFeatures.push('Comprehensive documentation')
    }
    if (fileStructure.some(item => item.name.includes('test'))) {
      keyFeatures.push('Automated testing suite')
    }

    // If no specific features found, add generic but relevant ones
    if (keyFeatures.length === 0) {
      keyFeatures.push(`${projectType.replace('-', ' ')} solution`)
      keyFeatures.push('Easy to use and integrate')
      keyFeatures.push('Well-structured codebase')
    }

    return {
      projectType,
      technologies: [...new Set(technologies)],
      frameworks,
      buildTools: fileTypes.json ? ['npm/yarn'] : fileTypes.py ? ['pip'] : [],
      packageManagers: fileTypes.json ? ['npm'] : fileTypes.py ? ['pip'] : [],
      databases: [],
      deploymentPlatforms: [],
      mainFiles: ['README.md', 'index.js', 'main.py', 'app.py', 'src/index.js', 'src/main.py'].filter(file =>
        fileStructure.some(item => item.name === file || item.path === file)
      ),
      configFiles: Object.keys(fileTypes).filter(ext =>
        ['json', 'yml', 'yaml', 'toml', 'ini', 'conf'].includes(ext)
      ),
      hasTests: Object.keys(fileTypes).some(ext => ['test', 'spec'].some(t => ext.includes(t))) ||
                fileStructure.some(item => item.name.toLowerCase().includes('test')),
      hasDocumentation: fileTypes.md > 0,
      hasCI: fileStructure.some(item => item.name === '.github' || item.path.includes('.github')),
      estimatedComplexity: Object.keys(fileTypes).length > 10 ? 'complex' :
                          Object.keys(fileTypes).length > 5 ? 'moderate' : 'simple',
      keyFeatures,
      architecture: `${projectType.replace('-', ' ')} with ${language || 'multiple languages'} implementation`,
      setupInstructions: this.generateSetupInstructions(projectType, fileTypes, language),
      useCases: [`Developers working with ${language || 'this technology stack'}`, 'Teams building similar solutions'],
      prerequisites: this.generatePrerequisites(fileTypes, language),
      apiEndpoints: projectType === 'api-service' ? ['To be documented based on code analysis'] : [],
      environmentVariables: fileStructure.some(item => item.name === '.env' || item.name === '.env.example') ?
                           ['Check .env.example for required variables'] : [],
      deploymentNotes: [`Standard ${projectType} deployment process`],
      codeStructure: {
        totalFiles: this.countFiles(fileStructure),
        directories: this.extractDirectories(fileStructure),
        fileTypes
      }
    }
  }

  generateSetupInstructions(projectType, fileTypes, language) {
    if (fileTypes.json) {
      return 'Clone repository, run npm install, then npm start'
    } else if (fileTypes.py) {
      return 'Clone repository, install requirements with pip install -r requirements.txt, then run main script'
    } else if (language === 'Java') {
      return 'Clone repository, ensure Java is installed, compile and run main class'
    } else {
      return `Clone repository and follow ${language || 'language-specific'} setup procedures`
    }
  }

  generatePrerequisites(fileTypes, language) {
    const prerequisites = []

    if (fileTypes.js || fileTypes.ts || fileTypes.json) {
      prerequisites.push('Node.js (v14 or higher)', 'npm or yarn')
    }
    if (fileTypes.py) {
      prerequisites.push('Python 3.7+', 'pip package manager')
    }
    if (language === 'Java') {
      prerequisites.push('Java JDK 8+', 'Maven or Gradle')
    }
    if (language === 'Go') {
      prerequisites.push('Go 1.16+')
    }

    if (prerequisites.length === 0) {
      prerequisites.push(`${language || 'Appropriate runtime'} environment`)
    }

    return prerequisites
  }

  // Build prompt for generating a repository architecture diagram (Mermaid)
  buildRepositoryArchitectureDiagramPrompt(repositoryData, analysisData, style = 'flowchart') {
    const {
      name,
      description,
      language,
      topics = [],
      license,
      homepage
    } = repositoryData || {}

    const {
      projectType,
      technologies = [],
      frameworks = [],
      buildTools = [],
      packageManagers = [],
      realAPIEndpoints = [],
      codeArchitecture = '',
      projectStructure = '',
      mainFiles = [],
      configFiles = [],
      hasCI = false,
      ciPlatforms = []
    } = analysisData || {}

    const techList = [...new Set([...(technologies || []), ...(frameworks || [])])].join(', ')

    const guidance = style === 'c4'
      ? `Use a single Mermaid C4-style diagram if supported by Mermaid (otherwise emulate using subgraphs):
- Show Context: Users/Clients -> Frontend -> Backend -> Databases/Queues -> External services
- Show Containers/Components within subgraphs with clear responsibilities
- Annotate edges with protocols (HTTP, gRPC, WebSocket), ports, and auth where applicable
- Keep it to ONE diagram only`
      : `Use a single Mermaid flowchart (flowchart LR) with subgraphs for layers (Frontend, Backend, Database, External, CI/CD).
- Nodes should include short labels and technology hints (e.g., Express API, MongoDB, Redis)
- Edges annotated with protocols (HTTP/REST, GraphQL, gRPC) where known
- Keep it to ONE diagram only`

    return `You are an expert software architect. Based on the following repository data and analysis, produce a single ADVANCED system architecture diagram in Mermaid syntax only.

REPOSITORY
- Name: ${name}
- Description: ${description || 'N/A'}
- Primary Language: ${language || 'Multiple'}
- Topics: ${topics.join(', ') || 'None'}
- License: ${license || 'Unspecified'}
- Homepage: ${homepage || 'None'}

ANALYSIS
- Project Type: ${projectType}
- Technologies: ${techList || 'Detect from files'}
- Build Tools: ${(buildTools || []).join(', ') || 'N/A'}
- Package Managers: ${(packageManagers || []).join(', ') || 'N/A'}
- Main Files: ${(mainFiles || []).join(', ') || 'N/A'}
- Config Files: ${(configFiles || []).join(', ') || 'N/A'}
- Has CI/CD: ${hasCI ? 'Yes' : 'No'} (${(ciPlatforms || []).join(', ')})
- Code Architecture: ${codeArchitecture || 'N/A'}
- Project Structure: ${projectStructure || 'N/A'}
- API Endpoints (if any): ${(realAPIEndpoints || []).slice(0, 15).join(' | ') || 'N/A'}

REQUIREMENTS
- Output ONLY one fenced code block containing Mermaid syntax and nothing else
- Prefer ${style === 'c4' ? 'C4-style (Context/Container/Component) structure' : 'flowchart with subgraphs'}
- Use subgraphs to group layers (Frontend, Backend/Services, Data Stores, External Services, CI/CD)
- Include relevant elements based on the analysis data
- Annotate edges with protocols (HTTP/REST, GraphQL, gRPC, DB driver) where appropriate
- No explanations before or after, just the Mermaid code block

CRITICAL MERMAID SYNTAX RULES:
- Node IDs must be simple alphanumeric (A, B, C1, API, DB, etc.) - NO SPACES
- Node labels go in brackets: A["API Gateway"] or B["React Frontend"]
- Use underscores for multi-word IDs: API_Gateway["API Gateway"]
- Valid arrows: --> --- -.- ==>
- Edge labels: A -->|HTTP| B or A -- "REST API" --> B
- Subgraph syntax: subgraph Frontend ... end
- Style syntax: style A fill:#f9f,stroke:#333,stroke-width:2px

${guidance}

EXAMPLE OUTPUT:
\`\`\`mermaid
graph LR
    subgraph Frontend
        UI["React App"]
        style UI fill:#e1f5fe
    end

    subgraph Backend
        API["Express API"]
        AUTH["Auth Service"]
        style API fill:#f3e5f5
        style AUTH fill:#f3e5f5
    end

    subgraph Data
        DB["PostgreSQL"]
        CACHE["Redis Cache"]
        style DB fill:#e8f5e8
        style CACHE fill:#e8f5e8
    end

    UI -->|HTTP/REST| API
    API -->|SQL| DB
    API -->|Cache| CACHE
    AUTH -->|JWT| API
\`\`\`

Return only the code block, like above.`
  }

  // Extract Mermaid code block from AI response
  extractMermaidCode(text) {
    if (!text) return ''
    const match = text.match(/```mermaid[\s\S]*?```/)
    if (match) {
      return match[0].replace(/```mermaid\s*/, '').replace(/```\s*$/, '').trim()
    }
    // Fallback: return whole text if no fenced block
    return text.trim()
  }

  // Generate architecture diagram via OpenRouter (primary)
  async generateRepositoryArchitectureDiagramWithOpenRouter(repositoryData, analysisData, style = 'flowchart') {
    if (!this.openRouterConfigured) {
      throw new Error('OpenRouter AI is not configured.')
    }

    const prompt = this.buildRepositoryArchitectureDiagramPrompt(repositoryData, analysisData, style)

    const models = [
      'anthropic/claude-3-sonnet',
      'openai/gpt-4-turbo',
      'openai/gpt-4'
    ]

    let lastError = null

    for (const modelName of models) {
      try {
        console.log(`🤖 Generating architecture diagram with OpenRouter model: ${modelName}`)
        const completion = await this.openRouterClient.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: 'You are an expert software architect. Respond with Mermaid code only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.4,
          max_tokens: 4096,
          top_p: 0.95
        })

        const content = completion.choices[0]?.message?.content || ''
        const mermaid = this.extractMermaidCode(content)
        if (!mermaid || mermaid.length < 50) {
          throw new Error('Generated diagram is empty or too short')
        }

        return {
          success: true,
          mermaid,
          provider: 'openrouter',
          modelUsed: `OpenRouter:${modelName}`,
          generatedAt: new Date()
        }
      } catch (error) {
        lastError = error
        console.warn(`⚠️ OpenRouter model ${modelName} failed (architecture):`, error.message)
        if (modelName === models[models.length - 1]) break
        await new Promise(r => setTimeout(r, 800))
      }
    }

    throw new Error(`All OpenRouter models failed to generate architecture diagram. Last error: ${lastError?.message || 'Unknown'}`)
  }

  // Generate architecture diagram (OpenRouter primary, Gemini fallback)
  async generateRepositoryArchitectureDiagramContent(repositoryData, analysisData, style = 'flowchart') {
    this.initialize()

    // Try OpenRouter first
    if (this.openRouterConfigured) {
      try {
        return await this.generateRepositoryArchitectureDiagramWithOpenRouter(repositoryData, analysisData, style)
      } catch (error) {
        console.warn('⚠️ OpenRouter failed for architecture diagram, falling back to Gemini:', error.message)
      }
    }

    // Fallback to Gemini
    if (!this.isConfigured) {
      throw new Error('No AI providers configured. Please set OPENROUTER_API_KEY or GEMINI_API_KEY.')
    }

    const prompt = this.buildRepositoryArchitectureDiagramPrompt(repositoryData, analysisData, style)
    const modelNames = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro', 'gemini-pro']

    let lastError = null

    for (const modelName of modelNames) {
      try {
        console.log(`🤖 Generating architecture diagram with Gemini model: ${modelName}`)
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 4096
          }
        })
        const result = await model.generateContent(prompt)
        const response = await result.response
        const content = response.text()
        const mermaid = this.extractMermaidCode(content)
        if (!mermaid || mermaid.length < 50) {
          throw new Error('Generated diagram is empty or too short')
        }
        return {
          success: true,
          mermaid,
          provider: 'gemini',
          modelUsed: `Gemini:${modelName}`,
          generatedAt: new Date()
        }
      } catch (error) {
        lastError = error
        console.warn(`⚠️ Gemini model ${modelName} failed (architecture):`, error.message)
        if (modelName === modelNames[modelNames.length - 1]) break
        await new Promise(r => setTimeout(r, 800))
      }
    }

    throw new Error(`All AI models failed to generate architecture diagram. Last error: ${lastError?.message || 'Unknown'}`)
  }
}

export default new AIService()
