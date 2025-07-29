import { GoogleGenerativeAI } from '@google/generative-ai'

class AIService {
  constructor() {
    this.genAI = null
    this.model = null
    this.isConfigured = null
    this.initialized = false
  }

  // Initialize Gemini AI (called lazily)
  initialize() {
    if (this.initialized) return

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

    this.initialized = true
  }

  // Check if AI service is configured
  isAvailable() {
    this.initialize()
    return this.isConfigured
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
- Clean, professional layout
- Focus on experience and skills
- Include technology badges using shields.io
- Add GitHub stats
- Professional tone throughout
- Include contact information section
- Add a brief about section
- List key technologies and tools`
        break

      case 'creative':
        prompt += `
- Creative and visually appealing design
- Use emojis and visual elements
- Include animated GIFs or ASCII art
- Colorful badges and graphics
- Fun and engaging tone
- Creative section headers
- Include hobby/interest section
- Use creative formatting`
        break

      case 'minimalist':
        prompt += `
- Clean, minimal design
- Simple structure
- Essential information only
- No excessive graphics
- Clear, concise content
- Simple badges
- Minimal use of emojis
- Focus on content over design`
        break

      case 'developer-focused':
        prompt += `
- Technical focus
- Detailed technology stack
- Code examples or snippets
- Development workflow
- Open source contributions
- Technical achievements
- Programming language stats
- Development tools and environment`
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
}

export default new AIService()
