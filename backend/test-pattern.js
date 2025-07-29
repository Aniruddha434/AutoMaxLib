import { patternService } from './services/patternService.js'

// Test pattern generation
async function testPattern() {
  console.log('🧪 Testing pattern generation...')
  
  try {
    // Test simple pattern
    const text = 'HI'
    console.log(`\n📝 Testing pattern for: "${text}"`)
    
    // Generate pattern
    const pattern = patternService.generateTextPattern(text, {
      intensity: 3,
      alignment: 'center',
      spacing: 1
    })
    
    console.log('🎨 Generated pattern:')
    console.log('Pattern dimensions:', pattern.length, 'x', pattern[0].length)
    
    // Print pattern visually
    for (let row = 0; row < pattern.length; row++) {
      let rowStr = ''
      for (let col = 0; col < pattern[row].length; col++) {
        const cell = pattern[row][col]
        rowStr += cell === 0 ? '⬜' : cell === 1 ? '🟩' : cell === 2 ? '🟢' : cell === 3 ? '🔵' : '🟦'
      }
      console.log(`Row ${row}: ${rowStr}`)
    }
    
    // Test commit date generation
    console.log('\n📅 Testing commit date generation...')
    const commitDates = patternService.patternToCommitDates(pattern)
    
    console.log(`Generated ${commitDates.length} commit dates`)
    console.log('First 5 commits:')
    commitDates.slice(0, 5).forEach((commit, index) => {
      console.log(`  ${index + 1}. ${commit.date.toISOString()} (intensity: ${commit.intensity}, week: ${commit.week}, day: ${commit.day})`)
    })
    
    console.log('Last 5 commits:')
    commitDates.slice(-5).forEach((commit, index) => {
      console.log(`  ${commitDates.length - 4 + index}. ${commit.date.toISOString()} (intensity: ${commit.intensity}, week: ${commit.week}, day: ${commit.day})`)
    })
    
    // Test preview
    console.log('\n👁️ Testing preview...')
    const preview = await patternService.previewPattern(text, {
      intensity: 3,
      alignment: 'center',
      spacing: 1
    })
    
    if (preview.success) {
      console.log('✅ Preview generated successfully')
      console.log('Stats:', preview.stats)
    } else {
      console.log('❌ Preview failed:', preview.error)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testPattern()
