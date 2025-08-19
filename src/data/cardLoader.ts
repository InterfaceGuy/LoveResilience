import { Card, CardData } from '../types/Card'

const parseFileName = (fileName: string): { id: string; name: string; theme: string; category?: string } => {
  const nameWithoutExt = fileName.replace('.jpg', '')
  const parts = nameWithoutExt.split('_')
  
  const id = parts[0]
  let theme = parts.slice(1).join(' ')
  let category: string | undefined
  
  const categoryMatch = theme.match(/^(.*?)\s+([A-Z\s&]+)$/)
  if (categoryMatch) {
    theme = categoryMatch[1].trim()
    category = categoryMatch[2].trim()
  }
  
  return { id, name: `${id}_${theme.replace(/\s+/g, '_')}`, theme, category }
}

export const loadCardData = async (): Promise<CardData> => {
  const cardModules = (import.meta as any).glob('/CardSet/*.jpg', { 
    query: '?url', 
    import: 'default' 
  }) as Record<string, () => Promise<string>>
  
  const cards: Card[] = []
  
  for (const [path, importFn] of Object.entries(cardModules)) {
    const fileName = path.split('/').pop() || ''
    const { id, name, theme, category } = parseFileName(fileName)
    const imagePath = await importFn()
    
    cards.push({
      id,
      name,
      theme,
      category,
      imagePath,
      meaning: `Reflect on the energy of ${theme}. What does this mean for you in this moment?`,
      questions: [
        `How does ${theme} show up in your life right now?`,
        'What would change if you embraced this energy more fully?',
        'What small action could honor this guidance today?'
      ],
      actions: [
        'Take three deep breaths and feel into this message',
        'Journal about how this theme relates to your current situation',
        'Set an intention to embody this energy today'
      ]
    })
  }
  
  cards.sort((a, b) => parseInt(a.id) - parseInt(b.id))
  
  const backside = '/Backside.jpg'
  const cover = '/Cover.png'
  
  return { cards, backside, cover }
}